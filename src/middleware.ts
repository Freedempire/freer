import { defineMiddleware } from "astro:middleware";

const protectedPrefixes = ["/keystatic", "/api/keystatic"];

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

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="freer.top studio", charset="UTF-8"',
    },
  });
}

export const onRequest = defineMiddleware((context, next) => {
  const isProtected = protectedPrefixes.some((prefix) =>
    context.url.pathname.startsWith(prefix),
  );

  if (!import.meta.env.DEV || !isProtected) {
    return next();
  }

  const username = import.meta.env.KEYSTATIC_AUTH_USERNAME ?? "admin";
  const password = import.meta.env.KEYSTATIC_AUTH_PASSWORD ?? "freer-local";
  const header = context.request.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(header.slice("Basic ".length));
  const separator = decoded.indexOf(":");
  const suppliedUsername = decoded.slice(0, separator);
  const suppliedPassword = decoded.slice(separator + 1);

  if (
    !timingSafeEqual(suppliedUsername, username) ||
    !timingSafeEqual(suppliedPassword, password)
  ) {
    return unauthorized();
  }

  return next();
});
