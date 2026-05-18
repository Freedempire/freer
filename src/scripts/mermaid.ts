const blocks = Array.from(
  document.querySelectorAll<HTMLElement>("pre > code.language-mermaid"),
);

if (blocks.length > 0) {
  const { default: mermaid } = await import("mermaid");

  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "strict",
  });

  blocks.forEach((block) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mermaid";
    wrapper.textContent = block.textContent ?? "";
    block.parentElement?.replaceWith(wrapper);
  });

  await mermaid.run({
    querySelector: ".mermaid",
  });
}

export {};
