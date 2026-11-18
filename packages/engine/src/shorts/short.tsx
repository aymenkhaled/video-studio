import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, easeInOutCubic, ramp} from '../motion';
import {INTER, TimedLine} from '../overlay';
import {Scene, SceneDef, SceneTime} from '../map/episode';
import {Cue, captionCues, numeralize} from '../map/clarity-logic';

// Vertical promo Short player (1080×1920). A Short = its own timeline.json (voice-first narration, scene ids s1…sN)
// + one ShortShot per scene. Shots reuse the long episode's SceneDefs: art / map / battle / custom render natively at
// 1080×1920; fixed 16:9 stages (scale, compare, deeptime, chart) are rendered at 1920×1080 and cropped to fill the
// frame with a slow pan (no letterbox); 'vbars' is a vertical-native bar chart for money/number moments.
// Safe zone (YouTube Shorts UI): nothing key below y 1500 or right of x 960. Key content lives in x 60–960, y 170–1470.

export type VBar = {label: string; value: number; valueText: string; color?: string; highlight?: boolean; note?: string};
export type VBarsSpec = {title: string; unit: string; bars: VBar[]; max?: number};

export type ShortShot = {
  scene?: SceneDef;
  vbars?: VBarsSpec;
  /** native = scene drawn at 1080×1920; crop = scene drawn at 1920×1080 and scaled to fill (default by kind) */
  frame?: 'native' | 'crop';
  /** native maps: multiply camera zoom (default 1.5) so the subject fills the narrow frame */
  zoom?: number;
  /** crop: horizontal focus (0..1 of the 1920 canvas) at shot start / end */
  pan?: [number, number];
  /** crop: scale (default 1920/1080 = fill height) */
  k?: number;
  /** big number in the top band */
  stat?: {value: string; label: string; at?: number};
  /** in-frame attribution for every number on screen */
  source?: string;
  /** final shot: "full story" pointer to the linked long video */
  end?: boolean;
};

export type ShortLook = {accent: string; channel: string};
export type ShortProps = {scenes: SceneTime[]; lines?: TimedLine[]};

const INK = 'rgba(8,12,18,0.82)';
const FADE = 0.35;
const CROP_KINDS = new Set(['scale', 'compare', 'deeptime', 'chart']);

/** Parse "Outnumbered *2 to 1*" → accent spans. */
const Rich: React.FC<{text: string; accent: string}> = ({text, accent}) => (
  <>
    {text.split('*').map((s, i) => (
      <span key={i} style={{color: i % 2 ? accent : undefined}}>
        {s}
      </span>
    ))}
  </>
);

const VBars: React.FC<{spec: VBarsSpec; p: number; elapsed: number; accent: string}> = ({spec, p, elapsed, accent}) => {
  const n = spec.bars.length;
  const max = spec.max ?? Math.max(...spec.bars.map((b) => b.value));
  const L = 90;
  const R = 930;
  const base = 1110;
  const topY = 560;
  const slot = (R - L) / n;
  const bw = Math.min(230, slot * 0.62);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="vb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1824" />
          <stop offset="1" stopColor="#16283a" />
        </linearGradient>
        <pattern id="vb-grid" width={72} height={72} patternUnits="userSpaceOnUse" patternTransform={`translate(${-10 * elapsed} ${-16 * elapsed})`}>
          <path d="M72 0H0V72" fill="none" stroke="rgba(244,239,228,0.07)" strokeWidth={2} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="url(#vb-bg)" />
      <rect width={1080} height={1920} fill="url(#vb-grid)" />
      <text x={540} y={430} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={54} fill="#ffffff">
        {spec.title}
      </text>
      <text x={540} y={486} textAnchor="middle" fontFamily={INTER} fontWeight={600} fontSize={30} fill="rgba(244,239,228,0.72)">
        {spec.unit}
      </text>
      <line x1={L - 20} x2={R + 20} y1={base} y2={base} stroke="rgba(244,239,228,0.5)" strokeWidth={3} />
      {spec.bars.map((b, i) => {
        const g = easeInOutCubic(ramp(p, 0.06 + i * 0.12, 0.4 + i * 0.12));
        const h = Math.max(8, ((base - topY) * b.value * g) / max);
        const cx = L + slot * (i + 0.5);
        const col = b.color ?? (b.highlight ? accent : '#7cc4ef');
        const shown = easeInOutCubic(ramp(p, 0.02 + i * 0.12, 0.1 + i * 0.12));
        const val = clamp01((g - 0.85) / 0.15);
        return (
          <g key={b.label} opacity={shown}>
            <rect x={cx - bw / 2} y={base - h} width={bw} height={h} rx={10} fill={col} stroke={b.highlight ? '#ffffff' : 'none'} strokeWidth={b.highlight ? 4 : 0} />
            <text x={cx} y={base - h - 22} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={b.highlight ? 64 : 54} fill="#ffffff" opacity={val}>
              {b.valueText}
            </text>
            {b.label.split('\n').map((ln, k) => (
              <text key={k} x={cx} y={base + 52 + k * 40} textAnchor="middle" fontFamily={INTER} fontWeight={b.highlight ? 800 : 700} fontSize={36} fill={b.highlight ? '#ffffff' : 'rgba(244,239,228,0.88)'}>
                {ln}
              </text>
            ))}
            {b.note ? (
              <text x={cx} y={base + 52 + b.label.split('\n').length * 40} textAnchor="middle" fontFamily={INTER} fontWeight={600} fontSize={28} fill="rgba(244,239,228,0.7)" opacity={val}>
                {b.note}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

const ShotView: React.FC<{shot: ShortShot; p: number; elapsed: number; uid: string; accent: string}> = ({shot, p, elapsed, uid, accent}) => {
  // living camera on every shot: slow push + absolute-time drift (freezedetect, LESSONS C001 #1)
  const push = 1 + 0.06 * p;
  const dx = 6 * Math.sin(elapsed / 2.7);
  const dy = 5 * Math.cos(elapsed / 3.3);
  const live = {transform: `translate(${dx}px, ${dy}px) scale(${push})`, transformOrigin: '50% 45%'};
  if (shot.vbars) return <VBars spec={shot.vbars} p={p} elapsed={elapsed} accent={accent} />;
  const def = shot.scene;
  if (!def) return null;
  const crop = shot.frame ? shot.frame === 'crop' : CROP_KINDS.has(def.kind);
  if (!crop) {
    const z = shot.zoom ?? 1.5;
    // maps: zoom the camera; art: always cover the tall frame (small 'object' photos left empty bands); battles: CSS zoom
    const d: SceneDef =
      def.kind === 'map' ? {...def, map: {...def.map, camera: def.map.camera.map((c) => ({...c, zoom: c.zoom * z}))}} : def.kind === 'art' ? {...def, art: {...def.art, object: false}} : def;
    const css = def.kind === 'battle' ? (shot.zoom ?? 1.3) : 1;
    return (
      <AbsoluteFill style={{...live, transform: `${live.transform} scale(${css})`}}>
        <Scene def={d} p={p} uid={uid} width={1080} height={1920} elapsed={elapsed} clarity />
      </AbsoluteFill>
    );
  }
  // k 1.96 + top offset: the stage's own top band (titles, 'to scale' chip) sits above the frame
  const k = shot.k ?? 1.96;
  const [f0, f1] = shot.pan ?? [0.5, 0.5];
  const fx = f0 + (f1 - f0) * easeInOutCubic(p);
  const left = Math.min(0, Math.max(1080 - 1920 * k, 540 - fx * 1920 * k));
  const top = Math.max(1920 - 1080 * k, -100 * k);
  return (
    <AbsoluteFill style={{...live, background: '#101b26', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        <Scene def={def} p={p} uid={uid} width={1920} height={1080} elapsed={elapsed} clarity />
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC<{text: string; big: number; accent: string}> = ({text, big, accent}) => {
  // big = 1 on the first shot (readable on frame 1, no fade-in), then it shrinks to a topic chip
  const fs = 40 + 34 * big;
  return (
    <div style={{position: 'absolute', left: 60, width: 900, top: 170, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          background: INK, borderRadius: 18 + 6 * big, padding: `${10 + 14 * big}px ${22 + 12 * big}px`, textAlign: 'center',
          fontFamily: INTER, fontWeight: 800, fontSize: fs, lineHeight: 1.12, color: '#fff', whiteSpace: 'pre-line', boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
        }}
      >
        <Rich text={big > 0.5 ? text : text.replace(/\n/g, ' ')} accent={accent} />
      </div>
    </div>
  );
};

const Stat: React.FC<{value: string; label: string; a: number; accent: string; top: number}> = ({value, label, a, accent, top}) => (
  <div style={{position: 'absolute', left: 60, width: 900, top, display: 'flex', justifyContent: 'center', opacity: a, transform: `scale(${0.92 + 0.08 * a})`}}>
    <div style={{background: INK, borderRadius: 20, padding: '10px 30px 14px', textAlign: 'center', fontFamily: INTER}}>
      <div style={{fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: accent}}>{value}</div>
      <div style={{fontWeight: 700, fontSize: 36, color: '#fff'}}>{label}</div>
    </div>
  </div>
);

const Source: React.FC<{text: string; a: number}> = ({text, a}) => (
  <div style={{position: 'absolute', left: 60, maxWidth: 900, top: 1196, opacity: 0.9 * a}}>
    <div style={{background: INK, borderRadius: 10, padding: '6px 14px', fontFamily: INTER, fontWeight: 600, fontSize: 26, color: 'rgba(244,239,228,0.9)'}}>Source: {text}</div>
  </div>
);

const EndPointer: React.FC<{a: number; t: number; accent: string; channel: string}> = ({a, t, accent, channel}) => (
  <div style={{position: 'absolute', left: 60, width: 900, top: 1010, opacity: a, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: accent, color: '#0b1118', borderRadius: 20, padding: '14px 30px', fontFamily: INTER, fontWeight: 800, fontSize: 48, textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>
      Full story on {channel}
      <div style={{fontSize: 36, fontWeight: 700, transform: `translateY(${6 * Math.sin(t * 5)}px)`}}>tap the linked video below ↓</div>
    </div>
  </div>
);

const ShortCaptions: React.FC<{lines: TimedLine[]; t: number; accent: string}> = ({lines, t, accent}) => {
  const cues = useMemo<Cue[]>(() => lines.flatMap((l) => captionCues(numeralize(l.words), 20, 2)), [lines]);
  let cue: Cue | undefined;
  for (const c of cues) if (t >= c.t - 0.05 && t <= c.end + 0.25) cue = c;
  if (!cue) return null;
  const a = clamp01((t - cue.t + 0.05) / 0.1) * clamp01((cue.end + 0.25 - t) / 0.1);
  let k = 0;
  const rows = cue.lines.map((line) => {
    const n = line.split(' ').length;
    const ws = cue!.words.slice(k, k + n);
    k += n;
    return ws;
  });
  return (
    <div style={{position: 'absolute', left: 60, width: 900, top: 1262, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{background: INK, borderRadius: 16, padding: '8px 24px', textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 62, lineHeight: 1.18, color: '#fff'}}>
        {rows.map((ws, r) => (
          <div key={r}>
            {ws.map((w, i) => (
              <span key={i} style={{color: t >= w.t && t < w.end + 0.08 ? accent : '#fff'}}>
                {w.w}
                {i < ws.length - 1 ? ' ' : ''}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShortEpisode: React.FC<ShortProps & {shots: Record<string, ShortShot>; hook: string; look: ShortLook}> = ({scenes, lines, shots, hook, look}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let i = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (i < 0) i = scenes.length - 1;
  const sc = scenes[i];
  const next = scenes[i + 1];
  const shot = shots[sc.id];
  if (!shot) throw new Error(`no ShortShot for scene ${sc.id}`);
  const p = clamp01((t - sc.start) / (sc.end - sc.start));
  const el = t - sc.start;
  const fadeIn = next ? easeInOutCubic(ramp(t, sc.end - FADE, sc.end)) : 0;
  const first = scenes[0];
  // hook: full size through the first shot (frame 1 = the promise), then a compact chip
  const big = 1 - easeInOutCubic(ramp(t, first.end - 0.4, first.end + 0.2));
  const statA = shot.stat ? easeInOutCubic(ramp(p, shot.stat.at ?? 0.08, (shot.stat.at ?? 0.08) + 0.08)) : 0;
  const endA = shot.end ? easeInOutCubic(ramp(p, 0.12, 0.25)) : 0;
  return (
    <AbsoluteFill style={{background: '#101b26', overflow: 'hidden'}}>
      <ShotView shot={shot} p={p} elapsed={el} uid={`a${sc.id}`} accent={look.accent} />
      {next && fadeIn > 0 ? (
        <AbsoluteFill style={{opacity: fadeIn}}>
          <ShotView shot={shots[next.id]} p={0} elapsed={0} uid={`b${next.id}`} accent={look.accent} />
        </AbsoluteFill>
      ) : null}
      {/* top scrim keeps the hook readable over bright art */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)'}} />
      {shot.vbars ? null : <Hook text={hook} big={big} accent={look.accent} />}
      {shot.stat ? <Stat value={shot.stat.value} label={shot.stat.label} a={statA} accent={look.accent} top={i === 0 ? 520 : 290} /> : null}
      {shot.source ? <Source text={shot.source} a={easeInOutCubic(ramp(p, 0.05, 0.15))} /> : null}
      {shot.end ? <EndPointer a={endA} t={t} accent={look.accent} channel={look.channel} /> : null}
      {lines?.length ? <ShortCaptions lines={lines} t={t} accent={look.accent} /> : null}
    </AbsoluteFill>
  );
};
