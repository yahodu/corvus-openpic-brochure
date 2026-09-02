import type { ScrollAnchor } from '@/types';
import { FRAME_COUNT } from '@/config/constants';

/**
 * Scroll anchor definitions.
 * Each entry maps N scrolls (100vh units) to a target frame.
 * The total scrolls determine the stage-wrap height (1700vh).
 */
export const SCROLLS: ScrollAnchor[] = [
  { frame: 112, scrolls: 1 },
  { frame: 236, scrolls: 2 },
  { frame: 306, scrolls: 1 },
  { frame: 400, scrolls: 1 },
  { frame: 497, scrolls: 1 },
  { frame: 704, scrolls: 4 },
  { frame: 849, scrolls: 3 },
  { frame: 993, scrolls: 3 },
];

export const TOTAL_SCROLLS: number = SCROLLS.reduce((s, a) => s + a.scrolls, 0); // 16

/**
 * [progress 0..1, frame 1-based] anchor pairs.
 * Derived from SCROLLS so they stay in sync.
 */
export const ANCHORS: [number, number][] = (() => {
  const pts: [number, number][] = [[0, 1]];
  let acc = 0;
  for (const a of SCROLLS) {
    acc += a.scrolls;
    pts.push([acc / TOTAL_SCROLLS, a.frame]);
  }
  return pts;
})();

/**
 * Piecewise-linear scroll progress → 1-based frame index.
 * @param p Normalized scroll progress [0..1]
 * @returns 1-based frame index, clamped to [1, FRAME_COUNT]
 */
export function frameAt(p: number): number {
  const x = Math.min(1, Math.max(0, p));
  for (let i = 1; i < ANCHORS.length; i++) {
    const [p0, f0] = ANCHORS[i - 1];
    const [p1, f1] = ANCHORS[i];
    if (x <= p1) {
      const t = p1 === p0 ? 0 : (x - p0) / (p1 - p0);
      return Math.round(f0 + t * (f1 - f0));
    }
  }
  return FRAME_COUNT;
}