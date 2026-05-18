# Freer

Personal website for `freer.top`, built with Astro and deployed on Cloudflare Pages.

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

After the first successful deployment, add these custom domains in Cloudflare Pages:

- `freer.top`
- `www.freer.top`
