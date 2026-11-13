import React from 'react';
import {AbsoluteFill, CalculateMetadataFunction, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOutCubic, ramp} from '../motion';
import {MapShot, MapSpec} from './map';
import {BattleShot, BattleSpec} from './battle';
import {BigCounter, ChapterCard, Citation, ListCard, QuoteCard, TimelineBar, TitleCard} from './ui';
import type {TimedLine} from '../overlay';
import {assertCardLimits, CharacterCard, ClarityConfig, GlossaryPop, Legend, MapCaptions, RecapCard} from './clarity';

// Generic long-form history episode player. An episode = timeline.json (voice-first narration per scene)
// + a SceneDef per scene id. Scene timing comes from the generated voice (timing.json).

export type Overlay =
  | {type: 'citation'; text: string; at?: [number, number]}
  | {type: 'counter'; label: string; value: number; window: [number, number]; color?: string; top?: number; suffix?: string}
  | {type: 'quote'; text: string; by: string; at?: [number, number]}
  | {type: 'list'; title: string; items: string[]; source?: string}
  | {type: 'title'; title: string; sub: string}
  | {type: 'chapter'; n: number; title: string; sub?: string}
  | {type: 'character'; name: string; role: string; line: string; side?: string}
  | {type: 'glossary'; term: string; meaning: string; window?: [number, number]}
  | {type: 'recap'; text: string};

export type SceneDef =
  | {kind: 'map'; map: MapSpec; overlays?: Overlay[]; year?: number}
  | {kind: 'battle'; battle: BattleSpec; range?: [number, number]; overlays?: Overlay[]; year?: number};

export type SceneTime = {id: string; start: number; end: number};
export type EpisodeProps = {scenes: SceneTime[]; lines?: TimedLine[]};

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
      return {durationInFrames: Math.ceil(j.duration * fps), fps, props: {scenes: j.scenes, lines: j.lines ?? []}};
    } catch {
      let t = 0;
      const lines: TimedLine[] = [];
      const scenes = timeline.scenes.map((s) => {
        const words = s.lines.join(' ').split(/\s+/).filter(Boolean).length;
        const start = t;
        // Estimated captions for local preview / stills: 2.5 words/s from the scene lead.
        let lt = start + (s.lead ?? 0.6);
        s.lines.forEach((text, k) => {
          const ws = text.split(/\s+/).filter(Boolean);
          lines.push({id: `${s.id}-${k}`, t: lt, duration: ws.length / 2.5, text, words: ws.map((w, i) => ({w, t: lt + i / 2.5, end: lt + (i + 1) / 2.5}))});
          lt += ws.length / 2.5 + 0.42;
        });
        t += Math.max((s.lead ?? 0.6) + words / 2.5 + (s.tail ?? 0.8), s.min ?? 3);
        return {id: s.id, start, end: t};
      });
      return {durationInFrames: Math.ceil(t * fps), fps, props: {scenes, lines}};
    }
  };

const renderOverlay = (o: Overlay, p: number, i: number, clarity?: ClarityConfig) => {
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
    case 'character':
      return <CharacterCard key={i} name={o.name} role={o.role} line={o.line} color={clarity?.factions.find((f) => f.name === o.side)?.color ?? '#d8b46a'} p={p} />;
    case 'glossary':
      return <GlossaryPop key={i} term={o.term} meaning={o.meaning} window={o.window} p={p} />;
    case 'recap':
      return <RecapCard key={i} text={o.text} p={p} />;
  }
};

const Scene: React.FC<{def: SceneDef; p: number; uid: string; width: number; height: number; elapsed: number}> = ({def, p, uid, width, height, elapsed}) =>
  def.kind === 'map' ? (
    <MapShot spec={def.map} p={p} width={width} height={height} uid={uid} elapsed={elapsed} />
  ) : (
    <BattleShot spec={def.battle} p={def.range ? def.range[0] + p * (def.range[1] - def.range[0]) : p} sceneP={p} width={width} height={height} />
  );

const FADE = 0.45;

export const HistoryEpisode: React.FC<EpisodeProps & {defs: Record<string, SceneDef>; timeline: {from: number; to: number}; clarity?: ClarityConfig}> = ({scenes, lines, defs, timeline, clarity}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  let i = scenes.findIndex((s) => t >= s.start && t < s.end);
  if (i < 0) i = scenes.length - 1;
  const sc = scenes[i];
  const next = scenes[i + 1];
  const def = defs[sc.id];
  if (!def) throw new Error(`no SceneDef for scene ${sc.id}`);
  if (clarity) assertCardLimits(sc.id, def.overlays);
  const p = Math.min(1, Math.max(0, (t - sc.start) / (sc.end - sc.start)));
  const fadeIn = next ? easeInOutCubic(ramp(t, sc.end - FADE, sc.end)) : 0;
  const isCard = def.overlays?.some((o) => o.type === 'chapter' || o.type === 'title' || o.type === 'recap');
  return (
    <AbsoluteFill style={{background: '#1b2f3a'}}>
      <Scene def={def} p={p} uid={`a${sc.id}`} width={width} height={height} elapsed={t - sc.start} />
      {(def.overlays ?? []).map((o, k) =>
        o.type === 'quote' || o.type === 'list' || o.type === 'chapter' || o.type === 'title' || o.type === 'recap' ? (
          // Cards darken the moving map: give the card itself a slow scale-in so the frame never freezes.
          <AbsoluteFill key={k} style={{transform: `scale(${1 + 0.09 * p})`}}>
            {renderOverlay(o, p, k, clarity)}
          </AbsoluteFill>
        ) : (
          renderOverlay(o, p, k, clarity)
        ),
      )}
      {def.year !== undefined && !isCard && def.kind === 'map' ? <TimelineBar from={timeline.from} to={timeline.to} year={def.year} now={clarity ? clarity.now ?? 2026 : undefined} /> : null}
      {clarity && def.kind === 'map' && !isCard ? <Legend factions={clarity.factions} p={p} /> : null}
      {next && fadeIn > 0 ? (
        <AbsoluteFill style={{opacity: fadeIn}}>
          <Scene def={defs[next.id]} p={0} uid={`b${next.id}`} width={width} height={height} elapsed={0} />
        </AbsoluteFill>
      ) : null}
      {clarity && lines?.length ? <MapCaptions lines={lines} t={t} highlight={clarity.highlight} /> : null}
    </AbsoluteFill>
  );
};
