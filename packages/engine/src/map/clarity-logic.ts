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
