# dclaw.dev — Astro site

Production Astro implementation of the dclaw.dev marketing site. Deployed via Cloudflare Pages on push to `main` (`npm run build` → `dist/`).

## Structure

```
src/
├── layouts/BaseLayout.astro         # html shell + theme bootstrap + nav
├── components/
│   ├── Nav.astro                    # top nav with theme toggle
│   ├── DocsShell.astro              # sidebar + main column for /docs/*
│   ├── Diagram.astro                # homepage 3-band diagram
│   └── DiagramFull.astro            # /architecture canonical diagram
├── pages/
│   ├── index.astro                  # /            — homepage
│   ├── architecture.astro           # /architecture
│   ├── changelog.astro              # /changelog
│   └── docs/
│       ├── index.astro              # /docs
│       ├── quickstart.astro         # /docs/quickstart
│       ├── cli.astro                # /docs/cli
│       └── fleet.astro              # /docs/fleet
└── styles/global.css                # all tokens, components, themes
public/
├── favicon.png
└── logo-96.png
```

## Run

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

## What changed from the prototype

- Hash routing (`#/docs/cli`) → real Astro file routes (`/docs/cli`).
- React (`window.HomePage` etc.) → Astro components with inline `<script is:inline>` only where needed (theme toggle, copy button).
- Tailwind config wired via `@astrojs/tailwind` with `applyBaseStyles: false` so the existing CSS reset in `global.css` wins.

## Still TODO post-merge

- Wire the changelog to fetch from the GitHub Releases API at build time.
- Add `repository_dispatch` workflow on the dclaw repo to redeploy on release.
- Write the four "coming soon" docs pages once the underlying features stabilize.
