import React from 'react';

// Illustrated unit figures (original vector drawings, no third-party art): infantry with shield and spear, cavalry
// rider, war elephant with tower, oared galley. Drawn in a 40 × 40 box centred on (0, 0), side colour + paper outline.

export type FigureKind = 'infantry' | 'cavalry' | 'elephant' | 'ship';
const PAPER = '#f4ecd8';
const INK = '#1b1208';

export const Figure: React.FC<{kind: FigureKind; x: number; y: number; size: number; color: string; flip?: boolean}> = ({kind, x, y, size, color, flip}) => {
  const k = size / 40;
  const common = {stroke: INK, strokeWidth: 2.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -k : k},${k})`}>
      {kind === 'infantry' ? (
        <>
          <line x1={11} y1={-21} x2={11} y2={19} stroke={INK} strokeWidth={2.4} />
          <path d="M9,-23 L11,-28 L13,-23 Z" fill={PAPER} {...common} />
          <path d="M-4,18 L-3,6 M4,18 L3,6" fill="none" {...common} strokeWidth={3.4} />
          <path d="M-6,-6 L6,-6 L7,7 L-7,7 Z" fill={color} {...common} />
          <circle cx={0} cy={-12} r={5} fill="#e8c9a0" {...common} />
          <path d="M-5.5,-13 Q0,-21 5.5,-13 Z" fill={color} {...common} />
          <path d="M6,-3 L11,-2" stroke={INK} strokeWidth={2.6} />
          <circle cx={-7} cy={1} r={8.5} fill={color} {...common} />
          <circle cx={-7} cy={1} r={2.6} fill={PAPER} stroke={INK} strokeWidth={1.4} />
        </>
      ) : null}
      {kind === 'cavalry' ? (
        <>
          <path d="M-14,8 L-15,19 M-8,9 L-9,19 M8,9 L9,19 M13,7 L15,18" fill="none" {...common} strokeWidth={3} />
          <ellipse cx={0} cy={4} rx={15} ry={7} fill="#8a6a45" {...common} />
          <path d="M11,1 L17,-9 L21,-8 L22,-4 L16,6 Z" fill="#8a6a45" {...common} />
          <path d="M-15,2 Q-21,6 -19,13" fill="none" {...common} strokeWidth={2.6} />
          <path d="M-4,-2 L-2,-12 L4,-12 L4,-2 Z" fill={color} {...common} />
          <circle cx={1} cy={-16} r={4.4} fill="#e8c9a0" {...common} />
          <path d="M-3.5,-17 Q1,-24 5.5,-17 Z" fill={color} {...common} />
          <line x1={-8} y1={-4} x2={22} y2={-20} stroke={INK} strokeWidth={2.2} />
        </>
      ) : null}
      {kind === 'elephant' ? (
        <>
          <path d="M-12,8 L-12,19 L-7,19 L-7,9 M5,9 L5,19 L10,19 L10,8" fill="#8f8a82" {...common} />
          <ellipse cx={-1} cy={2} rx={15} ry={10} fill="#8f8a82" {...common} />
          <circle cx={13} cy={-3} r={7.5} fill="#8f8a82" {...common} />
          <path d="M19,0 Q23,10 18,17" fill="none" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
          <path d="M19,0 Q23,10 18,17" fill="none" stroke="#8f8a82" strokeWidth={2} strokeLinecap="round" />
          <path d="M9,-6 Q5,2 10,5" fill="#7d7870" {...common} />
          <path d="M17,2 L21,4" stroke={PAPER} strokeWidth={2} />
          <rect x={-10} y={-14} width={13} height={8} fill={color} {...common} />
          <path d="M-11,-14 L4,-14" stroke={INK} strokeWidth={2.4} />
        </>
      ) : null}
      {kind === 'ship' ? (
        <>
          <path d="M-19,0 L-23,-5 M-12,2 L-15,12 M-6,3 L-8,13 M0,3 L-1,13 M6,3 L5,13 M12,2 L11,12" fill="none" stroke={INK} strokeWidth={1.8} />
          <path d="M-22,-2 Q0,10 22,-4 L19,-8 L-18,-6 Z" fill="#6b4a2c" {...common} />
          <line x1={0} y1={-6} x2={0} y2={-26} stroke={INK} strokeWidth={2.2} />
          <path d="M-9,-24 L9,-24 L8,-10 L-8,-10 Z" fill={color} {...common} />
        </>
      ) : null}
    </g>
  );
};
