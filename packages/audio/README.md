# packages/audio — Python audio pipeline (CI only)

Planned: MIDI composition → FluidSynth (FluidR3_GM, MIT), synthesized + Kenney/Freesound SFX, event-synced stems, ducking, single `loudnorm` to −14 LUFS / −1.5 dBTP, Kokoro TTS (drafts/Shorts), Aymen's voice cleanup (DeepFilterNet), Whisper word timestamps for captions.
Port sources: `_import/dtf/tools/make_field_audio.py`, `_import/prehistoric-sound-lab/make_audio*.py`, `make_vo*.py`. Fix hardcoded `/home/claude/*` paths.
Pins in `requirements.txt` are the set proven in the Horn Lock CI run.
