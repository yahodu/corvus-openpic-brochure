'use client';

import { useEffect } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';
import { BEATS } from '@/config/beats';
import { HERO_EXIT_START, HERO_EXIT_END } from '@/config/constants';
import { BeatOverlay } from '@/components/BeatOverlay';

interface BeatsProps {
  progress: MotionValue<number>;
  ready: boolean;
}

/**
 * Container that renders all beat overlays with scroll-driven animation.
 *
 * Applies opacity and y transforms to each beat based on the scroll progress.
 * The hero beat gets a special spring-based entry animation triggered by `ready`.
 *
 * Single Responsibility: orchestrate beat visibility and animation for all beats.
 * Individual beat content is delegated to BeatOverlay.
 */
export function Beats({ progress, ready }: BeatsProps) {
  // Smooth the scroll value so text fades feel buttery
  const smooth = useSpring(progress, { stiffness: 90, damping: 24, mass: 0.4 });
  const heroEntry = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 });

  // Animate hero in when the loading gate clears
  useEffect(() => {
    heroEntry.set(ready ? 1 : 0);
  }, [ready, heroEntry]);

  return (
    <>
      {BEATS.map((b) => {
        const [a, z] = b.range;
        const len = z - a;
        const enter = b.enterP ?? a;
        const fadeIn = [enter, enter + len * 0.28];
        const fadeOut = [
          Math.max(z - len * 0.28, fadeIn[1] + 0.002),
          z,
        ];

        const isHero = b.id === 'beat-hero';
        const opacity = isHero
          ? useTransform(smooth, [HERO_EXIT_START, HERO_EXIT_END], [1, 0])
          : useTransform(
              smooth,
              [...fadeIn, ...fadeOut].sort((x, y) => x - y),
              [0, 1, 1, 0],
            );
        const yTransform = isHero
          ? useTransform(smooth, [HERO_EXIT_START, HERO_EXIT_END], [0, 160])
          : useTransform(
              smooth,
              [...fadeIn, ...fadeOut].sort((x, y) => x - y),
              [10, 0, 0, 120],
            );

        const heroInner = isHero
          ? {
              opacity: heroEntry,
              y: useTransform(heroEntry, [0, 1], [14, 0]),
            }
          : null;

        return (
          <motion.section
            key={b.id}
            data-od-id={b.id}
            className={b.cls}
            style={{ opacity, y: yTransform } as Record<string, unknown>}
            aria-hidden="true"
          >
            {heroInner ? (
              <motion.div
                className="beat-hero-inner"
                style={heroInner as Record<string, unknown>}
              >
                <BeatOverlay beat={b} visible={true} />
              </motion.div>
            ) : (
              <BeatOverlay beat={b} visible={true} />
            )}
          </motion.section>
        );
      })}
    </>
  );
}