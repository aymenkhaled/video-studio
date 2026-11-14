import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Thumbnails 1280×720 (Test & Compare): a real image, ≤ 3 words, very high contrast, Swiss red as the accent.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};
const RED = '#e8392a';

export const SwitzerlandThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    // the Alps from space + the paradox
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('alps-modis')} style={{...cover, objectPosition: '42% 50%', transform: 'scale(1.25)', filter: 'contrast(1.2) saturate(1.15)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 56, top: 150, fontFamily: INTER, fontWeight: 900, fontSize: 132, lineHeight: 1.02, color: '#fff', textShadow: stroke}}>
          NO SEA.
          <br />
          NO OIL.
          <br />
          <span style={{color: RED}}>RICH?</span>
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // the 1650 Geneva watch (CC0) + "$1,837"
    return (
      <AbsoluteFill style={{background: '#0d141b'}}>
        <Img src={artSrc('met-watch')} style={{position: 'absolute', right: 30, top: 40, width: 640, height: 640, objectFit: 'contain', filter: 'contrast(1.15) drop-shadow(0 20px 40px #000)'}} />
        <div style={{position: 'absolute', left: 60, top: 170, fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 1, color: '#fff', textShadow: stroke}}>
          $1,837
          <div style={{fontSize: 96, color: RED, marginTop: 20}}>VS $4</div>
        </div>
      </AbsoluteFill>
    );
  }
  // hungry 1817 village photochrom → "WHY SO RICH?"
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('village-alps')} style={{...cover, objectPosition: '50% 45%', filter: 'contrast(1.25) saturate(1.1)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 124, color: '#fff', textShadow: stroke}}>
        WHY SO <span style={{color: RED}}>RICH?</span>
      </div>
    </AbsoluteFill>
  );
};
