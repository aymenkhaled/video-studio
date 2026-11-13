import React from 'react';
import * as THREE from 'three';
import {loadFont} from '@remotion/google-fonts/Inter';
import {clamp01, easeInOutCubic} from './motion';

// 2D overlays that sit on top of a 3D shot: world→screen projection, labels, brackets, counters, captions.

export const {fontFamily: INTER} = loadFont('normal', {weights: ['500', '700', '800'], subsets: ['latin']});

export type Cam = {pos: [number, number, number]; target: [number, number, number]; fov: number};

const projCam = new THREE.PerspectiveCamera();
const v = new THREE.Vector3();
/** Projects a world point with the same camera the 3D shot uses. Returns px and whether it's in front. */
export const project = (cam: Cam, p: [number, number, number], width: number, height: number) => {
  projCam.fov = cam.fov;
  projCam.aspect = width / height;
  projCam.near = 0.1;
  projCam.far = 1000;
  projCam.position.set(...cam.pos);
  projCam.lookAt(...cam.target);
  projCam.updateProjectionMatrix();
  projCam.updateMatrixWorld(true);
  v.set(...p).project(projCam);
  return {x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height, visible: v.z < 1};
};

const shadow = '0 3px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)';

/** Pill label anchored above a projected point, with a short leader line. */
export const Label: React.FC<{x: number; y: number; text: string; sub?: string; appear: number; color?: string}> = ({x, y, text, sub, appear, color = '#f2c14e'}) => {
  const a = easeInOutCubic(clamp01(appear));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) translateY(${(1 - a) * 20}px)`, opacity: a, textAlign: 'center', fontFamily: INTER}}>
      <div style={{background: 'rgba(14,16,20,0.82)', border: `3px solid ${color}`, borderRadius: 14, padding: '8px 18px', color: '#fff', fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap'}}>
        {text}
        {sub ? <div style={{fontSize: 24, fontWeight: 500, opacity: 0.8}}>{sub}</div> : null}
      </div>
      <div style={{width: 4, height: 46, background: color, margin: '0 auto'}} />
    </div>
  );
};

/** Horizontal measuring bracket between two projected points; the bar draws in with `progress` and shows a live counter. */
export const Bracket: React.FC<{a: {x: number; y: number}; b: {x: number; y: number}; progress: number; value: number; unit?: string; decimals?: number; color?: string; label?: string}> = ({
  a,
  b,
  progress,
  value,
  unit = 'm',
  decimals = 1,
  color = '#f2c14e',
  label,
}) => {
  const p = easeInOutCubic(clamp01(progress));
  if (p <= 0) return null;
  const ex = a.x + (b.x - a.x) * p;
  const ey = a.y + (b.y - a.y) * p;
  const mx = (a.x + ex) / 2;
  const my = (a.y + ey) / 2;
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return (
    <>
      <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
        <line x1={a.x} y1={a.y} x2={ex} y2={ey} stroke={color} strokeWidth={7} strokeLinecap="round" />
        <line x1={a.x} y1={a.y - 26} x2={a.x} y2={a.y + 26} stroke={color} strokeWidth={7} strokeLinecap="round" />
        {p > 0.98 ? <line x1={b.x} y1={b.y - 26} x2={b.x} y2={b.y + 26} stroke={color} strokeWidth={7} strokeLinecap="round" /> : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: mx,
          top: my,
          transform: `translate(-50%, -125%) rotate(${Math.abs(ang) < 35 ? ang : 0}deg)`,
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 64,
          color: '#fff',
          textShadow: shadow,
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {(value * p).toFixed(decimals)} {unit}
        {label ? <span style={{fontSize: 30, fontWeight: 600, marginLeft: 12, color}}>{label}</span> : null}
      </div>
    </>
  );
};

export type TimedWord = {w: string; t: number; end: number};
export type TimedLine = {id: string; t: number; duration: number; text: string; words: TimedWord[]};

/** Word-by-word captions: the current line, current word highlighted. Kept above the Shorts UI zone. */
export const Captions: React.FC<{lines: TimedLine[]; t: number; top?: number}> = ({lines, t, top = 1180}) => {
  const line = lines.find((l) => t >= l.t - 0.05 && t <= l.t + l.duration + 0.25);
  if (!line) return null;
  const pop = easeInOutCubic(clamp01((t - line.t + 0.05) / 0.18));
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 66, lineHeight: 1.18, color: '#fff', textShadow: shadow, transform: `scale(${0.94 + 0.06 * pop})`, opacity: pop}}>
      {line.words.map((w, i) => (
        <span key={i} style={{color: t >= w.t && t < w.end + 0.05 ? '#f2c14e' : '#fff'}}>
          {w.w}{' '}
        </span>
      ))}
    </div>
  );
};

/** Fallback timings when the soundtrack hasn't been generated (local preview): even word spread over the slot. */
export const linesFromTimeline = (lines: {id: string; t: number; until: number; text: string}[]): TimedLine[] =>
  lines.map((l) => {
    const words = l.text.split(/\s+/);
    const d = (l.until - l.t) * 0.9;
    return {id: l.id, t: l.t, duration: d, text: l.text, words: words.map((w, i) => ({w, t: l.t + (d * i) / words.length, end: l.t + (d * (i + 1)) / words.length}))};
  });

/** Series tag + progress bar (top). */
export const SeriesHud: React.FC<{tag: string; progress: number}> = ({tag, progress}) => (
  <>
    <div style={{position: 'absolute', left: 70, top: 120, fontFamily: INTER, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: '#111', background: '#f2c14e', padding: '8px 18px', borderRadius: 8}}>{tag}</div>
    <div style={{position: 'absolute', left: 70, right: 70, top: 92, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.25)'}}>
      <div style={{width: `${clamp01(progress) * 100}%`, height: '100%', borderRadius: 4, background: '#f2c14e'}} />
    </div>
  </>
);
