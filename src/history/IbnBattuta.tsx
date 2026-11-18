import React from 'react';
import timeline from '../../brands/history-maps/episodes/003-ibn-battuta/timeline.json';
import {CLARITY, SCENES} from '../../brands/history-maps/episodes/003-ibn-battuta/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

export const calculateIbnBattutaEpisode = makeEpisodeMetadata(timeline);
export const IbnBattutaEpisode: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 1300, to: 1360}} clarity={CLARITY} />
);
