import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {CINZEL, MapShot} from '../../packages/engine/src/map/map';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';
import {GDP_BREAKS, GDP_COLORS, GDP_PC_2024} from '../../brands/money-maps/data/europe';

// Channel identity for "Money & Maps": profile picture (800×800, shown as a circle) and banner (2560×1440,
// all text inside YouTube's 1546×423 central safe area).
const GOLD = '#f0c35a';
const PAPER = '#f4efe4';
const THEME = {sea: '#13212e', land: '#e8e1cf', coast: '#55606b', graticule: 'rgba(232,225,207,0.1)', text: '#1d2630'};

export const MoneyAvatar: React.FC = () => (
  <AbsoluteFill style={{background: '#0d1720'}}>
    {/* a globe over Europe coloured by GDP per person (World Bank 2024), framed by a gold ring */}
    <div style={{position: 'absolute', left: 60, top: 60, width: 680, height: 680, borderRadius: 340, overflow: 'hidden', boxShadow: `0 0 0 14px ${GOLD}`}}>
      <MapShot width={680} height={680} p={1} uid="mav" spec={{projection: 'globe', theme: THEME, camera: [{at: 0, center: [12, 40], zoom: 1.05}], choropleth: {values: GDP_PC_2024, breaks: GDP_BREAKS, colors: GDP_COLORS}}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 230, color: PAPER, textShadow: '0 8px 0 #000, 0 0 40px rgba(0,0,0,0.85)'}}>
      M<span style={{color: GOLD}}>&amp;</span>M
    </div>
  </AbsoluteFill>
);

export const MoneyBanner: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={artSrc('alps-modis')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.15)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.65) 100%)'}} />
    <div style={{position: 'absolute', left: (2560 - 1546) / 2, top: (1440 - 423) / 2, width: 1546, height: 423, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 132, letterSpacing: 10, color: PAPER, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>MONEY &amp; MAPS</div>
      <div style={{width: 260, height: 4, background: GOLD, margin: '18px 0 22px'}} />
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 46, color: GOLD, textShadow: '0 3px 0 #000', whiteSpace: 'nowrap'}}>Why countries are rich or poor, explained with maps.</div>
    </div>
  </AbsoluteFill>
);
