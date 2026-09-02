'use client';

import { useRef, useCallback, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useFramePreloader } from '@/hooks/useFramePreloader';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Beats } from '@/components/Beats';
import { Loader } from '@/components/Loader';
import { drawTrimmedImage } from '@/utils/canvas';
import { FRAME_COUNT } from '@/config/constants';
import { HERO_EXIT_START } from '@/config/constants';
import { frameAt } from '@/config/scroll';

/**
 * Scroll-driven image sequence stage.
 *
 * Contains the sticky canvas, loader, beat overlays, and scroll hint.
 * Composes three hooks to separate concerns:
 *  - useScrollProgress → tracks scroll position
 *  - useFramePreloader → manages image loading
 *  - useCanvasRenderer  → manages canvas lifecycle
 *
 * Single Responsibility: compose scroll + preload + render into the stage layout.
 */
export function Stage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);

  // Hook 1: scroll progress
  const scrollYProgress = useScrollProgress(containerRef);

  // Track scroll progress in a ref for rAF access
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v: number) => {
      progressRef.current = v;
      preloaderRef.prioritizeAround(frameAt(v));
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Hook 2: image preloading
  const preloaderRef = useFramePreloader();

  // Hook 3: canvas renderer
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, W: number, H: number): number => {
      const imgs = preloaderRef.imagesRef.current;
      const p = Math.min(1, Math.max(0, progressRef.current));
      const nearestIdx = preloaderRef.getNearestLoadedIndex(p);
      if (nearestIdx === null) return -1;

      const img = imgs[nearestIdx];
      if (!img?.complete || !img.naturalWidth) return -1;

      drawTrimmedImage(ctx, img, W, H);
      return nearestIdx;
    },
    [preloaderRef],
  );

  const { forceRedraw } = useCanvasRenderer(canvasRef, draw);

  // Fade the "Scroll" hint out as the hero exits
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, HERO_EXIT_START],
    [1, 0],
  );

  // Redraw once gate clears
  useEffect(() => {
    if (preloaderRef.ready) {
      forceRedraw();
    }
  }, [preloaderRef.ready, forceRedraw]);

  return (
    <div
      className="stage-wrap"
      ref={containerRef}
      data-od-id="scrolly-stage"
      id="top"
    >
      <div className="stage">
        <canvas
          ref={canvasRef}
          aria-label="Corvus — scroll-driven animation sequence"
          role="img"
        />
        <Beats progress={scrollYProgress} ready={preloaderRef.ready} />
        <motion.div
          className="scroll-hint"
          data-od-id="scroll-hint"
          style={{ opacity: scrollHintOpacity }}
        >
          Scroll
        </motion.div>
      </div>
      <Loader progress={preloaderRef.loadProgress} done={preloaderRef.ready} />
    </div>
  );
}