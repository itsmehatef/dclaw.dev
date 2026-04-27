// DiagramFull.jsx — faithful canonical architecture diagram for /architecture
// Click regions to expand internals (daemon sub-blocks, main agent internals).

const { useState: useStateDF } = React;

const DF_REGIONS = {
  user: {
    title: "User entry",
    desc: "The conversation begins from a chat platform. Each platform is a separate plugin container — no shared codepath, no version coupling. Add Telegram tomorrow without redeploying anything else.",
  },
  ext: {
    title: "LLM provider (external)",
    desc: "The data plane talks directly to whatever LLM you configure — Anthropic, OpenAI, Google, OpenRouter, or any endpoint pi-mono supports. The daemon never makes LLM calls; it only orchestrates. This keeps the control plane provider-agnostic and means a provider outage doesn't take the daemon down.",
  },
  ops: {
    title: "Operational surface",
    desc: "What you actually touch. fleet.yaml is the declarative source of truth. The CLI (Go) handles up/status/logs/upgrade. The web dashboard (TypeScript) is the visual surface — same RPC, different skin.",
  },
  plugin: {
    title: "Channel plugins",
    desc: "Independently versioned containers. discord v1.5.0, slack v2.0.3, whatsapp v0.8.2 today. Adding a channel = writing a new plugin against the channel-router contract. Removing a channel = pulling its container.",
  },
  daemon: {
    title: "dclaw daemon",
    desc: "Go process on the host. The control plane. Routes inbound messages to agents, manages the fleet (spawn/health/teardown), enforces quotas (max concurrent, max $/day), and persists agent registry to SQLite.",
  },
  router: { title: "Channel router", desc: "Inbound message → agent dispatch. Maps a channel event (\"new Slack DM in #ops\") to the correct main agent or spawns a worker." },
  fleet: { title: "Fleet manager", desc: "Container lifecycle. Spawns agents per fleet.yaml. Health-checks, restarts on crash, tears down ephemeral workers when their task completes." },
  quota: { title: "Quota enforcement", desc: "max-concurrent and max-$ caps before spawn. A worker that would push you over budget is rejected at the daemon — it never starts." },
  registry: { title: "Agent registry", desc: "SQLite. Stores agent state, conversation pointers, fleet config snapshot. Survives daemon restart." },
  main: {
    title: "Main agent container",
    desc: "Always-on, ~400MB. The persistent agent that holds conversation state. Runs the dclaw agent binary which calls the configured LLM provider and manages context. Tools execute as sandboxed sub-containers.",
  },
  mainBin:    { title: "Agent binary", desc: "Go + pi-mono runtime. Multi-provider LLM client (Anthropic, OpenAI, Google, OpenRouter, …) + conversation manager. Runs inside the main container as uid 1000." },
  workspace:  { title: "Workspace (bind mount)", desc: "The only path that crosses the container/host boundary. Validated against denylist + symlink-resolved before mount." },
  network:    { title: "Scoped network", desc: "Allowlist-only egress. The agent can talk to your configured LLM provider + whatever else you whitelist. Nothing else." },
  tools:      { title: "Built-in tools", desc: "bash · file · grep · web. Each runs as a sandboxed sub-container with its own caps and rootfs. Even an exploited tool can't reach the agent process." },
  workers: {
    title: "Worker containers",
    desc: "Ephemeral, ~400MB each. Spawned per-task by the fleet manager when the main agent delegates. Identical sandbox to the main agent but with scoped tools, scoped network, and a scoped workspace. Destroyed when the task completes.",
  },
};

function DiagramFull() {
  const [active, setActive] = useStateDF('daemon');
  const r = DF_REGIONS[active] || DF_REGIONS.daemon;

  const onEnter = (id) => () => setActive(id);
  const cls = (id) => `df-block${active === id ? ' on' : ''}`;
  const clsBand = (id) => `df-band${active === id ? ' on' : ''}`;

  return (
    <div className="df">
      <div className="df-titlebar">
        <span>./architecture · dclaw — Platform Architecture v2</span>
        <span className="df-titlebar-hint">faithful · click regions to inspect</span>
      </div>

      <div className="df-stage">
        {/* TOP STRIP: user · anthropic · ops surface */}
        <div className="df-row df-row-top">
          <div className={`${cls('user')} df-user`} onMouseEnter={onEnter('user')}>
            <div className="df-tag">USER</div>
            <div className="df-name">Discord · Slack · WhatsApp</div>
          </div>

          <div className={`${cls('ext')} df-ext`} onMouseEnter={onEnter('ext')}>
            <div className="df-tag">LLM PROVIDER · EXTERNAL</div>
            <div className="df-name mono">Anthropic · OpenAI · Google · …</div>
            <div className="df-sub">configurable per agent · dashed = TLS egress only</div>
          </div>

          <div className={`${cls('ops')} df-ops`} onMouseEnter={onEnter('ops')}>
            <div className="df-tag">OPERATIONAL SURFACE</div>
            <div className="df-ops-grid">
              <div className="df-mini">
                <div className="df-mini-name">fleet.yaml</div>
                <div className="df-mini-sub">declarative config</div>
              </div>
              <div className="df-mini">
                <div className="df-mini-name">dclaw CLI · Go</div>
                <div className="df-mini-sub">up · status · logs · upgrade</div>
              </div>
              <div className="df-mini">
                <div className="df-mini-name">Web Dashboard</div>
                <div className="df-mini-sub">TypeScript</div>
              </div>
            </div>
          </div>
        </div>

        {/* CHANNEL PLUGINS GROUP */}
        <div className={`${clsBand('plugin')} df-plugin`} onMouseEnter={onEnter('plugin')}>
          <div className="df-band-tag">CHANNEL PLUGINS · independently versioned containers</div>
          <div className="df-pills">
            <span className="df-pill">discord v1.5.0</span>
            <span className="df-pill">slack v2.0.3</span>
            <span className="df-pill">whatsapp v0.8.2</span>
          </div>
        </div>

        {/* DAEMON — band with sub-blocks visible */}
        <div className={`${clsBand('daemon')} df-daemon`} onMouseEnter={onEnter('daemon')}>
          <div className="df-band-tag df-band-tag-strong">dclaw DAEMON · Go · CONTROL PLANE · runs on host</div>
          <div className="df-daemon-grid">
            <div className={cls('router')} onMouseEnter={onEnter('router')}>
              <div className="df-mini-name">Channel Router</div>
              <div className="df-mini-sub">message routing</div>
            </div>
            <div className={cls('fleet')} onMouseEnter={onEnter('fleet')}>
              <div className="df-mini-name">Fleet Manager</div>
              <div className="df-mini-sub">spawn · health · teardown</div>
            </div>
            <div className={cls('quota')} onMouseEnter={onEnter('quota')}>
              <div className="df-mini-name">Quota Enforce</div>
              <div className="df-mini-sub">max-concurrent · max-$</div>
            </div>
            <div className={`${cls('registry')} df-registry`} onMouseEnter={onEnter('registry')}>
              <div className="df-mini-name">Agent Registry</div>
              <div className="df-mini-sub">SQLite</div>
            </div>
          </div>
        </div>

        {/* DATA PLANE: main + workers */}
        <div className="df-row df-row-data">
          <div className={`${clsBand('main')} df-main`} onMouseEnter={onEnter('main')}>
            <div className="df-band-tag">MAIN AGENT CONTAINER · ~400MB · always-on · DATA PLANE</div>
            <div className="df-main-grid">
              <div className={cls('mainBin')} onMouseEnter={onEnter('mainBin')}>
                <div className="df-mini-name">dclaw agent · Go</div>
                <div className="df-mini-sub">Anthropic calls · conversation</div>
              </div>
              <div className={cls('workspace')} onMouseEnter={onEnter('workspace')}>
                <div className="df-mini-name">workspace</div>
                <div className="df-mini-sub">bind mount</div>
              </div>
              <div className={cls('network')} onMouseEnter={onEnter('network')}>
                <div className="df-mini-name">scoped network</div>
                <div className="df-mini-sub">allowlist only</div>
              </div>
              <div className={`${cls('tools')} df-tools`} onMouseEnter={onEnter('tools')}>
                <div className="df-mini-name">Built-in tools · sandboxed sub-containers</div>
                <div className="df-mini-sub mono">bash · file · grep · web</div>
              </div>
            </div>
          </div>

          <div className={`${clsBand('workers')} df-workers`} onMouseEnter={onEnter('workers')}>
            <div className="df-band-tag">WORKER CONTAINERS · ~400MB ea · ephemeral · DATA PLANE</div>
            <div className="df-workers-grid">
              <div className="df-worker">
                <div className="df-mini-name">Worker 1</div>
                <div className="df-mini-sub">scoped tools</div>
                <div className="df-mini-sub">scoped network</div>
                <div className="df-mini-sub">scoped workspace</div>
              </div>
              <div className="df-worker">
                <div className="df-mini-name">Worker 2</div>
                <div className="df-mini-sub">scoped tools</div>
                <div className="df-mini-sub">scoped network</div>
                <div className="df-mini-sub">scoped workspace</div>
              </div>
              <div className="df-worker">
                <div className="df-mini-name">Worker N</div>
                <div className="df-mini-sub">scoped tools</div>
                <div className="df-mini-sub">scoped network</div>
                <div className="df-mini-sub">scoped workspace</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="df-detail">
        <div className="df-detail-title mono">{r.title}</div>
        <div className="df-detail-desc">{r.desc}</div>
      </div>

      <div className="df-legend">
        <span><span className="df-swatch df-sw-user" />user</span>
        <span><span className="df-swatch df-sw-plugin" />plugin</span>
        <span><span className="df-swatch df-sw-ops" />ops surface</span>
        <span><span className="df-swatch df-sw-daemon" />control plane</span>
        <span><span className="df-swatch df-sw-main" />main agent · data plane</span>
        <span><span className="df-swatch df-sw-worker" />workers · data plane</span>
        <span><span className="df-swatch df-sw-ext" />external</span>
      </div>
    </div>
  );
}

window.DiagramFull = DiagramFull;
