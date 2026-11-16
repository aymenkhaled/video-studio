import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import timeline from '../../brands/scale-science/episodes/002-giant-waves/timeline.json';
import {CLARITY, SCENES} from '../../brands/scale-science/episodes/002-giant-waves/scenes';
import {EpisodeProps, HistoryEpisode, makeEpisodeMetadata} from '../../packages/engine/src/map/episode';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc, useArtIndex} from '../../packages/engine/src/map/media';
import {pathFor, SHAPES} from '../../packages/engine/src/scale/shapes';

// Scale & Science 002 — "Every Giant Wave Ever Measured, Shown to Scale" (1920×1080, voice-first timing).
export const calculateGiantWaves = makeEpisodeMetadata(timeline);
export const GiantWaves: React.FC<EpisodeProps> = ({scenes, lines}) => (
  <HistoryEpisode scenes={scenes} lines={lines} defs={SCENES} timeline={{from: 0, to: 1}} clarity={CLARITY} />
);

// Thumbnails: designed at 1280×720, rendered at 3840×2160 (PLAYBOOK 3.3). Real USGS photos, ≤ 3 words.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};

const Line: React.FC<{y: number; color: string}> = ({y, color}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, borderTop: `8px dashed ${color}`}} />
);

const Design: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  const index = useArtIndex();
  if (variant === 1) {
    // Tracy Arm stripped slope + the 481 m line + Empire State profile for scale
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('ta-runup')} style={{...cover, objectPosition: '55% 40%', filter: 'contrast(1.15) saturate(1.2)'}} />
        <div style={{position: 'absolute', left: 50, top: 40, fontFamily: INTER, fontWeight: 900, fontSize: 150, color: '#f2c14e', textShadow: stroke}}>481 m</div>
        <div style={{position: 'absolute', left: 56, top: 205, fontFamily: INTER, fontWeight: 900, fontSize: 64, color: '#fff', textShadow: stroke}}>CLIMBED</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // the 1958 record: Miller's trimline photo + red line
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('lituya-trim')} style={{...cover, filter: 'contrast(1.35) sepia(0.25)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 124, color: '#fff', textShadow: stroke}}>
          TALLEST <span style={{color: '#ef6a5e'}}>EVER</span>
        </div>
      </AbsoluteFill>
    );
  }
  // the ladder: Statue, Eiffel, ESB and a water line above all of them
  const lib = index?.['liberty-cut'];
  const eif = index?.['eiffel-cut'];
  const s = 1.05; // px per metre
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #5d7f95 0%, #c7d6dc 100%)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700 - 481 * s, bottom: 0, background: 'linear-gradient(180deg, rgba(127,196,216,0.9), rgba(13,52,67,0.95))', borderTop: '8px solid #eef9ff'}} />
      {lib ? <Img src={artSrc('liberty-cut')} style={{position: 'absolute', left: 170, top: 700 - 93 * s, height: 93 * s, width: (93 * s * lib.w) / lib.h}} /> : null}
      {eif ? <Img src={artSrc('eiffel-cut')} style={{position: 'absolute', left: 330, top: 700 - 330 * s, height: 330 * s, width: (330 * s * eif.w) / eif.h}} /> : null}
      <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
        <path d={pathFor(SHAPES.esb, {x: 640, y: 700, len: 443 * s, t: 0})} fill="#e7e1d2" stroke="#000" strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', right: 50, top: 60, textAlign: 'right', fontFamily: INTER, fontWeight: 900, fontSize: 120, lineHeight: 1, color: '#fff', textShadow: stroke}}>
        TO <span style={{color: '#f2c14e'}}>SCALE</span>
      </div>
    </AbsoluteFill>
  );
};

export const GiantWavesThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{width: 1280, height: 720, transform: 'scale(3)', transformOrigin: '0 0', position: 'relative', overflow: 'hidden'}}>
      <Design variant={variant} />
    </div>
  </AbsoluteFill>
);
