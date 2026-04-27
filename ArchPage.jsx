// ArchPage.jsx
function ArchPage() {
  const threats = [
    { tag: "threat", title: "Prompt injection", desc: "Attacker jailbreaks an agent via untrusted input. On bare-metal runtimes this walks the agent's bash tool to your ~/.ssh.", arrow: "→ confined to one container. CapDrop ALL + ReadonlyRootfs + uid 1000. Cannot reach other agents, the host, the daemon." },
    { tag: "threat", title: "mknod + raw block device", desc: "CAP_MKNOD lets the agent create /tmp/sda pointing at the host's first SCSI disk and read raw sectors — including /etc/shadow on the host.", arrow: "→ CapDrop ALL removes CAP_MKNOD. mknod returns EPERM. Verified by smoke Test 17." },
    { tag: "threat", title: "Setuid escalation", desc: "A setuid binary on the rootfs (or one written by the agent) lets execve hand the agent a more-privileged identity. CVE-2019-5736 territory.", arrow: "→ no-new-privileges:true blocks execve from raising privileges. ReadonlyRootfs blocks writing new setuid binaries." },
    { tag: "threat", title: "Fork bomb / PID DoS", desc: "Spawn :(){ :|:& };: and exhaust the host's PID table. On macOS this crashes Docker Desktop's VM. On Linux it crashes the kernel.", arrow: "→ PidsLimit 256. The 257th fork returns EAGAIN. pi-mono's steady-state is 5." },
    { tag: "threat", title: "docker.sock as workspace", desc: "Bind-mount /var/run/docker.sock as the agent's workspace and the agent now controls the host's Docker daemon — equivalent to root.", arrow: "→ Three socket paths in the absolute denylist. --workspace-trust does NOT bypass. Pre-mount rejection with workspace_forbidden." },
    { tag: "threat", title: "Symlink workspace bypass", desc: "Create ~/dclaw-agents/trojan as a symlink to /etc and pass --workspace=~/dclaw-agents/trojan. Naive containment misses this.", arrow: "→ filepath.EvalSymlinks runs before the allow-root check. Symlinks resolve to canonical targets, then those are validated." },
  ];

  const layers = [
    ["Agent loop",       "pi-mono runs inside the container. LLM calls originate from there.",                    "Inside sandbox"],
    ["Tool execution",   "bash, file I/O, web fetch — all execute inside the container.",                         "Inside sandbox"],
    ["Capabilities",     "CapDrop: ALL. Empty CapAdd. mknod, ptrace, raw sockets — denied.",                      "All caps dropped"],
    ["Privilege escalation", "no-new-privileges:true. Setuid/setgid execve cannot raise effective uid.",          "Blocked"],
    ["Rootfs",           "ReadonlyRootfs:true. /tmp 64m + /run 8m as tmpfs (noexec,nosuid,nodev).",                "Read-only + EROFS"],
    ["User",             "HostConfig.User \"1000:1000\". Daemon overrides image USER. Workspace is uid 1000.",    "Non-root enforced"],
    ["Process count",    "PidsLimit 256. The 257th fork returns EAGAIN. pi-mono uses ~5 steady-state.",           "Capped"],
    ["Seccomp",          "Docker daemon-loaded default profile. unshare(CLONE_NEWUSER), keyctl denied.",          "Default profile"],
    ["Network egress",   "Per-agent allowlist (wiring planned post-GA; CAP_NET_ADMIN was dropped in beta.2).",    "Roadmap"],
    ["Filesystem",       "Only the bind-mounted workspace is visible. Rest of host is unreachable.",              "Workspace-scoped"],
    ["Workspace path",   "Validated against denylist + allow-root. Symlinks resolved. docker.sock blocked.",      "Pre-mount checked"],
    ["Credentials",      "API key passed as env var at start. Never written to disk, never shared.",              "Per-agent secret"],
  ];

  return (
    <React.Fragment>
      <section className="arch-hero" data-screen-label="Arch / Hero">
        <div className="container">
          <div className="section-label">— architecture</div>
          <h1>Sandboxing is mandatory. Everything downstream follows.</h1>
          <p>
            dclaw splits into a Go control plane (the daemon) and a Node + pi-mono data plane (agent containers). The diagram below is the interactive version. Hover to explore what crosses which boundary.
          </p>
        </div>
      </section>

      <section data-screen-label="Arch / Diagram">
        <div className="container" style={{ maxWidth: 1100 }}>
          <DiagramFull />
        </div>
      </section>

      <section data-screen-label="Arch / Threat">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— threat model</div>
              <h2 className="section-title">Six ways agents get pwned. Six ways dclaw contains it.</h2>
            </div>
            <p className="section-sub">
              This is the blast-radius argument. Sandboxing changes "one compromise = full system" into "one compromise = one agent." The rest of the architecture exists to keep that true.
            </p>
          </div>
          <div className="threat-grid">
            {threats.map((t, i) => (
              <div className="threat" key={i}>
                <div className="threat-tag">◆ {t.tag}</div>
                <h3 className="threat-title">{t.title}</h3>
                <p className="threat-desc">{t.desc}</p>
                <div className="threat-arrow">{t.arrow}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-screen-label="Arch / Layers">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— what gets sandboxed</div>
              <h2 className="section-title">All of it. Not just bash.</h2>
            </div>
            <p className="section-sub">
              Most "sandboxed agent" frameworks mean "we shelled out to docker for the bash tool." dclaw means the whole agent, including the LLM call and every tool, runs inside the box.
            </p>
          </div>
          <div className="layers">
            {layers.map((l, i) => (
              <div className="layer" key={i}>
                <div className="layer-col"><span className="layer-key">{l[0]}</span></div>
                <div className="layer-col"><span className="layer-val">{l[1]}</span></div>
                <div className="layer-col"><span className="layer-badge">{l[2]}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-screen-label="Arch / Deps">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">— dependencies</div>
              <h2 className="section-title">We didn't rewrite the agent loop.</h2>
            </div>
            <p className="section-sub">
              pi-mono by Mario Zechner is a proven, MIT-licensed TypeScript agent SDK with multi-model support. It ships inside our container. We add the sandbox, the fleet, and the channels.
            </p>
          </div>
          <div className="layers">
            <div className="layer">
              <div className="layer-col"><span className="layer-key">pi-mono</span></div>
              <div className="layer-col"><span className="layer-val">Agent loop, tool execution, session management, multi-model routing. Runs inside every container.</span></div>
              <div className="layer-col"><span className="layer-badge">runtime dep · MIT</span></div>
            </div>
            <div className="layer">
              <div className="layer-col"><span className="layer-key">Docker</span></div>
              <div className="layer-col"><span className="layer-val">The sandbox itself. We rely on cgroups, iptables and bind mounts. 24+ required.</span></div>
              <div className="layer-col"><span className="layer-badge">host dep · apache-2</span></div>
            </div>
            <div className="layer">
              <div className="layer-col"><span className="layer-key">OpenClaw</span></div>
              <div className="layer-col"><span className="layer-val">Reference only. Not imported, not linked. We read their gateway and adapter patterns and built something different.</span></div>
              <div className="layer-col"><span className="layer-badge">reference</span></div>
            </div>
          </div>
        </div>
      </section>

      <section data-screen-label="Arch / Close" className="arch-close">
        <div className="container">
          <div className="section-label">— next</div>
          <h2 className="section-title">Ready to ship agents you can't feel bad about on Monday?</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <a href="#/" className="btn-primary">← back to overview</a>
            <a href="#" className="btn-ghost">read the quickstart →</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.ArchPage = ArchPage;
