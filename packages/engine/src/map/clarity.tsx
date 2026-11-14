import React, {useMemo} from 'react';
import {Img} from 'remotion';
import {geoGraticule10, geoOrthographic, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {GeometryCollection, Topology} from 'topojson-specification';
import land110 from 'world-atlas/land-110m.json';
import {clamp01, easeInOutCubic, ramp} from '../motion';
import {INTER} from '../overlay';
import type {TimedLine} from '../overlay';
import {CINZEL, LonLat} from './map';
import {captionCues, numeralize, type Cue} from './clarity-logic';
import {artSrc} from './media';

// Clarity Kit (docs/CLARITY_STANDARD.md + docs/VIEWER_CLARITY_FEEDBACK.md): captions, legend, orientation tools and
// explainer cards for zero-background viewers on a phone. Opt-in through HistoryEpisode's `clarity` prop.
// Layout (1920×1080): top-left chapter tracker + source; top-centre phase / glossary; right column legend, locator
// globe, km scale; bottom-centre captions (bottom edge y = 920) above the timeline bar.

export type Faction = {name: string; color: string; pattern?: 'hatch' | 'dots'};
export type ClarityConfig = {
  factions: Faction[];
  highlight?: Record<string, string>;
  now?: number;
  /** chapter-start scene id → chapter title (drives the chapter tracker) */
  chapters?: Record<string, string>;
};

const INK = 'rgba(10,14,18,0.72)';
const PAPER = '#f4ecd8';
const GOLD = '#d8b46a';
export const MIN_TEXT = 34;

const key = (w: string) => w.replace(/[^A-Za-z']/g, '').replace(/'s$/, '');

/** Phrase captions: ≤ 2 lines × 42 chars, 54 px bold on a dark box, numerals, side colours, current word underlined. */
export const MapCaptions: React.FC<{lines: TimedLine[]; t: number; highlight?: Record<string, string>; raise?: number}> = ({lines, t, highlight = {}, raise = 0}) => {
  const cues = useMemo<Cue[]>(() => lines.flatMap((l) => captionCues(numeralize(l.words))), [lines]);
  let cue: Cue | undefined;
  for (const c of cues) if (t >= c.t - 0.05 && t <= c.end + 0.3) cue = c;
  if (!cue) return null;
  const a = clamp01((t - cue.t + 0.05) / 0.12) * clamp01((cue.end + 0.3 - t) / 0.12);
  let k = 0;
  const rows = cue.lines.map((line) => {
    const n = line.split(' ').length;
    const ws = cue!.words.slice(k, k + n);
    k += n;
    return ws;
  });
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 160 + raise, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{maxWidth: 1560, background: INK, borderRadius: 16, padding: '12px 34px', textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 54, lineHeight: 1.22, color: '#fff'}}>
        {rows.map((ws, r) => (
          <div key={r}>
            {ws.map((w, i) => {
              const now = t >= w.t && t < w.end + 0.08;
              return (
                <span key={i} style={{color: highlight[key(w.w)] ?? '#fff', borderBottom: now ? `5px solid ${GOLD}` : '5px solid transparent'}}>
                  {w.w}
                  {i < ws.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PatternDefs: React.FC<{factions: Faction[]; uid: string}> = ({factions, uid}) => (
  <defs>
    {factions.map((f) =>
      f.pattern ? (
        <pattern key={f.name} id={`${uid}-pat-${f.name}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          {f.pattern === 'hatch' ? <line x1={0} y1={0} x2={0} y2={14} stroke="rgba(255,240,220,0.55)" strokeWidth={4} /> : <circle cx={7} cy={7} r={2.6} fill="rgba(255,240,220,0.6)" />}
        </pattern>
      ) : null,
    )}
  </defs>
);

export type LegendSymbol = 'route' | 'sea' | 'city' | 'modern' | 'river' | 'army';
const SYMBOL_TEXT: Record<LegendSymbol, string> = {
  route: 'Movement',
  sea: 'Sea journey',
  city: 'City',
  modern: "Today's borders",
  river: 'River',
  army: 'Army',
};

/** Colour + pattern key (second cue for colour-blind viewers) and the symbols used in this scene. */
export const Legend: React.FC<{factions: Faction[]; p: number; symbols?: LegendSymbol[]}> = ({factions, p, symbols = []}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.04));
  const sw = (f: Faction) => (
    <svg width={30} height={30}>
      <PatternDefs factions={[f]} uid="lg" />
      <rect x={1} y={1} width={28} height={28} rx={4} fill={f.color} stroke={PAPER} strokeWidth={2} />
      {f.pattern ? <rect x={1} y={1} width={28} height={28} rx={4} fill={`url(#lg-pat-${f.name})`} /> : null}
    </svg>
  );
  const sym = (s: LegendSymbol) => (
    <svg width={30} height={30}>
      {s === 'route' ? <path d="M3 22 Q15 4 27 12" fill="none" stroke="#f0c36a" strokeWidth={5} strokeLinecap="round" /> : null}
      {s === 'sea' ? <path d="M3 22 Q15 4 27 12" fill="none" stroke="#f0c36a" strokeWidth={5} strokeDasharray="6 5" /> : null}
      {s === 'city' ? <circle cx={15} cy={15} r={8} fill={PAPER} stroke="#1b1208" strokeWidth={3} /> : null}
      {s === 'modern' ? <line x1={2} y1={15} x2={28} y2={15} stroke={PAPER} strokeWidth={2} strokeDasharray="5 4" /> : null}
      {s === 'river' ? <path d="M2 20 C10 8 18 24 28 10" fill="none" stroke="#5f8fb0" strokeWidth={4} /> : null}
      {s === 'army' ? <circle cx={15} cy={15} r={11} fill={GOLD} stroke={PAPER} strokeWidth={2} /> : null}
    </svg>
  );
  return (
    <div style={{position: 'absolute', right: 40, top: 32, opacity: a, background: INK, borderRadius: 12, padding: '12px 20px', fontFamily: INTER}}>
      {factions.map((f) => (
        <div key={f.name} style={{display: 'flex', alignItems: 'center', gap: 14, margin: '3px 0'}}>
          {sw(f)}
          <div style={{fontWeight: 700, fontSize: MIN_TEXT, color: PAPER}}>{f.name}</div>
        </div>
      ))}
      {symbols.map((s) => (
        <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14, margin: '3px 0'}}>
          {sym(s)}
          <div style={{fontWeight: 600, fontSize: MIN_TEXT, color: '#e9dcc0'}}>{SYMBOL_TEXT[s]}</div>
        </div>
      ))}
    </div>
  );
};

/** "CH 3 · THE NEIGHBOUR" — where are we in the story. */
export const ChapterTracker: React.FC<{n: number; title: string}> = ({n, title}) => (
  <div style={{position: 'absolute', left: 40, top: 32, background: INK, borderRadius: 10, padding: '6px 18px', fontFamily: INTER, fontWeight: 800, fontSize: MIN_TEXT, color: PAPER, letterSpacing: 1}}>
    <span style={{color: GOLD}}>CH {n}</span> · {title.toUpperCase()}
  </div>
);

/** Source line (top-left, under the chapter tracker). */
export const SourceChip: React.FC<{text: string; p: number; at?: [number, number]}> = ({text, p, at = [0.05, 0.95]}) => {
  const a = easeInOutCubic(ramp(p, at[0], at[0] + 0.06)) * (1 - easeInOutCubic(ramp(p, at[1] - 0.05, at[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 40, top: 100, maxWidth: 400, opacity: a, background: INK, borderLeft: `5px solid ${GOLD}`, padding: '6px 16px', fontFamily: INTER, fontWeight: 600, fontSize: MIN_TEXT - 4, lineHeight: 1.25, color: PAPER}}>
      Source: {text}
    </div>
  );
};

const LAND = (() => {
  const topo = land110 as unknown as Topology<{land: GeometryCollection}>;
  return feature(topo, topo.objects.land);
})();

/** Small globe showing where the map is on Earth (right column). */
export const LocatorGlobe: React.FC<{center: LonLat; zoom: number; top: number}> = ({center, zoom, top}) => {
  const size = 170;
  const proj = geoOrthographic().rotate([-center[0], -Math.max(-60, Math.min(60, center[1]))]).scale(size / 2 - 4).translate([size / 2, size / 2]).clipAngle(90);
  const path = geoPath(proj);
  const c = proj(center) ?? [size / 2, size / 2];
  // footprint of the main map: half-width in degrees ≈ 180 / zoom (Mercator scale = width / 2π · zoom)
  const r = Math.max(5, Math.min(size / 2, (proj.scale() * Math.PI) / zoom));
  return (
    <div style={{position: 'absolute', right: 40, top, width: size, height: size}}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 3} fill="#1b2f3a" stroke={PAPER} strokeWidth={3} />
        <path d={path(geoGraticule10()) ?? ''} fill="none" stroke="rgba(244,236,216,0.15)" strokeWidth={1} />
        <path d={path(LAND) ?? ''} fill="#d8c9a3" />
        <rect x={c[0] - r} y={c[1] - r * 0.56} width={r * 2} height={r * 1.12} fill="none" stroke="#ef6a5e" strokeWidth={4} />
      </svg>
    </div>
  );
};

/** km scale bar (right column). */
export const ScaleBar: React.FC<{km: number; px: number; top: number}> = ({km, px, top}) => (
  <div style={{position: 'absolute', right: 40, top, background: INK, borderRadius: 10, padding: '8px 16px', fontFamily: INTER, fontWeight: 700, fontSize: MIN_TEXT, color: PAPER, display: 'flex', alignItems: 'center', gap: 12}}>
    <div style={{width: px, height: 12, border: `3px solid ${PAPER}`, borderTop: 'none'}} />
    {km.toLocaleString('en-US')} km
  </div>
);

/** "Who's who" card, first time a person appears (left side). Portrait from PD art when available. */
export const CharacterCard: React.FC<{name: string; role: string; line: string; color: string; p: number; image?: string; window?: [number, number]}> = ({name, role, line, color, p, image, window = [0.02, 0.98]}) => {
  const a = easeInOutCubic(ramp(p, window[0], window[0] + 0.06)) * (1 - easeInOutCubic(ramp(p, window[1] - 0.05, window[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 40, top: 270, width: 640, opacity: a, transform: `translateX(${(1 - a) * -40}px)`, background: 'rgba(18,13,8,0.9)', borderLeft: `10px solid ${color}`, borderRadius: 14, padding: '26px 30px', fontFamily: INTER}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: 128, height: 128, borderRadius: 64, background: color, border: `5px solid ${PAPER}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CINZEL, fontWeight: 700, fontSize: 64, color: PAPER, flexShrink: 0}}>
          {image ? <Img src={artSrc(image)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : name[0]}
        </div>
        <div>
          <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: PAPER}}>{name}</div>
          <div style={{fontWeight: 800, fontSize: MIN_TEXT - 4, letterSpacing: 2, color, marginTop: 8, filter: 'brightness(1.35)'}}>{role.toUpperCase()}</div>
        </div>
      </div>
      <div style={{fontWeight: 600, fontSize: MIN_TEXT, lineHeight: 1.3, color: '#e9dcc0', marginTop: 18}}>{line}</div>
    </div>
  );
};

/** Word pop-up: a hard term and its plain meaning (≤ 8 words), top-centre. */
export const GlossaryPop: React.FC<{term: string; meaning: string; p: number; window?: [number, number]}> = ({term, meaning, p, window = [0.1, 0.8]}) => {
  const a = easeInOutCubic(ramp(p, window[0], window[0] + 0.05)) * (1 - easeInOutCubic(ramp(p, window[1] - 0.05, window[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * -16}px)`}}>
      <div style={{background: 'rgba(18,13,8,0.92)', border: `3px solid ${GOLD}`, borderRadius: 44, padding: '12px 32px', fontFamily: INTER, fontSize: 40, color: PAPER, whiteSpace: 'nowrap'}}>
        <span style={{fontWeight: 900, color: GOLD, letterSpacing: 1}}>{term.toUpperCase()}</span>
        <span style={{fontWeight: 600}}> = {meaning}</span>
      </div>
    </div>
  );
};

/** Battle / siege phase title, top-centre: "Phase 1 — The trap is set" + what to watch. */
export const PhaseBanner: React.FC<{title: string; sub?: string; a: number}> = ({title, sub, a}) =>
  a <= 0 ? null : (
    <div style={{position: 'absolute', left: 0, right: 0, top: 32, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{background: 'rgba(18,13,8,0.9)', borderBottom: `4px solid ${GOLD}`, borderRadius: 10, padding: '10px 30px', textAlign: 'center', fontFamily: INTER, maxWidth: 980}}>
        <div style={{fontWeight: 900, fontSize: 44, color: PAPER}}>{title}</div>
        {sub ? <div style={{fontWeight: 600, fontSize: MIN_TEXT, color: '#e9dcc0'}}>{sub}</div> : null}
      </div>
    </div>
  );

/** Chapter-end recap: "SO FAR" + one sentence, then the open loop into the next chapter. */
export const RecapCard: React.FC<{text: string; next?: string; p: number}> = ({text, next, p}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.12)) * (1 - easeInOutCubic(ramp(p, 0.92, 1)));
  const b = next ? easeInOutCubic(ramp(p, 0.45, 0.6)) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.8 * a})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a, paddingBottom: 160}}>
      <div style={{fontFamily: INTER, fontWeight: 800, fontSize: MIN_TEXT, letterSpacing: 10, color: GOLD}}>SO FAR</div>
      <div style={{width: 120 * a, height: 3, background: GOLD, margin: '20px 0'}} />
      <div style={{maxWidth: 1400, textAlign: 'center', fontFamily: CINZEL, fontWeight: 700, fontSize: 62, lineHeight: 1.25, color: PAPER}}>{text}</div>
      {next ? <div style={{marginTop: 30, opacity: b, fontFamily: INTER, fontWeight: 700, fontStyle: 'italic', fontSize: 40, color: GOLD}}>{next}</div> : null}
    </div>
  );
};

/** Last ~20 s: clean area for YouTube end-screen elements + next-video teaser. */
export const EndScreen: React.FC<{teaser: string; p: number}> = ({teaser, p}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.08));
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.7 * a})`, opacity: a, fontFamily: INTER}}>
      <div style={{position: 'absolute', left: 110, top: 200, width: 700}}>
        <div style={{fontWeight: 800, fontSize: MIN_TEXT, letterSpacing: 6, color: GOLD}}>WATCH NEXT</div>
        <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 64, lineHeight: 1.2, color: PAPER, marginTop: 16}}>{teaser}</div>
      </div>
      {/* keep-clear zones for YouTube's end-screen video + subscribe elements (outlined, not filled) */}
      <div style={{position: 'absolute', right: 110, top: 170, width: 760, height: 428, border: '3px dashed rgba(244,236,216,0.35)', borderRadius: 12}} />
      <div style={{position: 'absolute', right: 420, top: 640, width: 150, height: 150, border: '3px dashed rgba(244,236,216,0.35)', borderRadius: 75}} />
    </div>
  );
};

/** Fail fast on cards a phone viewer can't read. */
export const assertCardLimits = (sceneId: string, overlays: {type: string; meaning?: string; text?: string}[] = []) => {
  for (const o of overlays) {
    if (o.type === 'glossary' && (o.meaning ?? '').split(/\s+/).length > 8) throw new Error(`scene ${sceneId}: glossary meaning > 8 words`);
    if (o.type === 'recap' && (o.text ?? '').length > 120) throw new Error(`scene ${sceneId}: recap text > 120 chars`);
  }
};
