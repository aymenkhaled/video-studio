import React from 'react';
import {easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';
import {CINZEL} from './map';
import {Figure, FigureKind} from './figures';
import {PhaseBanner} from './clarity';

// Battle diagram engine: a top-down field (100 × 56.25 units ≈ 16:9) with terrain, unit blocks that move
// between keyframes, attack arrows and labels. Pure function of scene progress p (0..1).

export type BKey = {at: number; x: number; y: number; w?: number; h?: number; rot?: number; opacity?: number};
export type BUnit = {id: string; side: 'a' | 'b'; label?: string; labelUntil?: number; kind?: 'inf' | 'cav' | 'ele' | 'light' | 'ship'; keys: BKey[]; /** e.g. "~25,000" shown under the label (Clarity Kit) */ count?: string};

/** Later keyframes inherit size/rotation/opacity from the previous key unless they set them. */
const fillKeys = (keys: BKey[]): BKey[] => {
  const out: BKey[] = [];
  keys.forEach((k, i) => {
    const prev = out[i - 1];
    out.push({...k, w: k.w ?? prev?.w ?? 6, h: k.h ?? prev?.h ?? 3, rot: k.rot ?? prev?.rot ?? 0, opacity: k.opacity ?? prev?.opacity ?? 1});
  });
  return out;
};
export type BArrow = {from: [number, number]; via?: [number, number]; to: [number, number]; side: 'a' | 'b'; draw: [number, number]; width?: number};
export type Terrain = {river?: [number, number][]; lake?: [number, number][]; hills?: {x: number; y: number; r: number}[]; fog?: [number, number]; lakes?: [number, number][][]; walls?: [number, number][][]};
export type BattleSpec = {
  title: string;
  sides: {a: {name: string; color: string}; b: {name: string; color: string}};
  terrain?: Terrain;
  units: BUnit[];
  arrows?: BArrow[];
  notes?: {text: string; x: number; y: number; appear: number; until?: number}[];
  /** Clarity Kit: phase titles ("Phase 1 — The trap is set") with a one-line "what to watch". */
  phases?: {at: number; title: string; sub?: string}[];
  zoom?: {at: number; cx: number; cy: number; s: number}[];
};

const lerpKey = (keys: BKey[], p: number) => {
  if (p <= keys[0].at) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p <= b.at) {
      const k = easeInOutCubic((p - a.at) / Math.max(1e-6, b.at - a.at));
      return {
        at: p,
        x: mix(a.x, b.x, k),
        y: mix(a.y, b.y, k),
        w: mix(a.w ?? 6, b.w ?? a.w ?? 6, k),
        h: mix(a.h ?? 3, b.h ?? a.h ?? 3, k),
        rot: mix(a.rot ?? 0, b.rot ?? a.rot ?? 0, k),
        opacity: mix(a.opacity ?? 1, b.opacity ?? a.opacity ?? 1, k),
      };
    }
  }
  return keys[keys.length - 1];
};

const zoomAt = (z: BattleSpec['zoom'], p: number) => {
  if (!z?.length) return {cx: 50, cy: 28.125, s: 1};
  if (p <= z[0].at) return z[0];
  for (let i = 0; i < z.length - 1; i++) {
    if (p <= z[i + 1].at) {
      const k = easeInOutCubic((p - z[i].at) / Math.max(1e-6, z[i + 1].at - z[i].at));
      return {cx: mix(z[i].cx, z[i + 1].cx, k), cy: mix(z[i].cy, z[i + 1].cy, k), s: mix(z[i].s, z[i + 1].s, k)};
    }
  }
  return z[z.length - 1];
};

const pts = (a: [number, number][]) => a.map((q) => q.join(',')).join(' ');

/** Units along an arc (for crescents / curved lines). */
export const arcUnits = (
  prefix: string,
  side: 'a' | 'b',
  n: number,
  phases: {at: number; cx: number; cy: number; r: number; a0: number; a1: number}[],
  size: {w: number; h: number},
  kind: BUnit['kind'] = 'inf',
): BUnit[] =>
  Array.from({length: n}, (_, i) => ({
    id: `${prefix}${i}`,
    side,
    kind,
    keys: phases.map((ph) => {
      const ang = mix(ph.a0, ph.a1, n === 1 ? 0.5 : i / (n - 1));
      return {at: ph.at, x: ph.cx + ph.r * Math.cos(ang), y: ph.cy + ph.r * Math.sin(ang), w: size.w, h: size.h, rot: (ang * 180) / Math.PI + 90};
    }),
  }));

export const BattleShot: React.FC<{spec: BattleSpec; p: number; width: number; height: number; sceneP?: number; clarity?: boolean}> = ({spec, p, width, height, sceneP, clarity}) => {
  const S = width / 100; // px per field unit
  const z = zoomAt(spec.zoom, p * 1.0);
  // Living camera tied to the SCENE (not battle) progress: a battle split over several scenes still moves in each.
  const push = 1 + 0.07 * (sceneP ?? p);
  const scale = z.s * push;
  const tx = width / 2 - z.cx * S * scale;
  const ty = height / 2 - z.cy * S * scale;
  const t = spec.terrain ?? {};
  const fog = t.fog ? 1 - easeInOutCubic(ramp(p, t.fog[0], t.fog[1])) : 0;
  const color = (s: 'a' | 'b') => spec.sides[s].color;

  return (
    <div style={{position: 'absolute', inset: 0, background: '#cbbd94'}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="bvig" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(40,25,10,0.55)" />
          </radialGradient>
          <pattern id="bgrid" width={5 * S} height={5 * S} patternUnits="userSpaceOnUse">
            <path d={`M ${5 * S} 0 L 0 0 0 ${5 * S}`} fill="none" stroke="rgba(90,70,40,0.12)" strokeWidth={1} />
          </pattern>
        </defs>
        <g transform={`translate(${tx},${ty}) scale(${scale})`}>
          <rect x={-50 * S} y={-50 * S} width={200 * S} height={160 * S} fill="#d8c9a3" />
          <rect x={-50 * S} y={-50 * S} width={200 * S} height={160 * S} fill="url(#bgrid)" />
          {(t.hills ?? []).map((h, i) => (
            <g key={i}>
              <ellipse cx={h.x * S} cy={h.y * S} rx={h.r * 1.5 * S} ry={h.r * 0.75 * S} fill="#c4b284" />
              <ellipse cx={(h.x - h.r * 0.2) * S} cy={(h.y - h.r * 0.1) * S} rx={h.r * 0.9 * S} ry={h.r * 0.42 * S} fill="#b8a578" />
            </g>
          ))}
          {t.lake ? <polygon points={pts(t.lake.map(([x, y]) => [x * S, y * S]))} fill="#2c4a5a" stroke="#1d3340" strokeWidth={4} /> : null}
          {(t.lakes ?? []).map((l, i) => (
            <polygon key={`lk${i}`} points={pts(l.map(([x, y]) => [x * S, y * S]))} fill="#2c4a5a" stroke="#1d3340" strokeWidth={4} strokeLinejoin="round" />
          ))}
          {(t.walls ?? []).map((w, i) => (
            <g key={`wl${i}`}>
              <polyline points={pts(w.map(([x, y]) => [x * S, y * S]))} fill="none" stroke="#5a4a32" strokeWidth={1.1 * S} strokeLinejoin="round" strokeLinecap="round" />
              <polyline points={pts(w.map(([x, y]) => [x * S, y * S]))} fill="none" stroke="#efe4c8" strokeWidth={0.35 * S} strokeDasharray={`${0.6 * S} ${0.5 * S}`} />
            </g>
          ))}
          {t.river ? <polyline points={pts(t.river.map(([x, y]) => [x * S, y * S]))} fill="none" stroke="#2c4a5a" strokeWidth={2.2 * S} strokeLinejoin="round" strokeLinecap="round" /> : null}
          {(spec.arrows ?? []).map((a, i) => {
            const pr = easeInOutCubic(ramp(p, a.draw[0], a.draw[1]));
            const fade = clarity ? 1 - easeInOutCubic(ramp(p, a.draw[1] + 0.12, a.draw[1] + 0.25)) : 1;
            if (pr <= 0 || fade <= 0) return null;
            const via = a.via ?? [(a.from[0] + a.to[0]) / 2, (a.from[1] + a.to[1]) / 2];
            const q = (u: number): [number, number] => {
              const x = (1 - u) * (1 - u) * a.from[0] + 2 * (1 - u) * u * via[0] + u * u * a.to[0];
              const y = (1 - u) * (1 - u) * a.from[1] + 2 * (1 - u) * u * via[1] + u * u * a.to[1];
              return [x * S, y * S];
            };
            const N = 24;
            const line = Array.from({length: N + 1}, (_, k) => q((pr * k) / N));
            const tip = q(pr);
            const prev = q(Math.max(0, pr - 0.03));
            const ang = (Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) * 180) / Math.PI;
            const w = (a.width ?? 1.4) * S;
            return (
              <g key={i} opacity={fade}>
                <polyline points={pts(line)} fill="none" stroke={color(a.side)} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
                <polygon points={`0,${-w * 1.5} ${w * 2.4},0 0,${w * 1.5}`} fill={color(a.side)} transform={`translate(${tip[0]},${tip[1]}) rotate(${ang})`} />
              </g>
            );
          })}
          {spec.units.map((u) => {
            const k = lerpKey(fillKeys(u.keys), p);
            const showLabel = u.label && (u.labelUntil === undefined || p < u.labelUntil);
            if ((k.opacity ?? 1) <= 0.01) return null;
            const w = (k.w ?? 6) * S;
            const h = (k.h ?? 3) * S;
            const c = color(u.side);
            if (clarity) {
              const fk: FigureKind = u.kind === 'cav' ? 'cavalry' : u.kind === 'ele' ? 'elephant' : u.kind === 'ship' ? 'ship' : 'infantry';
              const size = (fk === 'ship' ? 3.2 : 2.6) * S;
              const cols = Math.max(1, Math.round(w / (size * 0.95)));
              const rows = Math.max(1, Math.round(h / (size * 0.95)));
              const flip = u.side === 'b';
              const lab = u.label && (u.labelUntil === undefined || p < u.labelUntil);
              return (
                <g key={u.id} opacity={k.opacity ?? 1}>
                  <g transform={`translate(${k.x * S},${k.y * S}) rotate(${k.rot ?? 0})`}>
                    <ellipse cx={0} cy={h / 2 + size * 0.15} rx={w / 2 + size * 0.3} ry={size * 0.35} fill="rgba(40,25,10,0.22)" />
                    {Array.from({length: rows * cols}, (_, n) => {
                      const cx = -w / 2 + (w * ((n % cols) + 0.5)) / cols;
                      const cy = -h / 2 + (h * (Math.floor(n / cols) + 0.5)) / rows;
                      return <Figure key={n} kind={fk} x={cx} y={cy} size={size} color={c} flip={flip} />;
                    })}
                  </g>
                  {lab ? (
                    <text x={k.x * S} y={k.y * S - h / 2 - size * 0.75} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={30 / scale} fill="#2a2116" stroke="#efe4c8" strokeWidth={8 / scale} paintOrder="stroke">
                      {u.label}
                      {u.count ? <tspan fill={c}>{` ${u.count}`}</tspan> : null}
                    </text>
                  ) : null}
                </g>
              );
            }
            return (
              <g key={u.id} transform={`translate(${k.x * S},${k.y * S}) rotate(${k.rot ?? 0})`} opacity={k.opacity ?? 1}>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={c} stroke="#f4ecd8" strokeWidth={0.25 * S} rx={0.2 * S} />
                {u.kind === 'cav' ? <line x1={-w / 2} y1={h / 2} x2={w / 2} y2={-h / 2} stroke="#f4ecd8" strokeWidth={0.22 * S} /> : null}
                {u.kind === 'inf' || !u.kind ? (
                  <>
                    <line x1={-w / 2} y1={-h / 2} x2={w / 2} y2={h / 2} stroke="#f4ecd8" strokeWidth={0.22 * S} />
                    <line x1={-w / 2} y1={h / 2} x2={w / 2} y2={-h / 2} stroke="#f4ecd8" strokeWidth={0.22 * S} />
                  </>
                ) : null}
                {u.kind === 'ele' ? (
                  <text y={h * 0.32} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={h * 0.9} fill="#f4ecd8">
                    E
                  </text>
                ) : null}
                {showLabel ? (
                  <text y={-h / 2 - 0.8 * S} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={1.5 * S} fill="#2a2116" stroke="#efe4c8" strokeWidth={0.35 * S} paintOrder="stroke" transform={`rotate(${-(k.rot ?? 0)})`}>
                    {u.label}
                  </text>
                ) : null}
              </g>
            );
          })}
          {(spec.notes ?? []).map((n, i) => {
            const a = easeInOutCubic(ramp(p, n.appear, n.appear + 0.06)) * (n.until ? 1 - easeInOutCubic(ramp(p, n.until - 0.05, n.until)) : 1);
            if (a <= 0) return null;
            return (
              <text key={i} x={n.x * S} y={n.y * S} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={clarity ? Math.max(1.7 * S, 30 / scale) : 1.7 * S} fill="#2a2116" stroke="#efe4c8" strokeWidth={0.4 * S} paintOrder="stroke" opacity={a}>
                {n.text}
              </text>
            );
          })}
        </g>
        {fog > 0 ? (
          <>
            <defs>
              <linearGradient id="fogband" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#e8e4da" stopOpacity={0.35} />
                <stop offset="0.5" stopColor="#e8e4da" stopOpacity={0.8} />
                <stop offset="1" stopColor="#e8e4da" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            {/* drifting fog band (moves even while the armies are hidden) */}
            <rect x={-width + p * width * 1.6} y={0} width={width * 2} height={height} fill="url(#fogband)" opacity={0.85 * fog} />
          </>
        ) : null}
        <rect width={width} height={height} fill="url(#bvig)" />
      </svg>
      {clarity && spec.phases?.length
        ? (() => {
            let cur = -1;
            spec.phases!.forEach((ph, n) => {
              if (p >= ph.at) cur = n;
            });
            if (cur < 0) return null;
            const ph = spec.phases![cur];
            const nextAt = spec.phases![cur + 1]?.at ?? 1.2;
            const a = easeInOutCubic(ramp(p, ph.at, ph.at + 0.05)) * (1 - easeInOutCubic(ramp(p, nextAt - 0.04, nextAt)));
            return <PhaseBanner title={ph.title} sub={ph.sub} a={a} />;
          })()
        : null}
      {clarity ? (
        <div style={{position: 'absolute', left: 40, bottom: 36, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: '#f4ecd8', background: 'rgba(20,14,8,0.8)', padding: '6px 18px', borderRadius: 8}}>{spec.title}</div>
      ) : null}
      {/* title + legend on dark plates at the bottom (units live in the upper field) */}
      {clarity ? null : <>
      <div style={{position: 'absolute', left: 56, bottom: 44, fontFamily: CINZEL, fontWeight: 700, fontSize: 46, color: '#f4ecd8', background: 'rgba(20,14,8,0.78)', padding: '10px 24px', borderRadius: 6}}>{spec.title}</div>
      <div style={{position: 'absolute', right: 56, bottom: 50, display: 'flex', gap: 28, fontFamily: INTER, fontWeight: 700, fontSize: 26, color: '#f4ecd8', background: 'rgba(20,14,8,0.78)', padding: '10px 20px', borderRadius: 6}}>
        {(['a', 'b'] as const).map((s) => (
          <div key={s} style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <div style={{width: 30, height: 20, background: spec.sides[s].color, border: '3px solid #f4ecd8'}} />
            {spec.sides[s].name}
          </div>
        ))}
      </div>
      </>}
    </div>
  );
};
