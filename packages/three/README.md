# packages/three — 3D (no post-processing)

Phase 2 port sources (in `_import/`, never committed):
- `prehistoric-sound-lab/src/lib.jsx` + `dtf/field/rig.mjs` → FBX/GLB loader, grounding/scale, eyes, frame-sampled AnimationMixer.
- `film.jsx` / `whip.jsx` → acting hooks: blink, breath, head turn, 5-bone tail wave, tail lift (anticipation → sweep → settle, per-bone lag), jaw close.
- `env.jsx` / `dtf/field/World.tsx` → instanced MegaKit + Low-Poly Nature, HDRI IBL, fog, blob shadows, fake AO.
Render rule: `--gl=swangle`, no EffectComposer/DOF/bloom/SMAA/N8AO.
