# Agents (OpenCode / GPT and any other coding agent)

Same rules as `CLAUDE.md` (read it first), then `docs/PLAYBOOK.md`, `docs/LESSONS.md`, `docs/STATUS.md`.
Division of work and handoff files: `docs/COST_SAVING.md`.

- Render, media generation and QA run only in GitHub Actions (`.github/workflows/render.yml`); locally only edit files and use git/gh.
- Licences: PD, CC0, CC BY, OFL, MIT, BSD, Apache only; every asset gets a row in `docs/LICENSES.md`. No BY-SA, NC, ND.
- Every on-screen number needs a dated source row in the episode's `sources.md`.
- Write results to files (research notes, sources rows, media.json entries), keep chat output short, never commit secrets or videos.
