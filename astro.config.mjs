import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const isDevServer = process.argv.includes("dev");
const isStudioServer = process.env.FREER_STUDIO === "1";

export default defineConfig({
  site: "https://freer.top",
  integrations: isDevServer ? [react(), keystatic()] : [],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    server: {
      hmr: isStudioServer ? false : undefined,
      watch: {
        ignored: isStudioServer ? ["**/src/content/**"] : [],
      },
    },
  },
});
