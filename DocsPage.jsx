// DocsPage.jsx — terminal-style docs with sidebar TOC
// Sub-routes: index, quickstart, cli, fleet
const { useState: useStateDocs, useEffect: useEffectDocs } = React;

const DOC_NAV = [
  { group: "start here", items: [
    { id: "index", label: "Overview" },
    { id: "quickstart", label: "Quickstart" },
  ]},
  { group: "reference", items: [
    { id: "cli", label: "CLI reference" },
    { id: "fleet", label: "fleet.yaml" },
  ]},
  { group: "coming soon", items: [
    { id: "channels", label: "Channel plugins", soon: true },
    { id: "recipes", label: "Recipes", soon: true },
    { id: "rpc", label: "RPC reference", soon: true },
    { id: "faq", label: "FAQ", soon: true },
  ]},
];

function DocsPage({ subroute, setSubroute }) {
  const Page = (
    subroute === 'quickstart' ? DocQuickstart :
    subroute === 'cli' ? DocCLI :
    subroute === 'fleet' ? DocFleet :
    DocIndex
  );

  return (
    <section className="docs-shell" data-screen-label={`Docs / ${subroute || 'index'}`}>
      <div className="container docs-container">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-title mono">./docs · v0.3.0-beta.2</div>
          {DOC_NAV.map(group => (
            <div className="docs-nav-group" key={group.group}>
              <div className="docs-nav-label">{group.group}</div>
              {group.items.map(it => (
                <a key={it.id}
                   href={`#/docs/${it.id === 'index' ? '' : it.id}`}
                   className={`docs-nav-link ${subroute === it.id || (subroute == null && it.id === 'index') ? 'active' : ''} ${it.soon ? 'soon' : ''}`}
                   onClick={(e) => {
                     if (it.soon) { e.preventDefault(); return; }
                     e.preventDefault();
                     setSubroute(it.id === 'index' ? null : it.id);
                   }}>
                  {it.label}
                  {it.soon && <span className="docs-soon-tag">soon</span>}
                </a>
              ))}
            </div>
          ))}
          <div className="docs-sidebar-foot">
            <a href="https://github.com/itsmehatef/dclaw" target="_blank" rel="noopener" className="docs-side-out">
              GitHub README →
            </a>
            <a href="https://github.com/itsmehatef/dclaw/blob/main/docs/architecture.md" target="_blank" rel="noopener" className="docs-side-out">
              architecture.md →
            </a>
          </div>
        </aside>
        <main className="docs-main">
          <Page />
        </main>
      </div>
    </section>
  );
}

// ---------- Reusable doc primitives ----------
function DocH1({ eyebrow, children }) {
  return (
    <div className="doc-h1-block">
      {eyebrow && <div className="doc-eyebrow">{eyebrow}</div>}
      <h1 className="doc-h1">{children}</h1>
    </div>
  );
}
function DocH2({ children }) { return <h2 className="doc-h2">{children}</h2>; }
function DocH3({ children }) { return <h3 className="doc-h3">{children}</h3>; }
function DocP({ children })  { return <p className="doc-p">{children}</p>; }
function DocCode({ children, lang }) {
  return (
    <pre className="doc-code"><code>{children}</code>{lang && <span className="doc-code-lang">{lang}</span>}</pre>
  );
}
function DocCallout({ tone = "note", title, children }) {
  return (
    <div className={`doc-callout doc-callout-${tone}`}>
      {title && <div className="doc-callout-title">{title}</div>}
      <div>{children}</div>
    </div>
  );
}
function DocKV({ rows }) {
  return (
    <div className="doc-kv">
      {rows.map((r, i) => (
        <div className="doc-kv-row" key={i}>
          <div className="doc-kv-key mono">{r[0]}</div>
          <div className="doc-kv-val">{r[1]}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- /docs (index) ----------
function DocIndex() {
  return (
    <article>
      <DocH1 eyebrow="docs">What's here, what's not.</DocH1>
      <DocP>
        dclaw is in <span className="mono">v0.3.0-beta.2</span>. The CLI, daemon, and sandbox are real and tested. The channel plugins and quota enforcement are partial. Docs follow the same line — what's written below is true; what's marked <span className="docs-soon-tag-inline">soon</span> isn't yet.
      </DocP>

      <DocH2>Read these</DocH2>
      <div className="docs-card-grid">
        <a href="#/docs/quickstart" className="docs-card" onClick={(e) => { e.preventDefault(); window.location.hash = '/docs/quickstart'; }}>
          <div className="docs-card-num mono">01</div>
          <div className="docs-card-title">Quickstart</div>
          <div className="docs-card-desc">Install dclaw, start the daemon, spawn your first agent, send it a message. ~5 minutes.</div>
        </a>
        <a href="#/docs/cli" className="docs-card" onClick={(e) => { e.preventDefault(); window.location.hash = '/docs/cli'; }}>
          <div className="docs-card-num mono">02</div>
          <div className="docs-card-title">CLI reference</div>
          <div className="docs-card-desc">Every command and flag. <span className="mono">up · status · logs · agent · daemon · doctor · upgrade</span>.</div>
        </a>
        <a href="#/docs/fleet" className="docs-card" onClick={(e) => { e.preventDefault(); window.location.hash = '/docs/fleet'; }}>
          <div className="docs-card-num mono">03</div>
          <div className="docs-card-title">fleet.yaml</div>
          <div className="docs-card-desc">The declarative config. Schema, examples, and the validation rules the daemon applies on load.</div>
        </a>
      </div>

      <DocH2>Coming soon</DocH2>
      <DocP>
        We don't ship docs for things that aren't stable. Here's the queue, in order:
      </DocP>
      <DocKV rows={[
        ["Channel plugins", "How to write a plugin against the channel-router contract. Blocked on plugin protocol freeze."],
        ["Recipes", "End-to-end how-tos: code-review bot, on-call triage, Linear sync. Blocked on having ≥3 reference deployments."],
        ["RPC reference", "Direct daemon RPC for integrations. Blocked on API stability — currently subject to change."],
        ["FAQ", "Common errors and fixes. Blocked on having more than ~12 users hitting them."],
      ]} />

      <DocH2>Out of scope</DocH2>
      <DocP>
        For deep architecture, threat model, and the comparison with bare-metal runtimes — see the <a className="doc-link" href="#/architecture" onClick={(e) => { e.preventDefault(); window.location.hash = '/architecture'; }}>architecture page</a>. For the current README and source — <a className="doc-link" href="https://github.com/itsmehatef/dclaw" target="_blank" rel="noopener">github.com/itsmehatef/dclaw</a>.
      </DocP>
    </article>
  );
}

// ---------- /docs/quickstart ----------
function DocQuickstart() {
  return (
    <article>
      <DocH1 eyebrow="quickstart · ~5 min">From install to first message.</DocH1>
      <DocP>
        Tested on macOS 14 + Linux (Ubuntu 22.04, Debian 12). Requires <span className="mono">docker 24+</span>. Go is bundled into the brew formula; you don't need a Go toolchain.
      </DocP>

      <DocCallout tone="warn" title="Docker is the sandbox">
        dclaw runs every agent inside Docker. If <span className="mono">docker info</span> doesn't work for your user, fix that first — Colima, Docker Desktop, or rootless Docker all work. <span className="mono">dclaw doctor</span> will tell you what's missing.
      </DocCallout>

      <DocH2>1 · Install</DocH2>
      <DocCode lang="shell">brew install itsmehatef/tap/dclaw</DocCode>

      <DocH2>2 · Initialize + start the daemon</DocH2>
      <DocCode lang="shell">{`dclaw init               # writes ~/.config/dclaw/config.yaml
dclaw doctor             # checks docker, ports, write perms
dclaw daemon start       # backgrounded; logs at ~/.local/state/dclaw/daemon.log`}</DocCode>
      <DocP>
        <span className="mono">init</span> creates an empty fleet, a default config, and (on first run) pulls the agent image — about 250MB.
      </DocP>

      <DocH2>3 · Spawn an agent</DocH2>
      <DocCode lang="shell">{`dclaw agent create scratch \\
  --image=dclaw-agent:v0.1 \\
  --workspace=~/dclaw/scratch`}</DocCode>
      <DocP>
        The workspace is bind-mounted into the container at <span className="mono">/workspace</span>. Path validation runs <em>before</em> mount: denylist (<span className="mono">/etc</span>, <span className="mono">/var</span>, <span className="mono">docker.sock</span>) is absolute; symlinks are resolved.
      </DocP>

      <DocH2>4 · Talk to it</DocH2>
      <DocCode lang="shell">{`dclaw agent chat scratch --one-shot 'list files in workspace'
# → bash tool runs inside the container; output streams back`}</DocCode>

      <DocH2>5 · Tear it down</DocH2>
      <DocCode lang="shell">{`dclaw agent destroy scratch       # stops + removes container, keeps workspace
dclaw daemon stop                 # if you're done`}</DocCode>

      <DocCallout tone="ok" title="That's the loop.">
        Spawn → chat → destroy. Everything else (channel plugins, fleet.yaml, multi-agent orchestration) layers on top of these four commands.
      </DocCallout>

      <DocH2>Where to next</DocH2>
      <ul className="doc-ul">
        <li><a className="doc-link" href="#/docs/cli" onClick={(e) => { e.preventDefault(); window.location.hash = '/docs/cli'; }}>CLI reference</a> — every flag</li>
        <li><a className="doc-link" href="#/docs/fleet" onClick={(e) => { e.preventDefault(); window.location.hash = '/docs/fleet'; }}>fleet.yaml</a> — declarative agents instead of imperative <span className="mono">agent create</span></li>
        <li><a className="doc-link" href="#/architecture" onClick={(e) => { e.preventDefault(); window.location.hash = '/architecture'; }}>Architecture</a> — what's actually inside the container</li>
      </ul>
    </article>
  );
}

// ---------- /docs/cli ----------
const CLI_GROUPS = [
  { name: "lifecycle", commands: [
    { sig: "dclaw init", desc: "Bootstrap config, fleet, and state dirs. Idempotent. Pulls the default agent image on first run." },
    { sig: "dclaw doctor", desc: "Diagnose: docker reachable? ports clear? write perms? Returns non-zero on failure with actionable hints." },
    { sig: "dclaw upgrade", desc: "Pull the latest agent image and restart the daemon if needed. Respects pinned versions in fleet.yaml." },
  ]},
  { name: "daemon", commands: [
    { sig: "dclaw daemon start", desc: "Start the control plane in the background. PID at ~/.local/state/dclaw/daemon.pid." },
    { sig: "dclaw daemon stop", desc: "Graceful shutdown. Sends SIGTERM, waits for in-flight tool calls to drain, then exits." },
    { sig: "dclaw daemon status", desc: "Daemon health + uptime + active agent count. Exit 0 if running." },
    { sig: "dclaw daemon logs [--tail=N] [-f]", desc: "Stream the daemon log. JSON-lines; pipe to jq." },
  ]},
  { name: "agent", commands: [
    { sig: "dclaw agent create <name>", desc: "Spawn a new agent container.", flags: [
      ["--image", "OCI image. Default: dclaw-agent:v0.1"],
      ["--workspace", "Host path to bind-mount. Validated against denylist."],
      ["--workspace-trust", "Override the denylist. Logged. Use only if you know what you're doing."],
      ["--model", "anthropic/claude-3-5-sonnet | openai/gpt-4o | google/gemini-1.5-pro | … (via pi-mono)"],
      ["--max-cost", "Hard cap on API spend. Daemon kills the container at the threshold."],
    ]},
    { sig: "dclaw agent chat <name>", desc: "Open an interactive chat session. Streams tool output.", flags: [
      ["--one-shot 'msg'", "Send a single message and exit."],
      ["--no-tools", "Disable tool use for this session."],
    ]},
    { sig: "dclaw agent list", desc: "All agents the daemon knows about, with status + uptime." },
    { sig: "dclaw agent logs <name>", desc: "Per-agent log. Includes model calls, tool execs, sandbox events." },
    { sig: "dclaw agent destroy <name>", desc: "Stop + remove the container. Workspace is preserved unless --purge." },
  ]},
  { name: "fleet", commands: [
    { sig: "dclaw up", desc: "Reconcile running agents against fleet.yaml. Creates missing, restarts drifted, leaves matching alone." },
    { sig: "dclaw status", desc: "Per-agent: spec source, image, container state, last health check." },
    { sig: "dclaw logs [--agent=<name>] [-f]", desc: "Aggregate logs across the fleet." },
  ]},
];

function DocCLI() {
  return (
    <article>
      <DocH1 eyebrow="reference">CLI</DocH1>
      <DocP>
        Every command, every flag in <span className="mono">v0.3.0-beta.2</span>. Run any command with <span className="mono">--help</span> for the same content inline.
      </DocP>

      {CLI_GROUPS.map(g => (
        <React.Fragment key={g.name}>
          <DocH2>{g.name}</DocH2>
          <div className="cli-table">
            {g.commands.map((c, i) => (
              <div className="cli-cmd" key={i}>
                <div className="cli-sig mono">{c.sig}</div>
                <div className="cli-desc">{c.desc}</div>
                {c.flags && (
                  <div className="cli-flags">
                    {c.flags.map((f, j) => (
                      <div className="cli-flag" key={j}>
                        <span className="mono cli-flag-name">{f[0]}</span>
                        <span className="cli-flag-desc">{f[1]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      <DocH2>Exit codes</DocH2>
      <DocKV rows={[
        ["0",  "success"],
        ["1",  "user error (bad flag, unknown agent, etc)"],
        ["2",  "daemon unreachable"],
        ["3",  "docker unreachable"],
        ["10", "workspace denied (path on denylist, no --workspace-trust)"],
        ["20", "image pull failed"],
        ["30", "model provider auth failed"],
      ]} />
    </article>
  );
}

// ---------- /docs/fleet ----------
function DocFleet() {
  const example = `# fleet.yaml — declarative agent fleet
version: 1

defaults:
  image: dclaw-agent:v0.1
  model: anthropic/claude-3-5-sonnet
  max_cost_usd: 10

agents:
  - name: code-reviewer
    workspace: ~/repos/main-app
    model: anthropic/claude-3-5-sonnet
    channels: [slack:#code-reviews]
    max_cost_usd: 25

  - name: oncall-triage
    workspace: ~/dclaw/oncall
    model: openai/gpt-4o
    channels: [discord:#alerts, slack:#ops]
    network_allowlist:
      - api.pagerduty.com
      - api.linear.app

  - name: scratch
    workspace: ~/dclaw/scratch
    # inherits image, model, max_cost from defaults
`;
  return (
    <article>
      <DocH1 eyebrow="reference">fleet.yaml</DocH1>
      <DocP>
        The declarative source of truth for your agents. <span className="mono">dclaw up</span> reads this file and reconciles. Validated on load — the daemon refuses to start with an invalid fleet.
      </DocP>
      <DocP>
        Default location: <span className="mono">~/.config/dclaw/fleet.yaml</span> (XDG-aware).
      </DocP>

      <DocH2>Example</DocH2>
      <DocCode lang="yaml">{example}</DocCode>

      <DocH2>Top-level keys</DocH2>
      <DocKV rows={[
        ["version",   "Schema version. Currently 1. Required."],
        ["defaults",  "Inherited by every agent unless overridden. Optional."],
        ["agents",    "List of agent specs. At least one required."],
      ]} />

      <DocH2>Agent spec</DocH2>
      <DocKV rows={[
        ["name",              "Unique identifier. [a-z0-9-]+, max 32 chars. Required."],
        ["image",             "OCI image. Defaults to dclaw-agent:v0.1."],
        ["workspace",         "Host path. Validated against denylist + symlink-resolved. Required."],
        ["workspace_trust",   "Bool. Bypass denylist. Logged. Default false."],
        ["model",             "Provider/model string. Routed via pi-mono. anthropic/* · openai/* · google/* · openrouter/*."],
        ["channels",          "List of channel:target. e.g. slack:#ops, discord:#alerts. Plugin must be installed."],
        ["network_allowlist", "FQDNs the agent can reach. Empty = LLM provider only. CIDRs not yet supported."],
        ["max_cost_usd",      "Hard spend cap. Daemon enforces; container is killed when hit."],
        ["env",               "Map of name → value. Passed at container start. Never written to disk."],
      ]} />

      <DocCallout tone="warn" title="Validation is strict">
        Unknown keys are an error, not a warning. This is intentional — silently ignoring typos is how you end up with a workspace pointing somewhere you didn't expect.
      </DocCallout>

      <DocH2>Reconciliation</DocH2>
      <DocP>When you run <span className="mono">dclaw up</span>:</DocP>
      <ul className="doc-ul">
        <li><b>Missing</b> agents (in fleet, not running) → created.</li>
        <li><b>Drifted</b> agents (running, but spec changed) → recreated. Workspace preserved.</li>
        <li><b>Matching</b> agents (running, spec matches) → left alone.</li>
        <li><b>Orphaned</b> agents (running, not in fleet) → flagged in <span className="mono">dclaw status</span> but <em>not</em> removed. Use <span className="mono">dclaw agent destroy</span> explicitly.</li>
      </ul>
    </article>
  );
}

window.DocsPage = DocsPage;
