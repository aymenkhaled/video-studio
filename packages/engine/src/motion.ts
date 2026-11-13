import {random} from 'remotion';

// Motion standard helpers. All motion is eased and frame-derived (deterministic).

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const easeInOutCubic = (v: number) => {
  const t = clamp01(v);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const smoothstep = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/** 0→1 progress between times a and b (seconds), unclamped input, clamped output. */
export const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export const mix = (a: number, b: number, v: number) => a + (b - a) * v;

/**
 * Slow organic drift so nothing is ever static: sum of two sines with
 * seeded phase. `seed` keeps layers independent; `amp` in px (or units).
 */
export const drift = (t: number, seed: number, amp: number, period = 9) => {
  const p1 = random(`drift-a-${seed}`) * Math.PI * 2;
  const p2 = random(`drift-b-${seed}`) * Math.PI * 2;
  return amp * (0.7 * Math.sin((2 * Math.PI * t) / period + p1) + 0.3 * Math.sin((2 * Math.PI * t) / (period * 0.43) + p2));
};

/** Exponential impact decay starting at `at` seconds (camera shake, flashes). */
export const impulse = (t: number, at: number, k = 9) => (t < at ? 0 : Math.exp(-(t - at) * k));
