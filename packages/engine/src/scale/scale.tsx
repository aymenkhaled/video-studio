import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {clamp01, easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';
import {bottomOf, pathFor, SHAPES, ShapeKey, toPx, topOf, widthOf} from './shapes';
import {gridStep, lengthLabel, ScaleCam, scaleCamAt} from './units';

// Scale & Science "measuring stage" (2D, cheap to render): subjects side by side on a metre grid with a person,
// a bus and other known references, brackets in metres AND feet, slow eased camera + absolute drift, living
// backgrounds (ocean: light rays, marine snow, fish, swaying weed; land: clouds, hills, swaying plants).
// Layout (1920×1080): ground line ≈ y 740; captions own y 780–904; chapter tracker top-left; "to scale" chip top-right.

export type ScaleEnv = 'ocean' | 'land';
export type ScaleSubject = {
  id: string;
  shape: ShapeKey;
  /** measured size in metres (length; height for people) — the minimum when `range` is set */
  size: number;
  /** left end (tail) position on the ground axis, metres */
  x: number;
  /** height of the subject's baseline above the ground, metres (swimmers' centre line) */
  y?: number;
  range?: [number, number];
  flip?: boolean;
  color?: string;
  label?: string;
  sub?: string;
  appear?: number;
  vanish?: number;
  bracket?: boolean;
  bracketAt?: number;
  you?: boolean;
  /** unknown challenger: dark silhouette with a question mark, no label yet */
  mystery?: boolean;
  /** swims / walks forward at this speed (m/s) */
  speed?: number;
  /** grows from `size` to `range[1]` over this window (estimates growing on screen) */
  grow?: [number, number];
};
export type ScaleSpec = {
  env: ScaleEnv;
  subjects: ScaleSubject[];
  camera: ScaleCam[];
  /** px y of the ground / seabed line */
  ground?: number;
  title?: string;
  seed?: number;
};

const GOLD = '#f2c14e';
/** Darker shade of a #rrggbb colour (no CSS filters: they are slow on software WebGL/Chrome). */
export const darken = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * k).toString(16).padStart(2, '0');
  return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
};
const PAPER = '#f6f1e4';
const W = 1920;

const Ocean: React.FC<{camX: number; s: number; t: number; ground: number; seed: number}> = ({camX, s, t, ground, seed}) => {
  const par = (k: number) => -camX * s * k;
  const rays = [0, 1, 2, 3, 4, 5].map((i) => {
    const x0 = ((i * 397 + par(0.05)) % 2400 + 2400) % 2400 - 240;
    const a = 0.05 + 0.04 * Math.sin(t * 0.35 + i * 1.7);
    return <polygon key={i} points={`${x0},0 ${x0 + 140},0 ${x0 + 460},${ground} ${x0 + 240},${ground}`} fill={`rgba(190,235,255,${a.toFixed(3)})`} />;
  });
  const snow = Array.from({length: 90}, (_, i) => {
    const r = (k: string) => random(`${seed}-snow-${i}-${k}`);
    const z = 0.3 + r('z') * 0.7;
    const x = (((r('x') * 2200 + par(0.25 * z) + t * 6 * z) % 2200) + 2200) % 2200 - 140;
    const y = (((r('y') * 1080 + t * 9 * z) % 1080) + 1080) % 1080;
    return <circle key={i} cx={x} cy={y} r={1.2 + 2.2 * z} fill={`rgba(225,245,255,${(0.18 + 0.35 * z).toFixed(2)})`} />;
  });
  const fish = Array.from({length: 14}, (_, i) => {
    const r = (k: string) => random(`${seed}-fish-${i}-${k}`);
    const x = (((r('x') * 2600 - t * 40 * (0.6 + r('v')) + par(0.12)) % 2600) + 2600) % 2600 - 300;
    const y = 120 + r('y') * (ground - 320) + 10 * Math.sin(t * 1.3 + i);
    const k = 7 + r('s') * 6;
    return <path key={i} d={`M${x},${y} q${k},${-k * 0.6} ${k * 2.4},0 q${-k * 1.4},${k * 0.6} ${-k * 2.4},0 l${-k * 0.7},${-k * 0.5} l0,${k} z`} fill="rgba(10,40,60,0.45)" />;
  });
  const weed = Array.from({length: 26}, (_, i) => {
    const r = (k: string) => random(`${seed}-weed-${i}-${k}`);
    const x = (((r('x') * 2400 + par(0.9)) % 2400) + 2400) % 2400 - 240;
    const h = 30 + r('h') * 70;
    const sway = 10 * Math.sin(t * 0.9 + i);
    return <path key={i} d={`M${x},${ground + 6} q${sway},${-h * 0.5} ${sway * 0.4},${-h} q${-sway * 0.2},${h * 0.5} ${8},${h}`} fill="#1f5b4a" opacity={0.85} />;
  });
  return (
    <svg width={W} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a86a8" />
          <stop offset="0.55" stopColor="#0f4a6a" />
          <stop offset="1" stopColor="#06233a" />
        </linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6e64" />
          <stop offset="1" stopColor="#24302d" />
        </linearGradient>
      </defs>
      <rect width={W} height={1080} fill="url(#sea)" />
      {rays}
      {fish}
      {snow}
      <rect y={ground} width={W} height={1080 - ground} fill="url(#sand)" />
      {weed}
    </svg>
  );
};

const Land: React.FC<{camX: number; s: number; t: number; ground: number; seed: number}> = ({camX, s, t, ground, seed}) => {
  const par = (k: number) => -camX * s * k;
  const hills = (k: number, amp: number, base: number, color: string, key: string) => {
    const off = par(k);
    let d = `M0,${ground}`;
    for (let x = 0; x <= W; x += 40) {
      const wx = x - off;
      d += ` L${x},${(base + amp * (0.5 * Math.sin(wx / 230 + key.length) + 0.3 * Math.sin(wx / 97) + 0.2 * Math.sin(wx / 41))).toFixed(1)}`;
    }
    return <path key={key} d={`${d} L${W},${ground} Z`} fill={color} />;
  };
  const clouds = Array.from({length: 7}, (_, i) => {
    const r = (k: string) => random(`${seed}-cloud-${i}-${k}`);
    const x = (((r('x') * 2600 + t * 8 + par(0.04)) % 2600) + 2600) % 2600 - 300;
    const y = 60 + r('y') * 260;
    const k = 0.7 + r('s') * 0.8;
    return (
      <g key={i} opacity={0.85} transform={`translate(${x},${y}) scale(${k})`}>
        <ellipse cx={0} cy={0} rx={110} ry={34} fill="#fbf6ea" />
        <ellipse cx={-50} cy={-18} rx={60} ry={38} fill="#fbf6ea" />
        <ellipse cx={40} cy={-26} rx={70} ry={44} fill="#fbf6ea" />
      </g>
    );
  });
  const plants = Array.from({length: 18}, (_, i) => {
    const r = (k: string) => random(`${seed}-plant-${i}-${k}`);
    const x = (((r('x') * 2600 + par(0.55)) % 2600) + 2600) % 2600 - 300;
    const h = 90 + r('h') * 160;
    const sway = 4 * Math.sin(t * 0.6 + i);
    // conifer silhouette (period-plausible for the Cretaceous: conifers, cycads, ferns)
    return (
      <g key={i} opacity={0.75}>
        <rect x={x - 4} y={ground - 22 - h * 0.25} width={8} height={h * 0.25} fill="#4a4a33" />
        <path d={`M${x + sway},${ground - 22 - h} L${x + h * 0.22},${ground - 22 - h * 0.22} L${x - h * 0.22},${ground - 22 - h * 0.22} Z`} fill="#56704a" />
      </g>
    );
  });
  const grass = Array.from({length: 60}, (_, i) => {
    const r = (k: string) => random(`${seed}-grass-${i}-${k}`);
    const x = (((r('x') * 2400 + par(1)) % 2400) + 2400) % 2400 - 240;
    const sway = 3 * Math.sin(t * 1.4 + i * 0.7);
    return <path key={i} d={`M${x},${ground + 4} l${sway - 5},-18 l7,14 l${sway + 4},-22 l4,26 Z`} fill="#6c7d3f" />;
  });
  return (
    <svg width={W} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fa8d6" />
          <stop offset="0.7" stopColor="#bfe0ee" />
          <stop offset="1" stopColor="#f3e3bf" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a78f5c" />
          <stop offset="1" stopColor="#5f4f32" />
        </linearGradient>
      </defs>
      <rect width={W} height={1080} fill="url(#sky)" />
      <circle cx={1500} cy={170} r={70} fill="#fff4cf" opacity={0.9} />
      {clouds}
      {hills(0.08, 60, ground - 210, '#9db7b5', 'far')}
      {hills(0.22, 45, ground - 110, '#7d9a7a', 'mid')}
      {plants}
      <rect y={ground} width={W} height={1080 - ground} fill="url(#soil)" />
      {grass}
    </svg>
  );
};

/** Metre ruler along the ground: ticks every grid step, bold + labelled every 5 steps; faint vertical lines above. */
const Ruler: React.FC<{camX: number; s: number; ground: number; env: ScaleEnv}> = ({camX, s, ground, env}) => {
  const step = gridStep(s, 22);
  const left = camX - W / 2 / s;
  const right = camX + W / 2 / s;
  const first = Math.floor(left / step) * step;
  const items: React.ReactNode[] = [];
  const line = env === 'ocean' ? 'rgba(210,240,255,' : 'rgba(40,34,20,';
  for (let m = first; m <= right + step; m += step) {
    const x = (m - camX) * s + W / 2;
    const bold = Math.round(m / step) % 5 === 0;
    items.push(<line key={`v${m}`} x1={x} x2={x} y1={ground - 360} y2={ground} stroke={`${line}${bold ? 0.16 : 0.07})`} strokeWidth={bold ? 2 : 1} />);
    items.push(<line key={`t${m}`} x1={x} x2={x} y1={ground} y2={ground + (bold ? 18 : 9)} stroke={`${line}0.8)`} strokeWidth={bold ? 3 : 2} />);
    if (bold && m >= 0) items.push(<text key={`l${m}`} x={x + 6} y={ground + 46} fontFamily={INTER} fontWeight={700} fontSize={30} fill={env === 'ocean' ? '#d8eef8' : '#2e2616'}>{`${m} m`}</text>);
  }
  return (
    <svg width={W} height={1080} style={{position: 'absolute', inset: 0}}>
      <line x1={0} x2={W} y1={ground} y2={ground} stroke={`${line}0.9)`} strokeWidth={3} />
      {items}
    </svg>
  );
};

type Box = {x: number; y: number; w: number; h: number};
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

export const ScaleShot: React.FC<{spec: ScaleSpec; p: number; elapsed: number; width: number; height: number}> = ({spec, p, elapsed}) => {
  const t = elapsed;
  const ground = spec.ground ?? 740;
  const seed = spec.seed ?? 7;
  const cam = scaleCamAt(spec.camera, p);
  // absolute-time drift: the frame never freezes even between camera keys (LESSONS 13)
  const camX = cam.x + cam.width * 0.012 * Math.sin(t / 6.5);
  const s = W / cam.width;
  const X = (m: number) => (m - camX) * s + W / 2;
  const Y = (m: number) => ground - m * s;

  const subs = [...spec.subjects].sort((a, b) => (b.range?.[1] ?? b.size) - (a.range?.[1] ?? a.size));
  const shapes: React.ReactNode[] = [];
  const labels: {node: React.ReactNode; box: Box; prio: number}[] = [];
  subs.forEach((sub, i) => {
    const shape = SHAPES[sub.shape];
    const a = easeInOutCubic(ramp(p, sub.appear ?? 0, (sub.appear ?? 0) + 0.06)) * (1 - easeInOutCubic(ramp(p, sub.vanish ?? 2, (sub.vanish ?? 2) + 0.05)));
    if (a <= 0) return;
    const grown = sub.grow && sub.range ? mix(sub.size, sub.range[1], easeInOutCubic(ramp(p, sub.grow[0], sub.grow[1]))) : sub.size;
    const len = grown * s;
    const xm = sub.x + (sub.speed ?? 0) * t;
    const lift = (1 - a) * 24;
    const pl = {x: X(xm), y: Y(sub.y ?? 0) + lift + (sub.y ? 4 * Math.sin(t * 0.7 + i) : 0), len, t, flip: sub.flip, phase: i * 1.3};
    const color = sub.mystery ? '#0c1822' : sub.color ?? '#7f97a8';
    const gid = `g-${sub.id}`;
    shapes.push(
      <g key={sub.id} opacity={a}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity={1} />
            <stop offset="1" stopColor={sub.mystery ? color : '#e8eef0'} stopOpacity={sub.mystery ? 1 : 0.55} />
          </linearGradient>
        </defs>
        {/* contact shadow (no blur filters: flat ellipse) */}
        {!sub.y ? <ellipse cx={X(xm) + len * widthOf(shape) * 0.5} cy={ground + 4} rx={len * widthOf(shape) * 0.48} ry={Math.max(4, len * 0.012)} fill="rgba(0,0,0,0.28)" /> : null}
        {/* range ghost: dashed outline at the largest estimate */}
        {sub.range && !sub.grow ? (
          <path d={pathFor(shape, {...pl, len: sub.range[1] * s})} fill="rgba(255,255,255,0.06)" stroke={GOLD} strokeWidth={3} strokeDasharray="14 10" />
        ) : null}
        {(shape.fins ?? []).map((f, k) => (
          <path key={k} d={pathFor(shape, {...pl, phase: pl.phase + 0.8}, f)} fill={darken(color, 0.72)} />
        ))}
        <path d={pathFor(shape, pl)} fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
        {!sub.mystery ? <path d={pathFor(shape, pl)} fill={`url(#${gid})`} opacity={0.55} /> : null}
        {!sub.mystery
          ? (shape.extras ?? []).map((e, k) => {
              if (e.kind === 'eye' || e.kind === 'disc') {
                const [cx, cy] = toPx(shape, e.u, e.v, pl);
                return <circle key={k} cx={cx} cy={cy} r={Math.max(2, e.r * len)} fill={e.kind === 'eye' ? '#101418' : e.tone === 'dark' ? '#1b1f24' : '#e9eef0'} />;
              }
              if (e.kind === 'rect') {
                const [x0, y0] = toPx(shape, e.u, e.v + e.h, pl);
                const [x1, y1] = toPx(shape, e.u + e.w, e.v, pl);
                return <rect key={k} x={Math.min(x0, x1)} y={y0} width={Math.abs(x1 - x0)} height={y1 - y0} fill={e.tone === 'dark' ? '#22303a' : '#f4f1e8'} rx={3} />;
              }
              const d = e.pts.map(([u, v], j) => `${j ? 'L' : 'M'}${toPx(shape, u, v, pl).map((n) => n.toFixed(1)).join(',')}`).join(' ');
              return <path key={k} d={d} fill="none" stroke={e.tone === 'dark' ? 'rgba(10,14,18,0.6)' : 'rgba(255,255,255,0.35)'} strokeWidth={Math.max(1.5, e.w * len)} strokeLinecap="round" />;
            })
          : null}
        {sub.mystery ? (
          <text x={X(xm) + len * 0.5} y={pl.y - len * (topOf(shape) + bottomOf(shape)) * 0.5 + 34} textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={Math.min(140, Math.max(60, len * 0.12))} fill={GOLD}>
            ?
          </text>
        ) : null}
      </g>,
    );
    if (sub.mystery) return;
    // bracket above the subject (horizontal for length, vertical for height)
    const maxLen = (sub.range && !sub.grow ? sub.range[1] : grown) * s;
    const topY = pl.y - (shape.measure === 'height' ? 1 : topOf(shape)) * maxLen;
    const bA = sub.bracket === false ? 0 : easeInOutCubic(ramp(p, sub.bracketAt ?? (sub.appear ?? 0) + 0.05, (sub.bracketAt ?? (sub.appear ?? 0) + 0.05) + 0.12));
    const value = sub.range ? sub.range : grown;
    const text = lengthLabel(sub.grow ? Math.round(grown * 10) / 10 : value) + (sub.range ? ' (estimates vary)' : '');
    const x0 = pl.x;
    if (bA > 0 && shape.measure === 'length' && maxLen > 40) {
      const by = topY - 26;
      const x1 = x0 + maxLen * bA;
      shapes.push(
        <g key={`b-${sub.id}`} opacity={a}>
          <path d={`M${x0},${by + 14} L${x0},${by} L${x1},${by} L${x1},${by + 14}`} fill="none" stroke={GOLD} strokeWidth={4} />
          {sub.range && !sub.grow ? <line x1={x0 + sub.size * s * bA} x2={x0 + sub.size * s * bA} y1={by - 10} y2={by + 18} stroke={GOLD} strokeWidth={4} /> : null}
        </g>,
      );
      const tw = text.length * 18 + 30;
      const cx = Math.min(W - 40 - tw / 2, Math.max(40 + tw / 2, x0 + maxLen / 2));
      labels.push({
        prio: 1,
        box: {x: cx - tw / 2, y: by - 58, w: tw, h: 46},
        node: (
          <div style={{opacity: a * bA, background: 'rgba(10,14,18,0.78)', borderRadius: 10, padding: '4px 14px', fontFamily: INTER, fontWeight: 800, fontSize: 32, color: GOLD, whiteSpace: 'nowrap'}}>{text}</div>
        ),
      });
    }
    if (sub.label) {
      const lw = Math.max(sub.label.length * 22, (sub.sub ?? '').length * 15.5) + 34;
      const lh = sub.sub ? 86 : 54;
      const anchorX = shape.measure === 'height' ? x0 + maxLen * 0.13 : x0 + maxLen * 0.5;
      const bracketTop = shape.measure === 'length' && maxLen > 40 && sub.bracket !== false ? topY - 26 - 62 : topY - 12;
      const cx = Math.min(W - 30 - lw / 2, Math.max(30 + lw / 2, anchorX));
      labels.push({
        prio: 2,
        box: {x: cx - lw / 2, y: bracketTop - lh, w: lw, h: lh},
        node: (
          <div style={{opacity: a, textAlign: 'center', fontFamily: INTER, color: PAPER, textShadow: '0 2px 0 rgba(0,0,0,0.65)'}}>
            <div style={{fontWeight: 900, fontSize: 40, lineHeight: 1.05, whiteSpace: 'nowrap'}}>
              {sub.you ? <span style={{background: GOLD, color: '#1a1408', borderRadius: 8, padding: '0 10px', marginRight: 10, textShadow: 'none'}}>YOU</span> : null}
              {sub.label}
            </div>
            {sub.sub ? <div style={{fontWeight: 700, fontSize: 30, color: '#d6e4ea', whiteSpace: 'nowrap', marginTop: 4}}>{sub.sub}</div> : null}
            {shape.measure === 'height' && bA > 0 ? <div style={{fontWeight: 800, fontSize: 30, color: GOLD, whiteSpace: 'nowrap', opacity: bA}}>{lengthLabel(sub.size)}</div> : null}
          </div>
        ),
      });
    }
  });

  // place labels: keep each above its subject, push up (never sideways) until it clears the ones already placed
  const placed: Box[] = [];
  const nodes = labels
    .sort((a, b) => a.prio - b.prio)
    .map((l, k) => {
      const box = {...l.box, h: l.box.h + (l.prio === 2 && l.node ? 34 : 0)};
      let dy = 0;
      for (let guard = 0; guard < 12 && placed.some((q) => overlaps({...box, y: box.y + dy}, q)); guard++) dy -= 52;
      const y = Math.max(96, box.y + dy);
      placed.push({...box, y});
      return (
        <div key={k} style={{position: 'absolute', left: box.x, top: y, width: box.w, display: 'flex', justifyContent: 'center'}}>
          {l.node}
        </div>
      );
    });

  const titleA = spec.title ? easeInOutCubic(ramp(p, 0.02, 0.1)) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {spec.env === 'ocean' ? <Ocean camX={camX} s={s} t={t} ground={ground} seed={seed} /> : <Land camX={camX} s={s} t={t} ground={ground} seed={seed} />}
      <Ruler camX={camX} s={s} ground={ground} env={spec.env} />
      <svg width={W} height={1080} style={{position: 'absolute', inset: 0}}>
        {shapes}
      </svg>
      {nodes}
      <div style={{position: 'absolute', right: 36, top: 32, background: 'rgba(10,14,18,0.7)', borderRadius: 10, padding: '6px 16px', fontFamily: INTER, fontWeight: 800, fontSize: 30, color: PAPER}}>
        TO SCALE <span style={{color: GOLD}}>· grid lines every {gridStep(s, 22)} m</span>
      </div>
      {titleA > 0 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: titleA}}>
          <div style={{background: 'rgba(10,14,18,0.82)', borderBottom: `4px solid ${GOLD}`, borderRadius: 10, padding: '8px 28px', fontFamily: INTER, fontWeight: 900, fontSize: 40, color: PAPER}}>{spec.title}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const clampP = clamp01;
