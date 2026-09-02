'use client';

import { useCallback, useEffect, useRef, RefObject } from 'react';

export interface UseCanvasRendererReturn {
  forceRedraw: () => void;
}

/**
 * Hook that manages canvas sizing and a requestAnimationFrame render loop.
 *
 * It reads the canvas's bounding rect, sizes to device-pixel ratio,
 * and runs a draw callback every frame. Redundant draws are skipped
 * via a last-drawn index check. No clearRect is used — the draw
 * callback always paints a full-canvas image that overwrites the
 * previous frame, so clearing would cause an unnecessary black flash.
 *
 * Single Responsibility: canvas lifecycle (resize + rAF loop) only.
 * Draw logic is injected via the `draw` callback.
 */
export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  /** Draw callback called every rAF. Return the current frame index, or -1 if nothing drawn. */
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number) => number,
): UseCanvasRendererReturn {
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef(0);
  const sizedRef = useRef(false);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      lastDrawnRef.current = -1;
      sizedRef.current = false;
    }
  }, [canvasRef]);

  // Render loop
  useEffect(() => {
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const idx = draw(ctx, canvas.width, canvas.height);
      if (idx < 0) {
        // No frame available — keep last frame, don't clear
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (lastDrawnRef.current === idx && sizedRef.current) {
        // skip redundant draw — still schedule next frame
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      // draw() already painted the image — no clearRect needed since it
      // overwrites the full canvas. Clearing would flash the background.
      lastDrawnRef.current = idx;
      sizedRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef, draw]);

  // Resize handling
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  const forceRedraw = useCallback(() => {
    lastDrawnRef.current = -1;
  }, []);

  return { forceRedraw };
}