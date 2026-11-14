// Original side-view silhouettes for the Scale & Science stage (drawn for this studio, no third-party art).
// Each outline is a closed list of [u, v] points: u = 0 (tail / left) … 1 (nose / right) along the measured size,
// v = height in the same unit (up is positive). Swimmers sit on their centre line (v ≈ 0), walkers on the ground (v = 0).
// The measured size is length for animals and vehicles, height for people (`measure`).
// Pure module (no React): tested in packages/engine/test/scale.test.ts.

export type Motion = 'whale' | 'fish' | 'reptile' | 'sauropod' | 'none';
export type Extra =
  | {kind: 'eye'; u: number; v: number; r: number}
  | {kind: 'line'; pts: [number, number][]; w: number; tone: 'dark' | 'light'}
  | {kind: 'disc'; u: number; v: number; r: number; tone: 'dark' | 'light'}
  | {kind: 'rect'; u: number; v: number; w: number; h: number; tone: 'dark' | 'light'};
export type Shape = {
  pts: [number, number][];
  /** separate darker part (far-side fin, flipper, far legs) drawn behind/over the body */
  fins?: [number, number][][];
  extras?: Extra[];
  motion: Motion;
  measure: 'length' | 'height';
  /** silhouette tension 0..1 (lower = sharper corners) */
  tension?: number;
};

const BLUE_WHALE: Shape = {
  motion: 'whale',
  measure: 'length',
  pts: [
    [0.0, 0.012], [0.035, 0.02], [0.065, 0.014], [0.12, 0.022], [0.2, 0.033], [0.235, 0.04], [0.255, 0.058], [0.272, 0.05], [0.29, 0.046],
    [0.4, 0.052], [0.55, 0.058], [0.7, 0.054], [0.82, 0.044], [0.91, 0.03], [0.97, 0.016], [1.0, 0.002],
    [0.992, -0.012], [0.95, -0.032], [0.86, -0.054], [0.74, -0.062], [0.6, -0.06], [0.45, -0.052], [0.3, -0.04], [0.18, -0.026],
    [0.09, -0.016], [0.06, -0.014], [0.03, -0.02], [0.0, -0.008],
  ],
  fins: [[[0.66, -0.055], [0.635, -0.085], [0.61, -0.112], [0.6, -0.108], [0.615, -0.08], [0.625, -0.056]]],
  extras: [
    {kind: 'eye', u: 0.855, v: -0.006, r: 0.004},
    {kind: 'line', pts: [[0.995, -0.006], [0.93, -0.012], [0.86, -0.016]], w: 0.003, tone: 'dark'},
    ...[0, 1, 2, 3].map((i): Extra => ({kind: 'line', pts: [[0.95 - i * 0.004, -0.036 + i * 0.006], [0.66, -0.056 + i * 0.008]], w: 0.0018, tone: 'light'})),
  ],
};

const shark = (depth: number, dorsal: number, tail: number): Shape => ({
  motion: 'fish',
  measure: 'length',
  pts: [
    [0.0, 0.17 * tail], [0.035, 0.11 * tail], [0.085, 0.035], [0.2, 0.05 * depth], [0.36, 0.075 * depth], [0.5, 0.095 * depth],
    [0.53, 0.1 * depth], [0.575, 0.1 * depth + 0.1 * dorsal], [0.6, 0.1 * depth + 0.105 * dorsal], [0.612, 0.1 * depth + 0.08 * dorsal], [0.635, 0.105 * depth],
    [0.76, 0.1 * depth], [0.88, 0.068 * depth], [0.96, 0.036 * depth], [1.0, 0.0],
    [0.985, -0.028 * depth], [0.9, -0.06 * depth], [0.78, -0.085 * depth], [0.62, -0.088 * depth], [0.5, -0.082 * depth], [0.38, -0.066 * depth],
    [0.35, -0.072 * depth], [0.33, -0.1 * depth], [0.315, -0.07 * depth], [0.2, -0.042 * depth], [0.09, -0.03],
    [0.04, -0.09 * tail], [0.008, -0.14 * tail], [0.045, 0.0],
  ],
  fins: [[[0.74, -0.085 * depth], [0.7, -0.15 * depth], [0.665, -0.2 * depth], [0.65, -0.19 * depth], [0.665, -0.12 * depth], [0.69, -0.085 * depth]]],
  extras: [
    {kind: 'eye', u: 0.905, v: 0.03 * depth, r: 0.006},
    {kind: 'line', pts: [[0.985, -0.03 * depth], [0.93, -0.05 * depth], [0.87, -0.045 * depth]], w: 0.004, tone: 'dark'},
    ...[0, 1, 2, 3, 4].map((i): Extra => ({kind: 'line', pts: [[0.8 - i * 0.014, 0.03 * depth], [0.795 - i * 0.014, -0.045 * depth]], w: 0.0035, tone: 'dark'})),
  ],
  tension: 0.42,
});

/** Great white: deep body, tall dorsal. Megalodon (one hypothesis): slimmer, longer, smaller dorsal, bigger head. */
const GREAT_WHITE = shark(2.1, 1.0, 1.0);
const MEGALODON = shark(1.75, 0.8, 0.9);

const PERUCETUS: Shape = {
  motion: 'whale',
  measure: 'length',
  pts: [
    [0.0, 0.01], [0.05, 0.022], [0.09, 0.018], [0.18, 0.06], [0.3, 0.095], [0.45, 0.112], [0.6, 0.11], [0.74, 0.092], [0.84, 0.066],
    [0.9, 0.06], [0.96, 0.045], [1.0, 0.02], [0.99, -0.004], [0.93, -0.02], [0.85, -0.05], [0.72, -0.092], [0.55, -0.108],
    [0.4, -0.1], [0.26, -0.07], [0.15, -0.04], [0.09, -0.02], [0.05, -0.024], [0.0, -0.012],
  ],
  fins: [[[0.78, -0.07], [0.76, -0.12], [0.73, -0.15], [0.715, -0.14], [0.73, -0.1], [0.75, -0.075]]],
  extras: [{kind: 'eye', u: 0.93, v: 0.024, r: 0.006}],
};

const ICHTHYOSAUR: Shape = {
  motion: 'fish',
  measure: 'length',
  pts: [
    [0.0, 0.11], [0.03, 0.07], [0.07, 0.02], [0.18, 0.035], [0.32, 0.06], [0.42, 0.068], [0.45, 0.085], [0.48, 0.09], [0.5, 0.07],
    [0.62, 0.068], [0.74, 0.056], [0.8, 0.044], [0.84, 0.03], [0.9, 0.012], [1.0, 0.004], [1.0, -0.002], [0.9, -0.008],
    [0.82, -0.022], [0.72, -0.05], [0.56, -0.062], [0.4, -0.058], [0.26, -0.04], [0.12, -0.02], [0.07, -0.016], [0.03, -0.06],
    [0.005, -0.09], [0.045, 0.0],
  ],
  fins: [
    [[0.7, -0.05], [0.66, -0.1], [0.62, -0.13], [0.605, -0.12], [0.63, -0.08], [0.66, -0.055]],
    [[0.36, -0.055], [0.33, -0.085], [0.305, -0.095], [0.3, -0.08], [0.32, -0.055]],
  ],
  extras: [{kind: 'eye', u: 0.8, v: 0.012, r: 0.011}],
  tension: 0.45,
};

const SAUROPOD: Shape = {
  motion: 'sauropod',
  measure: 'length',
  pts: [
    [0.0, 0.135], [0.08, 0.16], [0.18, 0.19], [0.3, 0.235], [0.38, 0.26], [0.5, 0.255], [0.6, 0.262], [0.68, 0.29], [0.78, 0.338],
    [0.88, 0.378], [0.94, 0.4], [0.975, 0.404], [1.0, 0.39], [0.992, 0.376], [0.95, 0.37], [0.88, 0.348], [0.78, 0.302],
    [0.7, 0.248], [0.655, 0.2], [0.655, 0.12], [0.66, 0.0], [0.61, 0.0], [0.612, 0.11], [0.58, 0.13], [0.48, 0.125],
    [0.44, 0.115], [0.44, 0.0], [0.385, 0.0], [0.375, 0.11], [0.32, 0.15], [0.2, 0.15], [0.08, 0.142], [0.0, 0.13],
  ],
  // far-side legs, a step out of phase
  fins: [
    [[0.635, 0.16], [0.632, 0.0], [0.6, 0.0], [0.598, 0.14]],
    [[0.42, 0.13], [0.415, 0.0], [0.38, 0.0], [0.385, 0.13]],
  ],
  extras: [{kind: 'eye', u: 0.975, v: 0.392, r: 0.0035}],
  tension: 0.38,
};

const HUMAN: Shape = {
  motion: 'none',
  measure: 'height',
  pts: [
    [0.07, 0.0], [0.122, 0.0], [0.127, 0.45], [0.133, 0.45], [0.138, 0.0], [0.19, 0.0], [0.19, 0.46], [0.214, 0.42], [0.234, 0.44],
    [0.226, 0.78], [0.172, 0.825], [0.147, 0.84], [0.154, 0.875], [0.162, 0.93], [0.13, 0.995], [0.098, 0.93], [0.106, 0.875],
    [0.113, 0.84], [0.088, 0.825], [0.034, 0.78], [0.026, 0.44], [0.046, 0.42], [0.07, 0.46],
  ],
  tension: 0.3,
};

const BUS: Shape = {
  motion: 'none',
  measure: 'length',
  pts: [[0.0, 0.03], [0.0, 0.24], [0.012, 0.267], [0.985, 0.267], [1.0, 0.24], [1.0, 0.03], [0.985, 0.02], [0.015, 0.02]],
  extras: [
    ...[0, 1, 2, 3, 4, 5].map((i): Extra => ({kind: 'rect', u: 0.1 + i * 0.13, v: 0.15, w: 0.105, h: 0.07, tone: 'dark'})),
    {kind: 'rect', u: 0.93, v: 0.06, w: 0.05, h: 0.165, tone: 'dark'},
    {kind: 'disc', u: 0.2, v: 0.042, r: 0.042, tone: 'dark'},
    {kind: 'disc', u: 0.75, v: 0.042, r: 0.042, tone: 'dark'},
  ],
  tension: 0.0,
};

const ELEPHANT: Shape = {
  motion: 'none',
  measure: 'length',
  pts: [
    [0.0, 0.42], [0.05, 0.6], [0.2, 0.7], [0.45, 0.72], [0.6, 0.68], [0.68, 0.74], [0.8, 0.76], [0.9, 0.68], [0.95, 0.52],
    [0.98, 0.3], [1.0, 0.12], [0.96, 0.1], [0.94, 0.3], [0.88, 0.42], [0.82, 0.4], [0.8, 0.0], [0.68, 0.0], [0.67, 0.3],
    [0.33, 0.3], [0.32, 0.0], [0.2, 0.0], [0.18, 0.32], [0.05, 0.38],
  ],
  extras: [{kind: 'eye', u: 0.86, v: 0.6, r: 0.02}],
  tension: 0.4,
};

const COURT: Shape = {
  motion: 'none',
  measure: 'length',
  pts: [[0, 0], [0, 0.012], [1, 0.012], [1, 0]],
  extras: [{kind: 'rect', u: 0.497, v: 0.0, w: 0.006, h: 0.012, tone: 'light'}],
  tension: 0,
};

export const SHAPES = {
  blueWhale: BLUE_WHALE,
  greatWhite: GREAT_WHITE,
  megalodon: MEGALODON,
  perucetus: PERUCETUS,
  ichthyosaur: ICHTHYOSAUR,
  sauropod: SAUROPOD,
  human: HUMAN,
  bus: BUS,
  elephant: ELEPHANT,
  court: COURT,
} satisfies Record<string, Shape>;
export type ShapeKey = keyof typeof SHAPES;

/** Placement in pixels: (x, y) = where u = 0, v = 0 lands; len = measured size in px; t = seconds (motion). */
export type Place = {x: number; y: number; len: number; t: number; flip?: boolean; phase?: number};

/** Body motion in shape units: whales beat the tail up/down, fish sweep it (seen side-on: small pitch), sauropods sway. */
export const deform = (motion: Motion, u: number, v: number, t: number, phase = 0): [number, number] => {
  const w = 2 * Math.PI * t;
  switch (motion) {
    case 'whale': {
      const k = Math.max(0, 0.55 - u) / 0.55;
      return [u, v + 0.03 * k * k * Math.sin(w * 0.32 - u * 5 + phase)];
    }
    case 'fish':
    case 'reptile': {
      const k = Math.max(0, 0.45 - u) / 0.45;
      return [u + 0.006 * k * Math.sin(w * 0.55 + phase), v * (1 - 0.1 * k * k * (0.5 + 0.5 * Math.sin(w * 0.55 + phase))) + 0.008 * k * k * Math.sin(w * 0.55 + phase + 1)];
    }
    case 'sauropod': {
      if (u > 0.64 && v > 0.15) {
        const a = 0.035 * Math.sin(w * 0.12 + phase) * ((u - 0.64) / 0.36);
        const du = u - 0.64;
        const dv = v - 0.25;
        return [0.64 + du * Math.cos(a) - dv * Math.sin(a), 0.25 + du * Math.sin(a) + dv * Math.cos(a)];
      }
      if (u < 0.32 && v > 0.1) return [u, v + 0.02 * ((0.32 - u) / 0.32) ** 2 * Math.sin(w * 0.2 + phase)];
      return [u, v];
    }
    default:
      return [u, v];
  }
};

/** Shape point → pixel. */
export const toPx = (s: Shape, u: number, v: number, pl: Place): [number, number] => {
  const [du, dv] = deform(s.motion, u, v, pl.t, pl.phase);
  const x = pl.flip ? pl.x + (1 - du) * pl.len : pl.x + du * pl.len;
  return [x, pl.y - dv * pl.len];
};

/** Closed cardinal-spline path through the points (tension 0 = straight polygon). */
export const smoothPath = (p: [number, number][], tension = 0.5): string => {
  const n = p.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const k = tension / 6 / 0.5;
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) * k * 0.5, p1[1] + (p2[1] - p0[1]) * k * 0.5];
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) * k * 0.5, p2[1] - (p3[1] - p1[1]) * k * 0.5];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d} Z`;
};

export const pathFor = (s: Shape, pl: Place, pts = s.pts): string => smoothPath(pts.map(([u, v]) => toPx(s, u, v, pl)), s.tension ?? 0.5);

/** Height of a shape above its baseline, in shape units (for bracket / label placement). */
export const topOf = (s: Shape): number => Math.max(...s.pts.map((q) => q[1]));
export const bottomOf = (s: Shape): number => Math.min(...s.pts.map((q) => q[1]));
export const widthOf = (s: Shape): number => Math.max(...s.pts.map((q) => q[0])) - Math.min(...s.pts.map((q) => q[0]));
