# freer.top

Static archive for articles, projects, photos, notes, and public-domain texts.

Built with Astro, Markdown content collections, and Cloudflare Pages.

## Content

```text
src/content/articles  long-form writing
src/content/projects  project logs
src/content/notes     knowledge-base notes
src/content/books     public-domain texts
src/data/photos.ts    photo index metadata
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Cloudflare Pages settings:

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
