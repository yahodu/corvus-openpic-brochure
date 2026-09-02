import type { TrimRegion } from '@/types';

/**
 * Canvas trim region for frames 1–138 that ship a baked pure-black border.
 * Measured: 5px left, 6px right, 3px top/bottom on 1284×716 source.
 */
export const TRIM: TrimRegion = { l: 5, r: 6, t: 3, b: 3 };

/**
 * Draw a source image onto a canvas, trimming the border and cover-fitting.
 * @param ctx - Canvas 2D rendering context
 * @param img - Loaded HTMLImageElement
 * @param W - Canvas pixel width (device-pixel scaled)
 * @param H - Canvas pixel height (device-pixel scaled)
 */
export function drawTrimmedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  W: number,
  H: number,
): void {
  const sw = img.naturalWidth - TRIM.l - TRIM.r;
  const sh = img.naturalHeight - TRIM.t - TRIM.b;
  const ir = sw / sh;
  const cr = W / H;
  let dw: number, dh: number;
  if (ir > cr) {
    dh = H;
    dw = H * ir;
  } else {
    dw = W;
    dh = W / ir;
  }
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, TRIM.l, TRIM.t, sw, sh, dx, dy, dw, dh);
}