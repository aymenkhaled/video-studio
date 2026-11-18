import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc, useArtIndex} from '../../packages/engine/src/map/media';
import {pathFor, SHAPES} from '../../packages/engine/src/scale/shapes';

// B002 thumbnails v3 (after analytics: CTR 1.5 %): the honest image of a RUN-UP — water surging UP a mountainside
// (textured with the real USGS photo of Tracy Arm's stripped slope) to 481 m / 524 m, with known landmarks beside it
// at the same scale. One frame per variant (render mode=stills, stills=3). Designed 1280×720, rendered 3840×2160.

const stroke = '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.85)';
const GROUND = 690;

/** Mountain from foot (x0, GROUND) up to its peak, photo-textured, with water surging up the slope to height h px. */
const SurgeMountain: React.FC<{x0: number; peakX: number; peakY: number; h: number; uid: string; label: string; color: string}> = ({x0, peakX, peakY, h, uid, label, color}) => {
  const slopeX = (y: number) => x0 + ((GROUND - y) / (GROUND - peakY)) * (peakX - x0);
  const top = GROUND - h;
  const mountain = `${x0},${GROUND} ${peakX},${peakY} ${peakX + 60},${peakY + 30} 1280,${peakY + 120} 1280,${GROUND}`;
  // the surge: a tongue of water hugging the slope, thickest at the bottom, foaming at the top
  const surge: string[] = [];
  for (let k = 0; k <= 12; k++) {
    const y = GROUND - (h * k) / 12;
    surge.push(`${(slopeX(y) - 70 * (1 - k / 12) - 14).toFixed(1)},${y.toFixed(1)}`);
  }
  const back: string[] = [];
  for (let k = 12; k >= 0; k--) {
    const y = GROUND - (h * k) / 12;
    back.push(`${(slopeX(y) + 6).toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id={`m-${uid}`}>
          <polygon points={mountain} />
        </clipPath>
        <linearGradient id={`w-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#0b3647" />
          <stop offset="0.75" stopColor="#3aa0c2" />
          <stop offset="1" stopColor="#e6f8fc" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#m-${uid})`}>
        <image href={artSrc('ta-scar')} x={x0 - 80} y={peakY - 40} width={1280 - x0 + 160} height={GROUND - peakY + 80} preserveAspectRatio="xMidYMid slice" />
        <rect x={0} y={0} width={1280} height={720} fill="rgba(10,20,25,0.18)" />
      </g>
      <polygon points={mountain} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
      <polygon points={`${surge.join(' ')} ${back.join(' ')}`} fill={`url(#w-${uid})`} />
      <polyline points={surge.slice(6).join(' ')} fill="none" stroke="#ffffff" strokeWidth={6} strokeLinejoin="round" />
      {Array.from({length: 40}, (_, i) => (
        <circle key={i} cx={slopeX(top) - 30 + ((i * 41) % 70)} cy={top - 6 - ((i * 23) % 50)} r={2 + (i % 4)} fill="rgba(255,255,255,0.9)" />
      ))}
      {/* fjord water at sea level */}
      <rect x={0} y={GROUND} width={1280} height={30} fill="#103a4a" />
      {/* run-up line across to the landmarks */}
      <line x1={0} x2={slopeX(top)} y1={top} y2={top} stroke={color} strokeWidth={5} strokeDasharray="16 10" />
      <rect x={slopeX(top) - 250} y={top - 62} width={230} height={52} rx={10} fill="rgba(10,14,18,0.85)" />
      <text x={slopeX(top) - 135} y={top - 24} textAnchor="middle" fontFamily={INTER} fontWeight={900} fontSize={38} fill={color}>
        {label}
      </text>
    </svg>
  );
};

const Esb: React.FC<{x: number; h: number}> = ({x, h}) => (
  <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id={`lit-${x}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fbf7ec" />
        <stop offset="0.5" stopColor="#d8d0bd" />
        <stop offset="1" stopColor="#8f8878" />
      </linearGradient>
    </defs>
    <path d={pathFor(SHAPES.esb, {x, y: GROUND, len: h, t: 0})} fill={`url(#lit-${x})`} stroke="#111" strokeWidth={3} />
  </svg>
);

const Sky: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(180deg, #34505f 0%, #8eaab8 75%, #d4dfe3 100%)'}} />;

const V1: React.FC = () => {
  const s = 1.25; // px per metre: water line 481 m, Empire State Building 443 m
  return (
    <AbsoluteFill>
      <Sky />
      <SurgeMountain uid="v1" x0={520} peakX={1180} peakY={30} h={481 * s} label="481 m" color="#ffd166" />
      <Esb x={300} h={443 * s} />
      <div style={{position: 'absolute', left: 26, top: 380, fontFamily: INTER, fontWeight: 900, fontSize: 96, lineHeight: 0.95, color: '#fff', textShadow: stroke}}>
        WATER
        <br />
        <span style={{color: '#ffd166'}}>CLIMBED</span>
      </div>
    </AbsoluteFill>
  );
};

const V2: React.FC = () => {
  // the real photo, big and bright, with one plain number
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={artSrc('ta-runup')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% 35%', transform: 'scale(1.25)', transformOrigin: '60% 35%', filter: 'contrast(1.2) saturate(1.3)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)'}} />
      <div style={{position: 'absolute', left: 40, top: 150, fontFamily: INTER, fontWeight: 900, fontSize: 190, lineHeight: 0.9, color: '#ffd166', textShadow: stroke}}>481 m</div>
      <div style={{position: 'absolute', left: 48, top: 330, fontFamily: INTER, fontWeight: 900, fontSize: 80, lineHeight: 1, color: '#fff', textShadow: stroke}}>
        UP THIS
        <br />
        MOUNTAIN
      </div>
    </AbsoluteFill>
  );
};

const V3: React.FC = () => {
  const index = useArtIndex();
  const lib = index?.['liberty-cut'];
  const eif = index?.['eiffel-cut'];
  const s = 1.1; // record 524 m vs landmarks
  return (
    <AbsoluteFill>
      <Sky />
      <SurgeMountain uid="v3" x0={560} peakX={1200} peakY={20} h={524 * s} label="524 m" color="#ff6b5e" />
      {lib ? <Img src={artSrc('liberty-cut')} style={{position: 'absolute', left: 40, top: GROUND - 93 * s, height: 93 * s, width: (93 * s * lib.w) / lib.h}} /> : null}
      {eif ? <Img src={artSrc('eiffel-cut')} style={{position: 'absolute', left: 120, top: GROUND - 330 * s, height: 330 * s, width: (330 * s * eif.w) / eif.h}} /> : null}
      <Esb x={330} h={443 * s} />
      <div style={{position: 'absolute', left: 420, top: 40, fontFamily: INTER, fontWeight: 900, fontSize: 92, lineHeight: 0.95, color: '#fff', textShadow: stroke}}>
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
