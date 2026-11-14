// Pure, import-free helpers for the chart engine and choropleths (tested with `npm test`).

export type NumFmt = {prefix?: string; suffix?: string; decimals?: number; compact?: boolean};

/** 107702 → "$107,702"; compact: 120000 → "$120k", 2.4e9 → "2.4 bn". */
export const fmtValue = (v: number, f: NumFmt = {}): string => {
  const d = f.decimals ?? 0;
  let body: string;
  if (f.compact && Math.abs(v) >= 1e9) body = `${(v / 1e9).toLocaleString('en-US', {maximumFractionDigits: 1})} bn`;
  else if (f.compact && Math.abs(v) >= 1e6) body = `${(v / 1e6).toLocaleString('en-US', {maximumFractionDigits: 1})} m`;
  else if (f.compact && Math.abs(v) >= 1e4) body = `${Math.round(v / 1e3).toLocaleString('en-US')}k`;
  else body = v.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
  return `${f.prefix ?? ''}${body}${f.suffix ?? ''}`;
};

/** Round axis ticks from lo to ≥ hi with about n steps (1/2/2.5/5 × 10^k). */
export const niceTicks = (lo: number, hi: number, n = 5): number[] => {
  const span = Math.max(1e-9, hi - lo);
  const raw = span / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const start = Math.floor(lo / step) * step;
  const out: number[] = [];
  for (let v = start; v < hi + step * 0.999; v += step) out.push(Math.round(v * 1e6) / 1e6);
  return out;
};

/** Stacked 100 % bar: normalised start/size per segment. */
export const shareSegments = (values: number[]): {start: number; size: number}[] => {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  return values.map((v) => {
    const s = {start: acc / total, size: v / total};
    acc += v;
    return s;
  });
};

/** Grid of `count` icons inside w×h; icon pitch shrinks until it fits (scale relative to `pitch`). */
export const pictogramLayout = (count: number, w: number, h: number, pitch = 34): {cells: {x: number; y: number}[]; scale: number} => {
  let s = pitch;
  let cols = Math.max(1, Math.floor(w / s));
  while (Math.ceil(count / cols) * s > h && s > 6) {
    s *= 0.9;
    cols = Math.max(1, Math.floor(w / s));
  }
  const cells = Array.from({length: count}, (_, k) => ({x: (k % cols) * s + s / 2, y: Math.floor(k / cols) * s + s / 2}));
  return {cells, scale: s / pitch};
};

/** Class index of value v for ascending breaks [b1, b2, …]: v < b1 → 0, b1 ≤ v < b2 → 1, … */
export const classify = (v: number, breaks: number[]): number => {
  let k = 0;
  while (k < breaks.length && v >= breaks[k]) k++;
  return k;
};
