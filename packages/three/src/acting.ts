import * as THREE from 'three';

// Secondary acting layered on top of baked clips (ported from film.jsx / whip.jsx).
// All functions are pure in `t` so any frame renders identically in any chunk.

const boneCache = new WeakMap<THREE.Object3D, Map<string, THREE.Bone | null>>();

export const bone = (obj: THREE.Object3D, name: string): THREE.Bone | null => {
  let m = boneCache.get(obj);
  if (!m) boneCache.set(obj, (m = new Map()));
  if (!m.has(name)) {
    let found: THREE.Bone | null = null;
    obj.traverse((c) => {
      if (!found && (c as THREE.Bone).isBone && c.name === name) found = c as THREE.Bone;
    });
    m.set(name, found);
  }
  return m.get(name)!;
};

const q = new THREE.Quaternion();
const axisY = new THREE.Vector3(0, 1, 0);
const axisX = new THREE.Vector3(1, 0, 0);

/** Adds a yaw (radians) on top of the clip pose, around the bone's parent-space up axis. */
export const yawBone = (b: THREE.Bone | null, yaw: number) => {
  if (!b || !yaw) return;
  b.quaternion.premultiply(q.setFromAxisAngle(axisY, yaw));
};

export const pitchBone = (b: THREE.Bone | null, pitch: number) => {
  if (!b || !pitch) return;
  b.quaternion.premultiply(q.setFromAxisAngle(axisX, pitch));
};

/** Travelling tail wave, stronger toward the tip; `flick` (0..1) adds a fast whip after impacts. */
export const tailWave = (obj: THREE.Object3D, t: number, opts: {amp?: number; speed?: number; flick?: number; prefix?: string; count?: number} = {}) => {
  const {amp = 1, speed = 1.6, flick = 0, prefix = 'Tail', count = 5} = opts;
  for (let k = 1; k <= count; k++) {
    const b = bone(obj, `${prefix}${k}`);
    const i = k - 1;
    yawBone(b, amp * (0.035 + i * 0.012) * Math.sin(t * speed - i * 0.55) + flick * 0.05 * Math.sin(t * 9 - i));
  }
};

/** Slow torso breathing (scale) so idle poses never look frozen. */
export const breathe = (obj: THREE.Object3D, t: number, amount = 0.018, boneName = 'Torso') => {
  const b = bone(obj, boneName);
  if (!b) return;
  const s = 1 + Math.sin(t * 2.2) * amount;
  b.scale.set(s, 1, s);
};

/** Head/neck look: yaw split between neck and head (radians). */
export const look = (obj: THREE.Object3D, yaw: number, pitch = 0) => {
  yawBone(bone(obj, 'Neck'), yaw * 0.55);
  yawBone(bone(obj, 'Head'), yaw * 0.45);
  pitchBone(bone(obj, 'Head'), pitch);
};

/** Hand-held camera wobble (deterministic), metres. */
export const handheld = (t: number, amount = 1): [number, number] => [
  amount * (0.035 * Math.sin(t * 1.3) + 0.018 * Math.sin(t * 3.1 + 1.7)),
  amount * (0.028 * Math.sin(t * 1.7 + 0.4) + 0.012 * Math.sin(t * 4.3)),
];
