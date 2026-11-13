import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {CINZEL} from '../../packages/engine/src/map/map';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Thumbnails 1280×720 for Test & Compare: real PD art with a figure/face, ≤ 3 words, very high contrast.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};

export const CarthageThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    // Turner's burning-sunset Carthage + two words
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('turner-decline')} style={{...cover, objectPosition: '55% 45%', transform: 'scale(1.15)', filter: 'contrast(1.15) saturate(1.2)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 50, top: 160, fontFamily: CINZEL, fontWeight: 700, fontSize: 150, lineHeight: 1, color: '#fff', textShadow: stroke}}>CARTHAGE</div>
        <div style={{position: 'absolute', left: 56, top: 330, fontFamily: INTER, fontWeight: 900, fontSize: 110, color: '#ff5a3c', textShadow: stroke}}>ERASED</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // Scipio weeping at the ruins (1797 engraving) — a human figure + question
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('buys-scipio')} style={{...cover, objectPosition: '50% 35%', filter: 'contrast(1.3) sepia(0.35)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 55%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 120, color: '#fff', textShadow: stroke}}>WHY BURN IT?</div>
      </AbsoluteFill>
    );
  }
  // Cato's face + the fig hook
  return (
    <AbsoluteFill style={{background: '#120c06'}}>
      <Img src={artSrc('cato-16c')} style={{position: 'absolute', left: 0, top: 0, width: 640, height: 720, objectFit: 'cover', filter: 'contrast(1.2)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(18,12,6,0) 35%, rgba(18,12,6,1) 52%)'}} />
      <div style={{position: 'absolute', right: 60, top: 190, width: 600, textAlign: 'right', fontFamily: INTER, fontWeight: 900, fontSize: 130, lineHeight: 1.05, color: '#fff', textShadow: stroke}}>
        THE <span style={{color: '#b07ad8'}}>FIG</span>
        <br />
        WAR
      </div>
    </AbsoluteFill>
  );
};
