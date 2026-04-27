// ChangelogPage.jsx — mock changelog styled to match the rest of the site.
// In production, this list comes from the GitHub Releases API at build time.
// See HANDOFF.md for the Astro + GitHub Actions wiring.

const RELEASES = [
  {
    tag: "v0.3.0-beta.2-sandbox-hardening",
    name: "Sandbox hardening",
    date: "2026-04-22",
    status: "current",
    summary:
      "Mandatory container posture across every agent. Capabilities dropped, root filesystem locked, fork bombs and escalation paths closed.",
    sections: [
      {
        kind: "Security",
        items: [
          "Drop ALL Linux capabilities by default; agents run with no caps.",
          "no-new-privileges enforced via SecurityOpt — setuid escalation blocked.",
          "ReadonlyRootfs — agent FS is read-only outside the workspace mount.",
          "Default seccomp profile applied; mknod and raw-device syscalls denied.",
          "PidsLimit 256 per agent — fork bombs cannot exhaust host PIDs.",
          "Containers run as uid 1000 (non-root) with workspace ownership matched.",
          "docker.sock denylisted as a workspace path; symlink resolution validated.",
        ],
      },
      {
        kind: "Reliability",
        items: [
          "NDJSON audit log with size-based rotation in $XDG_STATE_HOME/dclaw.",
          "dclaw doctor pre-flight: Docker daemon, image pull, capability probe.",
        ],
      },
      {
        kind: "Breaking",
        items: [
          "CAP_NET_ADMIN dropped — egress allowlist wiring deferred to GA.",
          "Workspaces under /var/run, /proc, /sys are rejected with --workspace-trust.",
        ],
      },
    ],
  },
  {
    tag: "v0.3.0-beta.1",
    name: "First-run flow",
    date: "2026-03-30",
    status: "shipped",
    summary:
      "dclaw init scaffolds a usable home, dclaw doctor surfaces Docker problems, agent create / agent chat ship end-to-end.",
    sections: [
      {
        kind: "Features",
        items: [
          "dclaw init — scaffolds fleet.yaml, key store, and XDG state dir.",
          "dclaw doctor — health checks for Docker, image, and host config.",
          "agent create / agent chat --one-shot — full prompt → response loop.",
          "Workspace path validator with denylist and --workspace-trust flag.",
        ],
      },
    ],
  },
  {
    tag: "v0.3.0-alpha.4",
    name: "Daemon, end-to-end",
    date: "2026-03-12",
    status: "shipped",
    summary:
      "Daemon owns container lifecycle. JSON-RPC routing between channel plugins, daemon, and agent containers ships.",
    sections: [
      {
        kind: "Features",
        items: [
          "dclaw daemon start — long-running control plane on Unix socket.",
          "Container lifecycle managed by daemon; agents start/stop on demand.",
          "JSON-RPC 2.0 wire protocol over Unix domain sockets.",
          "Discord channel plugin reaches agent via daemon routing.",
        ],
      },
    ],
  },
  {
    tag: "v0.3.0-alpha.3",
    name: "Quota + cost tracking",
    date: "2026-02-26",
    status: "shipped",
    summary:
      "Per-agent token budgets, cost accounting, and rate limits enforced in the daemon.",
    sections: [
      {
        kind: "Features",
        items: [
          "Per-agent token quota with daily reset.",
          "Cost tracking by model and provider, persisted to state dir.",
          "Rate-limit enforcement at the daemon boundary.",
        ],
      },
    ],
  },
  {
    tag: "v0.3.0-alpha.2",
    name: "Fleet manager",
    date: "2026-02-09",
    status: "shipped",
    summary:
      "fleet.yaml declarative config; daemon reconciles container fleet to match.",
    sections: [
      {
        kind: "Features",
        items: [
          "fleet.yaml schema — agents, channels, models, quotas.",
          "Reconciliation loop brings running fleet to declared state.",
        ],
      },
    ],
  },
  {
    tag: "v0.2.0-cli",
    name: "CLI bones",
    date: "2026-01-14",
    status: "shipped",
    summary:
      "CLI scaffold and version surface. Commands requiring the daemon exit 69 with structured JSON.",
    sections: [
      {
        kind: "Features",
        items: [
          "dclaw version, dclaw --help wired.",
          "Daemon-required commands return EX_UNAVAILABLE (69) with -o json envelope.",
        ],
      },
    ],
  },
  {
    tag: "v0.1.0",
    name: "One agent in a container",
    date: "2025-12-18",
    status: "shipped",
    summary:
      "Proof-of-concept: pi-mono agent loop runs inside a Docker container with sandboxed tools.",
    sections: [
      {
        kind: "Features",
        items: [
          "Alpine + Node + @mariozechner/pi-coding-agent container image (~250 MB).",
          "Wrapper script runs an agent with a system prompt against a bind mount.",
        ],
      },
    ],
  },
];

function ChangelogPage() {
  return (
    <main data-screen-label="Changelog">
      <section className="cl-hero">
        <div className="container">
          <div className="eyebrow">— changelog</div>
          <h1 className="cl-title">Every release. Tagged, dated, sourced.</h1>
          <p className="cl-sub">
            Mirrored from <span className="mono">github.com/itsmehatef/dclaw/releases</span> at build time.
            Not a changelog file — the Releases API is the source of truth.
          </p>
          <div className="cl-meta">
            <span><b>{RELEASES.length}</b> releases</span>
            <span>·</span>
            <span>Latest <b>{RELEASES[0].tag}</b></span>
            <span>·</span>
            <span>Updated <b>{RELEASES[0].date}</b></span>
            <span>·</span>
            <span>Apache-2.0</span>
          </div>
        </div>
      </section>

      <section className="cl-feed-section">
        <div className="container">
          <div className="cl-feed">
            {RELEASES.map((r, i) => (
              <article key={r.tag} className={`cl-entry ${r.status}`}>
                <aside className="cl-rail">
                  <div className="cl-dot" />
                  {i < RELEASES.length - 1 ? <div className="cl-line" /> : null}
                </aside>
                <div className="cl-body">
                  <header className="cl-head">
                    <div className="cl-tag-row">
                      <span className="cl-tag mono">{r.tag}</span>
                      {r.status === "current" ? (
                        <span className="cl-pill current">Current</span>
                      ) : (
                        <span className="cl-pill">Shipped</span>
                      )}
                    </div>
                    <div className="cl-date mono">{r.date}</div>
                  </header>
                  <h2 className="cl-name">{r.name}</h2>
                  <p className="cl-summary">{r.summary}</p>
                  {r.sections.map((s) => (
                    <div key={s.kind} className="cl-section">
                      <div className={`cl-section-label mono kind-${s.kind.toLowerCase()}`}>
                        {s.kind}
                      </div>
                      <ul className="cl-list">
                        {s.items.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="cl-foot mono">
                    <a
                      href={`https://github.com/itsmehatef/dclaw/releases/tag/${r.tag}`}
                      target="_blank"
                      rel="noopener"
                      className="cl-link"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="cl-source-note">
            <div className="cl-source-head mono">— how this page is built</div>
            <p>
              At <span className="mono">astro build</span>, the page fetches{" "}
              <span className="mono">api.github.com/repos/itsmehatef/dclaw/releases</span> and bakes the
              response into static HTML. A <span className="mono">repository_dispatch</span> from the
              dclaw repo redeploys this site whenever a new release publishes — typically within 30
              seconds. No client-side fetch, no rate limits, no CHANGELOG.md to maintain.
            </p>
            <p className="cl-source-foot">
              See <span className="mono">HANDOFF.md</span> for the Astro frontmatter and GitHub Actions
              workflow.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

window.ChangelogPage = ChangelogPage;
