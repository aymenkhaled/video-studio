# Reference-fidelity audit

Date: 2026-11-12

## Verdict

The delivered implementation targets wordless 2D paper-cut films, while the user's benchmark is narrated, acted, low-poly 3D filmmaking. The repository explicitly chose the paper-cut target, kept the supplied assets reference-only, and approved output using checks that do not establish reference-level performance.

The backups contain substantial reusable production material. The current implementation did not restore that runtime. This does not establish an inherent inability of OpenCode or its active model to make the kind of film Claude made.

## Evidence examined

- Read `VIDEO_PRODUCTION_BIBLE.md` in full, `AGENTS.md`, the reference toolkit, status/work log, production decisions, current rendering/audio/QA code, and the three delivered films' source compositions.
- Inventoried every top-level entry in `reference/`, including the nested Gobkit asset archive.
- Extracted the two film backups to the approved temporary directory and read their main film, model/animation, environment, narration, and soundtrack code.
- Read the relevant OpenMontage short-form, storytelling, cinematic, and sound-design guidance, plus the supplied dinosaur/nature license documents.
- Visually inspected all three delivery contact sheets and the supplied Gobkit cover image.
- Retrieved the existing GitHub Actions logs for the three delivered full renders and cross-checked their audio measurements against the delivery records.

This was a source/contact-sheet/cloud-record audit. Continuous MP4 playback and subjective listening were not available in this interface. The audio conclusions below are measurements from the existing cloud exports, not listening-test results.

## 1. The written contract selected the wrong target

| Evidence | Consequence |
|---|---|
| `AGENTS.md:3` says "wordless" and "paper-cut fossil stories." | The default aesthetic differs from the uploaded 3D films. |
| `AGENTS.md:31` requires "no narration or dialogue." | Missing voice follows an explicit instruction. |
| `AGENTS.md:34` requires paper layers, silhouettes, and slow parallax. | The implementation substitutes SVG cutouts and 2D transforms for the reference's models and acting. |
| `AGENTS.md:8` requires a recorded exception for 3D or narrated films. | Using the reference format requires a production decision; none was recorded for these deliveries. |
| `VIDEO_PRODUCTION_BIBLE.md:62-76` recognizes that the references use voice, captions, and 3D, but preserves wordless paper-cut canon and says to extract principles. | The references were treated as craft examples rather than the required production format. |
| The prior decision in `STATUS.md` explicitly retained wordless paper-cut canon. | This was a recorded format choice, not just a missing package. |
| `stories/02-softest-prey/story.json:6` and `stories/06-egg-thief/story.json:6` both select `paper-cut-led`. Their pitches specify original SVG visuals. | The individual productions reinforced that choice. |

Git history confirms that wordless/no-narration/paper-cut instructions were already present in scaffold commit `8b17523`, before Story 01 was built. The repository cannot establish which earlier conversation originally introduced those constraints. It does establish that production followed them.

The agent should have resolved the reference-format conflict with the user's intended result before treating these films as successful deliveries.

## 2. What the uploaded material actually contains

| Reference material | Verified inventory and relevance |
|---|---|
| `TRex_The_Sound_v4.mp4` | Primary benchmark. The bible records 39.6 seconds, narrated found-footage 3D; its backup includes the acted rig, shot sequence, captions, and sound design. |
| `Whip_Ep2_final.mp4` | Primary benchmark. The bible records 43.2 seconds; the full backup contains its 3D tail performance, distinct camera setups, replay, and speed comparison. |
| `PixVerse_V6_Image_Text_540P_Animate_this_exist.mp4` | Short visual reference; the bible records 5.04 seconds. It is an existing clip, not an installed generation service or a reusable animal rig. |
| `TRex_Project_Backup_v4.zip` | 14 files: film/environment/rig code, narration and soundtrack generators, package files, script and rebuild instructions. It contains no model, image, or audio assets, so this standalone archive needs the asset libraries too. |
| `PrehistoricSoundLab_full_backup.zip` | 161 files, about 63.7 MiB uncompressed: 81 model files, 25 image/HDRI files, and five recorded sound files. Includes six dinosaur FBXs, vegetation, four HDRIs, both films' source, and Kokoro narration scripts. |
| `Dinosaur Animated Pack - Dec 2018 (1).zip` | Six dinosaur species in Blend, FBX, and OBJ formats: Apatosaurus, Parasaurolophus, Stegosaurus, Trex, Triceratops, and Velociraptor. Included license says CC0. |
| `gobkit-dino-itch.zip` | Contains a second ZIP with ten GLB dinosaurs, including `Oviraptor.glb`, plus README/license and previews. README documents idle/attack/dead/walk ranges in one baked track. Included license says CC0. |
| `21-lowpoly-nature-starter-pack-glb.zip` | 40 GLB environment models with CC0 license and README. |
| `OpenMontage-main.zip` | 2,285 files of production tooling, code, guidance, and examples. Its creative guidance emphasizes motion, narration/captions for explainers, shot rhythm, layered sound, and phone review. It was not installed as the current project's production engine. |
| `VIDEO_TOOLKIT_for_OpenCode.md` | Recommends Kokoro narration, provides a Three.js/React Three Fiber stack, and lists permitted 3D/audio sources. These capabilities were not installed in the current runtime. |

In particular, Story 06's uploaded asset library contains an Oviraptor model. Its availability does not prove anatomical suitability without review, but the absence of any supplied 3D asset in that delivery cannot be explained simply as "there was no model."

## 3. The reference runtime was not connected to the build

- `.gitignore:2` excludes `reference/`. `git ls-files -- reference public` returned no tracked files. The local agent can inspect the references; a fresh Actions checkout does not receive them.
- `.github/workflows/render.yml` installs the current project, generates textures and synthesized audio, then renders its registered compositions. It has no reference/archive import or asset-restoration step.
- Current `package.json:11-18` contains Remotion and React, but no `three`, `@remotion/three`, or `@react-three/fiber`. Those libraries are present in the original backup's dependencies.
- Current `public/` contains only `tex/`. The full backup has dinosaur FBXs, environment models, textures, HDRIs, and recorded foley in `public/` and `sfx/`.
- `src/Root.tsx` registers newly written paper compositions. It does not register the supplied 3D films or an adapted 3D composition.
- `LICENSES.md` labels the reference library reference-only; its shipped-asset table contains only FluidR3. The later pitches explicitly choose "No external visual assets. Original SVG paper pieces."

Having ZIPs in a folder provides material to study and restore. It does not automatically install libraries, expose models to the renderer, register a composition, or generate voiceover.

The bible clearly shows that reference analysis occurred. What is missing is production reuse and verification of the reference's runtime and performance.

## 4. Why the movement is much simpler

The reference films are also coded Remotion videos. Their performance comes from what the code drives:

- Backup `src/lib.jsx:15-85` loads skinned FBXs, assigns materials, grounds/scales the model, and prepares eyes.
- Backup `src/lib.jsx:91-106` samples animation clips through `THREE.AnimationMixer` and supports clip blending plus additional acting.
- Backup `src/film.jsx:282-346` adds fixed-time blinks, neck/throat expansion, torso breathing, head turns, and a five-bone travelling tail wave. Footstep/boom timings also drive camera shake and environment reactions.
- Backup `src/whip.jsx:116-149` defines anticipation, sweep, settle, per-bone lag, and tail-tip tracking. Its cameras have world-space positions, look targets, and real field-of-view changes.

The current films use much narrower performances:

| Delivery | Source/contact-sheet finding |
|---|---|
| `01-good-mother` | `GoodMother.tsx:54-84` has whole-animal scale breathing, a vertical brace slide, and head rotation. It has no animated walking legs, tail, jaw, or blink. Lines 100-120 reuse one landscape with five global camera transforms. The contact sheet confirms repeated composition and a fact card over the nest payoff. |
| `02-softest-prey` | `SoftestPrey.tsx:145-285` uses a hand-drawn SVG animal with sine-based bob/flap and grouped appendage rotations. It has distinct sequences and more activity than Story 01, but no supplied 3D rig. Its escalation holds the same macro setup from 8 to 22 seconds. |
| `06-egg-thief` | `EggThief.tsx:236-390` adds paper texture, blink, beak and wing hinges, but leg/foot shapes remain unarticulated. Lines 617-637 move the parent horizontally to the nest while those feet remain fixed relative to its body. That is a slide, despite the shot description saying it "walks." |

The paper engine's `Camera` is a CSS translate/scale/rotate (`src/engine/paper.tsx:21-39`). A "35mm" label in story metadata does not create a perspective lens in that renderer.

The later films improve texture and layout. Those improvements do not supply the locomotion, ground contact, weight, depth, and acting the user expected.

## 5. Sound: absent narration is confirmed; fully silent exports are not

The existing cloud full-render logs report:

| Delivery | Run | Duration | Audio | Integrated loudness | Peak reported by QA |
|---|---:|---:|---|---:|---:|
| `01-good-mother` | 43123637497 | 35.000 s | AAC, 48 kHz, stereo | -14.6 LUFS | -1.3 dBFS |
| `02-softest-prey` | 43213378770 | 40.000 s | AAC, 48 kHz, stereo | -14.0 LUFS | -1.5 dBFS |
| `06-egg-thief` | 43229540687 | 40.000 s | AAC, 48 kHz, stereo | -14.0 LUFS | -1.8 dBFS |

All three logs show the soundtrack being muxed into `out/final.mp4` and audio QA passing. This is evidence of measurable audio in those cloud exports. It does not establish how the exact local copy sounded in the user's player. The reported complete-silence symptom remains unverified by direct playback.

The workflow deliberately renders an intermediate `out/video.mp4` with `--muted` (`render.yml:71`), then adds `out/soundtrack.wav` to make the final (`render.yml:76`). The muted intermediate is not the intended delivery. This distinction alone does not explain a silent `deliver/.../final.mp4`.

The confirmed audio differences are substantial:

- The backup's `make_vo.py` / `make_vo2.py` use Kokoro `am_michael`. `make_audio.py` / `make_audio2.py` place voice lines, duck the bed under speech, add recorded footsteps/breath/thuds, reverb, stereo events, silence, and scene-specific punctuation.
- Current CI never installs or invokes Kokoro. Current `tools/mix.py:11-27` mixes exactly two input files: generated music and generated SFX. There is no narration input.
- Current music uses fixed celesta/string/cello patterns (`tools/make_music.py`). The instruments named in section metadata do not select arbitrary instruments; the generator uses its hardcoded arrangement.
- Current SFX are mostly synthesized noise and tones (`tools/make_sfx.py`), rather than the recorded reference foley pipeline.
- `WORKLOG.md` records a Story 02 music bed that was initially very quiet and subsequently normalized. That is a real historical defect, but the final run includes the normalization fix.
- Both later `qa.md` files explicitly say no subjective phone-speaker listen was performed, yet assign Sound 7/10 and approve delivery.

Loudness compliance does not prove that voice exists, that creature sounds feel physical, or that the mix is compelling and clear on a phone.

## 6. Why weak output passed review

1. `tools/qa.py:37-46` checks freezing across the whole frame. Rain, sediment, grain, or background drift can prevent a freeze failure while the character remains nearly static.
2. `tools/validate_story.py` checks package fields, declared set/camera combinations, layer labels, and a self-reported greenlight score. It does not verify that a described walk uses walking limbs, that a focal-length label creates a lens, or that the film matches the reference format.
3. `tools/qa_stills.py:120-130` writes `RESULT WARN` when checks find problems, but always returns `0`. The Actions step can succeed despite those warnings. This is a concrete enforcement defect.
4. Still-based checks cannot establish natural movement or sound quality. The delivery reviews acknowledged missing listening tests and still approved the sound score at the publish threshold.
5. The bible already diagnoses Story 01's acting, shot-variety, and sound gaps (`VIDEO_PRODUCTION_BIBLE.md`, sections 0 and 4). The later productions kept the same overall format and accepted 7-level acting/sound rather than proving the stronger reference benchmark.

## 7. What matching the intended reference requires

1. **Align the production contract.** Record the requested narrated 3D format in the next pitch and `STATUS.md`; reconcile `AGENTS.md`, the bible, templates, and validator with that decision. The old wordless paper-cut decision currently sends production in the opposite direction.
2. **Restore a reference-derived runtime.** Adapt the original model loader, rig posing, environment lighting, and event-driven soundtrack architecture. Register an appropriate 3D composition with compatible pinned dependencies.
3. **Make assets available in CI.** Use a manifest of selected licensed models/textures/HDRIs/foley, with attribution rows in `LICENSES.md`, and an explicit checked-in or deterministic cloud-fetch path. An ignored local ZIP is insufficient.
4. **Repair backup portability.** Replace hardcoded `/home/claude/trex`, `/home/claude/voice`, and `/home/claude/voice2` paths. Restore/cache Kokoro model and voice files. Regenerate the imported `src/audio.json` and `src/audio_whip.json`, which are generated by the audio scripts and absent from the full backup's source directory.
5. **Prove the performance in one short cloud test.** Use a supplied dinosaur, a grounded walking/turning rig, blink/jaw/tail acting, lit 3D environment, narration, music, and synced foley. Compare that test against the reference before producing another complete story. The reference README documents software-WebGL rendering with `--gl=swangle`; actual CI compatibility and speed need verification.
6. **Strengthen acceptance.** Treat reference fidelity, articulated motion/contacts, actual perspective shots, speech intelligibility, and playback/listening as delivery requirements. Make still-QA failures propagate, and record unperformed checks as pending instead of treating them as publishable scores.

The useful starting point is the working reference architecture and licensed library, followed by a verified 3D/audio test. Another general request to "make it better" will not repair the mismatched contract or the absent runtime.

## Audit execution note

`rg` was unavailable in local PowerShell; batched log-filter calls failed with the same missing-command error. Those attempts were stopped. Existing cloud logs were then retrieved with `gh` and filtered using PowerShell's built-in output filtering. No local ffmpeg, rendering, media generation, or automated media QA was run for this audit.
