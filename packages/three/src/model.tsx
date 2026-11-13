import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Ported from the T. rex / Whip films (lib.jsx). Loads FBX/GLB, applies flat-shaded
// stylised materials, scales to a target height in metres, puts feet on y=0, centres x/z.

export type Palette = Record<string, string>;

export const PALETTES: Record<string, Palette> = {
  Trex: {Green: '#4a5a36', LightGreen: '#7d7a48', LightYellow: '#c79f63', Black: '#121212', Red: '#6e1a20'},
  Apatosaurus: {Brown: '#5f5c47', LightBrown: '#a38d64', Black: '#151515', Material: '#2a2622'},
  Parasaurolophus: {Green: '#3f5a4a', LightGreen: '#6f8f74', LightYellow: '#c9b98a', Red: '#b5462f'},
};

type Loaded = THREE.Group & {animations: THREE.AnimationClip[]};
const cache = new Map<string, Promise<Loaded>>();

const load = (file: string, height: number, palette: Palette): Promise<Loaded> => {
  const key = `${file}:${height}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const url = staticFile(file);
  const p = (file.endsWith('.fbx')
    ? new FBXLoader().loadAsync(url).then((o) => ({scene: o as THREE.Object3D, animations: o.animations}))
    : new GLTFLoader().loadAsync(url).then((g) => ({scene: g.scene as THREE.Object3D, animations: g.animations}))
  ).then(({scene, animations}) => {
    scene.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      const conv = (m: THREE.Material) =>
        new THREE.MeshStandardMaterial({name: m.name, color: palette[m.name] ?? (m as THREE.MeshStandardMaterial).color ?? '#8a7a5a', roughness: 0.78, metalness: 0, flatShading: true});
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(conv) : conv(mesh.material);
    });
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    scene.scale.multiplyScalar(height / size.y);
    const box2 = new THREE.Box3().setFromObject(scene);
    const c = box2.getCenter(new THREE.Vector3());
    scene.position.set(-c.x, -box2.min.y, -c.z);
    const wrap = new THREE.Group() as Loaded;
    wrap.add(scene);
    wrap.animations = animations;
    return wrap;
  });
  cache.set(key, p);
  return p;
};

/** Load once per render worker; blocks the frame until ready. `file` is relative to public/. */
export const useModel = (file: string, height: number, palette: Palette = {}) => {
  const [obj, setObj] = useState<Loaded | null>(null);
  const [handle] = useState(() => delayRender(`load ${file}`, {timeoutInMilliseconds: 120000}));
  useEffect(() => {
    load(file, height, palette)
      .then((o) => {
        setObj(o);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }, [file, height, handle, palette]);
  return obj;
};

/** Poses `obj` at time `t` (s) of the clip whose name ends with `_<clip>` (Quaternius naming), optional crossfade. */
export const Actor: React.FC<{
  obj: Loaded | null;
  clip: string;
  t: number;
  from?: string;
  fromT?: number;
  blend?: number;
  post?: (o: THREE.Object3D) => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({obj, clip, t, from, fromT = 0, blend = 1, post, position, rotation}) => {
  const mixer = useMemo(() => (obj ? new THREE.AnimationMixer(obj) : null), [obj]);
  if (!obj || !mixer) return null;
  const find = (n: string) => obj.animations.find((c) => c.name.endsWith('_' + n)) ?? obj.animations[0];
  mixer.stopAllAction();
  mixer.uncacheRoot(obj);
  const a = mixer.clipAction(find(clip));
  a.play();
  a.time = t % a.getClip().duration;
  a.weight = blend;
  if (from && blend < 1) {
    const b = mixer.clipAction(find(from));
    b.play();
    b.time = fromT % b.getClip().duration;
    b.weight = 1 - blend;
  }
  mixer.update(0);
  post?.(obj);
  return <primitive object={obj} position={position} rotation={rotation} />;
};
