// Diagram.jsx — simplified homepage architecture diagram
// 3 horizontal bands: ops surface · daemon · data plane (main + workers)
// Hover regions to highlight + show one-line description.

const { useState: useStateDiag } = React;

const REGIONS = {
  user:    { label: "user",         desc: "Discord, Slack, WhatsApp messages enter here. Each channel is a versioned plugin container." },
  plugin:  { label: "channel plugins", desc: "Independently versioned containers — discord v1.5, slack v2.0, whatsapp v0.8. Roll one without touching others." },
  ops:     { label: "operational surface", desc: "fleet.yaml declarative config · dclaw CLI (Go) · web dashboard (TypeScript). What you actually touch." },
  daemon:  { label: "dclaw daemon", desc: "Go control plane on host. Channel router · fleet manager · quota enforcement · agent registry (SQLite)." },
  main:    { label: "main agent",   desc: "Always-on container · ~400MB · DATA PLANE. Calls the configured LLM, holds conversation, runs sandboxed bash/file/grep/web tools." },
  workers: { label: "worker agents", desc: "Ephemeral · ~400MB each · DATA PLANE. Spawned per task with scoped tools, network, workspace. Destroyed when done." },
  ext:     { label: "llm provider", desc: "External — Anthropic, OpenAI, Google, OpenRouter, or any pi-mono-supported endpoint. Only the data plane talks to this; daemon never makes LLM calls." },
};

function Diagram() {
  const [active, setActive] = useStateDiag('daemon');
  const r = REGIONS[active] || REGIONS.daemon;

  const isActive = (id) => active === id;

  return (
    <div className="diagram">
      <div className="diagram-header">
        <span>./architecture · v2 · hover to explore</span>
        <div className="dots"><span className="dot" /><span className="dot" /><span className="dot" /></div>
      </div>

      <div className="diagram-stage">
        {/* Top row: user (yellow) + Anthropic (gray, dashed) */}
        <div className="dg-row dg-row-top">
          <div className={`dg-block dg-user ${isActive('user') ? 'on' : ''}`}
               onMouseEnter={() => setActive('user')}>
            <div className="dg-block-label">USER</div>
            <div className="dg-block-name">Discord · Slack · WhatsApp</div>
          </div>
          <div className={`dg-block dg-ext ${isActive('ext') ? 'on' : ''}`}
               onMouseEnter={() => setActive('ext')}>
            <div className="dg-block-label">LLM PROVIDER · EXTERNAL</div>
            <div className="dg-block-name">Anthropic · OpenAI · Google · …</div>
          </div>
          <div className={`dg-block dg-ops ${isActive('ops') ? 'on' : ''}`}
               onMouseEnter={() => setActive('ops')}>
            <div className="dg-block-label">OPERATIONAL SURFACE</div>
            <div className="dg-block-name">CLI · fleet.yaml · web</div>
          </div>
        </div>

        {/* Channel plugins band */}
        <div className={`dg-band dg-plugin ${isActive('plugin') ? 'on' : ''}`}
             onMouseEnter={() => setActive('plugin')}>
          <div className="dg-band-tag">CHANNEL PLUGINS · independently versioned containers</div>
          <div className="dg-pills">
            <span className="dg-pill">discord v1.5.0</span>
            <span className="dg-pill">slack v2.0.3</span>
            <span className="dg-pill">whatsapp v0.8.2</span>
          </div>
        </div>

        {/* Daemon band */}
        <div className={`dg-band dg-daemon ${isActive('daemon') ? 'on' : ''}`}
             onMouseEnter={() => setActive('daemon')}>
          <div className="dg-band-tag">dclaw DAEMON · Go · CONTROL PLANE · runs on host</div>
          <div className="dg-pills">
            <span className="dg-pill">channel router</span>
            <span className="dg-pill">fleet manager</span>
            <span className="dg-pill">quota enforce</span>
            <span className="dg-pill">agent registry · SQLite</span>
          </div>
        </div>

        {/* Data plane: main + workers */}
        <div className="dg-row dg-row-data">
          <div className={`dg-block dg-main ${isActive('main') ? 'on' : ''}`}
               onMouseEnter={() => setActive('main')}>
            <div className="dg-block-label">MAIN AGENT · ~400MB · DATA PLANE</div>
            <div className="dg-block-name">always-on</div>
            <div className="dg-block-sub mono">bash · file · grep · web</div>
          </div>
          <div className={`dg-block dg-workers ${isActive('workers') ? 'on' : ''}`}
               onMouseEnter={() => setActive('workers')}>
            <div className="dg-block-label">WORKER CONTAINERS · ~400MB ea · ephemeral</div>
            <div className="dg-block-name">w·1   w·2   w·N</div>
            <div className="dg-block-sub mono">scoped tools · scoped net · scoped fs</div>
          </div>
        </div>
      </div>

      <div className="diagram-detail">
        <b className="mono">{r.label}</b>
        <span className="diagram-detail-text"> — {r.desc}</span>
      </div>
    </div>
  );
}

window.Diagram = Diagram;
