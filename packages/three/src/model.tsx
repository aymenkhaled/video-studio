import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Ported from the T. rex / Whip films (lib.jsx + env.jsx bakeAO). Loads FBX/GLB, applies flat-shaded
// stylised materials, scales to a real-world size in metres, puts feet on y=0, centres x/z,
// and measures each locomotion clip's ground speed from the planted foot (no foot sliding).
// userData.gait.Walk is SIGNED m/s along the model's local z (sign = which way it faces).

export type Palette = Record<string, string>;
export type Fit = {axis: 'height' | 'length'; metres: number};
export type Loaded = THREE.Group & {animations: THREE.AnimationClip[]; userData: {gait: Record<string, number>; size: THREE.Vector3}};

export const PALETTES: Record<string, Palette> = {
  Trex: {Green: '#4f5e38', LightGreen: '#8a8650', LightYellow: '#cfa968', Black: '#121212', Red: '#7a1f24'},
  Apatosaurus: {Brown: '#5f5c47', LightBrown: '#a38d64', Black: '#151515', Material: '#2a2622'},
  Parasaurolophus: {Green: '#3f5a4a', LightGreen: '#6f8f74', LightYellow: '#c9b98a', Red: '#b5462f'},
};

/** Darker underside and lower body via vertex colours: cheap contact/AO read without post-processing. */
export const bakeAO = (obj: THREE.Object3D, strength = 1) => {
  obj.traverse((node) => {
    const m = node as THREE.Mesh;
    if (!m.isMesh || m.userData.ao) return;
    const g = m.geometry;
    g.computeBoundingBox();
    const {min, max} = g.boundingBox!;
    const H = max.y - min.y || 1;
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    const col = new Float32Array(pos.count * 3);
    for (let v = 0; v < pos.count; v++) {
      const up = 0.5 + 0.5 * (nor ? nor.getY(v) : 1);
      const low = Math.min(1, Math.max(0, (pos.getY(v) - min.y) / H / 0.32));
      const ao = Math.max(0.35, 1 - strength * (0.42 * (1 - up) + 0.28 * (1 - low)));
      col[v * 3] = col[v * 3 + 1] = col[v * 3 + 2] = ao;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => {
      (mt as THREE.MeshStandardMaterial).vertexColors = true;
      mt.needsUpdate = true;
    });
    m.userData.ao = true;
  });
};

export const findClip = (obj: Loaded, name: string) =>
  obj.animations.find((c) => c.name.endsWith('_' + name) || c.name === name) ?? obj.animations[0];

/** Ground speed (m/s along +z) of a locomotion clip, from the foot that is planted. */
const measureGait = (obj: Loaded, clip: THREE.AnimationClip) => {
  const feet: THREE.Object3D[] = [];
  obj.traverse((c) => {
    if ((c as THREE.Bone).isBone && /Foot[LR]?$|Foot\.?[LR]$/i.test(c.name)) feet.push(c);
  });
  if (!feet.length) return 0;
  const mixer = new THREE.AnimationMixer(obj);
  const action = mixer.clipAction(clip);
  action.play();
  const S = 90;
  const samples = feet.map(() => [] as THREE.Vector3[]);
  for (let i = 0; i <= S; i++) {
    action.time = (clip.duration * i) / S;
    mixer.update(0);
    obj.updateMatrixWorld(true);
    feet.forEach((f, k) => samples[k].push(f.getWorldPosition(new THREE.Vector3())));
  }
  mixer.stopAllAction();
  mixer.uncacheRoot(obj);
  const dt = clip.duration / S;
  const speeds: number[] = [];
  samples.forEach((s) => {
    const ys = s.map((p) => p.y);
    const lo = Math.min(...ys);
    const range = Math.max(...ys) - lo || 1;
    for (let i = 1; i < s.length; i++) {
      if (s[i].y - lo < range * 0.08 && s[i - 1].y - lo < range * 0.08) speeds.push(-(s[i].z - s[i - 1].z) / dt);
    }
  });
  if (!speeds.length) return 0;
  speeds.sort((a, b) => a - b);
  // Signed: positive = model walks toward +z, negative = toward -z.
  return speeds[Math.floor(speeds.length / 2)];
};

const cache = new Map<string, Promise<Loaded>>();

const load = (file: string, fit: Fit, palette: Palette): Promise<Loaded> => {
  const key = `${file}:${fit.axis}:${fit.metres}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const url = staticFile(file);
  const p = (
    file.endsWith('.fbx')
      ? new FBXLoader().loadAsync(url).then((o) => ({scene: o as THREE.Object3D, animations: o.animations}))
      : new GLTFLoader().loadAsync(url).then((g) => ({scene: g.scene as THREE.Object3D, animations: g.animations}))
  ).then(({scene, animations}) => {
    scene.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      const conv = (m: THREE.Material) => {
        const src = m as THREE.MeshStandardMaterial;
        return new THREE.MeshStandardMaterial({
          name: m.name,
          color: palette[m.name] ?? (src.color ? src.color.clone() : new THREE.Color('#8a7a5a')),
          map: src.map ?? null,
          roughness: 0.78,
          metalness: 0,
          flatShading: true,
        });
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(conv) : conv(mesh.material);
    });
    bakeAO(scene, 1);
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    const current = fit.axis === 'height' ? size.y : Math.max(size.x, size.z);
    scene.scale.multiplyScalar(fit.metres / current);
    const box2 = new THREE.Box3().setFromObject(scene);
    const c = box2.getCenter(new THREE.Vector3());
    scene.position.set(-c.x, -box2.min.y, -c.z);
    const wrap = new THREE.Group() as Loaded;
    wrap.add(scene);
    wrap.animations = animations;
    wrap.userData = {gait: {}, size: box2.getSize(new THREE.Vector3())};
    for (const name of ['Walk', 'Run']) {
      const clip = animations.find((a) => a.name.endsWith('_' + name));
      if (clip) wrap.userData.gait[name] = measureGait(wrap, clip);
    }
    return wrap;
  });
  cache.set(key, p);
  return p;
};

/** Load once per render worker; blocks the frame until ready. `file` is relative to public/. */
export const useModel = (file: string, fit: Fit, palette: Palette = {}) => {
  const [obj, setObj] = useState<Loaded | null>(null);
  const [handle] = useState(() => delayRender(`load ${file}`, {timeoutInMilliseconds: 120000}));
  useEffect(() => {
    load(file, fit, palette).then((o) => {
      setObj(o);
      continueRender(handle);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, fit.axis, fit.metres]);
  return obj;
};

/** Poses `obj` at time `t` (s) of a clip (Quaternius `_<Name>` naming), optional crossfade + post-pose acting. */
export const Actor: React.FC<{
  obj: Loaded | null;
  clip: string;
  t: number;
  from?: string;
  fromT?: number;
  blend?: number;
  post?: (o: THREE.Object3D) => void;
  position?: [number, number, number];
  rotationY?: number;
}> = ({obj, clip, t, from, fromT = 0, blend = 1, post, position, rotationY = 0}) => {
  const mixer = useMemo(() => (obj ? new THREE.AnimationMixer(obj) : null), [obj]);
  if (!obj || !mixer) return null;
  mixer.stopAllAction();
  mixer.uncacheRoot(obj);
  const a = mixer.clipAction(findClip(obj, clip));
  a.play();
  a.time = t % a.getClip().duration;
  a.weight = blend;
  if (from && blend < 1) {
    const b = mixer.clipAction(findClip(obj, from));
    b.play();
    b.time = fromT % b.getClip().duration;
    b.weight = 1 - blend;
  }
  mixer.update(0);
  post?.(obj);
  return <primitive object={obj} position={position} rotation={[0, rotationY, 0]} />;
};
