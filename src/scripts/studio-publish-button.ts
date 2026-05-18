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
    .freer-tag-suggestions {
      position: fixed;
      z-index: 10000;
      display: none;
      max-height: 220px;
      overflow: auto;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      box-shadow: 0 8px 24px rgba(17, 24, 39, 0.14);
      color: #111827;
      font: 500 13px/1.35 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .freer-tag-suggestions[data-open="true"] {
      display: block;
    }
    .freer-tag-suggestion {
      width: 100%;
      min-height: 30px;
      padding: 6px 10px;
      border: 0;
      background: white;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .freer-tag-suggestion:hover,
    .freer-tag-suggestion[data-active="true"] {
      background: #eef2ff;
    }
  `;

  button.className = "freer-publish-button";
  document.head.append(style);
  document.body.append(button);
  return button;
}

function isDashboardRoute() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "");
  return normalizedPath === "/keystatic";
}

function watchRouteChanges(callback: () => void) {
  const notify = () => window.setTimeout(callback, 0);
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function pushState(...args) {
    const result = originalPushState.apply(this, args);
    notify();
    return result;
  };

  window.history.replaceState = function replaceState(...args) {
    const result = originalReplaceState.apply(this, args);
    notify();
    return result;
  };

  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
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

async function getTagSuggestions() {
  const response = await fetch("/studio-tags", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) return [];

  const result = (await response.json()) as { tags: string[] };
  return result.tags;
}

function createTagSuggestionMenu() {
  let menu = document.querySelector<HTMLDivElement>("#freer-tag-suggestions");

  if (!menu) {
    menu = document.createElement("div");
    menu.id = "freer-tag-suggestions";
    menu.className = "freer-tag-suggestions";
    menu.setAttribute("role", "listbox");
    document.body.append(menu);
  }

  return menu;
}

function getInputLabelText(input: HTMLInputElement) {
  const textParts: Array<string | null | undefined> = [
    input.getAttribute("aria-label"),
    input.getAttribute("placeholder"),
    input.name,
  ];

  if (input.id) {
    textParts.push(
      ...Array.from(document.querySelectorAll<HTMLLabelElement>("label"))
        .filter((label) => label.htmlFor === input.id)
        .map((label) => label.textContent),
    );
  }

  const labelledBy = input.getAttribute("aria-labelledby");
  if (labelledBy) {
    textParts.push(
      ...labelledBy
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent),
    );
  }

  return textParts.filter(Boolean).join(" ").trim();
}

function isTagInput(input: HTMLInputElement) {
  const inputType = input.type || "text";
  if (!["text", "search"].includes(inputType)) return false;

  const labelText = getInputLabelText(input);
  if (/^tags?$/i.test(labelText)) return true;

  let ancestor = input.parentElement;
  for (let depth = 0; ancestor && depth < 4; depth += 1) {
    const nearbyText = ancestor.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (/^tags?\b/i.test(nearbyText)) return true;
    ancestor = ancestor.parentElement;
  }

  return false;
}

function attachTagSuggestions() {
  document
    .querySelectorAll<HTMLInputElement>("input")
    .forEach((input) => {
      if (!isTagInput(input)) return;
      input.removeAttribute("list");
      input.setAttribute("autocomplete", "off");
      input.dataset.freerTagInput = "true";
    });
}

async function init() {
  const button = createPublishButton();
  const tagMenu = createTagSuggestionMenu();
  let refreshTimer: number | undefined;
  let tagSuggestions: string[] = [];
  let activeTagInput: HTMLInputElement | null = null;

  function hideTagMenu() {
    tagMenu.dataset.open = "false";
    tagMenu.replaceChildren();
  }

  function setTagInputValue(input: HTMLInputElement, value: string) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;

    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function filteredTags(input: HTMLInputElement) {
    const query = input.value.trim().toLowerCase();
    const matches = tagSuggestions.filter((tag) =>
      tag.toLowerCase().includes(query),
    );

    return matches
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query);
        const bStarts = b.toLowerCase().startsWith(query);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.localeCompare(b);
      })
      .slice(0, 12);
  }

  function positionTagMenu(input: HTMLInputElement) {
    const rect = input.getBoundingClientRect();
    tagMenu.style.left = `${rect.left}px`;
    tagMenu.style.top = `${rect.bottom + 6}px`;
    tagMenu.style.width = `${rect.width}px`;
  }

  function renderTagMenu(input: HTMLInputElement) {
    const tags = filteredTags(input);
    activeTagInput = input;

    if (tags.length === 0) {
      hideTagMenu();
      return;
    }

    positionTagMenu(input);
    tagMenu.replaceChildren(
      ...tags.map((tag, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "freer-tag-suggestion";
        item.dataset.active = index === 0 ? "true" : "false";
        item.textContent = tag;
        item.addEventListener("mousedown", (event) => {
          event.preventDefault();
          setTagInputValue(input, tag);
          hideTagMenu();
          input.focus();
        });
        return item;
      }),
    );
    tagMenu.dataset.open = "true";
  }

  function activeTagItems() {
    return Array.from(
      tagMenu.querySelectorAll<HTMLButtonElement>(".freer-tag-suggestion"),
    );
  }

  function moveActiveTag(delta: number) {
    const items = activeTagItems();
    if (items.length === 0) return;

    const currentIndex = Math.max(
      0,
      items.findIndex((item) => item.dataset.active === "true"),
    );
    const nextIndex = (currentIndex + delta + items.length) % items.length;

    items.forEach((item, index) => {
      item.dataset.active = index === nextIndex ? "true" : "false";
    });
    items[nextIndex].scrollIntoView({ block: "nearest" });
  }

  function syncVisibility() {
    const shouldShow = isDashboardRoute();
    button.hidden = !shouldShow;

    if (shouldShow && refreshTimer === undefined) {
      void refresh();
      refreshTimer = window.setInterval(refresh, 15000);
    }

    if (!shouldShow && refreshTimer !== undefined) {
      window.clearInterval(refreshTimer);
      refreshTimer = undefined;
    }
  }

  async function refresh() {
    if (button.hidden) return;

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

  async function refreshTagSuggestions() {
    tagSuggestions = await getTagSuggestions();
    attachTagSuggestions();
  }

  function syncStudioEnhancements() {
    syncVisibility();
    if (tagSuggestions.length > 0) {
      attachTagSuggestions();
    }
  }

  syncVisibility();
  await refreshTagSuggestions();
  watchRouteChanges(syncStudioEnhancements);

  const observer = new MutationObserver(syncStudioEnhancements);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("focusin", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.dataset.freerTagInput !== "true") return;
    renderTagMenu(input);
  });

  document.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.dataset.freerTagInput !== "true") return;
    renderTagMenu(input);
  });

  document.addEventListener("keydown", (event) => {
    if (!activeTagInput || tagMenu.dataset.open !== "true") return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveTag(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveTag(-1);
    }

    if (event.key === "Enter") {
      const activeItem = activeTagItems().find(
        (item) => item.dataset.active === "true",
      );
      if (!activeItem?.textContent) return;
      event.preventDefault();
      setTagInputValue(activeTagInput, activeItem.textContent);
      hideTagMenu();
    }

    if (event.key === "Escape") {
      hideTagMenu();
    }
  });

  document.addEventListener("focusout", (event) => {
    if (event.target !== activeTagInput) return;
    window.setTimeout(() => {
      if (!tagMenu.matches(":hover")) hideTagMenu();
    }, 120);
  });

  window.addEventListener("resize", () => {
    if (activeTagInput && tagMenu.dataset.open === "true") {
      positionTagMenu(activeTagInput);
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (activeTagInput && tagMenu.dataset.open === "true") {
        positionTagMenu(activeTagInput);
      }
    },
    true,
  );
}

init();

export {};
