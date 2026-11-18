import React from 'react';
import {makeEpisodeMetadata} from '../../packages/engine/src/map/episode';
import {ShortEpisode, ShortLook, ShortProps, ShortShot} from '../../packages/engine/src/shorts/short';
import {SCENES as A1} from '../../brands/history-maps/episodes/001-hannibal/scenes';
import {SCENES as A2} from '../../brands/history-maps/episodes/002-carthage/scenes';
import {SCENES as B1} from '../../brands/scale-science/episodes/001-biggest-animal/scenes';
import {SCENES as B2} from '../../brands/scale-science/episodes/002-giant-waves/scenes';
import {SCENES as C1} from '../../brands/money-maps/episodes/001-switzerland/scenes';
import {SCENES as C2} from '../../brands/money-maps/episodes/002-siberian-curse/scenes';
import tA1a from '../../brands/history-maps/shorts/a001-short-1-cannae/timeline.json';
import tA1b from '../../brands/history-maps/shorts/a001-short-2-alps/timeline.json';
import tA2a from '../../brands/history-maps/shorts/a002-short-1-fig/timeline.json';
import tA2b from '../../brands/history-maps/shorts/a002-short-2-salt/timeline.json';
import tB1a from '../../brands/scale-science/shorts/b001-short-1-megalodon/timeline.json';
import tB1b from '../../brands/scale-science/shorts/b001-short-2-alive-now/timeline.json';
import tB2a from '../../brands/scale-science/shorts/b002-short-1-tracy-arm/timeline.json';
import tB2b from '../../brands/scale-science/shorts/b002-short-2-lituya/timeline.json';
import tC1a from '../../brands/money-maps/shorts/c001-short-1-watches/timeline.json';
import tC1b from '../../brands/money-maps/shorts/c001-short-2-not-banks/timeline.json';
import tC2a from '../../brands/money-maps/shorts/c002-short-1-norilsk/timeline.json';
import tC2b from '../../brands/money-maps/shorts/c002-short-2-paid-to-leave/timeline.json';

// Promo Shorts (2 per finished long video). Narration + packaging: tools/build_shorts.py. Shots reuse the long
// episodes' reviewed SceneDefs; every on-screen number carries its source (same rows as the long video's sources.md).

const HIST: ShortLook = {accent: '#f2c14e', channel: 'History in Maps'};
const SCALE: ShortLook = {accent: '#5fd3e8', channel: 'Scale & Science'};
const MONEY: ShortLook = {accent: '#ffd23f', channel: 'Money & Maps'};

type Def = {id: string; timeline: {fps: number; scenes: {id: string; lines: string[]}[]}; hook: string; look: ShortLook; shots: Record<string, ShortShot>};

export const SHORTS: Def[] = [
  {
    id: 'ShortA001Cannae', timeline: tA1a, look: HIST, hook: 'Outnumbered *2 to 1*.\nHe *surrounded* them.',
    shots: {
      s1: {scene: A1.c0a},
      s2: {scene: A1.c4b_2, stat: {value: '80,000 vs 40,000', label: 'Roman vs Carthaginian infantry'}, source: 'Polybius 3.113–114'},
      s3: {scene: A1.c4c_2},
      s4: {scene: A1.c4d},
      s5: {scene: A1.c4e_2},
      s6: {scene: A1.c4f, stat: {value: '~70,000', label: 'Roman dead (Polybius; Livy: ~50,000)'}, source: 'Polybius 3.117; Livy 22.49 — disputed'},
      s7: {scene: A1.c0a, end: true},
    },
  },
  {
    id: 'ShortA001Alps', timeline: tA1b, look: HIST, hook: 'He lost *half his army*\nbefore the first battle',
    shots: {
      s1: {scene: A1.c2c},
      s2: {scene: A1.c2a_2, stat: {value: '90,000 + 12,000', label: 'infantry + cavalry (claimed)'}, source: 'Polybius 3.35 — likely inflated'},
      s3: {scene: A1.c2b_2, source: 'Polybius 3.46; 37 elephants: Appian'},
      s4: {scene: A1.c2c_2},
      s5: {scene: A1.c2d, stat: {value: '20,000 + 6,000', label: 'infantry + cavalry left'}, source: "Polybius 3.56, from Hannibal's own inscription"},
      s6: {scene: A1.c2d_2},
      s7: {scene: A1.c2c, end: true},
    },
  },
  {
    id: 'ShortA002Fig', timeline: tA2a, look: HIST, hook: 'A *fig* started\nthe end of Carthage',
    shots: {
      s1: {scene: A2.c0a},
      s2: {scene: A2.c2b},
      s3: {scene: A2.c1i},
      s4: {scene: A2.c2c, source: 'Plutarch, Cato 27; Pliny 15.20 — versions differ'},
      s5: {scene: A2.c2e, source: 'Plutarch, Cato 27'},
      s6: {scene: A2.c2g},
      s7: {scene: A2.c0a, end: true},
    },
  },
  {
    id: 'ShortA002Salt', timeline: tA2b, look: HIST, hook: 'Rome *never* salted\nCarthage',
    shots: {
      s1: {scene: A2.c5i},
      s2: {scene: A2.c0a},
      s3: {scene: A2.c6c, source: 'Ridley 1986: first in modern books (1930)'},
      s4: {scene: A2.c6a},
      s5: {scene: A2.c6d, source: 'Appian, Punica 135'},
      s6: {scene: A2.c7a},
      s7: {scene: A2.c5i, end: true},
    },
  },
  {
    id: 'ShortB001Megalodon', timeline: tB1a, look: SCALE, hook: 'Megalodon was *smaller*\nthan an animal alive today',
    shots: {
      s1: {scene: B1.o1},
      s2: {scene: B1.c2e, source: 'Smithsonian Ocean: teeth up to ~18 cm'},
      s3: {scene: B1.c2f, pan: [0.35, 0.5], source: 'NOAA Fisheries: great white ~6 m'},
      s4: {scene: B1.c2g, pan: [0.3, 0.6], stat: {value: '16–24 m', label: 'megalodon estimates'}, source: 'Cooper et al. 2022 · Shimada et al. 2025'},
      s5: {scene: B1.c1d, pan: [0.3, 0.75], stat: {value: '~33 m', label: 'largest blue whales'}, source: 'NOAA Fisheries'},
      s6: {scene: B1.c2i, pan: [0.4, 0.6], stat: {value: '~60 t vs ~150 t', label: '16 m megalodon vs biggest blue whale'}, source: 'Cooper et al. 2022 · NOAA Fisheries'},
      s7: {scene: B1.o1, end: true},
    },
  },
  {
    id: 'ShortB001AliveNow', timeline: tB1b, look: SCALE, hook: 'The biggest animal *ever*\nis alive *today*',
    shots: {
      s1: {scene: B1.c6e},
      s2: {scene: B1.c1d, pan: [0.3, 0.75], stat: {value: '~33 m', label: '≈ 19 people head to toe'}, source: 'NOAA Fisheries'},
      s3: {scene: B1.c1f, pan: [0.4, 0.6], stat: {value: '~150 t', label: '≈ 25 adult male elephants'}, source: 'NOAA Fisheries'},
      s4: {scene: B1.c3h, pan: [0.4, 0.6], stat: {value: '50–83 t', label: 'giant sauropod estimates'}, source: 'Carballido 2017; Paul 2019; Sellers 2013'},
      s5: {scene: B1.c4e, pan: [0.4, 0.6], source: 'Bianucci et al. 2023 · Motani & Pyenson 2024'},
      s6: {scene: B1.c5d},
      s7: {scene: B1.c6e, end: true},
    },
  },
  {
    id: 'ShortB002TracyArm', timeline: tB2a, look: SCALE, hook: 'This wave climbed\n*481 metres*',
    shots: {
      s1: {scene: B2.h1, stat: {value: '481 m', label: 'run-up, Tracy Arm, Aug 2025'}},
      s2: {scene: B2.c1e, source: 'UAF Geophysical Institute (2026)'},
      s3: {scene: B2.c1g, pan: [0.4, 0.6], stat: {value: '~100 m', label: 'modelled first wave'}, source: 'computer models (USGS / Shugar et al. 2026)'},
      s4: {scene: B2.c1j, source: 'Shugar et al. 2026, Science'},
      s5: {scene: B2.c1k, pan: [0.25, 0.75]},
      s6: {scene: B2.c1m},
      s7: {scene: B2.h1, end: true},
    },
  },
  {
    id: 'ShortB002Lituya', timeline: tB2b, look: SCALE, hook: 'Water climbed *524 m*.\nTwo people *survived*.',
    shots: {
      s1: {scene: B2.c4d},
      s2: {scene: B2.c4c, source: 'Miller 1960, USGS PP 354-C'},
      s3: {scene: B2.c4e, pan: [0.4, 0.6]},
      s4: {scene: B2.c4e2, pan: [0.4, 0.6], stat: {value: '15–23 m', label: "wave at the boat (Ulrich's estimate)"}, source: "Miller 1960: Ulrich's eyewitness estimates"},
      s5: {scene: B2.c4f, stat: {value: '524 m', label: 'forest stripped up to here'}, source: 'Miller 1960, USGS PP 354-C'},
      s6: {scene: B2.c4g, pan: [0.3, 0.7]},
      s7: {scene: B2.c4d, end: true},
    },
  },
  {
    id: 'ShortC001Watches', timeline: tC1a, look: MONEY, hook: 'China sells *40×* more watches.\nSwitzerland earns *10×* more.',
    shots: {
      s1: {scene: C1.c3c},
      s2: {vbars: {title: 'Wristwatches exported, 2024', unit: 'FH, World watchmaking industry 2024', bars: [{label: 'China', value: 595.5, valueText: '595 M', color: '#7cc4ef'}, {label: 'Switzerland', value: 15.3, valueText: '15 M', highlight: true}]}},
      s3: {vbars: {title: 'Average export price of one watch', unit: '2024, US$ · FH 2025', bars: [{label: 'China', value: 4, valueText: '$4', color: '#7cc4ef'}, {label: 'Switzerland', value: 1837, valueText: '$1,837', highlight: true}]}},
      s4: {vbars: {title: 'Money earned from those watches', unit: '2024, US$ billion · FH 2025, our math', bars: [{label: 'China', value: 2.4, valueText: '$2.4 B', color: '#7cc4ef'}, {label: 'Switzerland', value: 28.1, valueText: '$28.1 B', highlight: true}]}},
      s5: {scene: C1.c3b},
      s6: {scene: C1.c3g2},
      s7: {scene: C1.c3c, end: true},
    },
  },
  {
    id: 'ShortC001NotBanks', timeline: tC1b, look: MONEY, hook: "Switzerland's #1 export\nis *not* banking",
    shots: {
      s1: {scene: C1.c6b},
      s2: {vbars: {title: 'Size of finance in Switzerland', unit: 'share of the economy · SIF 2026', bars: [{label: 'Banks +\ninsurance', value: 9, valueText: '9%', highlight: true}, {label: 'Everything\nelse', value: 91, valueText: '91%', color: '#9aa3ad'}]}},
      s3: {vbars: {title: "Switzerland's biggest exports", unit: '2024, billion CHF (no gold) · BAZG', bars: [{label: 'Chemicals +\nmedicines', value: 149.1, valueText: '149', highlight: true}, {label: 'Machines', value: 32.1, valueText: '32', color: '#3f8fd0'}, {label: 'Watches', value: 26, valueText: '26', color: '#e69f00'}]}},
      s4: {vbars: {title: 'All Swiss exports, 2024', unit: 'share of exports · BAZG', bars: [{label: 'Chemicals +\nmedicines', value: 53, valueText: '53%', highlight: true}, {label: 'Everything\nelse', value: 47, valueText: '47%', color: '#9aa3ad'}]}},
      s5: {scene: C1.c6c},
      s6: {scene: C1.c6a},
      s7: {scene: C1.c6b, end: true},
    },
  },
  {
    id: 'ShortC002Norilsk', timeline: tC2a, look: MONEY, hook: '*174,000* people live here.\n*No road* leads there.',
    shots: {
      s1: {scene: C2.c4j},
      s2: {scene: C2.o2, stat: {value: '174,453', label: 'Norilsk, 2021 census'}, source: 'Rosstat 2021 census'},
      s3: {scene: C2.c2g, source: 'Norillag 1935–1956 (Krasnoyarsk Memorial)'},
      s4: {vbars: {title: 'Cost of living', unit: 'Hill & Gaddy (2003)', bars: [{label: 'Russian\naverage', value: 1, valueText: '1×', color: '#9aa3ad'}, {label: 'Coldest\ncities', value: 4, valueText: 'up to 4×', highlight: true}]}},
      s5: {vbars: {title: 'Same job, different place', unit: 'salary, base = 100 · Labour Code art. 316', bars: [{label: 'Base', value: 100, valueText: '100', color: '#9aa3ad'}, {label: 'Norilsk', value: 180, valueText: '+80%', highlight: true}]}},
      s6: {scene: C2.c5a, frame: 'crop', k: 1.78, pan: [0.45, 0.55], source: 'USGS Mineral Commodity Summaries 2025'},
      s7: {scene: C2.c4j, end: true},
    },
  },
  {
    id: 'ShortC002PaidToLeave', timeline: tC2b, look: MONEY, hook: 'They were *paid to leave*.\nMost *stayed*.',
    shots: {
      s1: {scene: C2.o3},
      s2: {scene: C2.c4f, stat: {value: '$80 million', label: 'World Bank loan, 2001'}, source: 'World Bank IEG review'},
      s3: {vbars: {title: 'Households that moved out', unit: '2002–2009 · World Bank IEG review', bars: [{label: 'Planned', value: 10401, valueText: '10,401', color: '#9aa3ad'}, {label: 'Actually\nleft', value: 4527, valueText: '4,527', highlight: true}]}},
      s4: {vbars: {title: 'Norilsk only', unit: 'households · World Bank IEG review', bars: [{label: 'Planned', value: 4599, valueText: '4,599', color: '#9aa3ad'}, {label: 'Actually\nleft', value: 623, valueText: '623', highlight: true, note: '≈ 1 in 7'}]}},
      s5: {vbars: {title: 'The $80 million loan', unit: 'US$ million · World Bank IEG review', bars: [{label: 'Spent', value: 34.7, valueText: '$34.7 M', color: '#7cc4ef'}, {label: 'Cancelled', value: 45.3, valueText: '$45.3 M', highlight: true}]}},
      s6: {scene: C2.c4j},
      s7: {scene: C2.o3, end: true},
    },
  },
];

export const shortMetadata = (d: Def) => makeEpisodeMetadata(d.timeline);
export const shortComponent = (d: Def): React.FC<ShortProps> => {
  const C: React.FC<ShortProps> = ({scenes, lines}) => <ShortEpisode scenes={scenes} lines={lines} shots={d.shots} hook={d.hook} look={d.look} />;
  return C;
};
