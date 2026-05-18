import { defineMiddleware } from "astro:middleware";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const protectedPrefixes = ["/keystatic", "/api/keystatic"];
const sessionCookie = "freer_studio_session";
const execFileAsync = promisify(execFile);

function timingSafeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);

  if (aBytes.length !== bBytes.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < aBytes.length; i += 1) {
    result |= aBytes[i] ^ bBytes[i];
  }

  return result === 0;
}

function getExpectedCredentials() {
  return {
    username: import.meta.env.KEYSTATIC_AUTH_USERNAME ?? "admin",
    password: import.meta.env.KEYSTATIC_AUTH_PASSWORD ?? "freer-local",
  };
}

async function sessionToken() {
  const { username, password } = getExpectedCredentials();
  const data = new TextEncoder().encode(`${username}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function loginPage(error = false) {
  return new Response(
    `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>freer.top studio login</title>
    <style>
      :root { color-scheme: light; }
      body {
        min-height: 100vh;
        display: grid;
        place-items: center;
        margin: 0;
        background: #f8f8f4;
        color: #111413;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main { width: min(360px, calc(100% - 32px)); }
      h1 { margin: 0 0 20px; font-size: 22px; }
      label { display: block; margin: 14px 0 6px; color: #66706b; font-size: 13px; }
      input {
        width: 100%;
        min-height: 42px;
        padding: 8px 10px;
        border: 1px solid #d7dbd2;
        background: white;
        color: #111413;
        font: inherit;
      }
      button {
        width: 100%;
        min-height: 42px;
        margin-top: 18px;
        border: 0;
        background: #006b4f;
        color: white;
        font-weight: 700;
        cursor: pointer;
      }
      p { color: #a33; min-height: 20px; font-size: 13px; }
    </style>
  </head>
  <body>
    <main>
      <h1>freer.top studio</h1>
      <form method="post" action="/studio-login">
        <label for="username">Username</label>
        <input id="username" name="username" autocomplete="username" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required />
        <button type="submit">Sign in</button>
        <p>${error ? "Invalid username or password." : ""}</p>
      </form>
    </main>
  </body>
</html>`,
    {
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

async function runPowerShell(args: string[]) {
  return execFileAsync("powershell", args, {
    cwd: process.cwd(),
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 20,
  });
}

async function hasLocalChanges() {
  const { stdout } = await execFileAsync("git", ["status", "--porcelain"], {
    cwd: process.cwd(),
    windowsHide: true,
  });
  return stdout.trim().length > 0;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) {
    return next();
  }

  if (context.url.pathname === "/studio-login") {
    if (context.request.method === "GET") {
      return loginPage(context.url.searchParams.get("error") === "1");
    }

    if (context.request.method === "POST") {
      const form = await context.request.formData();
      const suppliedUsername = String(form.get("username") ?? "");
      const suppliedPassword = String(form.get("password") ?? "");
      const { username, password } = getExpectedCredentials();

      if (
        timingSafeEqual(suppliedUsername, username) &&
        timingSafeEqual(suppliedPassword, password)
      ) {
        return new Response(null, {
          status: 303,
          headers: {
            location: "/keystatic/",
            "set-cookie": `${sessionCookie}=${await sessionToken()}; Path=/; HttpOnly; SameSite=Lax`,
          },
        });
      }

      return new Response(null, {
        status: 303,
        headers: { location: "/studio-login?error=1" },
      });
    }
  }

  if (context.url.pathname === "/studio-status") {
    return Response.json({ dirty: await hasLocalChanges() });
  }

  if (context.url.pathname === "/studio-publish") {
    if (context.request.method !== "POST") {
      return Response.json(
        { success: false, message: "Method not allowed" },
        { status: 405 },
      );
    }

    if (context.cookies.get(sessionCookie)?.value !== (await sessionToken())) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    try {
      const { stdout, stderr } = await runPowerShell([
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        "scripts/publish.ps1",
        "-Message",
        "Update site content",
      ]);
      return Response.json({
        success: true,
        message: "Published",
        output: `${stdout}\n${stderr}`.trim(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Publish failed";
      return Response.json({ success: false, message }, { status: 500 });
    }
  }

  if (context.url.pathname === "/studio-logout") {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/studio-login",
        "set-cookie": `${sessionCookie}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
      },
    });
  }

  const isProtected = protectedPrefixes.some((prefix) =>
    context.url.pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return next();
  }

  if (context.cookies.get(sessionCookie)?.value !== (await sessionToken())) {
    return new Response(null, {
      status: 303,
      headers: { location: "/studio-login" },
    });
  }

  const response = await next();
  const contentType = response.headers.get("content-type") ?? "";

  if (
    context.url.pathname.startsWith("/keystatic") &&
    contentType.includes("text/html")
  ) {
    const html = await response.text();
    const script = '<script type="module" src="/src/scripts/studio-publish-button.ts"></script>';
    const enhancedHtml = html.includes("</body>")
      ? html.replace("</body>", `${script}</body>`)
      : `${html}${script}`;
    const headers = new Headers(response.headers);
    headers.delete("content-length");

    return new Response(enhancedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
});
