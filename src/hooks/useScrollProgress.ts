'use client';

import { useScroll, MotionValue } from 'framer-motion';
import { RefObject } from 'react';

/**
 * Hook that provides the normalized scroll progress [0..1] for a staged scroll container.
 * The container should be a tall element (stage-wrap) with a sticky inner stage.
 *
 * @param containerRef - Ref to the scrollable container element
 * @returns MotionValue<number> representing scroll progress [0..1]
 *
 * Single Responsibility: only tracks scroll → progress.
 * All scroll-derived values (frame index, opacity, etc.) are computed elsewhere.
 */
export function useScrollProgress(
  containerRef: RefObject<HTMLDivElement | null>,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  return scrollYProgress;
}