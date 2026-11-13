# INVENTORY — Phase 0 (13 Nov 2026)

Scope: `D:\deep-time-fables` (the only video work folder found; old 3D project lives inside `reference/*.zip`).
Skipped: `node_modules`, `.git`, caches. Totals: 624 files, 1.19 GB (out/ = 864 MB of intermediate renders).
Searched also: Desktop, Documents, Downloads, `D:\series`, `D:\tmp`, `D:\zcode` — no other video project found.
Originals untouched. `studio/` added to `.git/info/exclude` (local only) so the old repo ignores it.

Verdicts: **REUSE** = copy/port into studio · **REFERENCE** = read/learn, don't ship · **ARCHIVE** = keep, no further use · **IGNORE** = disposable.

## 1. Strategy & docs
| Path | Size | What | Verdict | Why |
|---|---|---|---|---|
| reference/MASTER_STRATEGY_v2.md | 22 KB | 3-brand portfolio, category scores, render math, risk register, 60 ideas | REUSE (copy → docs/STRATEGY.md) | Current strategy; matches master prompt |
| reference/WINNING_PLAN.md | 16 KB | Failure diagnosis, algorithm, packaging, 90-day plan | REUSE (copy) | Packaging + research loop rules |
| reference/MASTER_INSTALL_GUIDE.md | 11 KB | Tool/model/font list per category | REFERENCE | Re-verify licenses before use |
| reference/VIDEO_TOOLKIT_for_OpenCode.md | 15 KB | Free stack, narration, sources, CI install block | REFERENCE | Same file shows "deleted" at repo root in git status (moved here; root copy committed in aaaeae5) |
| VIDEO_PRODUCTION_BIBLE.md | ~100 KB | OpenCode's craft bible for paper-cut fables | REFERENCE (selected sections) | Shot grammar/QA rubric useful; canon (wordless paper-cut) is wrong for new brands |
| REFERENCE_AUDIT.md | 12 KB | Honest audit of why OpenCode output failed | REUSE (copy → docs/LESSONS.md seed) | Best "lessons learned" source |
| STATUS.md / WORKLOG.md / AGENTS.md | small | OpenCode run state and rules | ARCHIVE | Superseded by studio docs |
| LICENSES.md | 4 KB | Shipped-asset licence rows (Quaternius, Poly Haven, Freesound, Kokoro, Inter, Whisper, PLOS fig) | REUSE (rows) | Already verified URLs |
| TRex_Story_Script.md (inside both zips) | 3 KB | Script of "The Sound" | REFERENCE | Example of hedged-science script |
| **Missing** | — | `OPENCODE_PROMPT_Deep_Time_Fables.md`, `handoff_status.md`, `assets_and_licenses.md`, `case01_long_video.md`, `strategy_2026-11-09.md` | — | Not found anywhere searched |

## 2. Code
| Path | Size | What | Verdict | Why |
|---|---|---|---|---|
| zip PrehistoricSoundLab/src/lib.jsx | 7 KB | FBX loader, material/ground/scale, eye prep, AnimationMixer sampling + blending | REUSE → packages/three | Proven Quaternius pipeline |
| zip …/src/film.jsx | 29 KB | "The Sound": blinks, throat/breath, head turns, 5-bone tail wave, boom-driven camera shake, found-footage HUD, captions | REUSE (acting + HUD parts) | Acting tricks + HUD overlay |
| zip …/src/whip.jsx (+ whip_env.jsx) | 27+5 KB | Tail anticipation/sweep/settle, per-bone lag, tip tracking, real cameras/FOV, replay + speed HUD | REUSE (tail-lift, camera, counter) | Best motion code we have |
| zip …/src/env.jsx | 12 KB | Instanced MegaKit + LPN environment, HDRI light, blob shadows, fake AO | REUSE → packages/three | Cheap good-looking ground/forest |
| zip …/src/index.jsx, doc2d.jsx | 13+2 KB | Composition registry, 2D doc test | REFERENCE | |
| zip …/make_audio.py, make_audio2.py | 11+8 KB | Voice placement, ducking, Freesound foley, reverb, stereo events | REUSE → packages/audio | Hardcoded `/home/claude/...` paths to fix |
| zip …/make_vo.py, make_vo2.py | 1 KB each | Kokoro `am_michael` TTS | REUSE (port) | Kokoro model files NOT present; fetch in CI |
| zip TRex_Project_Backup_v4 (film_v3.jsx, flat.jsx, make_audio_v3.py, audio.json) | 14 files | Older v3 of the same film | ARCHIVE | Superseded by full backup |
| src/field/rig.mjs, stage.mjs, World.tsx, assets.ts | 24 KB | Frame-driven skinned-rig posing, staged confrontation, instanced world (TS port of the above) | REUSE (rig.mjs, World.tsx) | Already typed, deterministic, CI-proven |
| src/engine/paper.tsx, index.tsx | 17 KB | CSS-transform "paper" camera + layers | REFERENCE | Could serve 2D cards; not a real camera |
| src/stories/*.tsx (5 films) | 110 KB | Paper-cut fables + Horn Lock | ARCHIVE | Format dropped |
| tools/make_field_audio.py | 14 KB | Event-synced 5-stem score + Kokoro narration (pretty_midi + FluidSynth) | REUSE → packages/audio | Most complete audio engine |
| tools/make_music.py, make_sfx.py, mix.py | 17 KB | MIDI music, synthesized SFX, mixer | REUSE (sfx synth fns, mixer) | Music arrangement hardcoded; rework |
| tools/qa_field_media.py, qa.py, qa_stills.py, qa_field_motion.mjs | 17 KB | ffprobe/loudness/whisper-recall QA, still metrics, motion check | REUSE (qa_field_media) / fix | qa_stills returns 0 on WARN (bug) |
| tools/make_contact_sheet.py, field_stills.py, stills_plan.py | 8 KB | Contact sheets + event stills | REUSE | |
| tools/validate_story.py, fetch_phylopic.py, inspect_field_model.mjs, prepare_field_assets.py | 25 KB | Story schema validation, PhyloPic fetch, model inspection, asset prep | REUSE (fetch_phylopic, inspect_model) / REFERENCE (validator) | |
| .github/workflows/field-film.yml, render.yml | 7 KB | Single-job CI render: apt ffmpeg/fluidsynth, Kokoro+Whisper cache, swangle render, gates | REUSE (as base for matrix render.yml) | No chunking/matrix yet |
| package.json | — | remotion/@remotion/* 4.0.543, three 0.169, r3f 8.18, React 18.3 | REUSE (pinned versions) | Known-good combo |
| **Missing** | — | `labvideo.jsx`, `clips.jsx`, case-01 2D lab pipeline | — | Not in folder or zips |

## 3. Assets
| Path | Size | What | Licence | Verdict |
|---|---|---|---|---|
| reference/Dinosaur Animated Pack - Dec 2018 (1).zip | 10.6 MB | Quaternius: Apatosaurus, Parasaurolophus, Stegosaurus, Trex, Triceratops, Velociraptor (blend/fbx/obj) | CC0 (License.txt read) | REUSE |
| zip PrehistoricSoundLab public/*.fbx | 6×~1.1 MB | Same 6 FBX, ready to load | CC0 | REUSE (source of truth) |
| zip …public/mega/ (+ public/field/mega subset) | ~45 MB | Quaternius Stylized Nature MegaKit glTF + textures | CC0 | REUSE |
| reference/21-lowpoly-nature-starter-pack-glb.zip, zip …public/lpn/ | 77 KB | 40 Low-Poly Nature GLBs | CC0 (LICENSE.txt read) | REUSE |
| zip …public/kay/ | ~150 KB | 9 glTF trees/bushes/rocks ("kay") | **Unknown — no licence file** | IGNORE until identified (likely KayKit CC0; verify) |
| zip …public/hdri/*.hdr, public/field/misty_pines.hdr | 4×~1.5 MB | Poly Haven: spruit_sunrise, kloofendal_43d_clear, kloofendal_misty_morning, misty_pines | CC0 | REUSE |
| reference/gobkit-dino-itch.zip | 9.2 MB | 10 CC0 GLB dinos (Trex, Triceratops, Stegosaurus, Ankylosaurus, Spinosaurus, Carnotaurus, Pachycephalosaurus, Oviraptor, Pterodactylus, Plesiosaurus), shared skeleton, idle/attack/dead/walk | CC0 per description; inner zip not readable by `tar` — use 7-Zip once installed to confirm LICENSE | REUSE after check (adds Spinosaurus/marine reptile for Brand A) |
| zip …sfx/ + assets/field-audio/ | ~10 MB | Freesound 410609, 427414, 132149 (CC BY 4.0, credit); 507066, 529462 (CC0) | as listed | REUSE + credit. Banned 559296/810951 not present ✅ |
| reference/OpenMontage-main.zip | 76 MB, 2,285 files | Agent video-production framework + skills | **AGPL-3.0** | REFERENCE only — never copy code into studio |
| FluidR3 GM (apt in CI) | — | SoundFont | MIT | REUSE |
| Kokoro v1.0 onnx + voices | not on disk | TTS model (CI cache only) | Apache-2.0 | REUSE (fetch in CI) |
| PhyloPic SVGs | not on disk | only `tools/fetch_phylopic.py` | per-image (CC0/CC BY) | REUSE script; check each image |
| public/field/evidence/ (PLOS fig crop, via prepare script) | — | Farke et al. 2009 fig 2B | CC BY | REFERENCE (one-film use) |
| public/tex/, generated PNG textures | — | Original paper textures | own | ARCHIVE |

## 4. Videos (ffprobe + 6 frames each in `review/<name>/`)
Remotion's bundled ffmpeg/ffprobe were used (system ffmpeg not installed). Its build lacks `ebur128`, so loudness for references is **unmeasured**; DTF loudness comes from their CI logs.

| Video | Dur / format | Audio | Critique (works / fails) |
|---|---|---|---|
| reference/TRex_The_Sound_v4.mp4 | 39.6 s 1080×1920 30fps | 48k stereo | ✅ Real animated 3D, found-footage HUD, hedged captions ("Probably."), on-screen source, comment CTA. ❌ Frame 1 is a dark, low-contrast belly close-up (no readable subject on phone); heavy fog flattens everything; 3–4 s black end card kills loop. **5/10** |
| reference/Whip_Ep2_final.mp4 | 43.2 s 1080×1920 30fps | 48k stereo | ✅ Strong science hook (sonic boom), replay + live speed counter, several real camera setups. ❌ Frame 1 is an empty landscape — no animal; sauropods small/backlit in muddy sepia; black end card again. **5/10** |
| reference/PixVerse_V6_…mp4 | 5.0 s 1024×336 24fps | 32k stereo | ✅ Shows how good animated low-poly can look. ❌ AI clip with PixVerse watermark, wrong aspect; not usable. REFERENCE only |
| deliver/01-good-mother/final.mp4 | 35.0 s 1080×1920 | 48k (-14.6 LUFS) | ✅ Readable flat silhouette, clear palette. ❌ Near-static: same composition all film, stiff animal, fact card covers the nest. **3/10** |
| deliver/02-softest-prey/final.mp4 | 40.0 s | 48k (-14.0) | ✅ Clean illustration, predator/prey legible. ❌ Subjects tiny in lower half, top 50 % empty sky, minimal motion, no hook. **4/10** |
| out/05-full-fail/final.mp4 | 40.0 s | 48k | ❌ Broken render: black rectangle covers the subject mid-film. Never delivered. **1/10** |
| deliver/06-egg-thief/final.mp4 | 40.0 s | 48k (-14.0) | ✅ Best paper texture/colour, readable character. ❌ One setup recycled, letterboxed (≈25 % wasted top/bottom), limbs slide instead of walk. **4/10** |
| deliver/07-horn-lock/final.mp4 | 40.0 s | 48k (-14.3) | ✅ 3D low-poly Triceratops pair, captions, real fossil-evidence card with citation — best science packaging. ❌ Animals in middle third, lower 40 % empty ground, same model recoloured, flat lighting, mostly a standoff. **5/10** |
| out/** other mp4/png/wav (00-smoke, proofs, stills, *video.mp4 muted intermediates) | 864 MB | — | IGNORE (byte-identical or muted intermediates of the above; hashes checked) |

Overall: nothing in the folder is above 5/10. The 3D low-poly + found-footage + hedged-science approach (T. rex / Whip / Horn Lock) is the strongest base; paper-cut fables are dropped.

## 5. Zips
| Zip | Contents | Extract? |
|---|---|---|
| PrehistoricSoundLab_full_backup.zip (55 MB) | 161 files: full 3D project, 6 FBX, MegaKit, LPN, kay, 4 HDRI, sfx, Kokoro scripts | Yes, in Phase 1 → `studio/_import/` |
| TRex_Project_Backup_v4.zip (85 KB) | 14 files: v3/v4 code only, no assets | No (subset of above) |
| Dinosaur Animated Pack (10.6 MB) | Quaternius 6 dinos blend/fbx/obj + CC0 licence | Only `.blend` if re-rigging needed |
| gobkit-dino-itch.zip (9.2 MB) | cover, description, demo, inner `gobkit-dino-pack.zip` (10 GLB) | Yes (7-Zip), verify LICENSE |
| 21-lowpoly-nature-starter-pack-glb.zip | 40 GLB + CC0 LICENSE | Duplicate of backup's `lpn/` |
| OpenMontage-main.zip (76 MB) | AGPL-3.0 agent framework | No (reference reading only) |
