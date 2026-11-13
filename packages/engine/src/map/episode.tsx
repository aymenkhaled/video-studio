import React from 'react';
import {AbsoluteFill, CalculateMetadataFunction, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOutCubic, ramp} from '../motion';
import {MapShot, MapSpec} from './map';
import {BattleShot, BattleSpec} from './battle';
import {BigCounter, ChapterCard, Citation, ListCard, QuoteCard, TimelineBar, TitleCard} from './ui';

// Generic long-form history episode player. An episode = timeline.json (voice-first narration per scene)
// + a SceneDef per scene id. Scene timing comes from the generated voice (timing.json).

export type Overlay =
  | {type: 'citation'; text: string; at?: [number, number]}
  | {type: 'counter'; label: string; value: number; window: [number, number]; color?: string; top?: number; suffix?: string}
  | {type: 'quote'; text: string; by: string; at?: [number, number]}
  | {type: 'list'; title: string; items: string[]; source?: string}
  | {type: 'title'; title: string; sub: string}
  | {type: 'chapter'; n: number; title: string; sub?: string};

export type SceneDef =
  | {kind: 'map'; map: MapSpec; overlays?: Overlay[]; year?: number}
  | {kind: 'battle'; battle: BattleSpec; range?: [number, number]; overlays?: Overlay[]; year?: number};

export type SceneTime = {id: string; start: number; end: number};
export type EpisodeProps = {scenes: SceneTime[]};

type TimelineLike = {fps: number; scenes: {id: string; lead?: number; tail?: number; min?: number; lines: string[]}[]};

/** Duration + scene times from the soundtrack step; local preview estimates 2.5 words/s. */
export const makeEpisodeMetadata =
  (timeline: TimelineLike): CalculateMetadataFunction<EpisodeProps> =>
  async () => {
    const fps = timeline.fps;
    try {
      const r = await fetch(staticFile('generated/timing.json'));
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      const ids = new Set(timeline.scenes.map((s) => s.id));
      if (!j.scenes?.length || !j.scenes.every((s: SceneTime) => ids.has(s.id))) throw new Error('timing.json belongs to another episode');
      return {durationInFrames: Math.ceil(j.duration * fps), fps, props: {scenes: j.scenes}};
    } catch {
      let t = 0;
      const scenes = timeline.scenes.map((s) => {
        const words = s.lines.join(' ').split(/\s+/).filter(Boolean).length;
        const start = t;
        t += Math.max((s.lead ?? 0.6) + words / 2.5 + (s.tail ?? 0.8), s.min ?? 3);
        return {id: s.id, start, end: t};
      });
      return {durationInFrames: Math.ceil(t * fps), fps, props: {scenes}};
    }
  };

const renderOverlay = (o: Overlay, p: number, i: number) => {
  switch (o.type) {
    case 'citation':
      return <Citation key={i} text={o.text} p={p} at={o.at} />;
    case 'counter':
      return <BigCounter key={i} label={o.label} value={o.value} p={p} window={o.window} color={o.color} top={o.top} suffix={o.suffix} />;
    case 'quote':
      return <QuoteCard key={i} text={o.text} by={o.by} p={p} at={o.at} />;
    case 'list':
      return <ListCard key={i} title={o.title} items={o.items} p={p} source={o.source} />;
    case 'title':
      return <TitleCard key={i} title={o.title} sub={o.sub} p={p} />;
    case 'chapter':
      return <ChapterCard key={i} n={o.n} title={o.title} sub={o.sub} p={p} />;
  }
};

const Scene: React.FC<{def: SceneDef; p: number; uid: string; width: number; height: number}> = ({def, p, uid, width, height}) =>
  def.kind === 'map' ? (
    <MapShot spec={def.map} p={p} width={width} height={height} uid={uid} />
  ) : (
    <BattleShot spec={def.battle} p={def.range ? def.range[0] + p * (def.range[1] - def.range[0]) : p} width={width} height={height} />
  );

const FADE = 0.45;

export const HistoryEpisode: React.FC<EpisodeProps & {defs: Record<string, SceneDef>; timeline: {from: number; to: number}}> = ({scenes, defs, timeline}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  let i = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (i < 0) i = scenes.length - 1;
  const sc = scenes[i];
  const next = scenes[i + 1];
  const def = defs[sc.id];
  if (!def) throw new Error(`no SceneDef for scene ${sc.id}`);
  const p = Math.min(1, Math.max(0, (t - sc.start) / (sc.end - sc.start)));
  const fadeIn = next ? easeInOutCubic(ramp(t, sc.end - FADE, sc.end)) : 0;
  const isCard = def.overlays?.some((o) => o.type === 'chapter' || o.type === 'title');
  return (
    <AbsoluteFill style={{background: '#1b2f3a'}}>
      <Scene def={def} p={p} uid={`a${sc.id}`} width={width} height={height} />
      {(def.overlays ?? []).map((o, k) => renderOverlay(o, p, k))}
      {def.year !== undefined && !isCard && def.kind === 'map' ? <TimelineBar from={timeline.from} to={timeline.to} year={def.year} /> : null}
      {next && fadeIn > 0 ? (
        <AbsoluteFill style={{opacity: fadeIn}}>
          <Scene def={defs[next.id]} p={0} uid={`b${next.id}`} width={width} height={height} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
