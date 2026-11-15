// Fly-to camera (PLAYBOOK 5.1, trick #12): van Wijk & Nuij "smooth and efficient zooming and panning" (2003),
// the same path d3.interpolateZoom uses — zoom out while travelling, then zoom back in, as one continuous move.
// Pure functions (no React) so they are unit-tested in packages/engine/test.

export type View = {cx: number; cy: number; w: number};

/** Interpolator between two views (centre x/y in any planar unit, w = visible width in the same unit). */
export const flyPath = (a: View, b: View, rho = Math.SQRT2): ((t: number) => View) => {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const d2 = dx * dx + dy * dy;
  const r2 = rho * rho;
  if (d2 < 1e-12) {
    // pure zoom: geometric in width
    const S = Math.log(b.w / a.w) / rho;
    return (t) => ({cx: a.cx, cy: a.cy, w: a.w * Math.exp(rho * t * S)});
  }
  const d1 = Math.sqrt(d2);
  const b0 = (b.w * b.w - a.w * a.w + r2 * r2 * d2) / (2 * a.w * r2 * d1);
  const b1 = (b.w * b.w - a.w * a.w - r2 * r2 * d2) / (2 * b.w * r2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / rho;
  return (t) => {
    const s = t * S;
    const coshr0 = Math.cosh(r0);
    const u = (a.w / (r2 * d1)) * (coshr0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
    return {cx: a.cx + u * dx, cy: a.cy + u * dy, w: (a.w * coshr0) / Math.cosh(rho * s + r0)};
  };
};

/** Fly between two map cameras given as lon/lat centre + zoom (zoom ∝ 1 / visible width). */
export const flyCamera = (
  a: {center: [number, number]; zoom: number},
  b: {center: [number, number]; zoom: number},
  k: number,
): {center: [number, number]; zoom: number} => {
  // Work in equirectangular degrees; at the scales we fly (country ↔ continent) this keeps the arc honest.
  const path = flyPath({cx: a.center[0], cy: a.center[1], w: 360 / a.zoom}, {cx: b.center[0], cy: b.center[1], w: 360 / b.zoom});
  const v = path(Math.min(1, Math.max(0, k)));
  return {center: [v.cx, v.cy], zoom: 360 / v.w};
};
