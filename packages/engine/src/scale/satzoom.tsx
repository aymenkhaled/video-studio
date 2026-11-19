import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../overlay';
import {artSrc, useArtIndex} from '../map/media';

// Scale & Science: top-down "true area" stage on REAL satellite imagery (B003). Layers are licence-checked tile
// mosaics stitched in CI (`source: "tiles"` in assets/media.json → index.json carries metres-per-pixel + centre).
// Everything is placed in metres east/north of `origin`, so a football pitch, a city outline or a whale cut-out
// lies on the ground at exact size. Camera = visible ground width in metres, eased in log space (pitch → 200 km),
// plus absolute-time drift so the frame never freezes (LESSONS B001 #9).

type LonLat = [number, number];
export type SatCam = {at: number; width: number; x?: number; y?: number};
type Common = {label?: string; sub?: string; color?: string; appear?: number; vanish?: number; /** hide only the label after this progress (zoom-outs) */ labelVanish?: number; /** place by longitude/latitude instead of x/y metres */ at?: LonLat};
export type SatShape =
  | ({type: 'rect'; w: number; h: number; x?: number; y?: number; rot?: number; fill?: boolean} & Common)
  /** `minPx` keeps a marker ring visible (and labelled) when the true size is too small to see */
  | ({type: 'circle'; r: number; x?: number; y?: number; fill?: boolean; minPx?: number} & Common)
  /** fixed-size map pin (sampling sites) */
  | ({type: 'pin'; x?: number; y?: number} & Common)
  /** polyline / polygon in metres (x east, y north); `draw` animates the stroke over a window */
  | ({type: 'path'; pts: [number, number][]; closed?: boolean; fill?: boolean; draw?: [number, number]; dashed?: boolean} & Common)
  /** real photo cut-out (art id) seen from above, `len` metres long along its width */
  | ({type: 'image'; id: string; len: number; x?: number; y?: number; rot?: number} & Common);

export type SatZoomSpec = {
  /** art ids of tile mosaics, any order (finest drawn on top while it covers the view) */
  layers: string[];
  origin: LonLat;
  camera: SatCam[];
  shapes?: SatShape[];
  /** small caption top-left under the tracker, e.g. imagery credit */
  credit?: string;
  scaleBar?: boolean;
  /** dim the imagery so drawn shapes read (0–0.6) */
  dim?: number;
};

const W = 1920;
const H = 1080;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);

export const satCamAt = (keys: SatCam[], p: number) => {
  const k0 = keys[0];
  if (keys.length === 1) return {width: k0.width, x: k0.x ?? 0, y: k0.y ?? 0};
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].at) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const u = ease(clamp((p - a.at) / Math.max(1e-6, b.at - a.at)));
  const lw = Math.log(a.width) + (Math.log(b.width) - Math.log(a.width)) * u;
  // centre moves in proportion to the zoom so the target stays put during big log pulls
  const zu = Math.abs(Math.log(b.width) - Math.log(a.width)) > 0.2 ? (Math.exp(lw) - a.width) / (b.width - a.width) : u;
  const m = clamp(zu);
  return {width: Math.exp(lw), x: (a.x ?? 0) + ((b.x ?? 0) - (a.x ?? 0)) * m, y: (a.y ?? 0) + ((b.y ?? 0) - (a.y ?? 0)) * m};
};

const niceLen = (m: number) => {
  const e = 10 ** Math.floor(Math.log10(m));
  for (const f of [5, 2, 1]) if (f * e <= m) return f * e;
  return e;
};
const fmtLen = (m: number) => (m >= 1000 ? `${(m / 1000).toLocaleString('en-US')} km` : `${m} m`);

export const offset = (o: LonLat, c: LonLat): [number, number] => [
  (c[0] - o[0]) * 111320 * Math.cos((o[1] * Math.PI) / 180),
  (c[1] - o[1]) * 110574,
];

const vis = (s: Common, p: number) => clamp((p - (s.appear ?? 0)) / 0.04) * (s.vanish === undefined ? 1 : clamp((s.vanish - p) / 0.04));

const Chip: React.FC<{x: number; y: number; text: string; sub?: string; color: string; o: number}> = ({x, y, text, sub, color, o}) => {
  const cx = clamp(x, 220, W - 220);
  const cy = clamp(y, 150, 700);
  return (
    <div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -100%)', opacity: o, textAlign: 'center', whiteSpace: 'nowrap'}}>
      <div style={{display: 'inline-block', background: 'rgba(8,14,18,0.82)', border: `3px solid ${color}`, borderRadius: 12, padding: '8px 18px', fontFamily: INTER, color: '#fff'}}>
        <div style={{fontWeight: 800, fontSize: 34}}>{text}</div>
        {sub ? <div style={{fontWeight: 700, fontSize: 26, color}}>{sub}</div> : null}
      </div>
    </div>
  );
};

export const SatZoomShot: React.FC<{spec: SatZoomSpec; p: number; elapsed: number}> = ({spec, p, elapsed}) => {
  const index = useArtIndex() as Record<string, {w: number; h: number; mpp?: number; center?: LonLat}> | null;
  const cam = satCamAt(spec.camera, p);
  const width = cam.width * (1 + 0.006 * elapsed); // slow living pull-back
  const cx = cam.x + width * 0.004 * elapsed;
  const cy = cam.y;
  const s = W / width; // px per metre
  const X = (x: number) => W / 2 + (x - cx) * s;
  const Y = (y: number) => H / 2 - (y - cy) * s;

  const layers = (spec.layers
    .map((id) => {
      const a = index?.[id];
      if (!a?.mpp) return null;
      const [ox, oy] = a.center ? offset(spec.origin, a.center) : [0, 0];
      return {id, gw: a.w * a.mpp, gh: a.h * a.mpp, ox, oy};
    })
    .filter(Boolean) as {id: string; gw: number; gh: number; ox: number; oy: number}[]).sort((a, b) => b.gw - a.gw);

  // a layer is drawn while it covers the view; finer layers fade in as the camera gets inside them
  const viewH = width * (H / W);
  const cover = (l: (typeof layers)[0]) =>
    Math.min((l.gw / 2 - Math.abs(cx - l.ox)) / (width / 2), (l.gh / 2 - Math.abs(cy - l.oy)) / (viewH / 2));
  let base = 0;
  layers.forEach((l, i) => {
    if (cover(l) >= 1) base = i;
  });

  const shapes = (spec.shapes ?? []).map((sh) => {
    if (!sh.at) return sh;
    const [x, y] = offset(spec.origin, sh.at);
    return {...sh, x, y} as SatShape;
  });
  const bar = niceLen(width / 6);
  return (
    <AbsoluteFill style={{background: '#0b1d26', overflow: 'hidden'}}>
      {layers.map((l, i) => {
        if (i < base) return null;
        const o = i === base ? 1 : clamp((cover(l) - 0.85) / 0.25);
        if (o <= 0) return null;
        return (
          <Img
            key={l.id}
            src={artSrc(l.id)}
            style={{position: 'absolute', left: X(l.ox - l.gw / 2), top: Y(l.oy + l.gh / 2), width: l.gw * s, height: l.gh * s, opacity: o, maxWidth: 'none'}}
          />
        );
      })}
      {spec.dim ? <AbsoluteFill style={{background: `rgba(4,10,14,${spec.dim})`}} /> : null}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {shapes.map((sh, i) => {
          const o = vis(sh, p);
          if (o <= 0) return null;
          const color = sh.color ?? '#f2c14e';
          const sw = 6;
          if (sh.type === 'rect') {
            const x = sh.x ?? 0;
            const y = sh.y ?? 0;
            return (
              <g key={i} opacity={o} transform={`rotate(${-(sh.rot ?? 0)} ${X(x)} ${Y(y)})`}>
                <rect x={X(x - sh.w / 2)} y={Y(y + sh.h / 2)} width={Math.max(2, sh.w * s)} height={Math.max(2, sh.h * s)} fill={sh.fill ? color : 'none'} fillOpacity={0.35} stroke={color} strokeWidth={sw} />
              </g>
            );
          }
          if (sh.type === 'circle') {
            return <circle key={i} opacity={o} cx={X(sh.x ?? 0)} cy={Y(sh.y ?? 0)} r={Math.max(sh.minPx ?? 3, sh.r * s)} fill={sh.fill ? color : 'none'} fillOpacity={0.3} stroke={color} strokeWidth={sw} />;
          }
          if (sh.type === 'pin') {
            return (
              <g key={i} opacity={o}>
                <circle cx={X(sh.x ?? 0)} cy={Y(sh.y ?? 0)} r={13} fill={color} stroke="#000" strokeWidth={4} />
                <circle cx={X(sh.x ?? 0)} cy={Y(sh.y ?? 0)} r={13 + 10 * (0.5 + 0.5 * Math.sin(elapsed * 2.4 + i))} fill="none" stroke={color} strokeWidth={3} opacity={0.6} />
              </g>
            );
          }
          if (sh.type === 'path') {
            const pts = sh.pts.map(([x, y]) => [X(x), Y(y)]);
            let len = 0;
            for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
            if (sh.closed) len += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
            const d = 'M' + pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L') + (sh.closed ? ' Z' : '');
            const drawn = sh.draw ? ease(clamp((p - sh.draw[0]) / Math.max(1e-6, sh.draw[1] - sh.draw[0]))) : 1;
            return (
              <g key={i} opacity={o}>
                <path d={d} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={sw + 6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${len * drawn} ${len + 10}`} />
                <path d={d} fill={sh.fill && drawn >= 1 ? color : 'none'} fillOpacity={0.28} stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={sh.dashed && drawn >= 1 ? '18 12' : `${len * drawn} ${len + 10}`} />
              </g>
            );
          }
          return null;
        })}
      </svg>
      {shapes.map((sh, i) => {
        if (sh.type !== 'image') return null;
        const o = vis(sh, p);
        const a = index?.[sh.id];
        if (o <= 0 || !a) return null;
        const wpx = sh.len * s;
        const hpx = (wpx * a.h) / a.w;
        return (
          <Img
            key={`img${i}`}
            src={artSrc(sh.id)}
            style={{position: 'absolute', left: X(sh.x ?? 0) - wpx / 2, top: Y(sh.y ?? 0) - hpx / 2, width: wpx, height: hpx, opacity: o, transform: `rotate(${-(sh.rot ?? 0)}deg)`, maxWidth: 'none'}}
          />
        );
      })}
      {shapes.map((sh, i) => {
        if (!sh.label) return null;
        const o = vis(sh, p) * (sh.labelVanish === undefined ? 1 : clamp((sh.labelVanish - p) / 0.04));
        if (o <= 0) return null;
        // label sits above the shape's top edge; hidden while the shape is too small to see
        let x = 0;
        let top = 0;
        let size = 0;
        if (sh.type === 'rect') [x, top, size] = [X(sh.x ?? 0), Y((sh.y ?? 0) + sh.h / 2), Math.max(sh.w, sh.h) * s];
        else if (sh.type === 'circle') [x, top, size] = [X(sh.x ?? 0), Y(sh.y ?? 0) - Math.max(sh.minPx ?? 0, sh.r * s), Math.max(sh.minPx ?? 0, sh.r * s) * 2];
        else if (sh.type === 'pin') {
          const px = X(sh.x ?? 0);
          const py = Y(sh.y ?? 0);
          return px > 0 && px < W && py > 100 && py < 720 ? (
            <div key={`l${i}`} style={{position: 'absolute', left: px + 22, top: py - 20, opacity: o, fontFamily: INTER, fontWeight: 800, fontSize: 28, color: '#fff', textShadow: '0 2px 6px #000, 0 0 3px #000', whiteSpace: 'nowrap'}}>{sh.label}</div>
          ) : null;
        }
        else if (sh.type === 'image') [x, top, size] = [X(sh.x ?? 0), Y(sh.y ?? 0) - (sh.len * s) / 4, sh.len * s];
        else {
          const ys = sh.pts.map((q) => q[1]);
          const xs = sh.pts.map((q) => q[0]);
          [x, top, size] = [X((Math.min(...xs) + Math.max(...xs)) / 2), Y(Math.max(...ys)), (Math.max(...xs) - Math.min(...xs)) * s];
        }
        const show = clamp((size - 4) / 10) * o;
        return show > 0 ? <Chip key={`l${i}`} x={x} y={top - 14} text={sh.label} sub={sh.sub} color={sh.color ?? '#f2c14e'} o={show} /> : null;
      })}
      {spec.scaleBar !== false ? (
        <div style={{position: 'absolute', left: 60, top: 708, fontFamily: INTER, color: '#fff'}}>
          <div style={{width: bar * s, height: 12, background: '#fff', border: '3px solid #000', boxSizing: 'content-box'}} />
          <div style={{fontWeight: 800, fontSize: 30, marginTop: 4, textShadow: '0 2px 6px #000'}}>{fmtLen(bar)}</div>
        </div>
      ) : null}
      {spec.credit ? (
        <div style={{position: 'absolute', right: 40, top: 708, fontFamily: INTER, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 6px #000', maxWidth: 760, textAlign: 'right'}}>{spec.credit}</div>
      ) : null}
    </AbsoluteFill>
  );
};
