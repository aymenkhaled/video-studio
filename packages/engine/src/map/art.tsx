import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {easeInOutCubic, mix, ramp} from '../motion';
import {INTER} from '../overlay';
import {artSrc, useArtIndex} from './media';

// Painting / engraving / artefact / photo shot (Clarity Kit): slow camera move over a real image, with 2.5D
// parallax when fetch_media.py produced depth layers (base + mid + near cut-outs), and a credit plate.

export type ArtSpec = {
  id: string;
  /** Normalised focus points (0..1 of the image) at scene start and end; zoom 1 = image covers the frame. */
  from?: {x: number; y: number; zoom: number};
  to?: {x: number; y: number; zoom: number};
  /** Plate text, e.g. "J. M. W. Turner, The Decline of the Carthaginian Empire, 1817". */
  title?: string;
  /** Frame the image inside the shot instead of cover (coins, small objects). */
  object?: boolean;
};

export const ArtShot: React.FC<{art: ArtSpec; p: number; width: number; height: number}> = ({art, p, width, height}) => {
  const index = useArtIndex();
  const meta = index?.[art.id];
  const k = easeInOutCubic(p);
  const a = art.from ?? {x: 0.5, y: 0.5, zoom: 1.0};
  const b = art.to ?? {x: 0.5, y: 0.45, zoom: 1.15};
  const fx = mix(a.x, b.x, k);
  const fy = mix(a.y, b.y, k);
  const zoom = mix(a.zoom, b.zoom, k);
  if (!meta) {
    // Media not fetched (local preview): dark placeholder with the title, never a crash.
    return (
      <AbsoluteFill style={{background: '#1a140c', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontSize: 40, color: '#d9cdb0'}}>
        [{art.id}]
      </AbsoluteFill>
    );
  }
  const fit = art.object ? Math.min((width * 0.62) / meta.w, (height * 0.72) / meta.h) : Math.max(width / meta.w, height / meta.h);
  const s = fit * zoom;
  const w = meta.w * s;
  const h = meta.h * s;
  // keep the focus point centred, but never show the image edge in cover mode
  let left = width / 2 - fx * w;
  let top = height / 2 - fy * h;
  if (!art.object) {
    left = Math.min(0, Math.max(width - w, left));
    top = Math.min(0, Math.max(height - h, top));
  }
  const layer = (n: number, depth: number) => {
    // nearer layers drift further and grow a little more: parallax from the same camera path
    const dx = (fx - 0.5) * -w * 0.02 * depth + (k - 0.5) * width * 0.012 * depth;
    const grow = 1 + 0.025 * depth * k;
    return (
      <Img
        key={n}
        src={artSrc(art.id, n)}
        style={{position: 'absolute', left: left + dx - (w * (grow - 1)) / 2, top: top - (h * (grow - 1)) / 2, width: w * grow, height: h * grow}}
      />
    );
  };
  const plate = art.title ? easeInOutCubic(ramp(p, 0.04, 0.12)) * (1 - easeInOutCubic(ramp(p, 0.8, 0.9))) : 0;
  return (
    <AbsoluteFill style={{background: art.object ? 'radial-gradient(circle at 50% 45%, #2c2418 0%, #0d0a06 70%)' : '#0d0a06', overflow: 'hidden'}}>
      {layer(0, 0)}
      {meta.layers >= 1 ? layer(1, 1) : null}
      {meta.layers >= 2 ? layer(2, 2) : null}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      {plate > 0 ? (
        <div style={{position: 'absolute', right: 48, top: 40, maxWidth: 820, opacity: plate, background: 'rgba(12,9,5,0.78)', borderRight: '5px solid #d8b46a', padding: '12px 20px', fontFamily: INTER, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: '#f4ecd8', textAlign: 'right'}}>
          {art.title}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
