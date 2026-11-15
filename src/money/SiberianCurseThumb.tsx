import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Thumbnails 1280×720 (rendered at 3× = 3840×2160 for Test & Compare, PLAYBOOK 3.3): a real image, ≤ 3 words, high contrast.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};
const ICE = '#8fd3ff';
const RED = '#ff5a45';

export const SiberianCurseThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    // Russia at night: bright west, dark east, one lone light circled → "WHY HERE?"
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('night-russia')} style={{...cover, objectPosition: '38% 50%', transform: 'scale(1.35)', filter: 'brightness(1.5) contrast(1.25)'}} />
        <div style={{position: 'absolute', left: 820, top: 300, width: 150, height: 150, borderRadius: 999, border: `10px solid ${RED}`, boxShadow: '0 0 30px rgba(0,0,0,0.9)'}} />
        <div style={{position: 'absolute', left: 60, top: 70, fontFamily: INTER, fontWeight: 900, fontSize: 160, lineHeight: 1, color: '#fff', textShadow: stroke}}>
          WHY <span style={{color: RED}}>HERE?</span>
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // Norilsk from space → "NO ROADS IN"
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('norilsk-sat')} style={{...cover, objectPosition: '50% 50%', transform: 'scale(1.3)', filter: 'contrast(1.2) saturate(1.1)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 60, top: 180, fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 1.02, color: '#fff', textShadow: stroke}}>
          NO ROADS
          <br />
          <span style={{color: ICE}}>IN.</span>
        </div>
      </AbsoluteFill>
    );
  }
  // Trans-Siberian bridge (Prokudin-Gorsky colour photo) → "PAID TO STAY"
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('pg-bridge')} style={{...cover, objectPosition: '50% 50%', transform: 'scale(1.1)', filter: 'contrast(1.2) saturate(1.15)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 132, color: '#fff', textShadow: stroke}}>
        PAID TO <span style={{color: '#ffd166'}}>STAY</span>
      </div>
    </AbsoluteFill>
  );
};
