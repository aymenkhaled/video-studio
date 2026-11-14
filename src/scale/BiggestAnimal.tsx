import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import timeline from '../../brands/scale-science/episodes/001-biggest-animal/timeline.json';
import {CLARITY, SCENES} from '../../brands/scale-science/episodes/001-biggest-animal/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';
import {pathFor, SHAPES} from '../../packages/engine/src/scale/shapes';

// Scale & Science 001 — 1920×1080 long-form episode, voice-first timing, Clarity Kit captions + cards.
export const calculateBiggestAnimal = makeEpisodeMetadata(timeline);
export const BiggestAnimal: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 0, to: 1}} clarity={CLARITY} />
);

// Thumbnails 1280×720: a real photo of the subject + ≤ 3 words, very high contrast.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};

/** Tiny yellow person for scale (original silhouette). */
const Person: React.FC<{x: number; y: number; h: number}> = ({x, y, h}) => (
  <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
    <path d={pathFor(SHAPES.human, {x, y, len: h, t: 0})} fill="#ffd166" stroke="#000" strokeWidth={3} />
  </svg>
);

export const BiggestAnimalThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    return (
      <AbsoluteFill style={{background: '#04121c'}}>
        <Img src={artSrc('bw-aerial')} style={{...cover, objectPosition: '45% 55%', transform: 'scale(1.18)', filter: 'contrast(1.2) saturate(1.3)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%)'}} />
        <Person x={1110} y={470} h={70} />
        <div style={{position: 'absolute', left: 1080, top: 380, fontFamily: INTER, fontWeight: 900, fontSize: 40, color: '#ffd166', textShadow: stroke}}>YOU</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 132, color: '#fff', textShadow: stroke}}>
          BIGGEST <span style={{color: '#ffd166'}}>EVER?</span>
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('meg-jaw')} style={{...cover, objectPosition: '50% 40%', filter: 'contrast(1.25)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 75%)'}} />
        <div style={{position: 'absolute', right: 50, top: 170, width: 560, textAlign: 'right', fontFamily: INTER, fontWeight: 900, fontSize: 124, lineHeight: 1.02, color: '#fff', textShadow: stroke}}>
          NOT THE <span style={{color: '#ff5a3c'}}>BIGGEST</span>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('fernbank')} style={{...cover, objectPosition: '50% 55%', filter: 'contrast(1.2) saturate(1.1)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 120, color: '#fff', textShadow: stroke}}>
        BEAT THE <span style={{color: '#8fc3e8'}}>WHALE?</span>
      </div>
    </AbsoluteFill>
  );
};
