# dclaw website

Static site for [dclaw](https://github.com/itsmehatef/dclaw) — the daemon-mode runtime for Claude Code agents.

## Stack

- Plain `index.html`
- React 18 + JSX, transpiled in the browser via `@babel/standalone`
- Hash routing (`/#/architecture`, `/#/docs/cli`, etc.)
- Zero build step

## Develop

Open `index.html` in a browser, or run any static server:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy (Cloudflare Pages)

- Framework preset: **None**
- Build command: *(blank)*
- Output directory: `/`

Auto-deploys on push to `main`.

## Files

| | |
|---|---|
| `index.html` | Entry point + script tags |
| `styles.css` | All styles + theme tokens |
| `Nav.jsx` | Top nav + theme toggle |
| `HomePage.jsx` | Hero, install block, homepage diagram |
| `ArchPage.jsx` | `/#/architecture` — full architecture writeup |
| `DocsPage.jsx` | `/#/docs/*` — docs hub + 3 pages (cli, configuration, plugins) |
| `ChangelogPage.jsx` | `/#/changelog` — release history |
| `Diagram.jsx` | Homepage architecture diagram |
| `DiagramFull.jsx` | Full architecture diagram |
| `Tweaks.jsx` | In-design tweak panel (dev only) |
| `_redirects` | Cloudflare Pages SPA fallback |

## Future migration

See `HANDOFF.md` for an Astro + Tailwind port plan when the in-browser Babel cost stops being acceptable.
