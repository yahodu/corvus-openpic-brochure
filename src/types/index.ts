/**
 * Beat content overlay definition.
 * Each beat is a section of text that fades in/out at a specific scroll window.
 */
export interface BeatDef {
  id: string;
  cls: string;
  /** [entry, exit] progress range [0..1] */
  range: [number, number];
  /** Optional anchor progress for timing sub-fades */
  anchorP?: number;
  eyebrow: string;
  h: string;
  /** Simple string for p, or richP array when the heading has a cursive-glow middle segment */
  p: string | [string, string, string];
  richP?: boolean;
  /** Optional card grid items */
  cards?: BeatCardDef[];
  /** Optional 2x2 card grid */
  cards2x2?: BeatCardDef[];
  /** Optional frame-specific entry progress (overrides range[0]) */
  enterP?: number;
}

export interface BeatCardDef {
  h: string;
  p: string;
}

/**
 * A scroll anchor defines the target frame at the END of a scroll segment.
 */
export interface ScrollAnchor {
  frame: number;
  /** Number of 100vh scrolls this segment spans */
  scrolls: number;
}

/**
 * Canvas trim region for the image source rect.
 * Frames 1–138 ship with a baked pure-black border that must be trimmed.
 */
export interface TrimRegion {
  l: number;
  r: number;
  t: number;
  b: number;
}

export interface LoadState {
  queue: number[];
  pending: number;
  started: Set<number>;
}