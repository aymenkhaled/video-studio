import React, {useMemo} from 'react';
import {clamp01, easeInOutCubic, ramp} from '../motion';
import {INTER} from '../overlay';
import type {TimedLine} from '../overlay';
import {CINZEL} from './map';
import {captionCues, numeralize, type Cue} from './clarity-logic';

// Clarity Kit (docs/CLARITY_STANDARD.md): captions, legend and explainer cards for zero-background viewers.
// Everything is opt-in through HistoryEpisode's `clarity` prop.

export type Faction = {name: string; color: string};
export type ClarityConfig = {factions: Faction[]; highlight?: Record<string, string>; now?: number};

const INK = 'rgba(10,14,18,0.66)';
const PAPER = '#f4ecd8';
const GOLD = '#d8b46a';

const key = (w: string) => w.replace(/[^A-Za-z']/g, '').replace(/'s$/, '');

/** Phrase captions (≤ 2 lines), numbers shown as numerals, faction names in their colour. Bottom edge at y = 920. */
export const MapCaptions: React.FC<{lines: TimedLine[]; t: number; highlight?: Record<string, string>}> = ({lines, t, highlight = {}}) => {
  const cues = useMemo<Cue[]>(() => lines.flatMap((l) => captionCues(numeralize(l.words))), [lines]);
  let cue: Cue | undefined;
  for (const c of cues) if (t >= c.t - 0.05 && t <= c.end + 0.3) cue = c;
  if (!cue) return null;
  const a = clamp01((t - cue.t + 0.05) / 0.12) * clamp01((cue.end + 0.3 - t) / 0.12);
  // Re-split the cue's words into its display lines (captionCues already decided the breaks).
  let k = 0;
  const rows = cue.lines.map((line) => {
    const n = line.split(' ').length;
    const ws = cue!.words.slice(k, k + n);
    k += n;
    return ws;
  });
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 160, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{maxWidth: 1500, background: INK, borderRadius: 14, padding: '12px 30px', textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: '#fff'}}>
        {rows.map((ws, r) => (
          <div key={r}>
            {ws.map((w, i) => (
              <span key={i} style={{color: highlight[key(w.w)] ?? '#fff'}}>
                {w.w}
                {i < ws.length - 1 ? ' ' : ''}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Always-visible colour key on map scenes (top-right). */
export const Legend: React.FC<{factions: Faction[]; p: number}> = ({factions, p}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.04));
  return (
    <div style={{position: 'absolute', right: 48, top: 40, opacity: a, background: INK, borderRadius: 10, padding: '12px 18px', fontFamily: INTER}}>
      {factions.map((f) => (
        <div key={f.name} style={{display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0'}}>
          <div style={{width: 16, height: 16, borderRadius: 3, background: f.color, border: `2px solid ${PAPER}`}} />
          <div style={{fontWeight: 600, fontSize: 26, color: PAPER}}>{f.name}</div>
        </div>
      ))}
    </div>
  );
};

/** "Who's who" card, first time a person appears (left third). */
export const CharacterCard: React.FC<{name: string; role: string; line: string; color: string; p: number}> = ({name, role, line, color, p}) => {
  const a = easeInOutCubic(ramp(p, 0.02, 0.08)) * (1 - easeInOutCubic(ramp(p, 0.94, 1)));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 64, top: 250, width: 560, opacity: a, transform: `translateX(${(1 - a) * -40}px)`, background: 'rgba(18,13,8,0.86)', borderLeft: `8px solid ${color}`, borderRadius: 12, padding: '26px 30px', fontFamily: INTER}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{width: 92, height: 92, borderRadius: 46, background: color, border: `4px solid ${PAPER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CINZEL, fontWeight: 700, fontSize: 50, color: PAPER, flexShrink: 0}}>{name[0]}</div>
        <div>
          <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: PAPER}}>{name}</div>
          <div style={{fontWeight: 700, fontSize: 26, letterSpacing: 2, color: GOLD, marginTop: 6}}>{role.toUpperCase()}</div>
        </div>
      </div>
      <div style={{fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: '#e9dcc0', marginTop: 18}}>{line}</div>
    </div>
  );
};

/** Word pop-up: a hard term and its plain meaning (top-centre pill). */
export const GlossaryPop: React.FC<{term: string; meaning: string; p: number; window?: [number, number]}> = ({term, meaning, p, window = [0.1, 0.8]}) => {
  const a = easeInOutCubic(ramp(p, window[0], window[0] + 0.05)) * (1 - easeInOutCubic(ramp(p, window[1] - 0.05, window[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 46, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * -16}px)`}}>
      <div style={{background: 'rgba(18,13,8,0.88)', border: `2px solid ${GOLD}`, borderRadius: 40, padding: '12px 30px', fontFamily: INTER, fontSize: 32, color: PAPER, whiteSpace: 'nowrap'}}>
        <span style={{fontWeight: 800, color: GOLD, letterSpacing: 1}}>{term.toUpperCase()}</span>
        <span style={{fontWeight: 500}}> · {meaning}</span>
      </div>
    </div>
  );
};

/** Chapter-end recap: "SO FAR" + one sentence. */
export const RecapCard: React.FC<{text: string; p: number}> = ({text, p}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.12)) * (1 - easeInOutCubic(ramp(p, 0.9, 1)));
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.78 * a})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a}}>
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: GOLD}}>SO FAR</div>
      <div style={{width: 120 * a, height: 3, background: GOLD, margin: '22px 0'}} />
      <div style={{maxWidth: 1350, textAlign: 'center', fontFamily: CINZEL, fontWeight: 700, fontSize: 64, lineHeight: 1.25, color: PAPER}}>{text}</div>
    </div>
  );
};

/** Fail fast on cards a phone viewer can't read. */
export const assertCardLimits = (sceneId: string, overlays: {type: string; meaning?: string; text?: string}[] = []) => {
  for (const o of overlays) {
    if (o.type === 'glossary' && (o.meaning ?? '').length > 70) throw new Error(`scene ${sceneId}: glossary meaning > 70 chars`);
    if (o.type === 'recap' && (o.text ?? '').length > 120) throw new Error(`scene ${sceneId}: recap text > 120 chars`);
  }
};
