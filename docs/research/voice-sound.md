# Voice, music and sound design research

Research date: 2026-11-14. All URLs were accessed on 2026-11-14 unless the row says otherwise. Licences were read on the primary model card or repo where it could be reached. "Unverified" means the primary page could not be read; per CLAUDE.md, unverified counts as rejected until checked.

---

## 1. Summary and recommendation

**Main finding.** The weak point is how the narration is delivered, not which engine we use. Our Kokoro pipeline (`packages/audio/soundtrack.py`) sends whole lines at one speed per scene. It adds no voice processing (no EQ, compression or de-essing) and ducks music only about 9 dB (`duck = 1 - 0.65*mask` is −9.1 dB, plus a 0.85 music gain). Most guides say 18–24 dB. Every scene also uses the same i–VI–iv–v minor progression. The cheapest gains therefore come from techniques T1–T8 (section 3), and they apply to any TTS.

**TTS recommendation (ranked):**

1. **Kyutai Pocket TTS** (about 100M parameters). Code is MIT; weights are **CC BY 4.0**, so the description needs a credit line. The README reports **about 2.3–2.5× real-time on a 4-vCPU x86 VM**, which is about 4× faster than our measured Kokoro run. It handles "infinitely long text inputs" and can clone from a WAV. **Use only voices we have rights to.** Kyutai's `tts-voices` repo mixes CC0 (`voice-donations/`, `voice-zero/`) and CC BY 4.0 (`vctk/`, `alba-mackenna/`) folders with **CC BY-NC (`expresso/`, `ears/`), which we must reject.** It has no watermark. This is the first candidate to benchmark.
2. **Chatterbox (Resemble AI)**, MIT. Variants: original 500M English, Turbo 350M, Nano 110M ("3× faster than realtime on 8 CPU cores"), Multilingual V3 500M. Its `exaggeration` and `cfg_weight` controls are the most direct fix for monotone delivery. **Caveat:** the GitHub README now says *"As of August 2026, Chatterbox is retired research and is no longer maintained."* The code stays public under MIT. Every output carries a **PerTh imperceptible watermark** that survives MP3. That does not break our policy, and nothing we read says it changes YouTube disclosure. It does mean any audio can be traced as AI. Pin the exact version and the weights SHA in `assets/manifest.json`.
3. **Kokoro-82M** (Apache-2.0 weights). Keep it as the fallback and baseline. Our own measurement (`docs/BENCHMARK.md`, Hannibal 001): **10.5 min of narration took about 17 min on 4 vCPU, so RTF ≈ 1.6 (slower than real time).**

Watch list (allowed licence, CPU speed unproven): **Qwen3-TTS** (Apache-2.0, 0.6B/1.7B, natural-language style instructions), **Fun-CosyVoice3-0.5B** (Apache-2.0, emotion and speed instructions), **VoxCPM 1.5** (Apache-2.0, 0.8B, infers prosody from context), **NeuTTS Air** (Apache-2.0, "runs on CPU in real-time", Perth watermark), **Kitten TTS** (Apache-2.0, 80M).

**Music.** Keep the original MIDI score. It is the only source with zero Content ID risk and a fully original identity. Make it less generic with per-channel palettes, leitmotifs and a reveal grammar (T9–T12). For an outside library, use only the YouTube Audio Library or CC BY / CC0 tracks. Reject MusicGen (CC BY-NC weights) and Stable Audio Open (custom Community License, not on our list). ACE-Step and YuE are Apache-2.0 but need a GPU, so they are not a CI option today.

**SFX.** Use Kenney (CC0, verified), Freesound filtered to **CC0 and CC BY 4.0 only**, and our own synthesis. Reject BBC RemArc (personal, educational and research use only). Sonniss GDC is royalty-free for YouTube, but the licence is custom and not on our allowed list. **Aymen decides.**

**Policy.** On 2025-07-15 YouTube renamed "repetitious content" to "inauthentic content." It targets "mass-produced, generic, repetitive" videos, not AI voices as such. The altered/synthetic disclosure covers *realistic* content, such as a real person saying something they didn't. Per CLAUDE.md we keep disclosure for realistic AI only. A TTS narrator that does not imitate a real person is not listed as needing disclosure, and the page does not address it directly. A varied, original voice and score is the defence against the inauthentic-content policy.

Self-rating of this research: **7/10.** Top weaknesses: (1) no CPU RTF has been measured for Pocket TTS or Chatterbox on our runner; the figures are vendor numbers. (2) TTS Arena V2 could not be read live, so quality evidence is secondary. (3) Channel making-of material (Epic Mountain, LEMMiNO, Wendover) is thin publicly, so the techniques come from general practice.

---

## 2. TTS comparison table

RTF = generation time ÷ audio time on CPU (lower is better; "×RT" = times faster than real time). "Ours" means measured in our CI.

| Model | Code licence | Weights licence | Verdict | CPU speed | Quality / control notes | Sources |
|---|---|---|---|---|---|---|
| **Pocket TTS** (Kyutai, ~100M) | MIT | **CC BY 4.0** | **ALLOWED (credit)**. Voices: CC0/CC BY folders only | ~2.3–2.5×RT on 4-vCPU x86 VM; ~6×RT on M4 with 2 cores (README) | Cloning from a WAV; EN/FR/DE/PT/IT/ES; "infinitely long text"; no watermark; prohibits cloning without consent | [HF card](https://huggingface.co/kyutai/pocket-tts), [GitHub](https://github.com/kyutai-labs/pocket-tts), [voice licences](https://huggingface.co/kyutai/tts-voices) |
| **Chatterbox** (orig 500M / Turbo 350M / Nano 110M / Multilingual V3) | MIT | MIT (HF card) | **ALLOWED**, archived Aug 2026 | Nano "3× faster than realtime on 8 CPU cores", so ~1.5×RT on 4 vCPU (estimate); others not stated | `exaggeration`/`cfg_weight` (defaults 0.5; expressive ≈ 0.7/0.3); Turbo has `[laugh]`, `[cough]` tags; PerTh watermark on all outputs; ranked #12 (ELO 1518) on TTS Arena V2 in mid-2025 | [GitHub](https://github.com/resemble-ai/chatterbox), [HF](https://huggingface.co/ResembleAI/chatterbox), [HF Turbo](https://huggingface.co/ResembleAI/chatterbox-turbo), [ocdevel](https://ocdevel.com/blog/20250720-tts), [Resemble pivot](https://www.resemble.ai/resources/why-a-former-voice-ai-company-went-all-in-on-deepfake-detection) |
| **Kokoro-82M** | Apache-2.0 (kokoro-onnx MIT) | Apache-2.0 | **ALLOWED** (current) | **Ours: RTF ≈ 1.6** (17 min for 10.5 min, int8, 4 vCPU) | Clear but flat; only a `speed` control; int8 sometimes returns silence (we guard against it) | [HF](https://huggingface.co/hexgrad/Kokoro-82M), `docs/BENCHMARK.md` |
| Qwen3-TTS 0.6B / 1.7B | Apache-2.0 | Apache-2.0 | ALLOWED, watch | Not stated (CUDA examples); ocdevel: int8 beats int4 on CPU | Instruction control of tone, rate and emotion; VoiceDesign variant; 10 languages | [HF](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice), [ocdevel CPU](https://ocdevel.com/blog/20260711-quantized-cpu-tts) |
| Fun-CosyVoice3-0.5B | Apache-2.0 | Apache-2.0 | ALLOWED, watch | Not stated | Instructions for emotion, speed, volume; 9 languages | [HF](https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512) |
| VoxCPM 1.5 (0.8B) | Apache-2.0 | Apache-2.0 | ALLOWED, watch | GPU RTF 0.17 (4090); CPU not stated | Infers prosody from context; may be unstable on very long inputs | [HF](https://huggingface.co/openbmb/VoxCPM1.5) |
| NeuTTS Air (0.7B) | Apache-2.0 | Apache-2.0 | ALLOWED, watch | "Runs on CPU in real-time" (vendor) | 3-second cloning; Perth watermark | [HF](https://huggingface.co/neuphonic/neutts-air) |
| Kitten TTS mini 0.8 (80M) | Apache-2.0 | Apache-2.0 | ALLOWED, low priority | CPU, no GPU needed | 8 stock voices; tiny model | [HF](https://huggingface.co/KittenML/kitten-tts-mini-0.8) |
| MeloTTS English | MIT | MIT | ALLOWED, low priority | "CPU real-time" | US/UK/IN/AU accents; older, flatter | [HF](https://huggingface.co/myshell-ai/MeloTTS-English) |
| Parler-TTS large v1 (2.2B) | Apache-2.0 | Apache-2.0 | ALLOWED, too slow | Not stated; 2.2B is likely below real time on 4 vCPU | Text-described voice (pitch, rate, reverb); 34 named speakers | [HF](https://huggingface.co/parler-tts/parler-tts-large-v1) |
| StyleTTS2 | MIT | Pretrained models carry a **condition**: tell listeners the voice is synthetic unless you have the speaker's permission | ALLOWED with condition (our "AI voice" note in descriptions satisfies it) | Not measured | Good prosody in 2023; unmaintained | [GitHub](https://github.com/yl4579/StyleTTS2) |
| Sesame CSM-1B | Apache-2.0 | Apache-2.0 (gated) | Allowed licence, **not suited** | GPU-oriented | Conversational, context-driven; weak outside English | [HF](https://huggingface.co/sesame/csm-1b) |
| Dia-1.6B (Nari) | Apache-2.0 | Apache-2.0 | Allowed licence, **not suited** | "CPU support to be added"; ~10 GB VRAM | Voice changes between runs unless prompted or seeded; dialogue model | [HF](https://huggingface.co/nari-labs/Dia-1.6B) |
| Zonos v0.1 | Apache-2.0 | Apache-2.0 | Allowed licence, **not suited** | Linux + NVIDIA GPU only | Rich emotion, rate and pitch controls | [HF](https://huggingface.co/Zyphra/Zonos-v0.1-transformer) |
| Kyutai TTS 1.6B | MIT (repo) | CC BY 4.0 | Allowed licence, **not suited** | CUDA example | Voices via embeddings only | [HF](https://huggingface.co/kyutai/tts-1.6b-en_fr) |
| OpenVoice v2 | MIT | MIT ("free for commercial use") | Allowed. Voice conversion, not a narrator | — | Could restyle TTS toward a licensed voice | [GitHub](https://github.com/myshell-ai/OpenVoice) |
| Orpheus 3B | Apache-2.0 | Card says Apache-2.0, but **fine-tuned from Llama-3.2-3B-Instruct** | **HOLD/REJECT**: Llama licence inheritance unresolved | GPU | Emotion tags | [HF](https://huggingface.co/canopylabs/orpheus-3b-0.1-ft) |
| Higgs Audio v2 (~5.8B) | Apache-2.0 (repo LICENSE) | HF card says "other"; built on Llama-3.2-3B | **HOLD/REJECT**: ambiguous, and GPU-sized | GPU | Strong expressive TTS | [HF](https://huggingface.co/bosonai/higgs-audio-v2-generation-3B-base), [LICENSE](https://github.com/boson-ai/higgs-audio/blob/main/LICENSE) |
| VibeVoice 1.5B (Microsoft) | MIT | MIT, but card says "research purpose use" and adds an **audible AI disclaimer** to every file | **REJECT** (research-only intent; disclaimer audible) | GPU | Up to ~90 min, 4 speakers | [HF](https://huggingface.co/microsoft/VibeVoice-1.5B) |
| IndexTTS-2 | — | Custom "bilibili Model Use License" (Chinese law, use restrictions) | **REJECT** (not on allowed list) | GPU | Emotion and duration control | [LICENSE](https://github.com/index-tts/index-tts/blob/main/LICENSE) |
| F5-TTS | MIT | **CC BY-NC 4.0** | **REJECT** | — | Trained on Emilia | [HF](https://huggingface.co/SWivid/F5-TTS) |
| XTTS-v2 (Coqui) | MPL | **Coqui Public Model License** (licence page returns 404) | **REJECT** (CPML; text unreachable means unknown) | — | — | [HF](https://huggingface.co/coqui/XTTS-v2), [CPML 404](https://coqui.ai/cpml) |
| Spark-TTS 0.5B | Apache-2.0 | **CC BY-NC-SA 4.0** | **REJECT** | — | — | [HF](https://huggingface.co/SparkAudio/Spark-TTS-0.5B) |
| MaskGCT (Amphion) | MIT | **CC BY-NC 4.0** | **REJECT** | — | — | [HF](https://huggingface.co/amphion/MaskGCT) |
| OpenAudio S1-mini (Fish) | — | **CC BY-NC-SA 4.0** | **REJECT** | — | — | [HF](https://huggingface.co/fishaudio/openaudio-s1-mini) |
| Piper (piper1-gpl) | **GPL-3.0** | Per-voice dataset licences | **REJECT** (GPL code is outside our list; per-voice licences unclear) | Fast | — | [GitHub](https://github.com/OHF-Voice/piper1-gpl) |
| Supertonic 2 (66M) | MIT | **OpenRAIL-M** | **REJECT** (not on list), though very fast (RTF 0.012 on M4) | Very fast | — | [HF](https://huggingface.co/Supertone/supertonic-2) |

TTS Arena V2 could not be read live (the Space renders client-side). The only dated ELO data found is mid-2025: Chatterbox #12 at 1518, Kokoro not listed, and the top six within about 13 ELO ([ocdevel](https://ocdevel.com/blog/20250720-tts)).

---

## 3. Techniques (ranked by impact)

Status reflects `packages/audio/soundtrack.py` as of today: DOING = implemented, PARTIAL = some of it exists, MISSING = absent.

### Narration pacing and delivery

**T1. Duck music 18–24 dB under the voice.**
- What: Today the duck is −9.1 dB, so music competes with the voice, worst on phone speakers. Set the bed ~20 dB under the voice. Use a smoother sidechain (attack ~50 ms, release 300–500 ms, 80 ms look-ahead) and let the music swell back up in gaps longer than 0.8 s.
- Evidence: guides give 18–24 dB ([Overseer](https://www.overseeros.com/blog/background-music-volume-under-voiceover)); auto-duck default −20 dB ([Mubert docs](https://mubert.com/tools/cast/docs/auto-ducking)); 10–20 dB ([Boris FX](https://borisfx.com/blog/what-is-audio-ducking-and-how-is-it-used/)).
- Impact: high. Effort: S. Channels: all. Status: **PARTIAL**.
- Apply: in `soundtrack.py`, change `duck = 1 - 0.65*...` to a dB-based gain, e.g. `g = 10**(-20/20)`. Smooth the `voice_mask` with separate attack and release one-pole filters. Shift the mask 80 ms earlier for look-ahead. Make depth a timeline field (`music.duck_db`, default −20).

**T2. Voice processing chain tuned for phone speakers.**
- What: Kokoro output goes in raw today. Add a chain:
  1. HPF at 80–100 Hz.
  2. Gentle −2 dB bell at 250–350 Hz to remove mud.
  3. Low-mid warmth of no more than +1 dB at 150–200 Hz.
  4. De-esser at 5.5–8 kHz.
  5. Compressor at 3:1, ~−20 dBFS threshold, 10 ms attack, 120 ms release.
  6. Small room reverb at 5–8 % wet with a 0.3–0.5 s decay, so the voice stops sounding "pasted in."
  
  Phones roll off below 100–200 Hz and are already sensitive around 2.5–5 kHz, so **do not** boost presence much. Check by ear.
- Evidence: phone speakers struggle below 200 Hz and roll off by 100 Hz; take care at 4–5 kHz ([Audiokinetic measurements](https://blog.audiokinetic.com/en/loudness-and-frequency-response-on-popular-smart-phones/), [LANDR](https://blog.landr.com/make-bass-audible-phone-speakers)).
- Impact: high. Effort: S–M. Channels: all. Status: **MISSING**.
- Apply: add a `voice_chain(x)` function using `scipy.signal` biquads plus a simple feed-forward compressor in numpy. Or call ffmpeg on the voice stem with `highpass=f=90,equalizer=f=300:t=q:w=1:g=-2,deesser=i=0.4,acompressor=threshold=-20dB:ratio=3:attack=10:release=120,aecho=...`. Write `voice_processed` before the mix.

**T3. Sentence-level prosody variation.**
- What: Synthesize **per sentence** instead of per line. Vary speed deterministically:
  - ±4–8 % by role: hook and reveal lines slower (0.92), lists and connective lines faster (1.05).
  - Short punch sentences (≤6 words) get 0.90.
  - Vary gain ±1 dB.
  
  Use a seeded RNG, never `Math.random()`. With Chatterbox, vary `exaggeration` from 0.4 (exposition) to 0.75 (reveals) and keep `cfg_weight` ≈ 0.3–0.5.
- Evidence: Chatterbox README recommends higher exaggeration and lower cfg for expressive speech ([GitHub](https://github.com/resemble-ai/chatterbox)). Narration guides stress varied pace and pauses ([wordtotime](https://wordtotime-org.pages.dev/blog/words-to-time-explained), [Syllaby](https://syllaby.io/blog/voiceover-pacing-silence-trimming-retention-editing/)).
- Impact: high (the main cure for monotony). Effort: M. Channels: all. Status: **PARTIAL** (per-scene `speed` only).
- Apply: in `speak()`, split on sentence boundaries. Choose speed from a `role` tag in the script (`[hook]`, `[reveal]`, `[aside]`) or from rules (length, `?`, `!`, digits). Keep the cache key per sentence.

**T4. Explicit pause map.**
- What: Insert silence from punctuation and structure instead of relying on the engine:
  - Comma: ~120–180 ms
  - Sentence end: 300–450 ms
  - Paragraph or scene change: 700–1000 ms
  - Before a reveal or big number: 0.8–1.5 s, combined with a music drop (T10)
  - After a question: 600–900 ms
  - Script tag `[beat]` = 600 ms
- Evidence: pauses are part of documentary pacing time budgets ([wordtotime](https://wordtotime-org.pages.dev/blog/words-to-time-explained)); silence trimming and placement affect retention ([Syllaby](https://syllaby.io/blog/voiceover-pacing-silence-trimming-retention-editing/)).
- Impact: high. Effort: S. Channels: all (most for A/B). Status: **PARTIAL** (line gaps come from the timeline, not from rules).
- Apply: post-process each sentence chunk by trimming engine silence to under 60 ms, then appending the pause from the map. Store the pauses in `timing.json` so captions and visuals follow.

**T5. Target 140–155 wpm and measure it.**
- What: Documentary pace is 125–150 wpm; above 160 sounds like an explainer. Our channels are explainer-documentary, so aim for **~145 wpm average** including pauses. Allow 130 on reveals and 160 on lists. Fail CI if a scene averages more than 170 or less than 120.
- Evidence: documentary 135–150 / 125–140 / 130–145 ([wordtotime](https://wordtotime-org.pages.dev/blog/voice-over-rates-and-timing), [Typecast](https://typecast.ai/learn/?p=15068), [Edge Studio](https://edgestudio.com/?p=2132)).
- Impact: medium-high. Effort: S. Channels: all. Status: **MISSING**.
- Apply: compute words ÷ voiced duration per scene from `timing.json` and print a table in the CI log.

**T6. Write for the ear (script-side emphasis).**
- What: TTS cannot stress a word on command, so emphasis has to live in the script:
  - Put the key word at the end of a short sentence.
  - Split long sentences, aiming for a 6–22-word mix.
  - Spell numbers the way they should be spoken ("about three hundred thousand").
  - Use one rhetorical question per 60–90 s.
  - Avoid three same-length sentences in a row.
  
  For Turbo-style models, the paralinguistic tags (`[chuckle]`) are allowed only rarely.
- Evidence: Kurzgesagt's narration sets the animation timing and scripts go through about a dozen drafts ([Kurzgesagt process](https://kurzgesagt.org/youtube/)).
- Impact: high. Effort: S (lint). Channels: all. Status: **MISSING**.
- Apply: add a `tools/script_lint.py` check for sentence-length variance, a digit→words pass and a maximum of 30 words per sentence.

**T7. Breaths and mouth noise at paragraph starts.**
- What: Add a soft inhale (−30 to −26 dB relative to the voice, 250–400 ms) before about 1 in 3 paragraph starts. Never put one before every sentence.
- Evidence: general VO practice. Our `effect("breath")` already exists for foley.
- Impact: medium. Effort: S. Channels: all. Status: **PARTIAL**.
- Apply: reuse the synthesized `breath`, high-passed at 300 Hz, and place it 350 ms before the paragraph's first sentence on the voice stem, so it is processed with the voice.

**T8. Second voice for quotes and sources, and Aymen's voice on long videos.**
- What: Read primary-source quotes and on-screen document text in a second, contrasting licensed voice (e.g. `bm_george` against the main voice), with a slight band-limit to suggest an archive. Long videos use Aymen's recorded voice when possible (CLAUDE.md), which is also the strongest inauthentic-content defence.
- Evidence: YPP policy wants content that reflects creative vision rather than templates ([YouTube YPP policies](https://support.google.com/youtube/answer/1311392)).
- Impact: medium-high. Effort: M. Channels: A (history), C. Status: **MISSING** (`only kokoro is wired`).
- Apply: add a per-line `voice` override in the timeline. The "recorded" voice path (with DeepFilterNet cleanup) is already planned in the README.

### Music

**T9. A sonic identity per channel.**
- What: Every channel uses the same i–VI–iv–v minor progression today. Give each channel a palette:
  - **A History in Maps:** D Dorian or Aeolian, 70–84 BPM, low strings, frame drum, horn motif.
  - **B Scale & Science:** Lydian or major-7 colours, 90–100 BPM, plucks, celesta, synth pads ("wonder").
  - **C Money & Maps:** minor pentatonic, 96–110 BPM, muted piano, pulse bass, light hi-hat.
  
  Add a 2–3 s **sound logo** (3–4-note motif plus a soft hit) at the start of each video and a variation at the outro.
- Evidence: Kurzgesagt gives every video its own soundtrack from Epic Mountain "to give it a unique mood" ([Kurzgesagt](https://kurzgesagt.org/youtube/), [Kottke](https://also.kottke.org/18/01/the-soundtrack-to-kurzgesagt)). LEMMiNO uses his own music, offered for licensing ([LEMMiNO Bandcamp](https://lemmino.bandcamp.com/track/nation)).
- Impact: high (identity and anti-"generic"). Effort: M. Channels: all. Status: **MISSING**.
- Apply: add `brands/<brand>/sound.json` with mode, BPM, programs and motif. `soundtrack.py` reads it instead of the hard-coded `SCALE_MINOR`/`PROG`. Add 4–6 progressions per mood and pick one by seed per episode.

**T10. Reveal grammar: build, drop, hit.**
- What: Before a key number or map reveal, build for 4–8 s (rising filter cutoff, more hits, a riser). Then cut the music to silence for 0.5–1.5 s on the setup line. Land a stinger and a low boom on the reveal word, with music returning a bar later.
- Evidence: our moods already include `build`, `reveal` and `silence`; general explainer practice ([Boris FX](https://borisfx.com/blog/what-is-audio-ducking-and-how-is-it-used/)).
- Impact: high (retention at payoffs). Effort: S–M. Channels: all. Status: **PARTIAL** (moods exist, but there is no automatic drop or stinger sync to word timings).
- Apply: add a `reveal: {word_id}` timeline event. The generator schedules a riser ending at the word time −1.2 s, cuts the music for 1.2 s, then places `impact` and a stinger at the word time (taken from Whisper timing).

**T11. Change the music every 45–90 s.**
- What: Change the texture (drop drums, change instrument or register) on scene boundaries so the bed never loops audibly. Keep one cue per chapter.
- Evidence: CLAUDE.md's motion rule (a change every 6–15 s in long videos) applies by analogy. Kurzgesagt's bespoke per-video scoring.
- Impact: medium. Effort: S. Status: **PARTIAL**.
- Apply: rotate the instrument program per section by seed.

**T12. Better instruments (soundfont).**
- What: FluidR3_GM (MIT) sounds "General MIDI." Evaluate higher-quality free soundfonts. **Verify each licence before use; none was checked in this research.** As an alternative, layer a synthesized pad (numpy) with the GM strings.
- Impact: medium. Effort: M. Status: **MISSING**.

### SFX and sound design

**T13. Event-synced SFX vocabulary.**
- What:
  - **Whoosh** on every camera move or transition (−18 to −12 dB relative to the voice, 300–600 ms, panned with the motion).
  - **Map thud** (low sine 50–70 Hz plus a short noise transient) when a territory or pin lands.
  - **UI ticks** while numbers count up.
  - **Paper or pen** for documents.
  - **Riser** into chapter cards.
  
  Never more than one prominent SFX per 2 s, and never on a stressed word.
- Evidence: Kurzgesagt stresses music and SFX as a noticeable difference ([Kurzgesagt](https://kurzgesagt.org/youtube/)). Kenney ships interface and impact packs for exactly this ([Kenney](https://kenney.nl/assets/category:Audio)).
- Impact: high. Effort: M. Channels: all. Status: **PARTIAL** (whoosh, riser, tick, counter and impact synths exist; there is no automatic sync to Remotion transitions).
- Apply: export transition and count-up events from the Remotion timeline to `sfx[]` automatically, instead of hand-listing them.

**T14. Ambience layers.**
- What: Layer 2–3 quiet beds per scene, e.g. wind plus distant camp for history, room tone or hum for science, city or market murmur for money. Duck them like music, at −30 to −36 dB relative to the voice, with 0.8 s crossfades.
- Impact: medium. Effort: S. Status: **DOING** (`SCENE_AMB`).

**T15. Mix check on a phone speaker.**
- What: Render a "phone sim" (HPF 300 Hz, LPF 8 kHz, mono) of a 60-s excerpt in CI and attach it. Aymen listens on his own phone speaker before upload. Spot-check that STOI-style intelligibility holds with music at its peak.
- Evidence: high-pass 200–800 Hz to simulate phone playback ([LANDR](https://blog.landr.com/make-bass-audible-phone-speakers)).
- Impact: high (no one has done this yet). Effort: S. Status: **MISSING**.

### Mixing and loudness

**T16. Loudness and peaks.**
- What: Two-pass loudnorm to −14 LUFS with a final limiter. Note that the code uses `TP=-2.5` and an `alimiter` at 0.708 (−3 dBFS), stricter than the −1.5 dBTP gate. Keep it.
- Status: **DOING**.

**T17. Stem loudness targets.**
- What: Before the final loudnorm, set stems relative to the voice: music −20 LU during speech and −10 LU in gaps; ambience −30 LU; SFX peaks no more than 6 dB above voice peaks. Log per-stem LUFS (we already log RMS).
- Impact: medium. Effort: S. Status: **PARTIAL**.

---

## 4. Music and SFX sources (licence verified 2026-11-14)

| Source | Licence (primary source) | Commercial | Attribution | Content ID / risk | Verdict |
|---|---|---|---|---|---|
| **Our MIDI score** (FluidSynth + FluidR3_GM, MIT) | Original | Yes | No | None | **PRIMARY** |
| YouTube Audio Library | YouTube terms: monetizable in YPP; "won't be claimed through Content ID"; CC tracks need credit | Yes (on YouTube) | Only CC tracks | Safe on YouTube; no statement on use off YouTube | **ALLOWED** (YouTube uploads only; avoid on TikTok cross-posts) — [YT help](https://support.google.com/youtube/answer/3376882) |
| Incompetech (Kevin MacLeod) | Free "Creative Commons" option with credit, or a paid Standard licence. The page does not name the CC version | Yes | Required | Not stated on page | **ALLOWED (CC BY)**: copy the generated credit; log the version per track — [Incompetech](https://incompetech.com/music/royalty-free/licenses/) |
| Free Music Archive | Per-track CC; FMA guide lists BY, BY-SA, ND, NC, CC0 | Only BY / BY-SA / CC0 | Yes (except CC0) | Not stated | **ALLOWED: CC BY and CC0 only** (BY-SA has share-alike, so avoid) — [FMA guide](https://freemusicarchive.org/License_Guide) |
| Pixabay Music | Custom Pixabay Content License: free, no attribution; bans standalone redistribution | Yes | No | Terms say nothing on Content ID | **REJECT** (custom licence, not on our list; claim risk unaddressed) — [summary](https://pixabay.com/service/license-summary/), [terms](https://pixabay.com/service/terms/) |
| Musopen | FAQ blocked (403). Secondary sources: uploads are not verified as PD; YouTube claims reported | Per recording | — | Claims reported | **HOLD**: per-recording check only — [secondary](https://uppbeat.io/blog/public-domain-music) |
| OpenGameArt | Per-asset licence (not checked this session) | CC0 assets only | — | — | **ALLOWED: CC0 filter, check per asset** |
| MusicGen (Meta) | Weights **CC BY-NC 4.0** | No | — | — | **REJECT** — [HF](https://huggingface.co/facebook/musicgen-large) |
| Stable Audio Open 1.0 | Stability AI Community License (custom); up to 47 s | Custom terms | — | — | **REJECT** (not on list) — [HF](https://huggingface.co/stabilityai/stable-audio-open-1.0) |
| ACE-Step v1 3.5B | Apache-2.0 | Yes | No | Original output | **ALLOWED, GPU-only**: possible future stingers — [HF](https://huggingface.co/ACE-Step/ACE-Step-v1-3.5B) |
| YuE 7B | Apache-2.0; attribution "YuE by HKUST/M-A-P" requested | Yes | Requested | Original output | **ALLOWED, GPU-heavy** (songs with lyrics; not a bed tool) — [HF](https://huggingface.co/m-a-p/YuE-s1-7B-anneal-en-cot) |
| Kenney audio packs | **CC0** (verified for Impact Sounds, 130 files) | Yes | No | None | **ALLOWED** — [Kenney](https://kenney.nl/assets/impact-sounds) |
| Freesound | Each sound is CC0, CC BY 4.0, CC BY-NC 4.0 or legacy Sampling+ | CC0 / CC BY only | CC BY | Low | **ALLOWED: CC0 + CC BY 4.0 only** (reject NC and Sampling+) — [FAQ](https://freesound.org/help/faq/) |
| Sonniss GDC bundles | Custom: royalty-free, no attribution, YouTube allowed, no resale, **no AI/ML training** | Yes | No | Low | **AYMEN DECISION** (custom licence, not on list) — [Sonniss](https://sonniss.com/gameaudiogdc) |
| BBC Sound Effects (RemArc) | Personal, educational and research use only; commercial use via Pro Sound Effects | **No** | — | — | **REJECT** — primary page blocks automated fetch; [secondary](https://www.diyphotography.net/the-bbc-sound-effects-archive-is-now-free-to-download-with-over-33000-files/), [MusicRadar](https://www.musicradar.com/news/the-bbc-is-letting-you-download-more-than-16000-free-sound-effect-samples-from-its-archive) |

---

## 5. CI benchmark plan (Pocket TTS vs Chatterbox vs Kokoro)

**Workflow:** `.github/workflows/tts-bench.yml`, `workflow_dispatch`, matrix `engine: [kokoro, pocket, chatterbox_nano, chatterbox_turbo]`, `ubuntu-latest` (4 vCPU / 16 GB), `timeout-minutes: 120`, one job per engine.

**Input:** `tools/tts_bench/script.txt`, about 600 words (≈ 4 min). It mixes a hook, a list, numbers ("1,350 km", "1453", "$2.4 trillion"), place and person names (Hannibal, Carthage, Tenochtitlan), a question, a quote and a 3-paragraph reveal. Also run one **12-minute** script (the Hannibal 001 narration) for the top engine only, to test stability over long form.

**Voices:**
- Kokoro: `af_heart`, `bm_george`.
- Pocket: one CC0 `voice-donations/` voice and one CC BY `vctk/` voice. NC folders are blocked by an allow-list in code.
- Chatterbox: built-in default voice; no cloning of anyone without rights.

Run Chatterbox at two settings: (exag 0.5, cfg 0.5) and (exag 0.7, cfg 0.3).

**Metrics** (written to `bench/<engine>.json` and uploaded as an artifact with the WAVs):

| Metric | How | Pass gate |
|---|---|---|
| RTF and wall time | `time.perf_counter()` around synthesis only; model load logged separately | RTF ≤ 1.0 preferred; ≤ 2.0 acceptable (12-min narration ≤ 24 min) |
| Peak RAM | `resource.getrusage` | ≤ 10 GB |
| Intelligibility (WER) | faster-whisper (already pinned) on the output vs the script, numbers normalised | ≤ 3 % |
| Monotony | F0 standard deviation in semitones per sentence, and sentence-to-sentence F0 mean variance (pyin in numpy/scipy, or librosa after a licence check) | ≥ 1.3× Kokoro baseline |
| Pace | words ÷ voiced seconds | 130–160 wpm at speed 1.0 |
| Failures | count of silent, NaN or clipped chunks; truncated sentences (WER per sentence > 30 %) | 0 |
| Long-form drift (12-min run only) | per-minute median F0 and RMS; spectral-centroid drift | drift < 1 semitone, < 1.5 dB |
| Watermark | for Chatterbox, run `perth` detection and record the result (expected 1.0) | logged only |

**Human gate (Aymen's decision):** The CI job also writes a blind A/B page: `bench/listen.html` with the same 3 paragraphs per engine and shuffled labels, plus a phone-sim render (T15). Aymen listens **on his phone speaker** and ranks them. The automated metrics only pre-filter.

**Decision rule:** Pick the engine with the best Aymen rank among those passing every gate. Record RTF in `docs/BENCHMARK.md`, the licence rows in `docs/LICENSES.md`, the weights SHA in `assets/manifest.json`, and the decision in `docs/STATUS.md`. If Pocket TTS wins, add the credit line "Voice: Kyutai Pocket TTS (CC BY 4.0) – voice <name> (<licence>)" to `UPLOAD.md`.

**Cost estimate:** Kokoro ~4 min × 1.6 ≈ 7 min per engine-voice; 4 engines × 2 voices × ≤ 10 min ≈ 1.5 h of runner time in parallel jobs, under 15 min wall each. The 12-min stability run takes 10–25 min.

---

## 6. Sources (accessed 2026-11-14)

1. Chatterbox GitHub (README: retired Aug 2026, variants, PerTh, Nano CPU speed): https://github.com/resemble-ai/chatterbox
2. Chatterbox HF model card (MIT, 0.5B, PerTh): https://huggingface.co/ResembleAI/chatterbox
3. Chatterbox Turbo HF card (MIT, 350M, tags): https://huggingface.co/ResembleAI/chatterbox-turbo
4. Resemble AI pivot post (Aug 2026): https://www.resemble.ai/resources/why-a-former-voice-ai-company-went-all-in-on-deepfake-detection
5. Kokoro-82M HF card (Apache-2.0): https://huggingface.co/hexgrad/Kokoro-82M
6. Kyutai Pocket TTS HF card (CC BY 4.0, RTF): https://huggingface.co/kyutai/pocket-tts
7. Kyutai Pocket TTS GitHub (MIT, prohibited uses, voices): https://github.com/kyutai-labs/pocket-tts
8. Kyutai tts-voices (per-folder licences): https://huggingface.co/kyutai/tts-voices
9. Kyutai TTS 1.6B (CC BY 4.0): https://huggingface.co/kyutai/tts-1.6b-en_fr
10. F5-TTS HF (CC BY-NC 4.0): https://huggingface.co/SWivid/F5-TTS
11. XTTS-v2 HF (CPML): https://huggingface.co/coqui/XTTS-v2 ; CPML URL returned 404: https://coqui.ai/cpml
12. Dia-1.6B HF (Apache-2.0, GPU): https://huggingface.co/nari-labs/Dia-1.6B
13. Orpheus 3B HF: https://huggingface.co/canopylabs/orpheus-3b-0.1-ft
14. Zonos v0.1 HF: https://huggingface.co/Zyphra/Zonos-v0.1-transformer
15. VibeVoice-1.5B HF (research-only intent, audible disclaimer): https://huggingface.co/microsoft/VibeVoice-1.5B
16. Higgs Audio v2 HF: https://huggingface.co/bosonai/higgs-audio-v2-generation-3B-base ; LICENSE: https://github.com/boson-ai/higgs-audio/blob/main/LICENSE
17. IndexTTS licence (bilibili): https://github.com/index-tts/index-tts/blob/main/LICENSE ; card: https://huggingface.co/IndexTeam/IndexTTS-2
18. Spark-TTS HF (CC BY-NC-SA): https://huggingface.co/SparkAudio/Spark-TTS-0.5B
19. Fun-CosyVoice3 HF (Apache-2.0): https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512
20. Qwen3-TTS HF (Apache-2.0): https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice
21. Sesame CSM-1B HF: https://huggingface.co/sesame/csm-1b
22. NeuTTS Air HF: https://huggingface.co/neuphonic/neutts-air
23. VoxCPM 1.5 HF: https://huggingface.co/openbmb/VoxCPM1.5
24. StyleTTS2 GitHub (pretrained-model condition): https://github.com/yl4579/StyleTTS2
25. Piper1-gpl GitHub (GPL-3.0): https://github.com/OHF-Voice/piper1-gpl
26. MaskGCT HF (CC BY-NC): https://huggingface.co/amphion/MaskGCT
27. MeloTTS English HF (MIT): https://huggingface.co/myshell-ai/MeloTTS-English
28. Parler-TTS large v1 HF (Apache-2.0): https://huggingface.co/parler-tts/parler-tts-large-v1
29. OpenAudio S1-mini HF (CC BY-NC-SA): https://huggingface.co/fishaudio/openaudio-s1-mini
30. Supertonic 2 HF (OpenRAIL-M): https://huggingface.co/Supertone/supertonic-2
31. Kitten TTS mini HF (Apache-2.0): https://huggingface.co/KittenML/kitten-tts-mini-0.8
32. OpenVoice GitHub (MIT): https://github.com/myshell-ai/OpenVoice
33. TTS Arena V2 ELO snapshot, mid-2025 (secondary): https://ocdevel.com/blog/20250720-tts
34. Quantized CPU TTS notes 2026 (secondary): https://ocdevel.com/blog/20260711-quantized-cpu-tts
35. YouTube monetization policies (inauthentic content, 2025-07-15): https://support.google.com/youtube/answer/1311392
36. YouTube altered/synthetic content disclosure: https://support.google.com/youtube/answer/14328491
37. YouTube Audio Library help: https://support.google.com/youtube/answer/3376882
38. Pixabay licence summary: https://pixabay.com/service/license-summary/ ; terms: https://pixabay.com/service/terms/
39. Stable Audio Open 1.0 HF: https://huggingface.co/stabilityai/stable-audio-open-1.0
40. MusicGen large HF (CC BY-NC): https://huggingface.co/facebook/musicgen-large
41. ACE-Step v1 HF (Apache-2.0): https://huggingface.co/ACE-Step/ACE-Step-v1-3.5B
42. YuE HF (Apache-2.0): https://huggingface.co/m-a-p/YuE-s1-7B-anneal-en-cot
43. Incompetech licences: https://incompetech.com/music/royalty-free/licenses/
44. Free Music Archive licence guide: https://freemusicarchive.org/License_Guide
45. Freesound FAQ (licences): https://freesound.org/help/faq/
46. Kenney Impact Sounds (CC0): https://kenney.nl/assets/impact-sounds ; audio list: https://kenney.nl/assets/category:Audio
47. Sonniss GDC bundle terms: https://sonniss.com/gameaudiogdc
48. BBC SFX RemArc (secondary): https://www.diyphotography.net/the-bbc-sound-effects-archive-is-now-free-to-download-with-over-33000-files/ ; https://www.musicradar.com/news/the-bbc-is-letting-you-download-more-than-16000-free-sound-effect-samples-from-its-archive
49. Musopen public-domain caveats (secondary): https://uppbeat.io/blog/public-domain-music
50. Kurzgesagt video process (Epic Mountain soundtrack): https://kurzgesagt.org/youtube/
51. Kottke on the Kurzgesagt soundtrack (Epic Mountain): https://also.kottke.org/18/01/the-soundtrack-to-kurzgesagt
52. LEMMiNO Bandcamp (own music, licensing page): https://lemmino.bandcamp.com/track/nation
53. Smartphone loudness and frequency response (Audiokinetic): https://blog.audiokinetic.com/en/loudness-and-frequency-response-on-popular-smart-phones/
54. Bass on phone speakers, phone-sim HPF (LANDR): https://blog.landr.com/make-bass-audible-phone-speakers
55. Music under voiceover levels: https://www.overseeros.com/blog/background-music-volume-under-voiceover ; https://mubert.com/tools/cast/docs/auto-ducking ; https://borisfx.com/blog/what-is-audio-ducking-and-how-is-it-used/
56. Narration WPM: https://wordtotime-org.pages.dev/blog/voice-over-rates-and-timing ; https://wordtotime-org.pages.dev/blog/words-to-time-explained ; https://typecast.ai/learn/?p=15068 ; https://edgestudio.com/?p=2132 ; https://syllaby.io/blog/voiceover-pacing-silence-trimming-retention-editing/
57. Johnny Harris process interview (How I Write, 2025; not transcribed here): https://castbox.fm/episode/Johnny-Harris%3A-Master-Storytelling-on-YouTube-|-How-I-Write-id5563709-id787324282

Gaps to close later: Musopen and BBC primary pages blocked automated fetch; no making-of material found for Wendover, RealLifeLore, Kings and Generals, Real Science or MetaBallStudios audio; the TTS Arena V2 live leaderboard could not be read.
