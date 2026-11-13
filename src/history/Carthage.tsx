import React from 'react';
import timeline from '../../brands/history-maps/episodes/002-carthage/timeline.json';
import {CLARITY, SCENES} from '../../brands/history-maps/episodes/002-carthage/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

export const calculateCarthageEpisode = makeEpisodeMetadata(timeline);
export const CarthageEpisode: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: -218, to: -146}} clarity={CLARITY} />
);
