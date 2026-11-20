import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {INTER} from '../../packages/engine/src/overlay';
import {artSrc} from '../../packages/engine/src/map/media';
import {MapShot} from '../../packages/engine/src/map/map';
import {SCENES} from '../../brands/money-maps/episodes/003-phantom-borders/scenes';

// Thumbnails 1280×720 (rendered 1920×1080). Design-first after C002 (CTR 2.0 %): one real map/image + the ghost line
// itself (the "tension device") + ≤ 3 words that don't repeat the title. Every claim is in sources.md.
const stroke = '0 6px 0 #000, 0 0 34px rgba(0,0,0,0.85)';
const cover = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const};
const GOLD = '#ffd166';
const RED = '#ff6a4d';

const mapOf = (id: string) => {
  const d = SCENES[id];
  return d.kind === 'map' ? d.map : null;
};

export const PhantomBordersThumb: React.FC<{variant: 1 | 2 | 3}> = ({variant}) => {
  if (variant === 1) {
    // Germany's 2025 money map with the vanished East–West border glowing exactly on the colour edge (G2, G3)
    const spec = mapOf('o2');
    return (
      <AbsoluteFill style={{background: '#13212e'}}>
        {spec ? <div style={{position: 'absolute', left: 260, top: -40, width: 1280, height: 800}}><MapShot spec={{...spec, choropleth: spec.choropleth ? {...spec.choropleth, labels: undefined, legend: undefined} : undefined, modern: undefined, camera: [{at: 0, center: [10.5, 51.2], zoom: 17}]}} p={1} width={1280} height={800} uid="t1" /></div> : null}
        <div style={{position: 'absolute', left: 40, top: 70, fontFamily: INTER, fontWeight: 900, lineHeight: 0.95, color: '#fff', textShadow: stroke}}>
          <div style={{fontSize: 120}}>GONE</div>
          <div style={{fontSize: 120, color: GOLD}}>1990</div>
        </div>
        <div style={{position: 'absolute', left: 40, bottom: 60, fontFamily: INTER, fontWeight: 900, fontSize: 92, lineHeight: 1, color: RED, textShadow: stroke}}>STILL THERE</div>
      </AbsoluteFill>
    );
  }
  if (variant === 2) {
    // The Black Belt crescent from space (NASA, PD): an ancient coastline (B1, B3)
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={artSrc('blackbelt-space')} style={{...cover, objectPosition: '62% 42%', transform: 'scale(1.6)', filter: 'brightness(1.1) contrast(1.25) saturate(1.2)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)'}} />
        <div style={{position: 'absolute', left: 50, top: 40, fontFamily: INTER, fontWeight: 900, fontSize: 104, lineHeight: 1, color: GOLD, textShadow: stroke}}>DINOSAUR COAST</div>
        <div style={{position: 'absolute', right: 50, bottom: 46, fontFamily: INTER, fontWeight: 900, fontSize: 96, lineHeight: 1, color: '#fff', textShadow: stroke}}>STILL POOR</div>
      </AbsoluteFill>
    );
  }
  // Rome's frontier glowing across Germany (R1, R2)
  const spec = mapOf('c4a');
  return (
    <AbsoluteFill style={{background: '#13212e'}}>
      {spec ? <MapShot spec={{...spec, regions: undefined, cities: undefined, modern: undefined, ghosts: spec.ghosts?.map((g) => ({...g, label: undefined, width: 10})), camera: [{at: 0, center: [9.55, 49.6], zoom: 21}]}} p={1} width={1280} height={720} uid="t3" /> : null}
      <div style={{position: 'absolute', left: 40, top: 40, fontFamily: INTER, fontWeight: 900, fontSize: 112, lineHeight: 1, color: '#fff', textShadow: stroke}}>ROME&apos;S LINE</div>
      <div style={{position: 'absolute', right: 40, bottom: 40, fontFamily: INTER, fontWeight: 900, fontSize: 96, lineHeight: 1, color: GOLD, textShadow: stroke}}>STILL GLOWS</div>
    </AbsoluteFill>
  );
};
