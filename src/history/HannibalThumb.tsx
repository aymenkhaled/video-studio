import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Thumbnails v2 (after A001 analytics: CTR 0.1 % with a dark, faceless, generic thumbnail).
// Rules: bright and saturated, faces/figures large, ONE number or short hook (≤ 3 words), thick outlined text.
const outline = '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 18px rgba(0,0,0,0.8)';
const bright = 'brightness(1.18) contrast(1.2) saturate(1.35)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};

export const HannibalThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    // Cannae battle painting, zoomed on the fighting horsemen + the death toll
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('trumbull-cannae')} style={{...cover, objectPosition: '55% 85%', transform: 'scale(1.5)', transformOrigin: '55% 80%', filter: bright}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)'}} />
        <div style={{position: 'absolute', left: 40, bottom: 120, fontFamily: INTER, fontWeight: 900, fontSize: 190, lineHeight: 1, color: '#ffd23f', textShadow: outline}}>70,000</div>
        <div style={{position: 'absolute', left: 48, bottom: 40, fontFamily: INTER, fontWeight: 900, fontSize: 84, color: '#fff', textShadow: outline}}>IN ONE DAY</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // The boy Hannibal swearing the oath (Benjamin West), face large
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('west-oath')} style={{...cover, objectPosition: '40% 35%', transform: 'scale(1.6)', transformOrigin: '40% 40%', filter: bright}} />
        <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)'}} />
        <div style={{position: 'absolute', right: 50, top: 170, textAlign: 'right', fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 1.0, color: '#fff', textShadow: outline}}>
          SWORE
          <br />
          <span style={{color: '#ffd23f'}}>AT 9</span>
        </div>
      </AbsoluteFill>
    );
  }
  // Elephants in the Alps (Leutemann woodcut): bright colours, a clear question
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('leutemann-alps')} style={{...cover, objectPosition: '50% 55%', filter: bright}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 120, color: '#fff', textShadow: outline}}>
        ELEPHANTS <span style={{color: '#ffd23f'}}>HERE?!</span>
      </div>
    </AbsoluteFill>
  );
};
