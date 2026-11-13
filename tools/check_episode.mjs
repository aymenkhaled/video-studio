// Clarity Standard rule 9 + script sanity for a history episode (no bundle, no render).
// Usage: node tools/check_episode.mjs <episodeDir> [--warn]
// Fails (exit 1) if a scene's estimated length > 15 s, total words outside 1,300–2,200, or a chapter id is missing.
import fs from 'node:fs';
import path from 'node:path';

const [dir, flag] = process.argv.slice(2);
if (!dir) throw new Error('usage: check_episode.mjs <episodeDir> [--warn]');
const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
const pkgPath = path.join(dir, 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {chapters: {}};
const problems = [];
let words = 0;
let total = 0;
for (const s of tl.scenes) {
  const n = s.lines.join(' ').split(/\s+/).filter(Boolean).length;
  words += n;
  const d = Math.max((s.lead ?? 0.6) + n / 2.5 + (s.tail ?? 0.8), s.min ?? 3);
  total += d;
  if (d > 15) problems.push(`scene ${s.id}: estimated ${d.toFixed(1)} s > 15 s — split it`);
}
if (words < 1300 || words > 2200) problems.push(`total words ${words} outside 1,300–2,200`);
const ids = new Set(tl.scenes.map((s) => s.id));
for (const id of Object.keys(pkg.chapters ?? {})) if (!ids.has(id)) problems.push(`chapter id ${id} not in timeline.json`);
console.log(`${tl.id}: ${tl.scenes.length} scenes, ${words} words, ~${(total / 60).toFixed(1)} min estimated`);
for (const p of problems) console.log(`  FAIL ${p}`);
if (problems.length && flag !== '--warn') process.exit(1);
console.log(problems.length ? 'WARN (not enforced)' : 'PASS');
