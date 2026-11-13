import React, {useEffect, useMemo, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {continueRender, delayRender, random, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

// Ported from env.jsx: instanced CC0 vegetation, blob contact shadows, HDRI image-based light.

type Part = {geo: THREE.BufferGeometry; mat: THREE.Material | THREE.Material[]};
export type Spec = Record<string, [file: string, tint?: Record<string, string>]>;
export type Lib = Record<string, Part[]>;
export type Item = {p: [number, number, number]; s: number; r: number};

const partCache = new Map<string, Promise<Part[]>>();
const loadParts = (file: string, tint?: Record<string, string>) => {
  const key = file + JSON.stringify(tint ?? {});
  if (!partCache.has(key)) {
    partCache.set(
      key,
      new GLTFLoader().loadAsync(staticFile(file)).then((g) => {
        g.scene.updateMatrixWorld(true);
        const parts: Part[] = [];
        g.scene.traverse((c) => {
          const mesh = c as THREE.Mesh;
          if (!mesh.isMesh) return;
          const geo = mesh.geometry.clone();
          geo.applyMatrix4(mesh.matrixWorld);
          const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
          mats.forEach((m) => {
            if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
            m.roughness = 0.95;
            m.metalness = 0;
            const t = tint?.[m.name] ?? tint?.['*'];
            if (t) m.color.set(t);
            if (/^Bark/.test(m.name)) m.color.set('#8a7766');
          });
          parts.push({geo, mat: mesh.material});
        });
        return parts;
      }),
    );
  }
  return partCache.get(key)!;
};

export const useLib = (spec: Spec) => {
  const [lib, setLib] = useState<Lib | null>(null);
  const [h] = useState(() => delayRender('env models', {timeoutInMilliseconds: 120000}));
  useEffect(() => {
    Promise.all(Object.entries(spec).map(([k, [file, tint]]) => loadParts(file, tint).then((p) => [k, p] as const))).then((e) => {
      setLib(Object.fromEntries(e));
      continueRender(h);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return lib;
};

const dummy = new THREE.Object3D();
/** One InstancedMesh per model part; optional wind sway (rx, rz) per instance. */
export const Instances: React.FC<{parts: Part[]; items: Item[]; t?: number; sway?: number; cast?: boolean}> = ({parts, items, t = 0, sway = 0, cast = false}) => {
  const meshes = useMemo(
    () =>
      parts.map(({geo, mat}) => {
        const m = new THREE.InstancedMesh(geo, mat, items.length);
        m.castShadow = cast;
        m.receiveShadow = true;
        m.frustumCulled = false;
        return m;
      }),
    [parts, items.length, cast],
  );
  items.forEach((d, i) => {
    const w = sway * Math.sin(t * 0.9 + i * 1.7);
    dummy.position.set(...d.p);
    dummy.rotation.set(w * 0.6, d.r, w);
    dummy.scale.setScalar(d.s);
    dummy.updateMatrix();
    meshes.forEach((m) => m.setMatrixAt(i, dummy.matrix));
  });
  meshes.forEach((m) => (m.instanceMatrix.needsUpdate = true));
  return (
    <>
      {meshes.map((m, k) => (
        <primitive key={k} object={m} />
      ))}
    </>
  );
};

/** Deterministic scatter in a ring/box, rejecting points where `keepOut` returns true. */
export const scatter = (n: number, key: string, gen: (r: (s: string) => number) => Item, keepOut: (x: number, z: number) => boolean) => {
  const out: Item[] = [];
  for (let i = 0; out.length < n && i < n * 30; i++) {
    const d = gen((s) => random(`${key}-${s}-${i}`));
    if (!keepOut(d.p[0], d.p[2])) out.push(d);
  }
  return out;
};

let blobTex: THREE.CanvasTexture | null = null;
const getBlob = () => {
  if (blobTex) return blobTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  gr.addColorStop(0, 'rgba(0,0,0,1)');
  gr.addColorStop(0.5, 'rgba(0,0,0,0.55)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  blobTex = new THREE.CanvasTexture(c);
  return blobTex;
};
/** Soft contact shadow under a subject (reads as weight on the ground). */
export const Blob: React.FC<{x: number; z: number; rx: number; rz?: number; opacity?: number}> = ({x, z, rx, rz, opacity = 0.55}) => (
  <mesh position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[rx, rz ?? rx * 0.8, 1]} renderOrder={2}>
    <planeGeometry args={[1, 1]} />
    <meshBasicMaterial map={getBlob()} transparent depthWrite={false} opacity={opacity} color="#000" />
  </mesh>
);

const hdrCache = new Map<string, Promise<THREE.DataTexture>>();
export const useHDRI = (file: string) => {
  const [tex, setTex] = useState<THREE.DataTexture | null>(null);
  const [h] = useState(() => delayRender('hdri', {timeoutInMilliseconds: 120000}));
  useEffect(() => {
    if (!hdrCache.has(file)) hdrCache.set(file, new RGBELoader().loadAsync(staticFile(file)));
    hdrCache.get(file)!.then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      setTex(t);
      continueRender(h);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return tex;
};

export const EnvLight: React.FC<{tex: THREE.Texture | null; intensity?: number}> = ({tex, intensity = 0.6}) => {
  const scene = useThree((s) => s.scene);
  scene.environment = tex;
  scene.environmentIntensity = intensity;
  return null;
};
