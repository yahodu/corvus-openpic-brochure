import type { BeatDef } from '@/types';

/**
 * Singleton array of all beat overlay definitions.
 * Each beat is timed to a scroll-progress window mapped to an image-frame anchor.
 * Adding a beat changes only this file, not component logic (Open/Closed principle).
 */
export const BEATS: BeatDef[] = [
  {
    id: 'beat-hero',
    cls: 'beat beat-hero beat--light',
    range: [0.0, 0.05],
    eyebrow: 'FACIAL ANALYSIS SUITE',
    h: 'Corvus',
    p: ['A ', 'Billion', ' faces in seconds'],
    richP: true,
  },
  {
    id: 'beat-model-1',
    cls: 'beat beat-right',
    range: [0.135, 0.215],
    anchorP: 0.1875,
    eyebrow: '2D LANDMARKS',
    h: 'Corvus 2D Retina',
    p: 'More than 100 facial points with maximum precision',
  },
  {
    id: 'beat-model-2',
    cls: 'beat beat-right',
    range: [0.325, 0.425],
    anchorP: 0.375,
    eyebrow: '3D LANDMARKS',
    h: 'Corvus 3D Retina',
    p: 'High precision 3D facial points',
  },
  {
    id: 'beat-model-3',
    cls: 'beat beat-bottom beat--light',
    range: [0.575, 0.655],
    anchorP: 0.625,
    eyebrow: 'FACE DETECTION',
    h: 'Corvus Teo',
    p: 'Detect faces with 0 slippage',
  },
  {
    id: 'beat-model-4',
    cls: 'beat beat-bottom beat--light',
    range: [0.7625, 0.8425],
    anchorP: 0.8125,
    eyebrow: 'GENDER AND AGE PREDICTION',
    h: 'Corvus Pallium',
    p: 'Highly intelligent matching with near-zero error rate',
  },
  {
    id: 'beat-model-5',
    cls: 'beat beat-left',
    range: [0.9, 1.001],
    anchorP: 1.0,
    eyebrow: 'FACE RECOGNITION',
    h: 'Corvus Avian',
    p: 'Our most-powerful SOTA model with highest accuracy',
    // Enter only once the canvas has reached frame 980
    enterP: ((980 - 849) / (993 - 849)) * (1 - 13 / 16) + 13 / 16,
  },
];