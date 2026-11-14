import type {Overlay, SceneDef} from '../../../../packages/engine/src/map/episode';
import type {ClarityConfig} from '../../../../packages/engine/src/map/clarity';
import type {ScaleCam} from '../../../../packages/engine/src/scale/units';
import type {ScaleEnv, ScaleSubject} from '../../../../packages/engine/src/scale/scale';
import type {CompareRow, CompareSpec} from '../../../../packages/engine/src/scale/compare';
import type {DeepMarker, DeepTimeSpec} from '../../../../packages/engine/src/scale/deeptime';
import {SauropodWalkA, SauropodWalkB} from '../../../../src/scale/SauropodWalk';

// Scale & Science 001 "How Big Was the Biggest Animal Ever?" — visual design per scene id (see timeline.json).
// Every number on screen has a row in sources.md. Ranges are shown as ranges with "estimates vary".
// Reference objects: person 1.75 m, city bus 12 m, FIBA basketball court 28 m, adult male African elephant ~6 t.

export const C = {
  whale: '#5f86a6',
  white: '#8b98a3',
  meg: '#4f6272',
  peru: '#8b7a63',
  ichthy: '#6f8f7d',
  argento: '#a07c4f',
  patago: '#b8925c',
  apato: '#7d7558',
  you: '#ffd166',
  bus: '#e39a2d',
  court: '#c9733a',
  elephant: '#a9a294',
  krill: '#e0715a',
};

export const CLARITY: ClarityConfig = {
  factions: [
    {name: 'Blue whale', color: C.whale},
    {name: 'Megalodon', color: C.meg},
    {name: 'Sauropods', color: C.argento},
    {name: 'Perucetus', color: C.peru},
  ],
  chapters: {c1: 'The Blue Whale', c2: 'Megalodon', c3: 'Titans on Land', c4: 'The Challengers', c5: 'Why Now?', c6: 'The Final Line-up'},
  highlight: {
    whale: '#8fc3e8', whales: '#8fc3e8', Megalodon: '#9fb4c6', megalodon: '#9fb4c6', Argentinosaurus: '#e0b07a', Patagotitan: '#e0b07a',
    Apatosaurus: '#e0b07a', Perucetus: '#d8b48a', Ichthyotitan: '#9fd0b4', krill: '#f2a08f',
  },
  now: 2026,
};

// ---------- building blocks ----------
const cam = (x0: number, w0: number, x1 = x0, w1 = w0): ScaleCam[] => [{at: 0, x: x0, width: w0}, {at: 1, x: x1, width: w1}];
const scale = (env: ScaleEnv, subjects: ScaleSubject[], camera: ScaleCam[], overlays?: Overlay[], title?: string, seed = 7): SceneDef => ({kind: 'scale', scale: {env, subjects, camera, title, seed}, overlays});
const art = (id: string, title: string, from: {x: number; y: number; zoom: number}, to: {x: number; y: number; zoom: number}, overlays?: Overlay[], object = false): SceneDef => ({kind: 'art', art: {id, title, from, to, object}, overlays});
const compare = (spec: CompareSpec, overlays?: Overlay[]): SceneDef => ({kind: 'compare', compare: spec, overlays});
const deep = (spec: DeepTimeSpec, overlays?: Overlay[]): SceneDef => ({kind: 'deeptime', deeptime: spec, overlays});
const gloss = (term: string, meaning: string, window: [number, number] = [0.1, 0.85]): Overlay => ({type: 'glossary', term, meaning, window});
const src = (text: string): Overlay => ({type: 'citation', text});

// subjects (x = tail / left end in metres; y = height of a swimmer's centre line above the seabed)
const you = (x = 0, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'you', shape: 'human', size: 1.75, x, color: C.you, label: '', you: true, ...extra});
const bus = (x: number, id = 'bus', extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id, shape: 'bus', size: 12, x, color: C.bus, label: 'City bus', ...extra});
const whale = (x: number, y = 6, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'whale', shape: 'blueWhale', size: 33, x, y, color: C.whale, label: 'Blue whale', sub: 'largest ones', ...extra});
const white = (x: number, y = 2.5, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'white', shape: 'greatWhite', size: 6, x, y, color: C.white, label: 'Great white shark', sub: 'alive today', ...extra});
const meg = (x: number, y = 4, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'meg', shape: 'megalodon', size: 16, range: [16, 24], x, y, color: C.meg, label: 'Megalodon', sub: 'reconstruction', ...extra});
const peru = (x: number, y = 4, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'peru', shape: 'perucetus', size: 17, range: [17, 20], x, y, color: C.peru, label: 'Perucetus', sub: 'reconstruction, shape uncertain', ...extra});
const ichthy = (x: number, y = 4, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'ichthy', shape: 'ichthyosaur', size: 25, x, y, color: C.ichthy, label: 'Ichthyotitan', sub: 'up to ~25 m (estimate from 2 jawbones)', ...extra});
const argento = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'argento', shape: 'sauropod', size: 30, range: [30, 35], x, color: C.argento, label: 'Argentinosaurus', sub: 'reconstruction', ...extra});
const whaleOutline = (x: number, extra: Partial<ScaleSubject> = {}): ScaleSubject => ({id: 'whale-ghost', shape: 'blueWhale', size: 33, x, y: 3, color: '#cfe6f5', outline: true, label: 'Blue whale length', sub: 'for comparison', ...extra});
const court = (x: number): ScaleSubject => ({id: 'court', shape: 'court', size: 28, x, color: C.court, label: 'Basketball court', sub: '28 m (FIBA)', bracket: false});

// mass rows
const ROW = {
  whale: {label: 'Blue whale', note: 'largest ones', value: 150, color: C.whale, shape: 'blueWhale'} as CompareRow,
  elephant: {label: 'African elephant', note: 'adult male, average', value: 6, color: C.elephant, shape: 'elephant'} as CompareRow,
  meg: {label: 'Megalodon', note: '16 m model → slim 24 m model', range: [61, 94], color: C.meg, shape: 'megalodon'} as CompareRow,
  argento: {label: 'Argentinosaurus', note: 'estimates vary', range: [65, 96], color: C.argento, shape: 'sauropod'} as CompareRow,
  patago: {label: 'Patagotitan', note: 'estimates vary', range: [50, 69], color: C.patago, shape: 'sauropod'} as CompareRow,
  peru23: {label: 'Perucetus (2023)', note: 'first estimate', range: [85, 340], color: C.peru, shape: 'perucetus'} as CompareRow,
  peru24: {label: 'Perucetus (2024)', note: 're-check', range: [60, 114], color: C.peru, shape: 'perucetus'} as CompareRow,
};
const MASS_SRC = 'NOAA; Cooper 2022; Shimada 2025; Paul 2019; Otero & Carballido; Bianucci 2023; Motani & Pyenson 2024';

// deep-time markers
const DT = {
  meg: {label: 'Megalodon', range: [23, 3.6], color: '#9fb4c6', shape: 'megalodon'} as DeepMarker,
  whale: {label: 'Blue whale', at: 0, color: '#8fc3e8', shape: 'blueWhale', sub: 'alive today', row: 1} as DeepMarker,
  argento: {label: 'Argentinosaurus', range: [97, 94], color: '#e0b07a', shape: 'sauropod', sub: '~97–94 million years ago'} as DeepMarker,
  patago: {label: 'Patagotitan', at: 101, color: '#e8c48f', shape: 'sauropod', sub: '~101 million years ago', row: 1} as DeepMarker,
  peru: {label: 'Perucetus', at: 39, color: '#d8b48a', shape: 'perucetus', sub: '~39 million years ago · Peru'} as DeepMarker,
  ichthy: {label: 'Ichthyotitan', at: 202, color: '#9fd0b4', shape: 'ichthyosaur', sub: '~202 million years ago · England', row: 1} as DeepMarker,
  asteroid: {label: 'Asteroid impact', at: 66, color: '#ef6a5e', sub: 'end of the dinosaurs, 66 million years ago', row: 1} as DeepMarker,
};

const LINEUP: ScaleSubject[] = [
  you(-6),
  bus(-4, 'bus', {label: 'Bus'}),
  white(10, 2.5, {sub: undefined}),
  meg(18, 4, {sub: undefined, label: 'Megalodon'}),
  ichthy(44, 4.5, {sub: 'estimate'}),
  peru(72, 4, {sub: 'reconstruction'}),
  whale(95, 6, {sub: 'alive today'}),
];

const KRILL_SWARM: ScaleSubject[] = Array.from({length: 14}, (_, i) => ({
  id: `k${i}`,
  shape: 'krill' as const,
  size: 0.04 + ((i * 7) % 5) * 0.005,
  x: -0.25 + ((i * 37) % 23) * 0.04,
  y: 0.12 + ((i * 53) % 17) * 0.025,
  color: C.krill,
  bracket: false,
  speed: 0.01,
  flip: i % 3 === 0,
}));

export const SCENES: Record<string, SceneDef> = {
  // ---------- cold open: the subject big and bright on frame 1 ----------
  o1: art('bw-aerial', 'Blue whale seen from above · NOAA photo', {x: 0.42, y: 0.55, zoom: 1.05}, {x: 0.5, y: 0.5, zoom: 1.22}, [
    {type: 'character', name: 'Blue whale', role: 'biggest animal alive today', line: 'Largest ones: about 33 m (110 ft) long and 150 tonnes.', side: 'Blue whale', image: 'bw-aerial', window: [0.08, 0.97]},
  ]),
  o2: scale('ocean', [you(0), whale(3, 5.5, {appear: 0.12, sub: 'swimming next to you'})], [{at: 0, x: 1.2, width: 7}, {at: 0.25, x: 1.5, width: 9}, {at: 1, x: 17, width: 44}], undefined, undefined, 11),
  o3: scale('ocean', [court(0), bus(0, 'bus1', {label: '2 city buses', sub: '12 m each', appear: 0.05}), bus(12, 'bus2', {label: undefined, bracket: false, appear: 0.12}), whale(-2.5, 7, {appear: 0, bracketAt: 0.5})], cam(14, 40, 15, 46), undefined, undefined, 12),
  o4: scale(
    'ocean',
    [whale(2, 7, {sub: 'alive today'}), {id: 'm1', shape: 'megalodon', size: 20, x: -24, y: 3.5, mystery: true, appear: 0.25}, {id: 'm2', shape: 'perucetus', size: 18, x: 40, y: 3.5, mystery: true, appear: 0.4}],
    cam(10, 50, 9, 74),
    undefined,
    'THE BIGGEST ANIMAL EVER?',
    13,
  ),
  o5: deep({title: 'Three challengers from the past', from: [120, 0], to: [110, 0], markers: [{...DT.argento, appear: 0.05, sub: 'dinosaurs · ~95 million years ago'}, {...DT.meg, appear: 0.25, row: 1}, {...DT.peru, appear: 0.5}, {...DT.whale, appear: 0.7}]}),
  o6: scale('ocean', [you(0), bus(3), whale(17, 6.5, {appear: 0.2})], cam(6, 18, 24, 52), undefined, 'PERSON · BUS · GIANT', 14),

  // ---------- chapter 1: the blue whale ----------
  c1: art('bw-two', '', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.55, y: 0.45, zoom: 1.12}, [{type: 'chapter', n: 1, title: 'The Blue Whale', sub: 'alive today · every ocean', question: 'How big is big?', image: 'bw-two'}]),
  c1b: art('bw-two', 'Two blue whales, California · NOAA photo', {x: 0.4, y: 0.4, zoom: 1.1}, {x: 0.6, y: 0.6, zoom: 1.3}, [gloss('Mammal', 'breathes air, feeds its babies milk', [0.3, 0.95])]),
  c1b2: art('bw-dorsal', 'Blue whale · NOAA Fisheries photo', {x: 0.5, y: 0.3, zoom: 1.0}, {x: 0.5, y: 0.6, zoom: 1.12}, [src('Lifespan 80–90 years (estimate): NOAA Fisheries')]),
  c1c: scale('ocean', [you(0, {bracketAt: 0.15}), bus(4, 'bus', {appear: 0.45, sub: '12 m · 39 ft'})], cam(4, 14, 9, 22), undefined, undefined, 15),
  c1d: scale('ocean', [you(0), bus(4), whale(-8, 6, {appear: 0.15, bracketAt: 0.4, sub: 'largest ones, Antarctic'})], cam(9, 22, 9, 46), [src('NOAA Fisheries: up to ~110 ft (33 m), 330,000 lb')], undefined, 16),
  c1e: scale('ocean', [whale(0, 4, {bracket: false, speed: 0.6, sub: undefined})], [{at: 0, x: 26, width: 18}, {at: 1, x: 18, width: 30}], undefined, 'LENGTH IS ONLY HALF THE STORY', 17),
  c1e2: compare({title: 'Weight: 1 tonne = 1,000 kilograms', unit: 'mass', max: 8, rows: [{...ROW.elephant, appear: 0.25}], source: 'San Diego Zoo Wildlife Alliance'}, [gloss('Tonne', '1,000 kilograms (2,205 pounds)', [0.05, 0.6])]),
  c1f: compare({title: 'How heavy is the largest blue whale?', unit: 'mass', max: 160, rows: [ROW.elephant, {...ROW.whale, appear: 0.18}], tally: {row: 1, shape: 'elephant', each: 6, label: 'adult male African elephants (~6 t each)', appear: 0.42}, source: 'NOAA Fisheries; San Diego Zoo Wildlife Alliance'}),
  c1g: scale('ocean', [...KRILL_SWARM, {id: 'krill', shape: 'krill', size: 0.06, x: 0.02, y: 0.18, color: C.krill, label: 'Antarctic krill', sub: 'up to ~6 cm', speed: 0.004}], cam(0.06, 0.42, 0.08, 0.5), [gloss('Krill', 'small shrimp-like animal, up to 6 cm', [0.45, 0.95])], undefined, 18),
  c1g2: scale('ocean', [...KRILL_SWARM, you(1.2, {appear: 0.3}), whale(4, 7, {appear: 0.45, sub: 'eats krill by the tonne'})], [{at: 0, x: 0.06, width: 0.5}, {at: 1, x: 18, width: 44}], [src('Antarctic krill: up to ~6 cm (Australian Antarctic Division)')], undefined, 19),
  c1h: art('humpback-feed', 'Humpback whale feeding, a baleen whale like the blue whale · NOAA photo', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.48, y: 0.5, zoom: 1.25}, [gloss('Baleen', 'bristly mouth plates that sieve out food', [0.4, 0.95])]),
  c1i: compare({title: 'Krill eaten in one day', unit: 'mass', max: 8, rows: [{label: 'Krill per day', note: 'biggest whales, up to ~6 US tons', value: 5.4, color: C.krill, shape: 'krill'}, ROW.elephant], source: 'NOAA Fisheries'}),
  c1r: scale('ocean', [whale(0, 5, {bracket: false})], cam(16, 40, 18, 44), [{type: 'recap', text: 'The blue whale: up to ~33 m and ~150 tonnes. Longer than 2 buses.', next: 'But 20 million years ago, something with bigger teeth ruled the sea…'}], undefined, 20),

  // ---------- chapter 2: megalodon ----------
  c2: art('meg-jaw', '', {x: 0.5, y: 0.45, zoom: 1.0}, {x: 0.5, y: 0.4, zoom: 1.15}, [{type: 'chapter', n: 2, title: 'Megalodon', sub: 'giant shark · extinct', question: 'Was the giant shark bigger?', image: 'meg-jaw'}]),
  c2b: deep({title: 'When did megalodon live?', from: [30, 0], to: [26, 0], markers: [{...DT.meg, appear: 0.15, sub: '~23 → 3.6 million years ago'}, {...DT.whale, appear: 0.5}]}),
  c2c: deep({title: 'How long ago is that?', from: [26, 0], to: [8, 0], humans: true, markers: [{...DT.meg, appear: 0.0, sub: 'gone 3.6 million years ago'}]}),
  c2d: art('meg-jaw', 'Megalodon jaw model, NC Aquarium · a reconstruction', {x: 0.5, y: 0.35, zoom: 1.0}, {x: 0.5, y: 0.5, zoom: 1.25}, [gloss('Cartilage', 'bendy tissue, like in your ears', [0.3, 0.7]), gloss('Fossil', 'ancient remains preserved in rock', [0.72, 0.98])]),
  c2e: art('meg-teeth', 'Megalodon jaw reconstruction with fossil teeth · James St. John, CC BY 2.0', {x: 0.45, y: 0.4, zoom: 1.0}, {x: 0.6, y: 0.45, zoom: 1.3}, [src('Teeth up to ~7 in (18 cm): Smithsonian Ocean')]),
  c2e2: scale('ocean', [meg(0, 5, {bracket: false, speed: 0.8, sub: 'hunter · reconstruction'})], [{at: 0, x: 4, width: 24}, {at: 1, x: 18, width: 34}], [src('Cooper et al. 2022, Science Advances')], undefined, 21),
  c2f: scale('ocean', [you(0), white(3, 2.2, {appear: 0.15})], cam(4, 11, 5, 13), [src('White shark up to ~20 ft (6 m): NOAA')], undefined, 22),
  c2g: scale('ocean', [you(0), white(3, 2.2), meg(11, 5, {appear: 0.1, grow: [0.35, 0.75], sub: 'estimates: 16 → 24 m'})], cam(8, 18, 18, 38), [src('Cooper et al. 2022 (16 m) · Shimada et al. 2025 (up to 24.3 m)')], undefined, 23),
  c2g2: scale('ocean', [meg(0, 4, {bracket: false, sub: 'head and tail: estimated'}), {id: 'spine', shape: 'spine', size: 11, x: 5, y: 4.2, color: '#f6f1e4', label: 'Fossil backbones', sub: '~11 m, Belgium', appear: 0.2}], cam(12, 30, 12, 34), [src('Shimada et al. 2025, Palaeontologia Electronica')], undefined, 24),
  c2g3: scale('ocean', [{id: 'chunky', shape: 'greatWhite', size: 16, x: 0, y: 9, color: C.meg, label: 'Idea 1: chunky', sub: 'like a great white · ~16 m'}, {id: 'slim', shape: 'megalodon', size: 24, x: -4, y: 3, color: '#5f7686', label: 'Idea 2: slim', sub: 'like a lemon shark · up to ~24 m'}], cam(9, 34, 10, 38), [src('Cooper et al. 2022 vs Shimada et al. 2025')], 'TWO IDEAS, ONE SHARK', 25),
  c2h: scale('ocean', [you(-3), meg(1, 4, {sub: undefined}), whale(-4, 10, {appear: 0.15})], cam(12, 38, 13, 46), undefined, 'EVEN THE LARGEST ESTIMATE IS SHORTER', 26),
  c2i: compare({title: 'And lighter', unit: 'mass', max: 160, rows: [ROW.meg, {...ROW.whale, appear: 0.3}], source: 'Cooper et al. 2022; Shimada et al. 2025; NOAA'}),
  c2r: scale('ocean', [meg(0, 4, {bracket: false}), whale(-4, 10, {bracket: false})], cam(13, 44), [{type: 'recap', text: 'Megalodon: a true giant (16–24 m), but shorter and lighter than the biggest blue whales.', next: 'On land, though, some animals grew even longer…'}], undefined, 27),

  // ---------- chapter 3: sauropods ----------
  c3: art('fernbank', '', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.12}, [{type: 'chapter', n: 3, title: 'Titans on Land', sub: 'sauropod dinosaurs', question: 'Could a dinosaur beat the whale?', image: 'fernbank'}]),
  c3b: {kind: 'custom', render: SauropodWalkA, overlays: [gloss('Sauropod', 'long-necked, plant-eating dinosaur on four legs', [0.12, 0.9])]},
  c3c: {kind: 'custom', render: SauropodWalkB, overlays: [src('Apatosaurus ~21–23 m: estimates for Carnegie Museum specimen CM 3018')]},
  c3d: deep({title: 'The true giants: about 100 million years ago', from: [140, 0], to: [125, 0], markers: [{...DT.argento, appear: 0.15}, {...DT.patago, appear: 0.3}, {...DT.meg, appear: 0.55, row: 0}]}),
  c3d2: deep({title: 'The Cretaceous: the last age of dinosaurs', from: [160, 0], to: [150, 0], markers: [{...DT.argento, appear: 0.05}, {...DT.asteroid, appear: 0.4}]}, [gloss('Cretaceous', 'last dinosaur age, 145–66 million years ago', [0.08, 0.9])]),
  c3e: art('fernbank', 'Argentinosaurus skeleton cast, Fernbank Museum · reconstruction · photo Daderot, CC0', {x: 0.5, y: 0.45, zoom: 1.0}, {x: 0.45, y: 0.5, zoom: 1.2}, [gloss('Cast', 'a full-size copy of fossil bones', [0.15, 0.6])]),
  c3f: scale('land', [you(-2), bus(1), argento(14, {grow: [0.2, 0.6], sub: 'estimates: 30 → 35 m'}), whaleOutline(14, {appear: 0.65})], cam(14, 34, 30, 46), [src('Bonaparte & Coria 1993; Paul 2019')], undefined, 28),
  c3g: scale('land', [you(-2), bus(1), {id: 'patago', shape: 'sauropod', size: 31, range: [31, 37], x: 14, color: C.patago, label: 'Patagotitan', sub: 'first 37 m → later studies ~31 m'}], cam(18, 40, 26, 46), [src('Carballido et al. 2017; Paul 2019')], undefined, 29),
  c3h: compare({title: 'But on the scale, the dinosaurs lose', unit: 'mass', max: 160, rows: [ROW.patago, ROW.argento, {...ROW.whale, appear: 0.4}], source: 'Carballido 2017; Paul 2019; Otero & Carballido; NOAA'}),
  c3i: scale('land', [you(-2), bus(1), argento(16, {bracket: false, sub: 'pillar legs · air-filled bones'})], cam(22, 26, 26, 40), [src('Air-filled (pneumatic) bones: Wedel 2005; Sander et al. 2011')], 'ON LAND, LEGS CARRY EVERY KILOGRAM', 30),
  c3r: scale('land', [argento(0, {bracket: false}), whaleOutline(0, {label: undefined, sub: undefined})], cam(16, 44), [{type: 'recap', text: 'The longest dinosaurs may have matched the blue whale for length, but weighed far less.', next: 'Then, in 2023, a fossil whale claimed the crown…'}], undefined, 31),

  // ---------- chapter 4: challengers ----------
  c4: scale('ocean', [{id: 'peru-m', shape: 'perucetus', size: 18, x: 0, y: 4, mystery: true}], cam(9, 30), [{type: 'chapter', n: 4, title: 'The Challengers', sub: 'new fossils, new claims', question: 'Did a whale from Peru weigh more?'}], undefined, 32),
  c4b: deep({title: 'Perucetus colossus', from: [60, 0], to: [50, 0], markers: [{...DT.peru, appear: 0.15}, {...DT.meg, appear: 0.45, row: 1}, {...DT.whale, appear: 0.6, row: 0}]}),
  c4c: scale('ocean', [you(-2), peru(1, 4)], cam(10, 26, 11, 30), [src('Bianucci et al. 2023, Nature')], undefined, 33),
  c4c2: scale('ocean', [peru(0, 4, {bracket: false, sub: 'known: 13 backbones, 4 ribs, part of a hip'})], cam(9, 22, 10, 26), [src('Bianucci et al. 2023, Nature')], 'NO SKULL FOUND', 34),
  c4d: compare({title: 'The 2023 weight estimate', unit: 'mass', max: 350, rows: [ROW.peru23, {...ROW.whale, appear: 0.3}], source: 'Bianucci et al. 2023, Nature; NOAA'}),
  c4e: compare({title: 'A year later: the re-check', unit: 'mass', max: 350, rows: [ROW.peru23, {...ROW.peru24, appear: 0.25}, {...ROW.whale, appear: 0.45}], source: 'Motani & Pyenson 2024, PeerJ'}),
  c4f: scale('ocean', [you(-3), peru(1, 3.5, {range: [17, 20]}), whale(-4, 10, {appear: 0.1})], cam(12, 40, 13, 44), undefined, 'THE CROWN STAYS', 35),
  c4g: art('ichthy-jaw', 'Ichthyotitan jawbone · Lomax et al. 2024, CC BY 4.0', {x: 0.5, y: 0.5, zoom: 1.0}, {x: 0.5, y: 0.45, zoom: 1.1}, [src('Lomax et al. 2024, PLOS ONE')], true),
  c4g2: scale('ocean', [you(-2), ichthy(1, 4)], cam(12, 32, 13, 34), [gloss('Ichthyosaur', 'dolphin-shaped sea reptile from dinosaur times', [0.1, 0.9])], undefined, 36),
  c4h: scale('ocean', [you(-3), ichthy(0, 4, {sub: 'up to ~25 m · weight unknown'}), whale(-4, 10, {appear: 0.1})], cam(12, 40, 13, 44), [src('Lomax et al. 2024, PLOS ONE')], undefined, 37),
  c4r: scale('ocean', [whale(0, 5, {bracket: false})], cam(16, 44), [{type: 'recap', text: 'No fossil challenger has beaten the blue whale on weight.', next: 'So why is the biggest animal ever alive right now?'}], undefined, 38),

  // ---------- chapter 5: why now ----------
  c5: art('bw-two', '', {x: 0.5, y: 0.5, zoom: 1.1}, {x: 0.45, y: 0.55, zoom: 1.2}, [{type: 'chapter', n: 5, title: 'Why Now?', sub: 'water, food and time', question: 'Why is the biggest animal ever alive today?', image: 'bw-two'}]),
  c5b: scale('ocean', [you(0), whale(3, 6, {bracket: false})], cam(14, 40, 18, 44), [gloss('Buoyancy', 'water pushing up, holding a body', [0.1, 0.9])], 'WATER CARRIES THE WEIGHT', 39),
  c5c: deep({title: 'Giant whales appear: about 3 million years ago', from: [12, 0], to: [8, 0], humans: true, markers: [{label: 'Giant baleen whales', at: 3, color: '#8fc3e8', shape: 'blueWhale', sub: 'after ocean currents changed', appear: 0.2}, {...DT.meg, appear: 0.05, row: 1, sub: 'gone 3.6 million years ago'}]}, [src('Slater, Goldbogen & Pyenson 2017, Proc. R. Soc. B')]),
  c5d: art('humpback-feed', 'Whales feeding where krill gather · NOAA photo', {x: 0.4, y: 0.45, zoom: 1.2}, {x: 0.55, y: 0.5, zoom: 1.0}),
  c5d2: scale('ocean', [you(0), whale(3, 6, {bracket: false, sub: 'near the feeding limit?'})], cam(18, 44, 16, 38), [src('Goldbogen et al. 2019, Science')], undefined, 40),
  c5e: scale('ocean', [{...whale(0, 6), id: 'grow', size: 10, range: [10, 33], grow: [0.25, 0.85], bracket: false, label: 'Baleen whales', sub: 'mostly much smaller, until recently'}], cam(14, 40, 16, 42), [src('Slater, Goldbogen & Pyenson 2017')], undefined, 41),
  c5f: scale('ocean', [you(0), whale(3, 5.5, {appear: 0.2, sub: 'alive today, with you'})], [{at: 0, x: 0.9, width: 5}, {at: 0.3, x: 1.2, width: 7}, {at: 1, x: 18, width: 44}], undefined, undefined, 42),
  c5g: art('bw-dorsal', 'Blue whale · endangered, protected · NOAA Fisheries photo', {x: 0.5, y: 0.6, zoom: 1.15}, {x: 0.5, y: 0.35, zoom: 1.0}, [src('NOAA Fisheries: endangered; protected from whaling since 1966')]),
  c5r: scale('ocean', [whale(0, 5, {bracket: false})], cam(16, 44), [{type: 'recap', text: 'Water carries the whale’s weight, and seasonal krill feasts feed it.', next: 'Now, every giant side by side…'}], undefined, 43),

  // ---------- chapter 6: final line-up ----------
  c6: scale('ocean', LINEUP.map((s) => ({...s, bracket: false})), cam(60, 140), [{type: 'chapter', n: 6, title: 'The Final Line-up', sub: 'everything to the same scale', question: 'Who is the real giant?'}], undefined, 44),
  c6b: scale('ocean', LINEUP, [{at: 0, x: 4, width: 26}, {at: 0.5, x: 40, width: 70}, {at: 1, x: 70, width: 150}], undefined, 'TO THE SAME SCALE', 45),
  c6c: scale('land', [you(-3), bus(0), argento(14), whaleOutline(14, {appear: 0.35})], cam(26, 46, 28, 50), undefined, 'AND ON LAND', 46),
  c6c2: compare({
    title: 'Length: a close race',
    unit: 'length',
    max: 40,
    rows: [
      {label: 'Argentinosaurus', note: 'estimate', range: [30, 35], color: C.argento, shape: 'sauropod'},
      {label: 'Blue whale', note: 'largest ones', value: 33, color: C.whale, shape: 'blueWhale', appear: 0.2},
      {label: 'Patagotitan', note: 'later estimate', value: 31, color: C.patago, shape: 'sauropod', appear: 0.35},
      {label: 'Ichthyotitan', note: 'estimate', value: 25, color: C.ichthy, shape: 'ichthyosaur', appear: 0.5},
      {label: 'Megalodon', note: 'estimates', range: [16, 24], color: C.meg, shape: 'megalodon', appear: 0.65},
    ],
    source: 'see description',
  }),
  c6d: compare({title: 'Weight: no contest', unit: 'mass', max: 160, rows: [ROW.whale, {...ROW.peru24, appear: 0.25}, {...ROW.argento, appear: 0.4}, {...ROW.meg, appear: 0.55}], source: MASS_SRC}),
  c6e: art('bw-aerial', 'The blue whale · NOAA photo', {x: 0.5, y: 0.5, zoom: 1.25}, {x: 0.45, y: 0.55, zoom: 1.0}, [
    {type: 'character', name: 'Blue whale', role: 'biggest animal ever (as far as we know)', line: 'Alive today, in every ocean.', side: 'Blue whale', image: 'bw-aerial', window: [0.05, 0.6]},
  ]),
  c6f: scale('ocean', LINEUP.map((s) => ({...s, bracket: false})), cam(60, 150, 55, 160), undefined, 'WHICH GIANT WOULD YOU WANT TO SEE ALIVE?', 47),
  end: scale('ocean', [whale(0, 5, {bracket: false, speed: 0.5})], cam(20, 50, 28, 50), [{type: 'endscreen', teaser: 'The deadliest animals on Earth, ranked'}], undefined, 48),
};
