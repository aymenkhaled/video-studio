import React from 'react';
import timeline from '../../brands/money-maps/episodes/001-switzerland/timeline.json';
import {CLARITY, SCENES} from '../../brands/money-maps/episodes/001-switzerland/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

// Money & Maps 001 — same voice-first episode player as the history channel, with charts + choropleths.
export const calculateSwitzerlandEpisode = makeEpisodeMetadata(timeline);
export const SwitzerlandEpisode: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 1500, to: 2026}} clarity={CLARITY} />
);
