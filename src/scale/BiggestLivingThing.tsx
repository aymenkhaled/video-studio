import React from 'react';
import timeline from '../../brands/scale-science/episodes/003-biggest-living-thing/timeline.json';
import {CLARITY, SCENES} from '../../brands/scale-science/episodes/003-biggest-living-thing/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';

// Scale & Science 003 — "The Biggest Living Thing Isn't a Whale" (1920×1080, voice-first timing).
export const calculateBiggestLivingThing = makeEpisodeMetadata(timeline);
export const BiggestLivingThing: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 0, to: 1}} clarity={CLARITY} />
);
