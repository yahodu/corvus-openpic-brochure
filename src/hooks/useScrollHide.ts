'use client';

import { useState, useEffect } from 'react';

/**
 * Hook that tracks scroll direction to auto-hide/show a top bar.
 *
 * @returns `hidden` boolean — true when the user has scrolled down past the threshold
 *
 * Single Responsibility: scroll-direction detection for chrome visibility.
 */
export function useScrollHide(threshold = 8, hideAbove = 64): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last + threshold && y > hideAbove) setHidden(true);
      else if (y < last - threshold || y <= hideAbove) setHidden(false);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, hideAbove]);

  return hidden;
}