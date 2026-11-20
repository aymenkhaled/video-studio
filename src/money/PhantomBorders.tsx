import React from 'react';
import timeline from '../../brands/money-maps/episodes/003-phantom-borders/timeline.json';
import {CLARITY, SCENES} from '../../brands/money-maps/episodes/003-phantom-borders/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

// Money & Maps 003 — phantom borders. Same voice-first episode player (maps with ghost borders, charts, art).
export const calculatePhantomBordersEpisode = makeEpisodeMetadata(timeline);
export const PhantomBordersEpisode: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 1780, to: 2026}} clarity={CLARITY} />
);
