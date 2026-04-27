// Tweaks.jsx
const { useState: useStateTweaks, useEffect: useEffectTweaks } = React;

const ACCENTS = {
  amber:   { value: "oklch(0.74 0.14 65)",  strong: "oklch(0.62 0.16 55)",  faint: "oklch(0.96 0.04 75)",  swatch: "#d89a4e" },
  cyan:    { value: "oklch(0.72 0.12 210)", strong: "oklch(0.58 0.14 215)", faint: "oklch(0.96 0.03 210)", swatch: "#4ea9d8" },
  docker:  { value: "oklch(0.74 0.14 230)", strong: "oklch(0.58 0.17 240)", faint: "oklch(0.96 0.04 230)", swatch: "#0db7ed" },
  lime:    { value: "oklch(0.78 0.14 130)", strong: "oklch(0.64 0.15 135)", faint: "oklch(0.96 0.04 130)", swatch: "#9bd84e" },
  magenta: { value: "oklch(0.68 0.18 350)", strong: "oklch(0.56 0.20 350)", faint: "oklch(0.96 0.05 350)", swatch: "#d84e9b" },
  mono:    { value: "#18181b",              strong: "#09090b",              faint: "#f4f4f5",              swatch: "#18181b" },
};

const HERO_VARIANTS = ["diagram", "terminal", "type"];
const DENSITIES     = [{ k: "tight", v: 0.8 }, { k: "default", v: 1 }, { k: "roomy", v: 1.25 }];
const THEMES        = ["light", "dark"];

function Tweaks({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const setK = (k, v) => setTweaks({ ...tweaks, [k]: v });

  return (
    <div className="tweaks">
      <div className="tweaks-head">
        <span>⚙ Tweaks</span>
        <span style={{ color: 'var(--fg-faint)' }}>dclaw-web · v1</span>
      </div>
      <div className="tweaks-body">
        <div className="tweak-row">
          <label>Accent</label>
          <div className="tweak-options">
            {Object.entries(ACCENTS).map(([k, v]) => (
              <button key={k} className={`tweak-opt ${tweaks.accent === k ? 'active' : ''}`} onClick={() => setK('accent', k)}>
                <span className="swatch" style={{ background: v.swatch }} /> {k}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak-row">
          <label>Theme</label>
          <div className="tweak-options">
            {THEMES.map(t => (
              <button key={t} className={`tweak-opt ${tweaks.theme === t ? 'active' : ''}`} onClick={() => setK('theme', t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="tweak-row">
          <label>Density</label>
          <div className="tweak-options">
            {DENSITIES.map(d => (
              <button key={d.k} className={`tweak-opt ${tweaks.density === d.k ? 'active' : ''}`} onClick={() => setK('density', d.k)}>{d.k}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function applyTweaks(t) {
  const root = document.documentElement;
  const a = ACCENTS[t.accent] || ACCENTS.amber;
  root.style.setProperty('--accent', a.value);
  root.style.setProperty('--accent-strong', a.strong);
  root.style.setProperty('--accent-faint', a.faint);
  const d = DENSITIES.find(x => x.k === t.density) || DENSITIES[1];
  root.style.setProperty('--density', d.v);
  root.setAttribute('data-theme', t.theme);
}

window.Tweaks = Tweaks;
window.applyTweaks = applyTweaks;
