import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MapShot, type MapSpec, type Route} from '../../packages/engine/src/map/map';
import {INTER} from '../../packages/engine/src/overlay';
import {ALL_POINTS, COL4, POLO_POINTS} from '../../brands/history-maps/data/battuta';

// Thumbnails 1280×720 (brief: map-led). Dark navy sea, cream land; Polo = thin grey line, Ibn Battuta = huge gold loop.
const stroke = '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.9)';
const GOLD: Route = {id: 'gold', points: ALL_POINTS, color: COL4.gold, draw: [0, 0.001], width: 13};
const POLO: Route = {id: 'polo', points: POLO_POINTS, color: '#8a939b', draw: [0, 0.001], width: 5};
const world = (routes: Route[], center: [number, number] = [50, 22], zoom = 2.05): MapSpec => ({camera: [{at: 0, center, zoom}, {at: 1, center, zoom}], routes});
const Map: React.FC<{spec: MapSpec; w: number; h: number; uid: string}> = ({spec, w, h, uid}) => (
  <div style={{position: 'absolute', inset: 0, filter: 'saturate(1.25) contrast(1.1)'}}>
    <MapShot spec={spec} p={1} width={w} height={h} uid={uid} elapsed={0} />
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; color: string; size?: number}> = ({text, x, y, color, size = 40}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: INTER, fontWeight: 900, fontSize: size, color, textShadow: stroke, letterSpacing: 2}}>{text}</div>
);

export const IbnBattutaThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    return (
      <AbsoluteFill style={{background: '#13243a'}}>
        <Map spec={world([POLO, GOLD])} w={1280} h={720} uid="t1" />
        <Tag text="POLO" x={640} y={170} color="#c9ced3" size={38} />
        <div style={{position: 'absolute', left: 40, bottom: 34, fontFamily: INTER, fontWeight: 900, fontSize: 132, lineHeight: 1, color: '#fff', textShadow: stroke}}>
          5× <span style={{color: COL4.gold}}>MARCO POLO</span>
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    return (
      <AbsoluteFill style={{background: '#13243a'}}>
        <Map spec={world([GOLD], [40, 18], 2.1)} w={1280} h={720} uid="t2" />
        {/* book icon at Fez, where the route ends */}
        <svg viewBox="0 0 120 90" style={{position: 'absolute', left: 300, top: 120, width: 150}}>
          <path d="M60 18 C45 6 20 6 6 12 V80 C20 74 45 74 60 86 C75 74 100 74 114 80 V12 C100 6 75 6 60 18 Z" fill="#f4ecd8" stroke="#000" strokeWidth="5" />
          <path d="M60 18 V86" stroke="#000" strokeWidth="5" />
          <path d="M16 28 H50 M16 42 H50 M16 56 H50 M70 28 H104 M70 42 H104 M70 56 H104" stroke={COL4.gold} strokeWidth="4" />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 116, color: '#fff', textShadow: stroke}}>
          WHY WAS HE <span style={{color: COL4.gold}}>ERASED?</span>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#13243a'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 400, height: 720, overflow: 'hidden', filter: 'grayscale(0.6) brightness(0.8)'}}>
        <Map spec={world([POLO], [70, 35], 2.6)} w={400} h={720} uid="t3a" />
        <Tag text="POLO" x={24} y={40} color="#c9ced3" size={44} />
      </div>
      <div style={{position: 'absolute', left: 400, top: 0, width: 8, height: 720, background: '#000'}} />
      <div style={{position: 'absolute', left: 408, top: 0, width: 872, height: 720, overflow: 'hidden'}}>
        <Map spec={world([GOLD], [52, 22], 2.35)} w={872} h={720} uid="t3b" />
      </div>
      <div style={{position: 'absolute', left: 440, bottom: 30, fontFamily: INTER, fontWeight: 900, fontSize: 140, color: COL4.gold, textShadow: stroke}}>117,000 KM</div>
    </AbsoluteFill>
  );
};
