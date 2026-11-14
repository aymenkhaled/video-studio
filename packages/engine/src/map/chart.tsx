import React from 'react';
import {clamp01, easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';
import {CINZEL} from './map';
import {fmtValue, niceTicks, pictogramLayout, shareSegments} from './chart-logic';

// Chart engine (Money & Maps): animated bar / line / share / proportional-area charts and "1 icon = N" pictograms.
// Every value is a pure function of scene progress p, so charts follow the voice timing like maps do.
// Layout keeps clear of the Clarity Kit chrome: chapter tracker (top-left), captions (bottom 360 px).
// Colours: Okabe–Ito based (colour-blind safe); highlights also get a bold label + outline (second cue).

export const CB = {
  swiss: '#d6402f', // Switzerland (red, always with a label)
  blue: '#3f8fd0',
  sky: '#7cc4ef',
  orange: '#e69f00',
  green: '#2a9d77',
  yellow: '#f0e442',
  grey: '#9aa3ad',
  ink: '#16212c',
  paper: '#f4efe4',
} as const;

export type Num = {prefix?: string; suffix?: string; decimals?: number; compact?: boolean};

export type BarDatum = {label: string; value: number; color?: string; highlight?: boolean; note?: string};
export type LineSeries = {name: string; color: string; points: [number, number][]; highlight?: boolean};
export type ShareSeg = {label: string; value: number; color: string};
export type AreaDatum = {label: string; value: number; color: string; note?: string};
export type PictoGroup = {label: string; count: number; color: string};
export type PictoIcon = 'person' | 'watch' | 'coin' | 'box' | 'pill';

export type ChartSpec = {
  title: string;
  /** units + year, always shown: "GDP per person, 2024 US$" */
  unit: string;
  /** "World Bank, 2024" */
  source: string;
  /** first chart of a kind: one plain line on how to read it */
  howTo?: string;
  num?: Num;
} & (
  | {type: 'bar'; bars: BarDatum[]; max?: number}
  | {type: 'line'; series: LineSeries[]; x: [number, number]; y?: [number, number]; events?: {x: number; label: string}[]}
  | {type: 'share'; segments: ShareSeg[]; total?: string}
  | {type: 'area'; items: AreaDatum[]}
  | {type: 'pictogram'; icon: PictoIcon; per: string; groups: PictoGroup[]}
);

const BG = '#101b26';
const PANEL = {left: 150, right: 1770, top: 230, bottom: 700};

const Icon: React.FC<{kind: PictoIcon; x: number; y: number; s: number; color: string; a: number}> = ({kind, x, y, s, color, a}) => {
  const t = `translate(${x},${y}) scale(${s * (0.6 + 0.4 * a)})`;
  const o = clamp01(a);
  switch (kind) {
    case 'person':
      return (
        <g transform={t} opacity={o} fill={color}>
          <circle cx={0} cy={-9} r={5.2} />
          <path d="M-8 12 L-8 0 Q-8 -3 -5 -3 L5 -3 Q8 -3 8 0 L8 12 Z" />
        </g>
      );
    case 'watch':
      return (
        <g transform={t} opacity={o}>
          <rect x={-4} y={-14} width={8} height={28} rx={2} fill={color} opacity={0.7} />
          <circle cx={0} cy={0} r={9} fill={color} />
          <circle cx={0} cy={0} r={6} fill={BG} />
          <path d="M0 0 L0 -4.5 M0 0 L3.5 1.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      );
    case 'coin':
      return (
        <g transform={t} opacity={o}>
          <circle cx={0} cy={0} r={10} fill={color} />
          <circle cx={0} cy={0} r={7} fill="none" stroke={BG} strokeOpacity={0.35} strokeWidth={1.5} />
        </g>
      );
    case 'pill':
      return (
        <g transform={`${t} rotate(-35)`} opacity={o}>
          <rect x={-11} y={-5} width={22} height={10} rx={5} fill={color} />
          <rect x={0} y={-5} width={11} height={10} rx={5} fill="#ffffff" opacity={0.55} />
        </g>
      );
    default:
      return (
        <g transform={t} opacity={o}>
          <rect x={-10} y={-8} width={20} height={16} rx={2} fill={color} />
          <path d="M-10 -2 L10 -2" stroke={BG} strokeOpacity={0.4} strokeWidth={1.5} />
        </g>
      );
  }
};

const Frame: React.FC<{spec: ChartSpec; p: number; width: number; height: number; elapsed: number; children: React.ReactNode}> = ({spec, p, width, height, elapsed, children}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.08));
  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0, background: BG}}>
      <defs>
        <pattern id="chart-grid" width={60} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(${-8 * elapsed} ${-3 * elapsed})`}>
          <path d="M60 0 L0 0 0 60" fill="none" stroke="rgba(244,239,228,0.05)" strokeWidth={1.5} />
        </pattern>
        <radialGradient id="chart-vig" cx="50%" cy="45%" r="75%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </radialGradient>
      </defs>
      {/* living background: slow drifting grid, never a frozen frame */}
      <rect width={width} height={height} fill="url(#chart-grid)" />
      <g opacity={a}>
        <text x={PANEL.left} y={150} fontFamily={CINZEL} fontWeight={700} fontSize={50} fill={CB.paper}>
          {spec.title}
        </text>
        <text x={PANEL.left} y={196} fontFamily={INTER} fontWeight={600} fontSize={30} fill="rgba(244,239,228,0.72)">
          {spec.unit}
        </text>
        <text x={width - 60} y={196} textAnchor="end" fontFamily={INTER} fontWeight={600} fontSize={26} fill="rgba(244,239,228,0.6)">
          Source: {spec.source}
        </text>
        {spec.howTo ? (
          <g opacity={easeInOutCubic(ramp(p, 0.04, 0.12))}>
            <rect x={width - 60 - Math.min(760, spec.howTo.length * 15.5 + 40)} y={52} width={Math.min(760, spec.howTo.length * 15.5 + 40)} height={52} rx={10} fill="rgba(240,228,66,0.14)" stroke="rgba(240,228,66,0.6)" />
            <text x={width - 80} y={87} textAnchor="end" fontFamily={INTER} fontWeight={700} fontSize={27} fill={CB.yellow}>
              How to read: {spec.howTo}
            </text>
          </g>
        ) : null}
      </g>
      {children}
      <rect width={width} height={height} fill="url(#chart-vig)" pointerEvents="none" />
    </svg>
  );
};

const Bars: React.FC<{spec: Extract<ChartSpec, {type: 'bar'}>; p: number}> = ({spec, p}) => {
  const n = spec.bars.length;
  const max = spec.max ?? Math.max(...spec.bars.map((b) => b.value));
  const rowH = Math.min(96, (PANEL.bottom - PANEL.top - 20) / n);
  const labelW = 360;
  const x0 = PANEL.left + labelW;
  const w = PANEL.right - x0 - 260;
  return (
    <g>
      {spec.bars.map((b, i) => {
        const g = easeInOutCubic(ramp(p, 0.1 + i * 0.06, 0.45 + i * 0.06));
        const y = PANEL.top + 30 + i * rowH;
        const bw = Math.max(4, (w * b.value * g) / max);
        const col = b.color ?? (b.highlight ? CB.swiss : CB.blue);
        const shown = easeInOutCubic(ramp(p, 0.05 + i * 0.06, 0.15 + i * 0.06));
        return (
          <g key={b.label} opacity={shown}>
            <text x={x0 - 24} y={y + rowH * 0.42 + 12} textAnchor="end" fontFamily={INTER} fontWeight={b.highlight ? 800 : 600} fontSize={b.highlight ? 40 : 36} fill={b.highlight ? '#ffffff' : 'rgba(244,239,228,0.88)'}>
              {b.label}
            </text>
            <rect x={x0} y={y} width={bw} height={rowH * 0.7} rx={6} fill={col} stroke={b.highlight ? '#ffffff' : 'none'} strokeWidth={b.highlight ? 3 : 0} />
            <text x={x0 + bw + 18} y={y + rowH * 0.42 + 12} fontFamily={INTER} fontWeight={800} fontSize={b.highlight ? 42 : 36} fill={b.highlight ? '#ffffff' : 'rgba(244,239,228,0.9)'}>
              {fmtValue(b.value * g, spec.num)}
            </text>
            {b.note ? (
              <text x={x0 + 4} y={y + rowH * 0.7 + 30} fontFamily={INTER} fontWeight={600} fontSize={26} fill="rgba(244,239,228,0.66)" opacity={easeInOutCubic(ramp(p, 0.5, 0.6))}>
                {b.note}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

const Lines: React.FC<{spec: Extract<ChartSpec, {type: 'line'}>; p: number}> = ({spec, p}) => {
  const all = spec.series.flatMap((s) => s.points.map((q) => q[1]));
  const ticks = niceTicks(spec.y?.[0] ?? 0, spec.y?.[1] ?? Math.max(...all), 5);
  const ymax = ticks[ticks.length - 1];
  const L = PANEL.left + 170;
  const R = PANEL.right - 240;
  const T = PANEL.top + 20;
  const B = PANEL.bottom + 10;
  const sx = (x: number) => L + ((x - spec.x[0]) / (spec.x[1] - spec.x[0])) * (R - L);
  const sy = (y: number) => B - (y / ymax) * (B - T);
  const reveal = easeInOutCubic(ramp(p, 0.08, 0.75));
  const xNow = mix(spec.x[0], spec.x[1], reveal);
  const years = niceTicks(spec.x[0], spec.x[1], 6).filter((x) => x >= spec.x[0] && x <= spec.x[1]);
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={R} y1={sy(t)} y2={sy(t)} stroke="rgba(244,239,228,0.12)" strokeWidth={2} />
          <text x={L - 18} y={sy(t) + 10} textAnchor="end" fontFamily={INTER} fontWeight={600} fontSize={28} fill="rgba(244,239,228,0.7)">
            {fmtValue(t, {...spec.num, compact: true})}
          </text>
        </g>
      ))}
      {years.map((x) => (
        <text key={x} x={sx(x)} y={B + 42} textAnchor="middle" fontFamily={INTER} fontWeight={600} fontSize={28} fill="rgba(244,239,228,0.7)">
          {x}
        </text>
      ))}
      {(spec.events ?? []).map((e) => (
        <g key={e.label} opacity={xNow >= e.x ? 1 : 0}>
          <line x1={sx(e.x)} x2={sx(e.x)} y1={T} y2={B} stroke="rgba(240,228,66,0.5)" strokeDasharray="6 8" strokeWidth={2} />
          <text x={sx(e.x) + 10} y={T + 30} fontFamily={INTER} fontWeight={700} fontSize={27} fill={CB.yellow}>
            {e.label}
          </text>
        </g>
      ))}
      {spec.series.map((s) => {
        const pts = s.points.filter((q) => q[0] <= xNow);
        const prev = s.points.filter((q) => q[0] <= xNow).slice(-1)[0];
        const next = s.points.find((q) => q[0] > xNow);
        if (prev && next) pts.push([xNow, mix(prev[1], next[1], (xNow - prev[0]) / (next[0] - prev[0]))]);
        if (pts.length < 2) return null;
        const d = pts.map((q, k) => `${k ? 'L' : 'M'}${sx(q[0]).toFixed(1)} ${sy(q[1]).toFixed(1)}`).join(' ');
        const tip = pts[pts.length - 1];
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={s.highlight ? 9 : 6} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={sx(tip[0])} cy={sy(tip[1])} r={s.highlight ? 11 : 8} fill={s.color} stroke="#fff" strokeWidth={3} />
            <text x={sx(tip[0]) + 20} y={sy(tip[1]) - 8} fontFamily={INTER} fontWeight={800} fontSize={s.highlight ? 36 : 32} fill={s.color}>
              {s.name}
            </text>
            <text x={sx(tip[0]) + 20} y={sy(tip[1]) + 28} fontFamily={INTER} fontWeight={700} fontSize={30} fill="#ffffff">
              {fmtValue(tip[1], spec.num)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const Share: React.FC<{spec: Extract<ChartSpec, {type: 'share'}>; p: number}> = ({spec, p}) => {
  const segs = shareSegments(spec.segments.map((s) => s.value));
  const L = PANEL.left;
  const W = PANEL.right - PANEL.left;
  const y = PANEL.top + 120;
  const h = 150;
  return (
    <g>
      {spec.segments.map((s, i) => {
        const g = easeInOutCubic(ramp(p, 0.1 + i * 0.12, 0.4 + i * 0.12));
        const x = L + segs[i].start * W;
        const w = segs[i].size * W * g;
        const big = segs[i].size > 0.12;
        return (
          <g key={s.label}>
            <rect x={x} y={y} width={Math.max(0, w - 4)} height={h} fill={s.color} rx={i === 0 ? 10 : 0} />
            {big ? (
              <text x={x + 24} y={y + 92} fontFamily={INTER} fontWeight={800} fontSize={54} fill={CB.ink} opacity={g}>
                {Math.round(s.value * g)}%
              </text>
            ) : null}
            <text x={big ? x + 24 : x + w / 2} textAnchor={big ? 'start' : 'middle'} y={y + h + 54 + (big ? 0 : 50)} fontFamily={INTER} fontWeight={700} fontSize={34} fill={s.color} opacity={g}>
              {big ? s.label : `${s.label} ${s.value}%`}
            </text>
          </g>
        );
      })}
      {spec.total ? (
        <text x={L} y={y - 30} fontFamily={INTER} fontWeight={700} fontSize={32} fill="rgba(244,239,228,0.8)">
          {spec.total}
        </text>
      ) : null}
    </g>
  );
};

const Areas: React.FC<{spec: Extract<ChartSpec, {type: 'area'}>; p: number}> = ({spec, p}) => {
  const max = Math.max(...spec.items.map((i) => i.value));
  const side = 380; // px for the biggest square
  const gap = 90;
  const sizes = spec.items.map((i) => side * Math.sqrt(i.value / max));
  const total = sizes.reduce((a, b) => a + b, 0) + gap * (sizes.length - 1);
  let x = (PANEL.left + PANEL.right) / 2 - total / 2;
  const base = PANEL.bottom - 10;
  return (
    <g>
      {spec.items.map((it, i) => {
        const g = easeInOutCubic(ramp(p, 0.1 + i * 0.15, 0.45 + i * 0.15));
        const s = sizes[i] * g;
        const cx = x + sizes[i] / 2;
        x += sizes[i] + gap;
        return (
          <g key={it.label}>
            <rect x={cx - s / 2} y={base - s} width={s} height={s} fill={it.color} rx={6} />
            <text x={cx} y={base - sizes[i] - 64} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={40} fill="#fff" opacity={g}>
              {fmtValue(it.value * g, spec.num)}
            </text>
            <text x={cx} y={base - sizes[i] - 22} textAnchor="middle" fontFamily={INTER} fontWeight={700} fontSize={32} fill={it.color} opacity={g}>
              {it.label}
            </text>
            {it.note ? (
              <text x={cx} y={base + 40} textAnchor="middle" fontFamily={INTER} fontWeight={600} fontSize={26} fill="rgba(244,239,228,0.7)" opacity={g}>
                {it.note}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

const Pictogram: React.FC<{spec: Extract<ChartSpec, {type: 'pictogram'}>; p: number}> = ({spec, p}) => {
  const rows = spec.groups.length;
  const rowH = (PANEL.bottom - PANEL.top - 40) / rows;
  return (
    <g>
      <text x={PANEL.right} y={PANEL.top + 6} textAnchor="end" fontFamily={INTER} fontWeight={700} fontSize={30} fill={CB.yellow}>
        1 icon = {spec.per}
      </text>
      {spec.groups.map((g, gi) => {
        const lay = pictogramLayout(g.count, PANEL.right - PANEL.left - 380, rowH - 20, 34);
        const y0 = PANEL.top + 40 + gi * rowH;
        const start = 0.08 + gi * 0.3;
        return (
          <g key={g.label}>
            <text x={PANEL.left} y={y0 + rowH / 2} fontFamily={INTER} fontWeight={800} fontSize={38} fill={g.color} opacity={easeInOutCubic(ramp(p, start - 0.05, start))}>
              {g.label}
            </text>
            {lay.cells.map((c, k) => {
              // icons pop in one after another (small count-up feel), capped so big counts still finish in time
              const at = start + (k / Math.max(1, lay.cells.length)) * 0.22;
              const a = clamp01((p - at) / 0.04);
              return <Icon key={k} kind={spec.icon} x={PANEL.left + 380 + c.x} y={y0 + c.y + 20} s={lay.scale} color={g.color} a={a} />;
            })}
            <text x={PANEL.left} y={y0 + rowH / 2 + 44} fontFamily={INTER} fontWeight={700} fontSize={30} fill="rgba(244,239,228,0.8)" opacity={easeInOutCubic(ramp(p, start + 0.2, start + 0.26))}>
              {g.count} icons
            </text>
          </g>
        );
      })}
    </g>
  );
};

export const ChartShot: React.FC<{spec: ChartSpec; p: number; width: number; height: number; elapsed?: number}> = ({spec, p, width, height, elapsed = 0}) => (
  <Frame spec={spec} p={p} width={width} height={height} elapsed={elapsed}>
    {spec.type === 'bar' ? <Bars spec={spec} p={p} /> : null}
    {spec.type === 'line' ? <Lines spec={spec} p={p} /> : null}
    {spec.type === 'share' ? <Share spec={spec} p={p} /> : null}
    {spec.type === 'area' ? <Areas spec={spec} p={p} /> : null}
    {spec.type === 'pictogram' ? <Pictogram spec={spec} p={p} /> : null}
  </Frame>
);
