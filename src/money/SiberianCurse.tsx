import React from 'react';
import timeline from '../../brands/money-maps/episodes/002-siberian-curse/timeline.json';
import {CLARITY, SCENES} from '../../brands/money-maps/episodes/002-siberian-curse/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

// Money & Maps 002 — the Siberian curse. Same voice-first episode player as 001 (charts, choropleths, art).
export const calculateSiberianCurseEpisode = makeEpisodeMetadata(timeline);
export const SiberianCurseEpisode: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 1890, to: 2026}} clarity={CLARITY} />
);
