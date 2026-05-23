// Generates public/og.png — the 1200x630 social/share preview card.
// Run with: npm run og
//
// Self-contained: pulls IBM Plex Mono (cached under scripts/.fonts) and renders
// a dark "terminal" card via satori -> resvg. Re-run after a branding/version
// change to refresh the card.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FONT_CACHE = join(__dirname, '.fonts');

// --- Editable content -------------------------------------------------------
const VERSION = 'v0.3.0-beta.2';
const WORDMARK = 'dclaw';
const HEADLINE = ['Container-native', 'multi-agent platform.'];
const HEADLINE_ACCENT = 'Hardened by default.';
const SUBTEXT =
  'Every agent runs inside its own Docker container — brain, tools, filesystem, network.';
const COMMAND = 'brew install itsmehatef/tap/dclaw';
const URL_LABEL = 'dclaw.dev';

// --- Brand tokens (mirrors src/styles/global.css dark theme) ----------------
const BG = '#0c0c0d';
const FG = '#fafafa';
const MUTED = '#9ca3af';
const FAINT = '#6b7280';
const ACCENT = '#3b82f6';
const CODE = '#d4d4d4';

const FONT_BASE =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono';
const FONTS = [
  { weight: 400, file: 'IBMPlexMono-Regular.ttf' },
  { weight: 600, file: 'IBMPlexMono-SemiBold.ttf' },
  { weight: 700, file: 'IBMPlexMono-Bold.ttf' },
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadFont({ weight, file }) {
  await mkdir(FONT_CACHE, { recursive: true });
  const cached = join(FONT_CACHE, file);
  if (await exists(cached)) {
    return { name: 'IBM Plex Mono', data: await readFile(cached), weight, style: 'normal' };
  }
  const url = `${FONT_BASE}/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(cached, buf);
  return { name: 'IBM Plex Mono', data: buf, weight, style: 'normal' };
}

// Tiny hyperscript helper for satori's element tree.
const h = (type, style, children) => ({
  type,
  props: { style, ...(children !== undefined ? { children } : {}) },
});

async function main() {
  const fonts = await Promise.all(FONTS.map(loadFont));

  const logoB64 = (await readFile(join(ROOT, 'public/logo-96.png'))).toString('base64');
  const logo = `data:image/png;base64,${logoB64}`;

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '74px 80px',
      backgroundColor: BG,
      color: FG,
      fontFamily: 'IBM Plex Mono',
      position: 'relative',
      backgroundImage: `radial-gradient(circle at 86% 12%, rgba(59,130,246,0.18), transparent 55%)`,
    },
    [
      // top accent hairline
      h('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundImage: `linear-gradient(90deg, ${ACCENT}, rgba(59,130,246,0))`,
      }),

      // header: logo + wordmark .... version pill
      h(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        [
          h('div', { display: 'flex', alignItems: 'center', gap: 30 }, [
            h(
              'div',
              {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 104,
                height: 104,
                borderRadius: 24,
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 34px rgba(0,0,0,0.45)',
              },
              [{ type: 'img', props: { src: logo, width: 74, height: 74 } }]
            ),
            h(
              'div',
              { fontSize: 78, fontWeight: 700, letterSpacing: -2, lineHeight: 1 },
              WORDMARK
            ),
          ]),
          h(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: 999,
              padding: '12px 22px',
              fontSize: 24,
              fontWeight: 500,
              color: MUTED,
              backgroundColor: 'rgba(255,255,255,0.03)',
            },
            VERSION
          ),
        ]
      ),

      // headline + subtext
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h('div', { fontSize: 62, fontWeight: 600, letterSpacing: -1, lineHeight: 1.12 }, HEADLINE[0]),
        h('div', { fontSize: 62, fontWeight: 600, letterSpacing: -1, lineHeight: 1.12 }, HEADLINE[1]),
        h('div', { fontSize: 62, fontWeight: 600, letterSpacing: -1, lineHeight: 1.12, color: ACCENT }, HEADLINE_ACCENT),
        h('div', { marginTop: 22, fontSize: 25, fontWeight: 400, color: MUTED, maxWidth: 900, lineHeight: 1.45 }, SUBTEXT),
      ]),

      // footer: terminal command .... url
      h(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        [
          h(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              padding: '20px 26px',
              backgroundColor: '#141414',
            },
            [
              h('div', { fontSize: 26, fontWeight: 700, color: ACCENT }, '$'),
              h('div', { fontSize: 26, fontWeight: 400, color: CODE }, COMMAND),
            ]
          ),
          h('div', { fontSize: 26, fontWeight: 600, color: FAINT }, URL_LABEL),
        ]
      ),
    ]
  );

  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    .render()
    .asPng();
  const out = join(ROOT, 'public/og.png');
  await writeFile(out, png);
  console.log(`Wrote ${out} (${(png.length / 1024).toFixed(1)} KB, 1200x630)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
