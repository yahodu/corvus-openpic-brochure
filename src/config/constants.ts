/**
 * Single source of truth for all Corvus numerical constants.
 * Every numeric literal in the application should derive from this module.
 */

/** Total frames in the image sequence (0-based index range: 0..FRAME_COUNT-1) */
export const FRAME_COUNT = 993;

/** Frames that must load before the scroll story begins */
export const GATE = 236;

/** Maximum concurrent image loads */
export const MAX_CONCURRENT_LOADS = 12;

/** Lookahead window for prioritized loading around the current frame */
export const LOOKAHEAD_BEFORE = 8;
export const LOOKAHEAD_AFTER = 60;

/** Hero exit timing derived from frameAt(43) over the first anchor segment */
export const HERO_EXIT_START = (43 - 1) / (112 - 1) * (1 / 16);
export const HERO_EXIT_END = HERO_EXIT_START + 0.008;

/** Image preload safety timeout (ms) */
export const LOAD_SAFETY_TIMEOUT_MS = 30_000;

/** Gate interval check interval (ms) */
export const GATE_CHECK_INTERVAL_MS = 100;

/** Stream loader interval (ms) */
export const STREAM_INTERVAL_MS = 400;

/** Stream refill batch size */
export const STREAM_BATCH_SIZE = 48;

/** Low queue watermark to trigger refill */
export const STREAM_LOW_WATERMARK = 24;

/** Gate completion threshold (97% = close enough) */
export const GATE_COMPLETE_THRESHOLD = 0.97;

/** Generate the image URL for a given 1-based frame index */
export function frameUrl(i: number): string {
  return `/corvus_image_sequence/corvus_images_${String(i).padStart(5, '0')}.jpg`;
}

/** Maps a 0-based frame index to its 1-based URL */
export function frameUrlFromZero(i: number): string {
  return frameUrl(i + 1);
}