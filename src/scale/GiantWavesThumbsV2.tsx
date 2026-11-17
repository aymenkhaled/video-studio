import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc, useArtIndex} from '../../packages/engine/src/map/media';
import {pathFor, SHAPES} from '../../packages/engine/src/scale/shapes';

// B002 thumbnails v2 (after analytics: CTR 1.5 %): show the SIZE CONTRAST itself at phone size — a wall of water
// towering over a known building and a tiny person — instead of a landscape photo. One frame per variant
// (render with mode=stills, stills=3). Designed at 1280×720, rendered at 3840×2160. All heights to scale.

const stroke = '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.8)';
const GROUND = 690;

/** water wall up to `h` px above the ground, with a curling crest and foam (static, frame-free). */
const WaterWall: React.FC<{h: number; x0?: number; x1?: number}> = ({h, x0 = 0, x1 = 1280}) => {
  const top = GROUND - h;
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 20) pts.push(`${x},${(top + 10 * Math.sin(x / 60) + 6 * Math.sin(x / 23)).toFixed(1)}`);
  return (
    <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="ww" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfeaf5" />
          <stop offset="0.06" stopColor="#3e9cbc" />
          <stop offset="0.55" stopColor="#14506a" />
          <stop offset="1" stopColor="#082634" />
        </linearGradient>
      </defs>
      <polygon points={`${x0},${GROUND + 40} ${pts.join(' ')} ${x1},${GROUND + 40}`} fill="url(#ww)" />
      <polyline points={pts.join(' ')} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinejoin="round" />
      {Array.from({length: 60}, (_, i) => (
        <circle key={i} cx={x0 + ((i * 97) % (x1 - x0))} cy={top - 8 - ((i * 37) % 40)} r={2 + (i % 4)} fill="rgba(255,255,255,0.8)" />
      ))}
    </svg>
  );
};

const Building: React.FC<{shape: 'esb' | 'burj'; x: number; h: number}> = ({shape, x, h}) => (
  <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id={`lit-${shape}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fbf7ec" />
        <stop offset="0.5" stopColor="#d8d0bd" />
        <stop offset="1" stopColor="#8f8878" />
      </linearGradient>
    </defs>
    <path d={pathFor(SHAPES[shape], {x, y: GROUND, len: h, t: 0})} fill={`url(#lit-${shape})`} stroke="#111" strokeWidth={4} />
  </svg>
);

const Person: React.FC<{x: number; h: number}> = ({x, h}) => (
  <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
    <path d={pathFor(SHAPES.human, {x, y: GROUND, len: h, t: 0})} fill="#ffd166" stroke="#000" strokeWidth={2} />
  </svg>
);

const Sky: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(180deg, #2b3f52 0%, #7d97a8 70%, #c9d6dc 100%)'}} />;

const V1: React.FC = () => {
  // 481 m of water vs the 443 m Empire State Building (both to scale: 1.3 px per metre)
  const s = 1.3;
  return (
    <AbsoluteFill>
      <Sky />
      <WaterWall h={481 * s} x0={0} x1={1280} />
      <Building shape="esb" x={720} h={443 * s} />
      <Person x={690} h={16} />
      <div style={{position: 'absolute', left: 40, top: 30, fontFamily: INTER, fontWeight: 900, fontSize: 170, lineHeight: 0.95, color: '#ffd166', textShadow: stroke}}>481 m</div>
      <div style={{position: 'absolute', left: 48, top: 205, fontFamily: INTER, fontWeight: 900, fontSize: 70, color: '#fff', textShadow: stroke}}>OF WATER</div>
    </AbsoluteFill>
  );
};

const V2: React.FC = () => {
  // real photo of the stripped fjord on the left, the to-scale comparison on the right
  const s = 1.15;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('ta-runup')} style={{position: 'absolute', left: 0, top: 0, width: 760, height: 720, objectFit: 'cover', objectPosition: '55% 40%', filter: 'contrast(1.2) saturate(1.25)'}} />
      <div style={{position: 'absolute', left: 760, top: 0, width: 520, height: 720, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -760, top: 0, width: 1280, height: 720}}>
          <Sky />
          <WaterWall h={481 * s} x0={760} x1={1280} />
          <Building shape="esb" x={990} h={443 * s} />
          <Person x={930} h={14} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 760, top: 0, width: 8, height: 720, background: '#ffd166'}} />
      <div style={{position: 'absolute', left: 36, bottom: 30, fontFamily: INTER, fontWeight: 900, fontSize: 104, lineHeight: 1, color: '#fff', textShadow: stroke}}>
        THIS <span style={{color: '#ffd166'}}>HIGH</span>
      </div>
    </AbsoluteFill>
  );
};

const V3: React.FC = () => {
  // the ladder: Statue of Liberty, Eiffel Tower, ESB, and the record water line above them all (0.95 px/m)
  const index = useArtIndex();
  const lib = index?.['liberty-cut'];
  const eif = index?.['eiffel-cut'];
  const s = 1.05;
  return (
    <AbsoluteFill>
      <Sky />
      <WaterWall h={524 * s} />
      {lib ? <Img src={artSrc('liberty-cut')} style={{position: 'absolute', left: 180, top: GROUND - 93 * s, height: 93 * s, width: (93 * s * lib.w) / lib.h}} /> : null}
      {eif ? <Img src={artSrc('eiffel-cut')} style={{position: 'absolute', left: 330, top: GROUND - 330 * s, height: 330 * s, width: (330 * s * eif.w) / eif.h}} /> : null}
      <Building shape="esb" x={640} h={443 * s} />
      <div style={{position: 'absolute', right: 40, top: 40, textAlign: 'right', fontFamily: INTER, fontWeight: 900, fontSize: 120, lineHeight: 1, color: '#fff', textShadow: stroke}}>
        TALLEST
        <br />
        <span style={{color: '#ff6b5e'}}>EVER</span>
      </div>
    </AbsoluteFill>
  );
};

export const GiantWavesThumbsV2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{width: 1280, height: 720, transform: 'scale(3)', transformOrigin: '0 0', position: 'relative', overflow: 'hidden'}}>{f === 0 ? <V1 /> : f === 1 ? <V2 /> : <V3 />}</div>
    </AbsoluteFill>
  );
};
