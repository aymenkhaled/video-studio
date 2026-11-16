import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Thumbnails 1280×720 (rendered 1920×1080). After C001's 1.7 % CTR: one big surprising number + a real image,
// bright, ≤ 3 words, each a different reason to click (Test & Compare). Every number is in sources.md.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};
const ICE = '#8fd3ff';
const RED = '#ff5a45';
const GOLD = '#ffd166';

export const SiberianCurseThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    // Norilsk from space (Landsat): "174,000" + "NO ROAD" — the paradox of title 1 (D6, NO2)
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('norilsk-sat')} style={{...cover, objectPosition: '55% 50%', transform: 'scale(1.25)', filter: 'brightness(1.25) contrast(1.2) saturate(1.2)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 58%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 56, top: 150, fontFamily: INTER, fontWeight: 900, lineHeight: 1, color: '#fff', textShadow: stroke}}>
          <div style={{fontSize: 190, color: GOLD}}>174,000</div>
          <div style={{fontSize: 150, marginTop: 24}}>
            NO <span style={{color: RED}}>ROAD</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // Russia at night (NASA, gamma-lifted), the lone light of Yakutsk circled: "−37 °C · WHY?" (Y2)
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('night-russia')} style={{...cover, objectPosition: '68% 50%', filter: 'brightness(1.8) contrast(1.3) saturate(1.2)'}} />
        <div style={{position: 'absolute', left: 850 - 80, top: 302 - 80, width: 160, height: 160, borderRadius: 999, border: `12px solid ${RED}`, boxShadow: '0 0 30px rgba(0,0,0,0.9)'}} />
        <div style={{position: 'absolute', left: 56, top: 380, fontFamily: INTER, fontWeight: 900, lineHeight: 1, color: '#fff', textShadow: stroke}}>
          <div style={{fontSize: 190, color: ICE}}>−37 °C</div>
          <div style={{fontSize: 120, marginTop: 12}}>WHY?</div>
        </div>
      </AbsoluteFill>
    );
  }
  // Winter sea ice (NASA MODIS): "2× PAY" (W1 + W2: pay can double, or more)
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('okhotsk-ice')} style={{...cover, objectPosition: '50% 50%', transform: 'scale(1.1)', filter: 'brightness(1.1) contrast(1.25)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 70%)'}} />
      <div style={{position: 'absolute', left: 70, top: 170, fontFamily: INTER, fontWeight: 900, lineHeight: 0.95, color: '#fff', textShadow: stroke}}>
        <div style={{fontSize: 300, color: GOLD}}>2×</div>
        <div style={{fontSize: 150}}>PAY</div>
      </div>
    </AbsoluteFill>
  );
};
