import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MapShot, CINZEL} from '../../packages/engine/src/map/map';
import {INTER} from '../../packages/engine/src/overlay';
import {AFRICA_146, C3, CARTHAGE_150, COL3, EMPORIA, MODERN, NUMIDIA, ROME_ITALY, SICILY, TYSCA} from '../../brands/history-maps/data/punic3';

// Thumbnails 1280×720 for Test & Compare: one subject, ≤ 4 words, high contrast.
const W = 1280;
const H = 720;
const stroke = '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.7)';

export const CarthageThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    return (
      <AbsoluteFill>
        <MapShot width={W} height={H} p={1} uid="t1" spec={{camera: [{at: 0, center: [10.6, 36.9], zoom: 22}], territories: [NUMIDIA, EMPORIA, TYSCA, CARTHAGE_150, {...AFRICA_146, opacity: 0.75}], cities: [{...C3.carthagePlain, size: 1.8}]}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,6,2,0.88) 0%, rgba(10,6,2,0.3) 60%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 50, top: 150, fontFamily: CINZEL, fontWeight: 700, fontSize: 140, color: '#f4ecd8', textShadow: stroke, lineHeight: 1}}>CARTHAGE</div>
        <div style={{position: 'absolute', left: 56, top: 320, fontFamily: INTER, fontWeight: 800, fontSize: 66, color: '#ef6a5e', textShadow: stroke}}>MUST BE DESTROYED</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    const col = (label: string, n: string, color: string, left: boolean) => (
      <div style={{position: 'absolute', top: 0, bottom: 0, [left ? 'left' : 'right']: 0, width: W / 2, background: color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 120, color: '#fff', textShadow: stroke}}>{n}</div>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: '#fff', textShadow: stroke}}>{label}</div>
      </div>
    );
    return (
      <AbsoluteFill style={{background: '#000'}}>
        {col('WEAPONS GIVEN UP', '200,000', '#b56f1f', true)}
        {col('THEN ROME BURNED IT', '146 BC', '#8f2620', false)}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 36, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 46, color: '#fff', textShadow: stroke}}>WHY?</div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <MapShot width={W} height={H} p={1} uid="t3" spec={{camera: [{at: 0, center: [11.2, 39.2], zoom: 6.6}], territories: [ROME_ITALY, SICILY, NUMIDIA, CARTHAGE_150], cities: [C3.romePlain, C3.carthage], modern: {labels: MODERN}, routes: [{id: 'f', points: [[10.32, 36.85], [11.2, 38.0], [11.6, 39.6], [12.1, 41.0], [12.48, 41.9]], color: COL3.route, draw: [0, 0.01], dashed: true, width: 12}]}} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(10,6,2,0.0) 45%, rgba(10,6,2,0.8) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 110, color: '#fff', textShadow: stroke}}>ONE FIG STARTED IT</div>
    </AbsoluteFill>
  );
};
