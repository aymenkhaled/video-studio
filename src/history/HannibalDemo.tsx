import React from 'react';
import {AbsoluteFill, CalculateMetadataFunction, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../../brands/history-maps/episodes/000-hannibal-demo/timeline.json';
import {MapShot, MapSpec, CINZEL, LonLat, Territory, Route, City} from '../../packages/engine/src/map/map';
import {BigCounter, Citation, TimelineBar} from '../../packages/engine/src/map/ui';
import {easeInOutCubic, ramp} from '../../packages/engine/src/motion';

// Channel A engine demo: "Hannibal's march, 218 BC" (~1 min, 16:9, voice-first scene timing).

type SceneTime = {id: string; start: number; end: number};
type Props = {scenes: SceneTime[]};

/** Scene timings come from the soundtrack step (voice-first). Local preview: estimate 2.6 words/s. */
export const calculateHannibalMetadata: CalculateMetadataFunction<Props> = async () => {
  const fps = timeline.fps;
  try {
    const r = await fetch(staticFile('generated/timing.json'));
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    if (!j.scenes?.length) throw new Error('no scenes');
    return {durationInFrames: Math.ceil(j.duration * fps), fps, props: {scenes: j.scenes}};
  } catch {
    let t = 0;
    const scenes = timeline.scenes.map((s) => {
      const words = s.lines.join(' ').split(/\s+/).length;
      const start = t;
      t += (s.lead ?? 0.6) + words / 2.6 + ((s as {tail?: number}).tail ?? 0.8);
      return {id: s.id, start, end: t};
    });
    return {durationInFrames: Math.ceil(t * fps), fps, props: {scenes}};
  }
};

// ---------- data (approximate 218 BC; see sources.md) ----------
const ROME: Territory = {
  id: 'rome', color: '#a8322d', label: 'ROME', labelAt: [13.2, 42.4], origin: [12.48, 41.9],
  rings: [[[10.0, 44.1], [12.6, 44.1], [19, 41.5], [19, 36.3], [12.4, 36.3], [12.0, 37.5], [8.0, 38.6], [7.6, 41.5], [8.4, 43.2], [10.0, 44.1]]],
};
const CARTHAGE_AFRICA: Territory = {
  id: 'carthage-africa', color: '#c8812a', origin: [10.32, 36.85],
  rings: [[[8.0, 37.6], [11.4, 37.6], [11.6, 35.5], [11.0, 33.6], [12.6, 32.6], [15.2, 31.9], [19.6, 30.8], [19.6, 29.9], [15.0, 30.9], [12.4, 31.9], [10.2, 32.9], [9.6, 34.6], [8.2, 35.6], [5.0, 35.9], [2.0, 35.9], [-1.5, 35.0], [-1.5, 36.2], [3.0, 37.4], [8.0, 37.6]]],
};
const CARTHAGE_IBERIA: Territory = {
  id: 'carthage-iberia', color: '#c8812a', origin: [-0.99, 37.6],
  rings: [[[0.9, 40.8], [-0.5, 41.3], [-3.0, 40.1], [-5.0, 38.7], [-7.5, 37.7], [-6.3, 35.9], [-2.0, 36.2], [1.5, 38.6], [0.9, 40.8]]],
};
// Inland waypoints (the smoothed curve must not bulge over the sea).
const MARCH: LonLat[] = [[-0.99, 37.6], [-1.0, 38.6], [-0.75, 39.7], [0.2, 40.95], [1.3, 41.85], [2.3, 42.45], [2.9, 43.25], [4.0, 43.85], [4.78, 44.1], [5.5, 44.9], [6.3, 45.3], [6.95, 45.22], [7.68, 45.07]];
const NEW_CARTHAGE: City = {name: 'New Carthage', at: [-0.99, 37.6], align: 'left'};
const territories = [ROME, CARTHAGE_AFRICA, CARTHAGE_IBERIA];
const unit = {label: 'Hannibal', color: '#c8812a', kind: 'infantry' as const};

const SPECS: Record<string, MapSpec> = {
  s1: {
    camera: [{at: 0, center: [9, 38.5], zoom: 4.6}, {at: 1, center: [7, 39.5], zoom: 5.6}],
    territories: territories.map((t) => ({...t, grow: t.id === 'rome' ? [0.3, 0.65] : [0.55, 0.9]})),
    regions: [{text: 'ROME', at: [13.6, 42.6], appear: 0.4}, {text: 'CARTHAGE', at: [7.5, 33.6], appear: 0.65}],
    cities: [{name: 'Rome', at: [12.48, 41.9], appear: 0.35}, {name: 'Carthage', at: [10.32, 36.85], appear: 0.6}, {...NEW_CARTHAGE, appear: 0.85}],
  },
  s2: {
    camera: [{at: 0, center: [3, 39.5], zoom: 6}, {at: 0.35, center: [-1.6, 39.2], zoom: 14}, {at: 1, center: [-1.2, 39.6], zoom: 15.5}],
    territories,
    cities: [{...NEW_CARTHAGE, appear: 0.1, size: 1.3}, {name: 'Saguntum', at: [-0.27, 39.68], appear: 0.4}],
    routes: [{id: 'ebro', points: MARCH.slice(0, 4), color: '#f0c36a', draw: [0.45, 0.9], unit}],
    regions: [{text: 'IBERIA', at: [-4.2, 40.3], appear: 0.3, size: 52}],
  },
  s3: {
    camera: [{at: 0, center: [0.4, 40.6], zoom: 11}, {at: 0.5, center: [3.4, 43.4], zoom: 12}, {at: 1, center: [6.4, 45.0], zoom: 18}],
    territories,
    routes: [{id: 'march', points: MARCH, color: '#f0c36a', draw: [0.02, 0.92], unit}],
    cities: [{name: 'Massalia', at: [5.37, 43.3], appear: 0.45}, {name: 'Rhône crossing', at: [4.78, 44.05], appear: 0.5, align: 'left'}, {name: 'Alpine pass (debated)', at: [6.95, 45.22], appear: 0.8}],
    regions: [{text: 'GAUL', at: [2.6, 45.6], appear: 0.25}, {text: 'ALPS', at: [7.6, 46.2], appear: 0.65, size: 40}],
  },
  s4: {
    camera: [{at: 0, center: [7.4, 45.0], zoom: 34}, {at: 1, center: [8.6, 44.9], zoom: 26}],
    territories,
    routes: [{id: 'march', points: MARCH, color: '#f0c36a', draw: [-1, 0], unit}],
    cities: [{name: 'Taurini (Turin)', at: [7.68, 45.07], appear: 0.05}],
    regions: [{text: 'CISALPINE GAUL', at: [9.6, 45.55], appear: 0.2, size: 34}],
  },
  s5: {
    camera: [{at: 0, center: [8.6, 44.9], zoom: 26}, {at: 1, center: [10.5, 42.5], zoom: 7}],
    territories,
    routes: [{id: 'march', points: MARCH, color: '#f0c36a', draw: [-1, 0], unit}],
    cities: [{name: 'Rome', at: [12.48, 41.9]}],
  },
};

const FADE = 0.45; // seconds of cross-dissolve between scenes

export const HannibalDemo: React.FC<Props> = ({scenes}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const i = Math.max(0, scenes.findIndex((s) => t >= s.start && t < s.end));
  const sc = scenes[i] ?? scenes[scenes.length - 1];
  const next = scenes[i + 1];
  const prog = (s: SceneTime) => Math.min(1, Math.max(0, (t - s.start) / (s.end - s.start)));
  const p = prog(sc);
  const fadeIn = next ? easeInOutCubic(ramp(t, sc.end - FADE, sc.end)) : 0;

  return (
    <AbsoluteFill style={{background: '#1b2f3a'}}>
      <MapShot spec={SPECS[sc.id]} p={p} width={width} height={height} uid={`a${sc.id}`} />
      {next && fadeIn > 0 ? (
        <AbsoluteFill style={{opacity: fadeIn}}>
          <MapShot spec={SPECS[next.id]} p={0} width={width} height={height} uid={`b${next.id}`} />
        </AbsoluteFill>
      ) : null}

      {sc.id === 's1' ? <Citation text="Approximate territories, 218 BC" p={p} at={[0.3, 0.97]} /> : null}
      {sc.id === 's2' ? (
        <>
          <Citation text="Polybius, Histories 3.35" p={p} at={[0.45, 0.98]} />
          <BigCounter label="INFANTRY (CLAIMED)" value={90000} p={p} window={[0.5, 0.97]} top={330} />
          <BigCounter label="CAVALRY (CLAIMED)" value={12000} p={p} window={[0.58, 0.97]} top={560} color="#f4ecd8" />
        </>
      ) : null}
      {sc.id === 's4' ? (
        <>
          <Citation text="Polybius, Histories 3.56" p={p} at={[0.05, 0.98]} />
          <BigCounter label="INFANTRY" value={20000} p={p} window={[0.15, 0.98]} top={330} />
          <BigCounter label="CAVALRY" value={6000} p={p} window={[0.25, 0.98]} top={560} color="#f4ecd8" />
        </>
      ) : null}
      {sc.id === 's5' ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: `rgba(12,9,5,${0.55 * easeInOutCubic(ramp(p, 0.1, 0.4))})`}}>
          <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 92, color: '#f4ecd8', opacity: easeInOutCubic(ramp(p, 0.15, 0.4)), textShadow: '0 4px 0 #000'}}>So how did he win anyway?</div>
        </AbsoluteFill>
      ) : null}
      <TimelineBar from={-264} to={-146} year={-218} events={[{year: -264, label: 'First Punic War'}, {year: -218, label: 'Hannibal marches'}, {year: -146, label: 'Carthage destroyed'}]} />
    </AbsoluteFill>
  );
};
