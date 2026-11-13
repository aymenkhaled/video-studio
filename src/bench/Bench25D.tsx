import React, {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {easeInOutCubic, ramp} from '../../packages/engine/src/motion';

// Benchmark: 2.5D parallax — one dense displaced plane (image + depth map), slow dolly/orbit.
// Real episodes feed a painting + Depth-Anything-V2-Small depth; here both are procedural
// so the benchmark needs no external image.

const W = 1024;
const H = 1820;

const makeTextures = () => {
  const color = document.createElement('canvas');
  const depth = document.createElement('canvas');
  color.width = depth.width = W;
  color.height = depth.height = H;
  const c = color.getContext('2d')!;
  const d = depth.getContext('2d')!;
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#f2c58a');
  sky.addColorStop(0.6, '#c27a52');
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  d.fillStyle = '#000';
  d.fillRect(0, 0, W, H);
  const layers = ['#8a5a4a', '#6b4038', '#4a2b2a', '#2a1a1c'];
  layers.forEach((col, li) => {
    const base = H * (0.45 + li * 0.13);
    c.fillStyle = col;
    d.fillStyle = `rgb(${60 + li * 60},${60 + li * 60},${60 + li * 60})`;
    for (const ctx of [c, d]) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 16) {
        const y = base - 120 * Math.abs(Math.sin(x / (140 + li * 40) + li)) - 40 * random(`ridge-${li}-${x}`);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }
  });
  return {map: new THREE.CanvasTexture(color), depth: new THREE.CanvasTexture(depth)};
};

const Cam: React.FC<{t: number}> = ({t}) => {
  const camera = useThree((s) => s.camera);
  const k = easeInOutCubic(ramp(t, 0, 10));
  camera.position.set(-0.35 + 0.7 * k, 0.1 * Math.sin(k * Math.PI), 6.2 - 1.2 * k);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  return null;
};

export const Bench25D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const tex = useMemo(makeTextures, []);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} camera={{fov: 40, near: 0.1, far: 100}}>
        <Cam t={frame / fps} />
        <ambientLight intensity={3.1} />
        <mesh>
          <planeGeometry args={[W / 256, H / 256, 256, 456]} />
          <meshStandardMaterial map={tex.map} displacementMap={tex.depth} displacementScale={1.2} roughness={1} metalness={0} />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
