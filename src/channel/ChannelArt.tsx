import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {CINZEL, MapShot} from '../../packages/engine/src/map/map';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';

// Channel identity for "History in Maps": profile picture (800×800, shown as a circle) and banner (2560×1440,
// all text inside YouTube's 1546×423 safe area in the centre so it is visible on phones, desktop and TV).
const GOLD = '#d8b46a';
const PAPER = '#f4ecd8';

export const ChannelAvatar: React.FC = () => (
  <AbsoluteFill style={{background: '#10202a'}}>
    {/* a parchment globe centred on the Mediterranean, framed by a gold ring */}
    <div style={{position: 'absolute', left: 60, top: 60, width: 680, height: 680, borderRadius: 340, overflow: 'hidden', boxShadow: `0 0 0 14px ${GOLD}`}}>
      <MapShot width={680} height={680} p={0} uid="av" spec={{projection: 'globe', camera: [{at: 0, center: [14, 36], zoom: 1.05}]}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: CINZEL, fontWeight: 700, fontSize: 210, color: PAPER, textShadow: '0 8px 0 #000, 0 0 40px rgba(0,0,0,0.8)'}}>HM</div>
  </AbsoluteFill>
);

export const ChannelBanner: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={artSrc('turner-hannibal')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) contrast(1.15) saturate(1.1)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.6) 100%)'}} />
    {/* safe area: 1546 × 423 centred */}
    <div style={{position: 'absolute', left: (2560 - 1546) / 2, top: (1440 - 423) / 2, width: 1546, height: 423, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 128, letterSpacing: 10, color: PAPER, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap', textAlign: 'center'}}>HISTORY IN MAPS</div>
      <div style={{width: 260, height: 4, background: GOLD, margin: '18px 0 22px'}} />
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 46, color: GOLD, textShadow: '0 3px 0 #000', whiteSpace: 'nowrap', textAlign: 'center'}}>Ancient history, explained with maps. No background needed.</div>
    </div>
  </AbsoluteFill>
);
