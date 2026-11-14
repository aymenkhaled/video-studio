import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {CINZEL} from '../../packages/engine/src/map/map';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Thumbnails 1280×720 for Test & Compare: real PD paintings with figures, ≤ 3 words, very high contrast.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};

export const HannibalThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('turner-hannibal')} style={{...cover, filter: 'contrast(1.25) saturate(1.2) brightness(1.1)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 50, top: 170, fontFamily: CINZEL, fontWeight: 700, fontSize: 150, lineHeight: 1, color: '#fff', textShadow: stroke}}>HANNIBAL</div>
        <div style={{position: 'absolute', left: 56, top: 345, fontFamily: INTER, fontWeight: 900, fontSize: 100, color: '#ff5a3c', textShadow: stroke}}>VS ROME</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('trumbull-cannae')} style={{...cover, objectPosition: '50% 40%', filter: 'contrast(1.2) saturate(1.15)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 55%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 120, color: '#fff', textShadow: stroke}}>
          ROME’S <span style={{color: '#ff5a3c'}}>WORST</span> DAY
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('west-oath')} style={{...cover, objectPosition: '45% 40%', filter: 'contrast(1.2) saturate(1.1)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.88) 75%)'}} />
      <div style={{position: 'absolute', right: 60, top: 220, textAlign: 'right', fontFamily: CINZEL, fontWeight: 700, fontSize: 120, lineHeight: 1.05, color: '#fff', textShadow: stroke}}>
        THE
        <br />
        <span style={{color: '#f2c14e'}}>OATH</span>
      </div>
    </AbsoluteFill>
  );
};
