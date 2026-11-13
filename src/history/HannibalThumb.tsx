import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MapShot, CINZEL} from '../../packages/engine/src/map/map';
import {BattleShot} from '../../packages/engine/src/map/battle';
import {INTER} from '../../packages/engine/src/overlay';
import {SCENES} from '../../brands/history-maps/episodes/001-hannibal/scenes';
import {BARCID_SPAIN, CARTHAGE_AFRICA, COL, MARCH, ROME_ITALY, SARD_CORSICA, SICILY} from '../../brands/history-maps/data/punic';

// Thumbnails 1280×720 for Test & Compare: one subject, ≤3 words, high contrast.
const W = 1280;
const H = 720;
const stroke = '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.7)';

export const HannibalThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    return (
      <AbsoluteFill>
        <MapShot
          width={W}
          height={H}
          p={1}
          uid="t1"
          spec={{camera: [{at: 0, center: [6.5, 42.2], zoom: 9}], territories: [ROME_ITALY, SARD_CORSICA, SICILY, CARTHAGE_AFRICA, BARCID_SPAIN], routes: [{id: 'm', points: MARCH, color: COL.route, draw: [0, 0.01], width: 16, unit: {label: '', color: COL.carthage, kind: 'elephant'}}]}}
        />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,6,2,0.85) 0%, rgba(10,6,2,0.2) 60%, rgba(0,0,0,0) 100%)'}} />
        <div style={{position: 'absolute', left: 50, top: 170, fontFamily: CINZEL, fontWeight: 700, fontSize: 150, color: '#f4ecd8', textShadow: stroke, lineHeight: 1}}>HANNIBAL</div>
        <div style={{position: 'absolute', left: 56, top: 350, fontFamily: INTER, fontWeight: 800, fontSize: 70, color: '#f2c14e', textShadow: stroke}}>vs ROME</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    const side = (label: string, n: string, color: string, left: boolean) => (
      <div style={{position: 'absolute', top: 0, bottom: 0, [left ? 'left' : 'right']: 0, width: W / 2, background: color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 150, color: '#fff', textShadow: stroke}}>{n}</div>
        <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 64, color: '#fff', textShadow: stroke}}>{label}</div>
      </div>
    );
    return (
      <AbsoluteFill style={{background: '#000'}}>
        {side('ROME', '86,000', '#8f2620', true)}
        {side('HANNIBAL', '50,000', '#b56f1f', false)}
        <div style={{position: 'absolute', left: W / 2 - 90, top: H / 2 - 90, width: 180, height: 180, borderRadius: 90, background: '#111', border: '8px solid #f4ecd8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 80, color: '#f4ecd8'}}>VS</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 46, color: '#fff', textShadow: stroke}}>WHO WON?</div>
      </AbsoluteFill>
    );
  }
  const cannae = SCENES.c4e;
  return (
    <AbsoluteFill>
      {cannae.kind === 'battle' ? <BattleShot spec={{...cannae.battle, title: 'Cannae, 216 BC'}} p={1} width={W} height={H} /> : null}
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(10,6,2,0.0) 40%, rgba(10,6,2,0.75) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 130, color: '#fff', textShadow: stroke}}>THE PERFECT TRAP</div>
    </AbsoluteFill>
  );
};
