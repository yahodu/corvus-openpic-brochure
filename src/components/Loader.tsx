'use client';

import { PLACEHOLDER_LOGO_DATA_URL } from '@/utils/logo';

interface LoaderProps {
  progress: number;
  done: boolean;
}

/**
 * Full-screen loading overlay with a spinner and progress bar.
 * Fades out when `done` becomes true.
 *
 * Single Responsibility: display load progress only.
 * Image loading logic is in useFramePreloader.
 */
export function Loader({ progress, done }: LoaderProps) {
  return (
    <div
      className="loader"
      style={{
        opacity: done ? 0 : 1,
        pointerEvents: done ? 'none' : 'auto' as const,
      }}
    >
      <div className="spinner" aria-hidden="true" />
      <div className="loader-label">Loading Corvus…</div>
      <div className="loader-track" aria-hidden="true">
        <div
          className="loader-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}