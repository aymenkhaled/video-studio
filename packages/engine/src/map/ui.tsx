import React from 'react';
import {clamp01, easeInOutCubic, ramp} from '../motion';
import {INTER} from '../overlay';
import {CINZEL} from './map';
import {agoLabel} from './clarity-logic';

// Long-form (16:9) documentary UI: chapter cards, timeline bar, citation lower-thirds, big counters.

export const yearLabel = (y: number) => (y < 0 ? `${-y} BC` : `AD ${y}`);

/** Full-frame chapter card over a darkened map. `p` = progress within the card's on-screen time. */
export const ChapterCard: React.FC<{n: number; title: string; sub?: string; p: number}> = ({n, title, sub, p}) => {
  const a = easeInOutCubic(ramp(p, 0, 0.18)) * (1 - easeInOutCubic(ramp(p, 0.85, 1)));
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.72 * a})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a}}>
      <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#d8b46a'}}>CHAPTER {n}</div>
      <div style={{width: 120 * a, height: 3, background: '#d8b46a', margin: '22px 0'}} />
      <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 96, color: '#f4ecd8', transform: `translateY(${(1 - a) * 20}px)`}}>{title}</div>
      {sub ? <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 34, color: '#d9cdb0', marginTop: 16}}>{sub}</div> : null}
    </div>
  );
};

/** Quote over a darkened background, with attribution. */
export const QuoteCard: React.FC<{text: string; by: string; p: number; at?: [number, number]}> = ({text, by, p, at = [0.08, 0.96]}) => {
  const a = easeInOutCubic(ramp(p, at[0], at[0] + 0.1)) * (1 - easeInOutCubic(ramp(p, at[1] - 0.05, at[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.84 * a})`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: a}}>
      <div style={{maxWidth: 1350, textAlign: 'center'}}>
        <div style={{fontFamily: CINZEL, fontWeight: 600, fontSize: 64, lineHeight: 1.25, color: '#f4ecd8', transform: `translateY(${(1 - a) * 16}px)`}}>“{text}”</div>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 30, color: '#d8b46a', marginTop: 28, letterSpacing: 2}}>— {by}</div>
      </div>
    </div>
  );
};

/** Numbered list card (e.g. treaty terms), items appear one by one. */
export const ListCard: React.FC<{title: string; items: string[]; p: number; source?: string}> = ({title, items, p, source}) => {
  const a = easeInOutCubic(ramp(p, 0.02, 0.1));
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.84 * a})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: a}}>
      <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 62, color: '#f4ecd8', marginBottom: 40}}>{title}</div>
      {items.map((it, i) => {
        const b = easeInOutCubic(ramp(p, 0.12 + i * 0.17, 0.2 + i * 0.17));
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, width: 1200, marginBottom: 22, opacity: b, transform: `translateX(${(1 - b) * -30}px)`}}>
            <div style={{width: 56, height: 56, borderRadius: 28, background: '#d8b46a', color: '#1b1208', fontFamily: INTER, fontWeight: 800, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{i + 1}</div>
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 40, color: '#f4ecd8'}}>{it}</div>
          </div>
        );
      })}
      {source ? <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: '#d9cdb0', marginTop: 20}}>Source: {source}</div> : null}
    </div>
  );
};

/** Big episode title card. */
export const TitleCard: React.FC<{title: string; sub: string; p: number}> = ({title, sub, p}) => {
  const a = easeInOutCubic(ramp(p, 0.15, 0.4));
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(12,9,5,${0.55 * a})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: CINZEL, fontWeight: 700, fontSize: 170, letterSpacing: 18, color: '#f4ecd8', opacity: a, transform: `scale(${0.94 + 0.06 * a})`, textShadow: '0 6px 0 #000'}}>{title}</div>
      <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 38, letterSpacing: 6, color: '#d8b46a', opacity: easeInOutCubic(ramp(p, 0.35, 0.55))}}>{sub}</div>
    </div>
  );
};

/** Bottom timeline bar with a moving year marker. */
export const TimelineBar: React.FC<{from: number; to: number; year: number; events?: {year: number; label: string}[]; now?: number}> = ({from, to, year, events = [], now}) => {
  const x = (y: number) => clamp01((y - from) / (to - from)) * 100;
  return (
    <div style={{position: 'absolute', left: 120, right: 120, bottom: 54, height: 60, fontFamily: INTER}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 28, height: 4, background: 'rgba(244,236,216,0.35)'}} />
      <div style={{position: 'absolute', left: 0, width: `${x(year)}%`, top: 28, height: 4, background: '#d8b46a'}} />
      {events.map((e) => (
        <div key={e.label} style={{position: 'absolute', left: `${x(e.year)}%`, top: 22, width: 2, height: 16, background: 'rgba(244,236,216,0.6)'}} />
      ))}
      <div style={{position: 'absolute', left: `${x(year)}%`, top: 16, transform: 'translateX(-50%)'}}>
        <div style={{width: 28, height: 28, borderRadius: 14, background: '#d8b46a', border: '4px solid #1b1208', margin: '0 auto'}} />
      </div>
      <div style={{position: 'absolute', left: `${x(year)}%`, top: -30, transform: 'translateX(-50%)', color: '#f4ecd8', fontWeight: 800, fontSize: 30, textShadow: '0 2px 0 #000', whiteSpace: 'nowrap'}}>{yearLabel(Math.round(year))}</div>
      {now !== undefined ? (
        <div style={{position: 'absolute', left: `${x(year)}%`, top: 40, transform: 'translateX(-50%)', color: '#e9dcc0', fontWeight: 500, fontSize: 18, textShadow: '0 2px 0 #000', whiteSpace: 'nowrap'}}>{agoLabel(Math.round(year), now)}</div>
      ) : null}
      <div style={{position: 'absolute', left: 0, top: 40, color: 'rgba(244,236,216,0.7)', fontSize: 20}}>{yearLabel(from)}</div>
      <div style={{position: 'absolute', right: 0, top: 40, color: 'rgba(244,236,216,0.7)', fontSize: 20}}>{yearLabel(to)}</div>
    </div>
  );
};

/** Source citation chip (lower-left). Shows that numbers come from somewhere. */
export const Citation: React.FC<{text: string; p: number; at?: [number, number]}> = ({text, p, at = [0.05, 0.95]}) => {
  const a = easeInOutCubic(ramp(p, at[0], at[0] + 0.08)) * (1 - easeInOutCubic(ramp(p, at[1] - 0.06, at[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 64, top: 56, opacity: a, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: '#f4ecd8', background: 'rgba(12,9,5,0.7)', borderLeft: '5px solid #d8b46a', padding: '10px 18px'}}>
      Source: {text}
    </div>
  );
};

/** Big number panel (right side), counting toward `value`. */
export const BigCounter: React.FC<{label: string; value: number; p: number; window: [number, number]; color?: string; suffix?: string; top?: number}> = ({label, value, p, window, color = '#d8b46a', suffix = '', top = 300}) => {
  const k = easeInOutCubic(ramp(p, window[0], window[0] + 0.25));
  const a = easeInOutCubic(ramp(p, window[0], window[0] + 0.08)) * (1 - easeInOutCubic(ramp(p, window[1] - 0.06, window[1])));
  if (a <= 0) return null;
  return (
    <div style={{position: 'absolute', right: 90, top, textAlign: 'right', opacity: a, fontFamily: INTER, transform: `translateX(${(1 - a) * 30}px)`}}>
      <div style={{fontWeight: 800, fontSize: 112, color, fontVariantNumeric: 'tabular-nums', textShadow: '0 4px 0 rgba(0,0,0,0.6)'}}>
        {Math.round(value * k).toLocaleString('en-US')}
        {suffix}
      </div>
      <div style={{fontWeight: 700, fontSize: 34, letterSpacing: 4, color: '#f4ecd8', textShadow: '0 2px 0 #000'}}>{label}</div>
    </div>
  );
};
