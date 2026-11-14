// Pure helpers for the Scale & Science stage: metric + imperial labels, ranges, metre-grid steps, camera.
// No React, no Remotion: unit-tested in packages/engine/test/scale.test.ts.

export const FT_PER_M = 3.28084;
export const LB_PER_T = 2204.62;
export const US_TON_PER_T = 1.10231;

const round = (v: number) => (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10); // never round a sourced value to a "nicer" one
const fmt = (v: number) => {
  const r = round(v);
  return r >= 1000 ? r.toLocaleString('en-US') : String(r);
};

/** "30 m · 98 ft", "1.75 m · 5.7 ft"; ranges "16–24 m · 52–79 ft". */
export const lengthLabel = (m: number | [number, number]): string => {
  if (Array.isArray(m)) {
    const [a, b] = m;
    return `${fmt(a)}–${fmt(b)} m · ${fmt(a * FT_PER_M)}–${fmt(b * FT_PER_M)} ft`;
  }
  return `${m < 10 && m !== Math.round(m) ? m : fmt(m)} m · ${fmt(m * FT_PER_M)} ft`;
};

/** "150 t · 165 US tons"; ranges "60–114 t · 66–126 US tons". */
export const massLabel = (t: number | [number, number]): string => {
  if (Array.isArray(t)) return `${fmt(t[0])}–${fmt(t[1])} t · ${fmt(t[0] * US_TON_PER_T)}–${fmt(t[1] * US_TON_PER_T)} US tons`;
  return `${fmt(t)} t · ${fmt(t * US_TON_PER_T)} US tons`;
};

/** Metre-grid spacing for a zoom level: thin lines never closer than `minPx`, bold lines every 5 steps. */
export const gridStep = (pxPerM: number, minPx = 18): number => {
  for (const s of [1, 2, 5, 10, 20, 50, 100]) if (s * pxPerM >= minPx) return s;
  return 200;
};

export type ScaleCam = {at: number; x: number; width: number};

/** Camera at progress p: centre x (m) and visible width (m), eased between keys; zoom eases in log space. */
export const scaleCamAt = (keys: ScaleCam[], p: number): {x: number; width: number} => {
  if (keys.length === 1) return {x: keys[0].x, width: keys[0].width};
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].at) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const u = Math.max(0, Math.min(1, (p - a.at) / Math.max(1e-6, b.at - a.at)));
  const k = u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
  return {x: a.x + (b.x - a.x) * k, width: Math.exp(Math.log(a.width) + (Math.log(b.width) - Math.log(a.width)) * k)};
};

/** How many of a reference fit into a value: 150 t / 6 t → 25 ("as heavy as 25 elephants"). */
export const howMany = (value: number, ref: number): number => Math.round(value / ref);
