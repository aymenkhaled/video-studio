import React from 'react';
import timeline from '../../brands/history-maps/episodes/001-hannibal/timeline.json';
import {CLARITY, SCENES} from '../../brands/history-maps/episodes/001-hannibal/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

export const calculateHannibalEpisode = makeEpisodeMetadata(timeline);
export const HannibalEpisode: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: -264, to: -146}} clarity={CLARITY} />
);
