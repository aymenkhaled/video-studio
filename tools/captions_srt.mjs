// captions.srt that matches the burned-in captions exactly (same numeralize + captionCues as the video).
// Usage: node --experimental-strip-types tools/captions_srt.mjs <timing.json> <out.srt>
import fs from 'node:fs';
import {captionCues, numeralize} from '../packages/engine/src/map/clarity-logic.ts';

const [timingPath, outPath] = process.argv.slice(2);
if (!timingPath || !outPath) throw new Error('usage: captions_srt.mjs <timing.json> <out.srt>');
const timing = JSON.parse(fs.readFileSync(timingPath, 'utf8'));
const ts = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const sec = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, '0')}`;
};
const cues = timing.lines.flatMap((l) => captionCues(numeralize(l.words)));
const srt = cues.map((c, i) => `${i + 1}\n${ts(c.t)} --> ${ts(Math.min(c.end + 0.3, cues[i + 1]?.t ?? Infinity))}\n${c.lines.join('\n')}\n`).join('\n');
fs.writeFileSync(outPath, srt, 'utf8');
console.log(`captions.srt: ${cues.length} cues (identical to burned-in captions)`);
