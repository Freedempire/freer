# freer.top

Static archive for articles, projects, photos, notes, and public-domain texts.

Built with Astro, Markdown content collections, and Cloudflare Pages.

## Content

```text
src/content/articles  long-form writing
src/content/projects  project logs
src/content/notes     knowledge-base notes
src/content/books     books, serials, and library parent entries
src/content/chapters  chapters linked to library entries
src/content/photos    photo entries and metadata
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
chapters  -> src/content/chapters
photos    -> src/content/photos
```

Each entry has status, tags, license, and copyright fields. Library entries also include type, author, language, and source fields.

In the local studio, Tag fields suggest existing tags from `src/content` as you type. Chapter pages inherit tags from their parent Library entry at render time, so you do not need to repeat book-level tags on every chapter.

For a long public-domain book or serial, create one parent entry in `Library`, then create each chapter in `Book Chapters`.

Use the chapter fields this way:

```text
Book           parent Library entry
Part           optional grouping, e.g. Part 1 or Volume I
Part order     numeric order for parts
Chapter order  numeric order within the full book
Chapter label  optional display label, e.g. Chapter 1 or 第三章
```

The public pages then render:

```text
/library/                    all library entries with grouped tables of contents
/library/book-slug/          book intro plus full table of contents
/library/book-slug/chapter/  chapter page with previous/next navigation
```

Keystatic writes Markdown files to the repo. You can edit through the studio or directly edit the source files in your editor.

`npm run studio` runs with content-file hot reload disabled so Create and Save in Keystatic do not force the editor page to reload. Use `npm run dev` when you want normal site preview hot reload while editing files directly.

The editor stores MDX-compatible Markdown in `.md` files. Published pages support:

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
