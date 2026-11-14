import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {easeInOutCubic, ramp} from '../motion';
import {INTER} from '../overlay';
import {pathFor, SHAPES, ShapeKey, topOf, widthOf, bottomOf} from './shapes';
import {lengthLabel, massLabel} from './units';

// Tale-of-the-tape bars for weights (or lengths): each row = mini silhouette + name + bar (ranges: solid to the low
// estimate, striped to the high one) + metric/imperial value; optional "= N elephants" icon row for human context.

export type CompareRow = {label: string; value?: number; range?: [number, number]; color: string; shape?: ShapeKey; note?: string; appear?: number};
export type CompareSpec = {
  title: string;
  unit: 'mass' | 'length';
  max: number;
  rows: CompareRow[];
  /** icon tally for one row: e.g. 150 t ÷ 6 t = 25 elephants */
  tally?: {row: number; shape: ShapeKey; each: number; label: string; appear?: number};
  source?: string;
};

const GOLD = '#f2c14e';
const PAPER = '#f6f1e4';

const Mini: React.FC<{shape: ShapeKey; w: number; h: number; color: string; t: number}> = ({shape, w, h, color, t}) => {
  const s = SHAPES[shape];
  const sw = widthOf(s);
  const sh = topOf(s) - Math.min(0, bottomOf(s));
  const len = Math.min(w / sw, h / sh);
  const y = h / 2 + ((topOf(s) + Math.min(0, bottomOf(s))) / 2) * len;
  return (
    <svg width={w} height={h}>
      <path d={pathFor(s, {x: (w - sw * len) / 2, y, len, t})} fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
    </svg>
  );
};

export const CompareShot: React.FC<{spec: CompareSpec; p: number; elapsed: number}> = ({spec, p, elapsed}) => {
  const t = elapsed;
  const n = spec.rows.length;
  const rowH = spec.tally ? 104 : n > 4 ? 96 : 118;
  const top = 200;
  const barX = 640;
  const barW = 1140;
  const fmt = spec.unit === 'mass' ? massLabel : lengthLabel;
  const motes = Array.from({length: 40}, (_, i) => {
    const r = (k: string) => random(`cmp-${i}-${k}`);
    const x = (r('x') * 1920 + t * (6 + 10 * r('v'))) % 1920;
    const y = (r('y') * 1080 - t * (4 + 6 * r('v')) + 1080) % 1080;
    return <circle key={i} cx={x} cy={y} r={1.5 + 2 * r('z')} fill="rgba(200,225,240,0.22)" />;
  });
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #18384d 0%, #0b1824 70%)', fontFamily: INTER}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {motes}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', fontWeight: 900, fontSize: 50, color: PAPER, opacity: easeInOutCubic(ramp(p, 0, 0.08))}}>{spec.title}</div>
      {spec.rows.map((r, i) => {
        const a0 = r.appear ?? 0.06 + i * 0.1;
        const a = easeInOutCubic(ramp(p, a0, a0 + 0.06));
        const g = easeInOutCubic(ramp(p, a0 + 0.02, a0 + 0.16));
        const lo = r.range ? r.range[0] : r.value ?? 0;
        const hi = r.range ? r.range[1] : lo;
        const wLo = (barW * Math.min(lo, spec.max) * g) / spec.max;
        const wHi = (barW * Math.min(hi, spec.max) * g) / spec.max;
        const label = r.range ? fmt(r.range) : fmt(lo);
        const y = top + i * rowH;
        const labelInside = wHi > barW * 0.62;
        return (
          <div key={i} style={{position: 'absolute', left: 90, top: y, width: 1740, height: rowH - 16, opacity: a, display: 'flex', alignItems: 'center'}}>
            <div style={{width: 150}}>{r.shape ? <Mini shape={r.shape} w={140} h={rowH - 26} color={r.color} t={t} /> : null}</div>
            <div style={{width: barX - 90 - 150 - 10, paddingRight: 10}}>
              <div style={{fontWeight: 900, fontSize: 38, color: PAPER, lineHeight: 1.05}}>{r.label}</div>
              {r.note ? <div style={{fontWeight: 600, fontSize: 30, color: '#b9cbd6'}}>{r.note}</div> : null}
            </div>
            <div style={{position: 'relative', width: barW, height: 50}}>
              <div style={{position: 'absolute', left: 0, top: 0, width: barW, height: 50, background: 'rgba(255,255,255,0.06)', borderRadius: 8}} />
              {r.range ? (
                <div style={{position: 'absolute', left: 0, top: 0, width: wHi, height: 50, borderRadius: 8, background: `repeating-linear-gradient(135deg, ${r.color}88 0 14px, ${r.color}33 14px 26px)`, border: `2px dashed ${r.color}`}} />
              ) : null}
              <div style={{position: 'absolute', left: 0, top: 0, width: wLo, height: 50, borderRadius: 8, background: r.color, boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}} />
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  left: labelInside ? undefined : wHi + 16,
                  right: labelInside ? barW - wHi + 14 : undefined,
                  whiteSpace: 'nowrap',
                  fontWeight: 900,
                  fontSize: 34,
                  color: labelInside ? '#0b1824' : GOLD,
                  opacity: ramp(p, a0 + 0.1, a0 + 0.16),
                }}
              >
                {label}
              </div>
            </div>
          </div>
        );
      })}
      {spec.tally
        ? (() => {
            const tl = spec.tally;
            const row = spec.rows[tl.row];
            const value = row.range ? row.range[0] : row.value ?? 0;
            const count = Math.round(value / tl.each);
            const a0 = tl.appear ?? 0.45;
            const y = top + n * rowH + 6;
            const per = Math.min(25, count);
            const size = Math.min(62, 1500 / per);
            return (
              <div style={{position: 'absolute', left: 90, top: y, width: 1740, opacity: easeInOutCubic(ramp(p, a0, a0 + 0.05))}}>
                <div style={{fontWeight: 800, fontSize: 34, color: GOLD, marginBottom: 6}}>
                  = {count} {tl.label}
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, width: 1740}}>
                  {Array.from({length: count}, (_, k) => {
                    const on = easeInOutCubic(ramp(p, a0 + (k / count) * 0.25, a0 + (k / count) * 0.25 + 0.03));
                    return (
                      <div key={k} style={{opacity: on, transform: `translateY(${(1 - on) * 12}px)`}}>
                        <Mini shape={tl.shape} w={size} h={size * 0.8} color="#b8b2a4" t={t} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        : null}
      {spec.source ? (
        <div style={{position: 'absolute', right: 40, top: 40, maxWidth: 760, textAlign: 'right', fontWeight: 600, fontSize: 30, color: '#9fb4c2'}}>Source: {spec.source}</div>
      ) : null}
    </AbsoluteFill>
  );
};
