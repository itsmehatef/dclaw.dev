# dclaw-web — Production handoff

This prototype is `index.html` + JSX served as a single-page SPA. The real site lives in
`itsmehatef/dclaw.dev` (Astro + Tailwind). This doc covers the one piece that can't be mocked
faithfully in the prototype: **wiring the `/changelog` page to GitHub Releases at build time**.

## Why build-time, not runtime

| | Build-time fetch | Client-side fetch |
|---|---|---|
| Rate limit | None at runtime | 60 req/IP/hr unauth — one office IP can DoS the page |
| First paint | Static HTML, instant | Loading state, then content |
| SEO | Crawlable | Empty until JS runs |
| Stale risk | Until next deploy (~30s with the workflow below) | Always live |
| Works if GitHub is down | Yes | No |

Tailscale, Linear, Vercel all do build-time. Recommend the same.

---

## 1. Astro page — fetch in frontmatter

Create `src/pages/changelog.astro` in `dclaw.dev`:

```astro
---
// Runs at build time. Output is baked into static HTML.
import Layout from "../layouts/Layout.astro";

type GhRelease = {
  tag_name: string;
  name: string | null;
  body: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
};

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
// Optional but recommended — raises rate limit from 60 -> 5000/hr.
// Set GITHUB_TOKEN as a build-time env var (default available in Actions).
if (import.meta.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${import.meta.env.GITHUB_TOKEN}`;
}

const res = await fetch(
  "https://api.github.com/repos/itsmehatef/dclaw/releases?per_page=50",
  { headers }
);
if (!res.ok) {
  throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
}
const releases = (await res.json() as GhRelease[])
  .filter((r) => !r.draft)
  .sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));
---

<Layout title="Changelog · dclaw">
  <main class="cl-feed">
    {releases.map((r, i) => (
      <article class:list={["cl-entry", i === 0 && !r.prerelease && "current"]}>
        <header>
          <span class="cl-tag mono">{r.tag_name}</span>
          <time datetime={r.published_at}>
            {new Date(r.published_at).toISOString().slice(0, 10)}
          </time>
        </header>
        <h2>{r.name || r.tag_name}</h2>
        <!-- body is GitHub-flavored Markdown. Pipe through a markdown renderer
             (e.g. `marked` or Astro's built-in `<Markdown>`) before rendering. -->
        <div class="cl-body" set:html={renderMarkdown(r.body)} />
        <a href={r.html_url} target="_blank" rel="noopener">View on GitHub →</a>
      </article>
    ))}
  </main>
</Layout>
```

Markdown rendering: install `marked` (`npm i marked`) or use `astro:content` with the
`render()` API. Strip raw HTML for safety (`marked.parse(body, { mangle: false })` plus
`DOMPurify` if you allow contributor-authored release notes).

The CSS in `styles.css` (the `.cl-*` block) ports cleanly to Tailwind or stays as-is in
`global.css`.

---

## 2. Auto-redeploy on every release

Two workflows. The first lives in **dclaw**, the second in **dclaw.dev**.

### `.github/workflows/notify-site.yml` — in `itsmehatef/dclaw`

```yaml
name: Notify dclaw.dev on release
on:
  release:
    types: [published]

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger dclaw.dev rebuild
        env:
          GH_TOKEN: ${{ secrets.SITE_DISPATCH_TOKEN }}
        run: |
          gh api repos/itsmehatef/dclaw.dev/dispatches \
            -f event_type=release-published \
            -f 'client_payload[tag]=${{ github.event.release.tag_name }}'
```

`SITE_DISPATCH_TOKEN` = a fine-grained PAT scoped to `dclaw.dev` with **Contents: read** and
**Metadata: read** permission. Stored as a repo secret on `dclaw`.

### `.github/workflows/deploy.yml` — in `itsmehatef/dclaw.dev`

```yaml
name: Deploy dclaw.dev
on:
  push:
    branches: [main]
  repository_dispatch:
    types: [release-published]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Swap `actions/deploy-pages` for the Vercel / Netlify / Cloudflare Pages action if you're not
on GitHub Pages — most platforms also accept a webhook URL you can `curl` from the dispatch
workflow instead of the two-step approach.

The default `secrets.GITHUB_TOKEN` is enough for the build-time API call (5000 req/hr). No
PAT needed in `dclaw.dev`.

---

## 3. Release discipline

For the page to look good, every release on `dclaw` needs:

- A real **release** (not just a tag) — published via `gh release create` or the GitHub UI.
- A **markdown body** with `### Security`, `### Features`, `### Breaking` headings (matches
  the prototype's section labels). The frontmatter parser in step 1 can split on these.
- Sane `tag_name` — keep using `vMAJOR.MINOR.PATCH-channel` (`v0.3.0-beta.2-...`).

If you'd rather author once and publish twice, generate the GitHub release body from a single
source: `gh release create vX.Y.Z -F docs/releases/vX.Y.Z.md`.

---

## 4. Checklist before going live

- [ ] Port `.cl-*` styles from this prototype's `styles.css` into `dclaw.dev`'s `global.css`
      (or convert to Tailwind utilities).
- [ ] Decide markdown renderer (`marked` recommended) and sanitization (`DOMPurify` if
      release bodies are ever contributor-authored).
- [ ] Add `SITE_DISPATCH_TOKEN` PAT to `dclaw` repo secrets.
- [ ] Configure deploy target (Pages / Vercel / Netlify / Cloudflare).
- [ ] First publish on a draft release to verify the workflow chain end to end.
- [ ] Add a fallback in the Astro page: if the API call fails at build, log and ship the
      previous build's content (or a stub) instead of failing the deploy.

---

## 5. Things this prototype mocks that production will replace

- The `RELEASES` array in `ChangelogPage.jsx` → API response.
- The kind-based section coloring (`Security` / `Features` / `Breaking`) → parsed from
  markdown headings in each release body.
- The "current" pill on the latest non-prerelease → `i === 0 && !r.prerelease`.
- "View on GitHub" link → `release.html_url` (already correct shape in mock data).

Everything else — the rail, the entry card, the typography, the source-note block — is
production-ready CSS.
