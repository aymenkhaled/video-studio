---
name: package-upload
description: Create the upload package for a finished video (titles, thumbnails, description, chapters, credits, SRT, Shorts cut-downs, cross-post captions, UPLOAD.md checklist). Use after qa-video passes.
---

# package-upload

Write everything into the episode folder.

1. **Titles (3)** for Test & Compare: concrete, ≤ 60 chars, no clickbait the video doesn't pay off.
2. **Thumbnails (3)**: render the `Thumbnail` still (1280×720) in 3 variants: single subject (≤ 3 words), VS layout, size layout. Same brand look. Look at them at 25 % size.
3. **Description**: 2-line hook, chapters (`00:00 …`, first at 00:00, ≥ 3 chapters, each ≥ 10 s), sources (every URL from `sources.md`), credits block from `docs/LICENSES.md` for assets used, 3–5 hashtags.
4. **Captions**: `captions.srt` from Whisper word timings, checked against the script.
5. **Shorts**: 4–6 cut-downs from the long video, each starting with motion and the subject in frame 1, plus a related-video link to the long one.
6. **Cross-post captions** for TikTok, Instagram Reels, Facebook Reels.
7. **UPLOAD.md** checklist for Aymen: audience "not made for kids"; altered content "No" unless realistic AI; category Education; language English; upload SRT; enable auto-dubbing and review the dubs; end screen + playlist; pinned comment (a debate question); after 48 h record CTR, average % viewed, 30-s drop, viewed-vs-swiped in `docs/LESSONS.md`.
