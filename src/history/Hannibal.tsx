import React from 'react';
import timeline from '../../brands/history-maps/episodes/001-hannibal/timeline.json';
import {SCENES} from '../../brands/history-maps/episodes/001-hannibal/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

export const calculateHannibalEpisode = makeEpisodeMetadata(timeline);
export const HannibalEpisode: React.FC<EpisodeProps> = ({scenes}) => <HistoryEpisode scenes={scenes} defs={SCENES} timeline={{from: -264, to: -146}} />;
