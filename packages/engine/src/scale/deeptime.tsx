import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';
import {pathFor, SHAPES, ShapeKey, topOf, widthOf, bottomOf} from './shapes';

// "Millions of years ago" made visible: a horizontal time line with TODAY on the right, geological periods as
// coloured bands (named), animals pinned at their time, and the tiny sliver of time humans have existed.

export type DeepMarker = {label: string; at?: number; range?: [number, number]; color: string; shape?: ShapeKey; sub?: string; appear?: number; row?: 0 | 1};
export type DeepTimeSpec = {
  title?: string;
  /** visible window in millions of years ago [oldest, youngest] at the start and end of the scene */
  from: [number, number];
  to?: [number, number];
  markers: DeepMarker[];
  /** show the "humans like us: last 300,000 years" sliver */
  humans?: boolean;
};

const PERIODS: {name: string; from: number; to: number; color: string}[] = [
  {name: 'Triassic', from: 252, to: 201, color: '#8e5a8c'},
  {name: 'Jurassic', from: 201, to: 145, color: '#3f8fb0'},
  {name: 'Cretaceous', from: 145, to: 66, color: '#6fa35a'},
  {name: 'Paleogene', from: 66, to: 23, color: '#d08a3c'},
  {name: 'Neogene', from: 23, to: 2.6, color: '#d7b43c'},
  {name: 'Ice ages', from: 2.6, to: 0, color: '#c9d6de'},
];

const GOLD = '#f2c14e';
const PAPER = '#f6f1e4';
const L = 120;
const R = 1800;
const AXIS = 520;

const mya = (v: number) => (v >= 1 ? `${Number.isInteger(v) ? v : v.toFixed(1)} million years ago` : `${Math.round(v * 1000).toLocaleString('en-US')},000 years ago`.replace(',000,000', ',000'));

export const DeepTimeShot: React.FC<{spec: DeepTimeSpec; p: number; elapsed: number}> = ({spec, p, elapsed}) => {
  const k = easeInOutCubic(p);
  const to = spec.to ?? spec.from;
  const old = Math.exp(mix(Math.log(spec.from[0] + 1), Math.log(to[0] + 1), k)) - 1;
  const young = mix(spec.from[1], to[1], k);
  const X = (m: number) => R - ((m - young) / (old - young)) * (R - L);
  const step = [1, 2, 5, 10, 20, 25, 50, 100].find((s) => (old - young) / s <= 8) ?? 100;
  const ticks: number[] = [];
  for (let m = Math.ceil(young / step) * step; m <= old; m += step) ticks.push(m);
  const motes = Array.from({length: 50}, (_, i) => {
    const r = (q: string) => random(`dt-${i}-${q}`);
    const x = (r('x') * 1920 - elapsed * (5 + 8 * r('v')) + 1920 * 4) % 1920;
    return <circle key={i} cx={x} cy={r('y') * 1080} r={1 + 2 * r('z')} fill="rgba(240,230,200,0.18)" />;
  });
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2a3a 0%, #111018 75%)', fontFamily: INTER}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {motes}
        {PERIODS.map((pd) => {
          const x0 = Math.max(L, X(pd.from));
          const x1 = Math.min(R, X(pd.to));
          if (x1 <= L || x0 >= R) return null;
          return (
            <g key={pd.name}>
              <rect x={x0} y={AXIS + 6} width={x1 - x0} height={44} fill={pd.color} opacity={0.85} />
              {x1 - x0 > 150 ? (
                <text x={(x0 + x1) / 2} y={AXIS + 39} textAnchor="middle" fontWeight={800} fontSize={30} fill="#141018">
                  {pd.name}
                </text>
              ) : null}
            </g>
          );
        })}
        <line x1={L} x2={R} y1={AXIS} y2={AXIS} stroke={PAPER} strokeWidth={4} />
        <polygon points={`${R + 26},${AXIS} ${R},${AXIS - 12} ${R},${AXIS + 12}`} fill={PAPER} />
        {ticks.map((m) => (
          <g key={m}>
            <line x1={X(m)} x2={X(m)} y1={AXIS - 14} y2={AXIS + 4} stroke={PAPER} strokeWidth={3} />
            <text x={X(m)} y={AXIS + 92} textAnchor="middle" fontWeight={700} fontSize={30} fill="#d9d2bd">
              {m === 0 ? '' : m}
            </text>
          </g>
        ))}
        <text x={L} y={AXIS + 140} fontWeight={800} fontSize={30} fill={GOLD} letterSpacing={2}>
          MILLIONS OF YEARS AGO
        </text>
        <text x={R} y={AXIS + 92} textAnchor="end" fontWeight={900} fontSize={34} fill={GOLD}>
          TODAY
        </text>
      </svg>
      {spec.humans ? (
        <div style={{position: 'absolute', left: X(0.3) - 6, top: AXIS - 30, width: Math.max(10, X(0) - X(0.3)) + 6, height: 30, background: GOLD, opacity: easeInOutCubic(ramp(p, 0.3, 0.4))}} />
      ) : null}
      {spec.humans ? (
        <div style={{position: 'absolute', right: 1920 - R, top: AXIS - 120, textAlign: 'right', fontWeight: 800, fontSize: 32, color: GOLD, opacity: easeInOutCubic(ramp(p, 0.3, 0.4))}}>
          humans like us:
          <br />
          only the last ~300,000 years
        </div>
      ) : null}
      {spec.markers.map((mk, i) => {
        const a = easeInOutCubic(ramp(p, mk.appear ?? 0.1 + i * 0.15, (mk.appear ?? 0.1 + i * 0.15) + 0.08));
        if (a <= 0) return null;
        const c = mk.range ? (mk.range[0] + mk.range[1]) / 2 : mk.at ?? 0;
        const x = Math.min(R - 160, Math.max(L + 160, X(c)));
        const rowY = mk.row === 1 ? 150 : 250;
        const s = mk.shape ? SHAPES[mk.shape] : null;
        const iconW = 220;
        const len = s ? Math.min(iconW / widthOf(s), 90 / (topOf(s) - Math.min(0, bottomOf(s)))) : 0;
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: a}}>
            {mk.range ? (
              <div style={{position: 'absolute', left: X(mk.range[0]), top: AXIS - 16, width: Math.max(8, X(mk.range[1]) - X(mk.range[0])), height: 16, background: mk.color, borderRadius: 4}} />
            ) : (
              <div style={{position: 'absolute', left: X(c) - 9, top: AXIS - 9, width: 18, height: 18, borderRadius: 9, background: mk.color, border: `3px solid ${PAPER}`}} />
            )}
            <div style={{position: 'absolute', left: X(c) - 2, top: rowY + 150, width: 4, height: AXIS - rowY - 166, background: `${mk.color}aa`}} />
            <div style={{position: 'absolute', left: x - 200, top: rowY - 40, width: 400, textAlign: 'center'}}>
              {s ? (
                <svg width={iconW} height={100} style={{display: 'block', margin: '0 auto'}}>
                  <path d={pathFor(s, {x: (iconW - widthOf(s) * len) / 2, y: 50 + ((topOf(s) + Math.min(0, bottomOf(s))) / 2) * len, len, t: elapsed})} fill={mk.color} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                </svg>
              ) : null}
              <div style={{fontWeight: 900, fontSize: 38, color: PAPER, lineHeight: 1.1}}>{mk.label}</div>
              <div style={{fontWeight: 700, fontSize: 30, color: mk.color}}>{mk.sub ?? (mk.range ? `${mk.range[0]}–${mk.range[1]} million years ago` : mya(c))}</div>
            </div>
          </div>
        );
      })}
      {spec.title ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontWeight: 900, fontSize: 46, color: PAPER, opacity: easeInOutCubic(ramp(p, 0, 0.08))}}>{spec.title}</div>
      ) : null}
    </AbsoluteFill>
  );
};
