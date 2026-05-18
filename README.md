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

## Local Studio

Run the local content studio:

```bash
npm run studio
```

Then open:

```text
http://127.0.0.1:4321/keystatic/
```

Keystatic is enabled only for local development. Production builds stay static and do not expose the studio route.

The local studio uses a small local login page:

```text
username: admin
password: freer-local
```

Override these values with environment variables, or create a local `.env` from `.env.example`:

```powershell
$env:KEYSTATIC_AUTH_USERNAME = "admin"
$env:KEYSTATIC_AUTH_PASSWORD = "your-local-password"
npm run studio
```

The studio manages:

```text
articles  -> src/content/articles
notes     -> src/content/notes
projects  -> src/content/projects
library   -> src/content/books
photos    -> src/content/photos
```

Each entry has status, tags, license, and copyright fields. Library entries also include type, author, language, and source fields.

Keystatic writes Markdown files to the repo. You can edit through the studio or directly edit the source files in your editor.

Published pages support:

- Markdown
- Mermaid code blocks with ```` ```mermaid ````
- LaTeX math with `$inline$` and `$$block$$`

To add a new collection:

1. Add a schema to `src/content.config.ts`.
2. Add the Keystatic collection to `keystatic.config.ts`.
3. Add a list page and optional `[slug].astro` page under `src/pages`.
4. Reuse `EntryList.astro`, `EntryLayout.astro`, and the existing `writingCollection(...)` helper where possible.

## Build

```bash
npm run build
```

## Publish

After editing content locally:

```bash
npm run publish
```

This script builds the site, commits staged changes with a default message, and pushes to GitHub. Cloudflare Pages then deploys from the `main` branch.

Cloudflare Pages settings:

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
