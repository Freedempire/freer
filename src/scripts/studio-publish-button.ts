function createPublishButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Publish";
  button.disabled = true;
  button.dataset.state = "checking";
  button.setAttribute("aria-live", "polite");

  const style = document.createElement("style");
  style.textContent = `
    .freer-publish-button {
      position: fixed;
      top: 14px;
      right: 18px;
      z-index: 9999;
      min-height: 34px;
      padding: 0 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #111827;
      color: white;
      font: 600 13px/1 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(17, 24, 39, 0.12);
    }
    .freer-publish-button:disabled {
      background: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
      box-shadow: none;
    }
    .freer-publish-button[data-state="busy"] {
      background: #374151;
      color: white;
      cursor: wait;
    }
  `;

  button.className = "freer-publish-button";
  document.head.append(style);
  document.body.append(button);
  return button;
}

async function getStatus() {
  const response = await fetch("/studio-status", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Status request failed: ${response.status}`);
  }

  return (await response.json()) as { dirty: boolean };
}

async function publish() {
  const response = await fetch("/studio-publish", {
    method: "POST",
    credentials: "same-origin",
  });
  const result = (await response.json()) as {
    success: boolean;
    message: string;
    output?: string;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Publish failed");
  }

  return result;
}

async function init() {
  const button = createPublishButton();

  async function refresh() {
    try {
      const status = await getStatus();
      button.disabled = !status.dirty;
      button.dataset.state = status.dirty ? "ready" : "clean";
      button.textContent = status.dirty ? "Publish" : "Published";
      button.title = status.dirty
        ? "Build, commit, push, and let Cloudflare deploy."
        : "No local changes to publish.";
    } catch {
      button.disabled = true;
      button.dataset.state = "error";
      button.textContent = "Publish";
      button.title = "Could not read git status.";
    }
  }

  button.addEventListener("click", async () => {
    if (button.disabled) return;

    const confirmed = window.confirm("Build, commit, and push local changes?");
    if (!confirmed) return;

    button.disabled = true;
    button.dataset.state = "busy";
    button.textContent = "Publishing...";

    try {
      await publish();
      button.textContent = "Published";
      button.dataset.state = "clean";
    } catch (error) {
      button.textContent = "Publish failed";
      button.dataset.state = "error";
      button.title = error instanceof Error ? error.message : "Publish failed";
    } finally {
      window.setTimeout(refresh, 2000);
    }
  });

  await refresh();
  window.setInterval(refresh, 15000);
}

init();

export {};
