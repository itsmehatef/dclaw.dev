// HomePage.jsx
const { useState: useStateHome } = React;

const INSTALL_CMD = "brew install itsmehatef/tap/dclaw && dclaw init && dclaw daemon start";

function InstallBlock() {
  const [copied, setCopied] = useStateHome(false);
  const copy = () => {
    navigator.clipboard?.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="install-block">
      <div className="install-tabs">
        <span className="install-tab active">brew</span>
        <span className="install-tab-hint mono">macOS · Linux</span>
      </div>
      <div className="install-body">
        <span className="prompt">$</span>
        <span className="cmd">{INSTALL_CMD}</span>
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  );
}

const FEATURES = [
  { id: "01", title: "Mandatory sandboxing", desc: "Every agent — brain and tools — runs inside a Docker container. There is no sandbox.mode: \"off\". One prompt injection = one destroyed container." },
  { id: "02", title: "Hardened container posture", desc: "CapDrop ALL · no-new-privileges · ReadonlyRootfs · tmpfs overlays for /tmp+/run · non-root uid 1000 · PidsLimit 256 · seccomp default. mknod, ptrace, setuid, fork-bomb — all return EPERM." },
  { id: "03", title: "Path-validated workspaces", desc: "workspace-root allow-root + system denylist (/etc, /var, docker.sock, Docker Desktop socket). Symlink-resolved before mount. --workspace-trust is the only escape, and it's logged." },
  { id: "04", title: "pi-mono under the hood", desc: "Agent loop is @mariozechner/pi-coding-agent — 34.6k stars, MIT, multi-model. We do not rewrite the agentic loop. We wrap it." },
  { id: "05", title: "NDJSON audit log", desc: "Every agent-create decision (pass / forbidden / trust) lands in audit.log with rotation: 10 MB × 5 files. O_APPEND + O_SYNC + 0600. Reconstruct who-trusted-what after the fact." },
  { id: "06", title: "First-run that actually works", desc: "dclaw init creates the allow-root, dclaw doctor preflights seven checks, dclaw daemon start brings up the control plane. State-dir honors XDG on Linux, ~/.dclaw on macOS." }
];

function FeatureGrid() {
  return (
    <div className="features">
      {FEATURES.map(f => (
        <div className="feature" key={f.id}>
          <div className="feature-id">{f.id} ·</div>
          <h3 className="feature-title">{f.title}</h3>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

const COMPARE_ROWS = [
  ["Sandbox scope",      "Optional, bash-only",        "Mandatory, full-agent"],
  ["Agent loop",         "Runs on bare metal",         "Runs inside container"],
  ["File operations",    "Bare metal",                 "Inside container"],
  ["Network egress",     "Bare metal",                 "Per-agent iptables allowlist"],
  ["Agent isolation",    "Shared process",             "One container per agent"],
  ["Blast radius",       "One compromise = full host", "One compromise = one agent"],
];

function Compare() {
  return (
    <div className="compare">
      <div className="compare-row head">
        <div className="compare-cell">Dimension</div>
        <div className="compare-cell">Bare-metal agent runtimes</div>
        <div className="compare-cell">dclaw</div>
      </div>
      {COMPARE_ROWS.map(([k, a, b], i) => (
        <div className="compare-row" key={i}>
          <div className="compare-cell mono">{k}</div>
          <div className="compare-cell dim">{a}</div>
          <div className="compare-cell strong">{b}</div>
        </div>
      ))}
    </div>
  );
}

const MILESTONES = [
  { ver: "v0.2.0-cli",            status: "shipped", done: true,  title: "CLI bones",         desc: "dclaw version, --help, structured JSON error envelopes. EX_UNAVAILABLE for daemon-bound commands." },
  { ver: "v0.3.0-alpha → beta.1", status: "shipped", done: true,  title: "Daemon + paths",    desc: "Go daemon, JSON-RPC wire protocol, fleet lifecycle. workspace-root validator, --workspace-trust, NDJSON audit log." },
  { ver: "v0.3.0-beta.2",         status: "current", done: false, title: "Sandbox hardening", desc: "Container posture: cap drop, no-new-privileges, ReadonlyRootfs, tmpfs, non-root uid, PidsLimit, docker.sock denylist.", current: true },
  { ver: "v1.0 GA",               status: "next",    done: false, title: "General availability", desc: "Web dashboard, egress allowlist wiring, distroless agent image. Channel plugins follow." },
];

function Roadmap() {
  return (
    <div className="roadmap">
      {MILESTONES.map(m => (
        <div key={m.ver} className={`milestone ${m.done ? 'done' : ''} ${m.current ? 'current' : ''}`}>
          <div className="milestone-ver">
            <span>{m.ver}</span>
            <span className="milestone-status">{m.status}</span>
          </div>
          <h4 className="milestone-title">{m.title}</h4>
          <p className="milestone-desc">{m.desc}</p>
        </div>
      ))}
    </div>
  );
}

function HomePage() {
  return (
    <React.Fragment>
      <section className="hero" data-screen-label="Home / Hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">v0.3.0-beta.2 · sandbox-hardening · apache-2.0</div>
            <h1 className="hero-title">
              Container-native<br />
              multi-agent platform. <em>hardened by default.</em>
            </h1>
            <p className="hero-sub">
              Every agent runs inside its own Docker container — brain, tools, filesystem, network. Caps dropped, rootfs read-only, uid 1000, PIDs capped at 256. A Go control plane routes; pi-mono containers think. One compromise stays one compromise.
            </p>
            <InstallBlock />
            <div className="cta-row">
              <a href="#/architecture" className="btn-primary">Read the architecture →</a>
              <a href="https://github.com/itsmehatef/dclaw" target="_blank" rel="noopener" className="btn-ghost">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.1 2 3 1.4 3.7 1.1.1-.8.5-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 011.3-3.3c-.1-.3-.6-1.7.1-3.5 0 0 1-.3 3.4 1.3a11.8 11.8 0 016.2 0c2.3-1.6 3.4-1.3 3.4-1.3.6 1.8.2 3.2.1 3.5.8.9 1.3 2 1.3 3.3 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3"/></svg>
                github.com/itsmehatef/dclaw
              </a>
            </div>
            <div className="hero-meta">
              <span>◇ <b>~250MB</b> image</span>
              <span>◇ <b>Alpine</b> base · uid 1000</span>
              <span>◇ requires <b>go 1.25+</b> · <b>docker 24+</b></span>
              <span>◇ <b>macOS</b> + <b>Linux</b> · XDG-aware</span>
            </div>
          </div>

          <div>
            <Diagram />
          </div>
        </div>
      </section>

      <section data-screen-label="Home / Features">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— what's in beta.2 today</div>
              <h2 className="section-title">Six decisions, baked in.</h2>
            </div>
            <p className="section-sub">
              dclaw is opinionated. These are calls made once so you don't make them per-deployment. They do not come back as flags. The denylist is absolute on every OS — even <span className="mono">--workspace-trust</span> can't bypass it.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      <section data-screen-label="Home / Posture">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— container posture · beta.2</div>
              <h2 className="section-title">Seven boxes the agent runs inside of.</h2>
            </div>
            <p className="section-sub">
              Paths hardening (beta.1) bounded WHERE the bind-mount points. Sandbox hardening (beta.2) bounds WHAT the containerized agent can do once inside. There is no escape hatch for any of these.
            </p>
          </div>
          <div className="features">
            {[
              ["CapDrop ALL",        "Every Linux capability dropped. mknod fails with EPERM. CAP_NET_RAW, CAP_MKNOD, CAP_SYS_CHROOT — gone."],
              ["no-new-privileges",  "Setuid/setgid bits cannot grant new privileges via execve. Defense vs CVE-2019-5736 and similar runc escapes."],
              ["ReadonlyRootfs",     "Rootfs is read-only. /tmp and /run are tmpfs overlays with noexec,nosuid,nodev. /workspace is the only persistent write surface."],
              ["uid 1000:1000",      "Daemon enforces non-root user regardless of image USER directive. A regressed image still can't run as root."],
              ["PidsLimit 256",      "Fork bomb caps at 256 processes. pi-mono steady-state is ~5. The 257th fork returns EAGAIN."],
              ["seccomp default",    "Docker's daemon-loaded default profile applied. unshare(CLONE_NEWUSER), keyctl, ptrace — denied for unprivileged."],
              ["docker.sock denylist", "Three Docker socket paths absolutely denied as workspaces. Linux /var/run, systemd /run, Docker Desktop macOS. --workspace-trust can't bypass."],
            ].map(([t, d], i) => (
              <div className="feature" key={i}>
                <div className="feature-id">{String(i + 1).padStart(2, '0')} ·</div>
                <h3 className="feature-title mono" style={{ fontSize: 16 }}>{t}</h3>
                <p className="feature-desc">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-screen-label="Home / Compare">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— against bare-metal runtimes</div>
              <h2 className="section-title">Sandboxing isn't a feature. It's the whole point.</h2>
            </div>
            <p className="section-sub">
              Most agent frameworks run on your host. The agent's bash tool IS your bash. The agent's network IS your network. That is a fine demo and a poor production story.
            </p>
          </div>
          <Compare />
        </div>
      </section>

      <section data-screen-label="Home / Roadmap">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— roadmap</div>
              <h2 className="section-title">Shipped in phases. No vaporware.</h2>
            </div>
            <p className="section-sub">
              We're in beta.2 today. Each phase ships with working binaries and a public changelog. Container posture is the second-to-last gate before GA.
            </p>
          </div>
          <Roadmap />
        </div>
      </section>

      <footer data-screen-label="Home / Footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="brand" style={{ marginBottom: 12 }}>
                <img src="logo-96.png" alt="" className="brand-mark-img" width="32" height="32" />
                <span>dclaw</span>
                <span className="brand-version" style={{ marginLeft: 4 }}>v0.3.0-beta.2</span>
              </div>
              <p style={{ color: 'var(--fg-muted)', fontSize: 13.5, margin: 0, maxWidth: '32ch' }}>
                Container-native multi-agent platform. Sandboxing is mandatory. Apache-2.0.
              </p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#/architecture">Architecture</a></li>
                <li><a href="#/changelog">Changelog</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Docs</h4>
              <ul>
                <li><a href="#">Quickstart</a></li>
                <li><a href="#">fleet.yaml</a></li>
                <li><a href="#">CLI reference</a></li>
                <li><a href="#">Wire protocol</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Community</h4>
              <ul>
                <li><a href="https://github.com/itsmehatef/dclaw" target="_blank" rel="noopener">GitHub</a></li>
                <li><a href="#">Discord</a></li>
                <li><a href="https://github.com/badlogic/pi-mono" target="_blank" rel="noopener">pi-mono</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-credit">
            <span>© 2026 dclaw · apache-2.0</span>
            <span>agent loop by <a href="https://github.com/badlogic/pi-mono" style={{ color: 'var(--fg-muted)', textDecoration: 'underline' }} target="_blank" rel="noopener">pi-mono</a> · mit</span>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

window.HomePage = HomePage;
