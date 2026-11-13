// Pure, import-free helpers for the Clarity Kit (tested with `npm test`, node --experimental-strip-types).

/** Years between `year` (negative = BC, no year 0) and `now`. */
export const yearsAgo = (year: number, now = 2026): number => (year < 0 ? now - year - 1 : now - year);

/** "about 2,170 years ago" — rounded to 10 from 100 years on. */
export const agoLabel = (year: number, now = 2026): string => {
  const n = yearsAgo(year, now);
  const r = n >= 100 ? Math.round(n / 10) * 10 : n < 10 ? n : Math.round(n / 10) * 10;
  return `about ${r.toLocaleString('en-US')} years ago`;
};

export type CueWord = {w: string; t: number; end: number};
export type Cue = {t: number; end: number; lines: string[]; words: CueWord[]};

/** Group timed words into caption cues: ≤ maxLines lines of ≤ maxChars, a sentence end closes a cue. */
export const captionCues = (words: CueWord[], maxChars = 42, maxLines = 2): Cue[] => {
  const cues: Cue[] = [];
  let lines: string[] = [];
  let line = '';
  let cw: CueWord[] = [];
  const close = () => {
    if (line) lines.push(line);
    if (cw.length) cues.push({t: cw[0].t, end: cw[cw.length - 1].end, lines, words: cw});
    lines = [];
    line = '';
    cw = [];
  };
  for (const word of words) {
    if (line && line.length + 1 + word.w.length > maxChars) {
      lines.push(line);
      line = '';
      if (lines.length >= maxLines) close();
    }
    line = line ? `${line} ${word.w}` : word.w;
    cw.push(word);
    if (/[.?!]["')\]]?$/.test(word.w)) close();
    else if (/[,;:]$/.test(word.w) && line.length >= 14) {
      // prefer phrase breaks: a comma ends the line (and the cue once it has maxLines lines)
      lines.push(line);
      line = '';
      if (lines.length >= maxLines) close();
    }
  }
  close();
  return cues;
};

export type LabelBox = {id: string; x: number; y: number; w: number; h: number; priority: number};
export type Placed = {id: string; dx: number; dy: number; hidden: boolean};

/** Greedy label placement: highest priority first, clamp into frame, try nearby offsets, else hide. */
export const layoutLabels = (boxes: LabelBox[], frame: {w: number; h: number}, pad = 6): Placed[] => {
  const order = boxes.map((b, i) => ({b, i})).sort((a, c) => c.b.priority - a.b.priority || a.i - c.i);
  const placed: {x: number; y: number; w: number; h: number}[] = [];
  const result = new Map<string, Placed>();
  const hits = (x: number, y: number, w: number, h: number) =>
    placed.some((p) => x < p.x + p.w + pad && p.x < x + w + pad && y < p.y + p.h + pad && p.y < y + h + pad);
  const inside = (x: number, y: number, w: number, h: number) => x >= 0 && y >= 0 && x + w <= frame.w && y + h <= frame.h;
  for (const {b} of order) {
    const bx = Math.min(Math.max(b.x, 0), Math.max(0, frame.w - b.w));
    const by = Math.min(Math.max(b.y, 0), Math.max(0, frame.h - b.h));
    const sy = b.h + pad;
    const sx = b.w / 2 + pad;
    const offsets: [number, number][] = [];
    for (const k of [0, -1, 1, -2, 2, -3, 3]) for (const j of [0, -1, 1]) offsets.push([j * sx, k * sy]);
    const hit = offsets.find(([ox, oy]) => inside(bx + ox, by + oy, b.w, b.h) && !hits(bx + ox, by + oy, b.w, b.h));
    if (!hit) {
      result.set(b.id, {id: b.id, dx: 0, dy: 0, hidden: true});
      continue;
    }
    const x = bx + hit[0];
    const y = by + hit[1];
    placed.push({x, y, w: b.w, h: b.h});
    result.set(b.id, {id: b.id, dx: x - b.x, dy: y - b.y, hidden: false});
  }
  return boxes.map((b) => result.get(b.id)!);
};

const UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const bare = (w: string) => w.toLowerCase().replace(/[^a-z-]/g, '');
const isNumWord = (w: string) => {
  const parts = bare(w).split('-').filter(Boolean);
  return parts.length > 0 && parts.every((p) => UNITS.includes(p) || TENS.includes(p) || p === 'hundred' || p === 'thousand');
};
const numValue = (ws: string[]) => {
  let total = 0;
  let cur = 0;
  for (const p of ws.flatMap((w) => bare(w).split('-').filter(Boolean))) {
    if (UNITS.includes(p)) cur += UNITS.indexOf(p);
    else if (TENS.includes(p)) cur += TENS.indexOf(p) * 10;
    else if (p === 'hundred') cur *= 100;
    else if (p === 'thousand') {
      total += cur * 1000;
      cur = 0;
    }
  }
  return total + cur;
};

/** Caption display: spoken numbers ("one hundred forty-six B C") → numerals ("146 BC"), merged words keep their span. */
export const numeralize = (words: CueWord[]): CueWord[] => {
  const out: CueWord[] = [];
  let i = 0;
  while (i < words.length) {
    let j = i;
    while (j < words.length && isNumWord(words[j].w) && (j === i || !/[.,;:?!]$/.test(words[j - 1].w))) j++;
    const run = words.slice(i, j);
    const clean = run.map((w) => bare(w.w));
    const bc = j + 1 < words.length && words[j].w === 'B' && /^C\b/.test(words[j + 1].w);
    const big = clean.some((c) => c === 'hundred' || c === 'thousand');
    const year = run.length === 2 && UNITS.indexOf(clean[0]) >= 11 && numValue([clean[1]]) >= 20 && numValue([clean[1]]) < 100;
    if (run.length && (bc || big || year)) {
      const v = year ? UNITS.indexOf(clean[0]) * 100 + numValue([clean[1]]) : numValue(clean);
      const trail = run[run.length - 1].w.replace(/^[A-Za-z-]+/, '');
      if (bc) {
        out.push({w: `${v} BC${words[j + 1].w.replace(/^C/, '')}`, t: run[0].t, end: words[j + 1].end});
        i = j + 2;
      } else {
        out.push({w: (year ? String(v) : v.toLocaleString('en-US')) + trail, t: run[0].t, end: run[run.length - 1].end});
        i = j;
      }
      continue;
    }
    out.push(words[i]);
    i++;
  }
  return out;
};

/** "≈ 600 km": 1 km steps under 20, 5 under 100, 50 under 1,000, then 100. */
export const kmLabel = (km: number): string => {
  const step = km < 20 ? 1 : km < 100 ? 5 : km < 1000 ? 50 : 100;
  return `≈ ${(Math.round(km / step) * step).toLocaleString('en-US')} km`;
};

/** Largest 1/2/5 × 10^k km bar that fits in maxPx at pxPerKm. */
export const niceScale = (pxPerKm: number, maxPx: number): {km: number; px: number} => {
  let best = {km: 1, px: pxPerKm};
  for (let e = -1; e <= 5; e++)
    for (const m of [1, 2, 5]) {
      const km = m * 10 ** e;
      if (km * pxPerKm <= maxPx && km >= best.km) best = {km, px: Math.round(km * pxPerKm)};
    }
  return best;
};
