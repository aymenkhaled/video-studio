import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';
import {pathFor, SHAPES, ShapeKey} from '../../packages/engine/src/scale/shapes';

// Channel identity for "Scale & Science": profile picture (800×800, shown as a circle) and banner (2560×1440,
// all text inside YouTube's 1546×423 central safe area). Original silhouettes + a public-domain NOAA photo.
const GOLD = '#ffd166';
const PAPER = '#f6f1e4';

const Sil: React.FC<{shape: ShapeKey; x: number; y: number; len: number; color: string; w: number; h: number; flip?: boolean}> = ({shape, x, y, len, color, w, h, flip}) => (
  <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
    <path d={pathFor(SHAPES[shape], {x, y, len, t: 0.4, flip})} fill={color} stroke="rgba(0,0,0,0.6)" strokeWidth={4} />
  </svg>
);

export const ScaleChannel1: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1f6d8f 0%, #08263a 70%)'}}>
    {/* a whale too big for the frame, and you */}
    <Sil shape="blueWhale" x={-260} y={430} len={1300} color="#7fa7c4" w={800} h={800} />
    <Sil shape="human" x={560} y={640} len={120} color={GOLD} w={800} h={800} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 190, letterSpacing: -4, color: PAPER, textShadow: '0 8px 0 #000'}}>
      S<span style={{color: GOLD}}>&</span>S
    </div>
    <div style={{position: 'absolute', left: 120, right: 120, top: 700, height: 8, background: GOLD, borderRadius: 4}} />
  </AbsoluteFill>
);

export const ScaleChannel2: React.FC = () => (
  <AbsoluteFill style={{background: '#04121c'}}>
    <Img src={artSrc('bw-two')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.15) saturate(1.15)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(4,18,28,0.75) 0%, rgba(4,18,28,0.35) 50%, rgba(4,18,28,0.7) 100%)'}} />
    {/* safe area: 1546 × 423 centred */}
    <div style={{position: 'absolute', left: (2560 - 1546) / 2, top: (1440 - 423) / 2, width: 1546, height: 423, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 140, letterSpacing: 4, color: PAPER, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>
        SCALE <span style={{color: GOLD}}>&</span> SCIENCE
      </div>
      <div style={{width: 260, height: 5, background: GOLD, margin: '14px 0 20px'}} />
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 48, color: GOLD, textShadow: '0 3px 0 #000', whiteSpace: 'nowrap'}}>Giants, disasters and space, measured next to you.</div>
    </div>
    {/* a scale line-up just under the safe area (visible on TV/desktop, cropped on phones) */}
    <Sil shape="human" x={1010} y={1010} len={40} color={GOLD} w={2560} h={1440} />
    <Sil shape="bus" x={1060} y={1010} len={110} color="#e39a2d" w={2560} h={1440} />
    <Sil shape="megalodon" x={1200} y={985} len={190} color="#4f6272" w={2560} h={1440} />
    <Sil shape="blueWhale" x={1420} y={985} len={300} color="#7fa7c4" w={2560} h={1440} />
  </AbsoluteFill>
);
