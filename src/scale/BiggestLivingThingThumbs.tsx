import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc, useArtIndex} from '../../packages/engine/src/map/media';
import {SatZoomShot, SatZoomSpec} from '../../packages/engine/src/scale/satzoom';

// B003 thumbnails (PLAYBOOK 3.3 + B002 lesson: show the contrast itself). 3840×2160; designed on a 1920×1080 stage
// scaled ×2. Real EOxCloudless satellite (credit line kept small but visible: the licence requires it on the image).
const stroke = '0 8px 0 #000, 0 0 40px rgba(0,0,0,0.9)';
const EOX = 'EOxCloudless 2016 · EOX IT Services GmbH · Copernicus Sentinel data 2016 · CC BY 4.0';

const SB: [number, number] = [113.65, -25.95];
const layers = ['sb-z8', 'sb-z10', 'sb-z12', 'sb-z14'];
const SITES: [number, number][] = [[113.07, -25.72], [113.55, -25.61], [113.46, -25.81], [113.72, -25.79], [113.885, -25.85], [113.62, -26.11], [113.8, -26.26]];

const Stage: React.FC<{spec: SatZoomSpec; children?: React.ReactNode}> = ({spec, children}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(2)', transformOrigin: '0 0', overflow: 'hidden'}}>
      <SatZoomShot spec={{...spec, scaleBar: false, credit: undefined}} p={0.5} elapsed={0} />
      {children}
      <div style={{position: 'absolute', right: 14, bottom: 8, fontFamily: INTER, fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 3px #000'}}>{EOX}</div>
    </div>
  </AbsoluteFill>
);

const pins = SITES.map((at) => ({type: 'pin' as const, at, color: '#5ef0a8'}));
const ruler = {type: 'path' as const, pts: [[-90000, -112000], [90000, -112000]] as [number, number][], color: '#5ef0a8'};

export const BiggestLivingThingThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  const index = useArtIndex();
  if (variant === 1) {
    return (
      <Stage spec={{layers, origin: SB, camera: [{at: 0, width: 260000, x: 0, y: -20000}], shapes: [...pins, ruler], dim: 0.05}}>
        <div style={{position: 'absolute', left: 60, top: 50, fontFamily: INTER, fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: '#fff', textShadow: stroke}}>
          1 <span style={{color: '#5ef0a8'}}>PLANT</span>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 870, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 96, color: '#5ef0a8', textShadow: stroke}}>180 km</div>
      </Stage>
    );
  }
  if (variant === 2) {
    const bw = index?.['bw-top'];
    return (
      <Stage spec={{layers, origin: SB, camera: [{at: 0, width: 230000, x: 0, y: -10000}], shapes: [...pins, ruler], dim: 0.2}}>
        {bw ? <Img src={artSrc('bw-top')} style={{position: 'absolute', left: 80, top: 190, width: 900, height: (900 * bw.h) / bw.w, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.8))'}} /> : null}
        <div style={{position: 'absolute', left: 90, top: 40, fontFamily: INTER, fontWeight: 900, fontSize: 150, color: '#fff', textShadow: stroke}}>
          NOT A <span style={{color: '#ff6b6b'}}>WHALE</span>
        </div>
        <div style={{position: 'absolute', right: 70, bottom: 90, fontFamily: INTER, fontWeight: 900, fontSize: 92, color: '#5ef0a8', textShadow: stroke, textAlign: 'right'}}>one plant ·<br />180 km</div>
      </Stage>
    );
  }
  const rr = (a: number) => Math.sqrt(a / Math.PI);
  return (
    <Stage spec={{layers, origin: SB, camera: [{at: 0, width: 62000, x: 0, y: -5000}], dim: 0.15, shapes: [
      {type: 'circle', r: rr(200e6), x: -9000, y: -6000, fill: true, color: '#5ef0a8'},
      {type: 'circle', r: rr(105.4e6), x: 10000, y: -6000, color: '#ff8fa3'},
    ]}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 170, color: '#fff', textShadow: stroke}}>
        <span style={{color: '#5ef0a8'}}>1 PLANT</span> = 2× <span style={{color: '#ff8fa3'}}>PARIS</span>
      </div>
    </Stage>
  );
};
