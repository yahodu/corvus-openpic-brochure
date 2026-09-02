'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { LoadState } from '@/types';
import {
  FRAME_COUNT,
  GATE,
  MAX_CONCURRENT_LOADS,
  LOOKAHEAD_BEFORE,
  LOOKAHEAD_AFTER,
  LOAD_SAFETY_TIMEOUT_MS,
  GATE_CHECK_INTERVAL_MS,
  STREAM_INTERVAL_MS,
  STREAM_BATCH_SIZE,
  STREAM_LOW_WATERMARK,
  GATE_COMPLETE_THRESHOLD,
  frameUrlFromZero,
} from '@/config/constants';
import { frameAt } from '@/config/scroll';

/**
 * Result of the frame preloader hook.
 */
export interface UseFramePreloaderReturn {
  /** Gate-loading progress [0..1] */
  loadProgress: number;
  /** True when the gate frames are sufficiently loaded */
  ready: boolean;
  /** All loaded images (some may not have completed loading) */
  imagesRef: React.MutableRefObject<(HTMLImageElement | null)[]>;
  /** Prioritize loading around the given frame */
  prioritizeAround: (frame: number) => void;
  /** Get the nearest loaded frame index for a given scroll progress */
  getNearestLoadedIndex: (p: number) => number | null;
}

/**
 * Hook that manages background image preloading with intelligent prioritization.
 *
 * Phases:
 *  1. Gate — load first GATE frames sequentially for meaningful progress display.
 *  2. Stream — background-fill remaining frames at a steady pace.
 *  3. Prioritize — around the user's current scroll position, load nearest-first.
 *
 * Single Responsibility: image lifecycle only (load, priority, completion tracking).
 */
export function useFramePreloader(): UseFramePreloaderReturn {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT).fill(null),
  );
  const loadStateRef = useRef<LoadState>({ queue: [], pending: 0, started: new Set() });
  const gateCountRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const pump = useCallback(() => {
    const st = loadStateRef.current;
    while (st.pending < MAX_CONCURRENT_LOADS && st.queue.length > 0) {
      const i = st.queue.shift()!;
      if (st.started.has(i)) continue;
      st.pending++;
      startImage(i);
    }
  }, []);

  const startImage = useCallback((index: number) => {
    const st = loadStateRef.current;
    if (st.started.has(index)) return;
    st.started.add(index);
    const img = new Image();
    const done = () => {
      st.pending--;
      if (index < GATE) {
        gateCountRef.current++;
        setLoadProgress(gateCountRef.current / GATE);
      }
      pump();
    };
    img.onload = () => {
      // Wait for full decode so drawImage never gets a partially-decoded frame
      img.decode().then(done).catch(done);
    };
    img.onerror = done;
    img.src = frameUrlFromZero(index);
    imagesRef.current[index] = img;
  }, [pump]);

  const enqueue = useCallback(
    (indices: number[], front: boolean) => {
      const st = loadStateRef.current;
      const fresh = indices.filter(
        (i) =>
          i >= 0 &&
          i < FRAME_COUNT &&
          !st.started.has(i) &&
          !st.queue.includes(i),
      );
      if (front) st.queue.unshift(...fresh);
      else st.queue.push(...fresh);
      pump();
    },
    [pump],
  );

  const prioritizeAround = useCallback(
    (frame: number) => {
      const from = frame - LOOKAHEAD_BEFORE;
      const to = frame + LOOKAHEAD_AFTER;
      const idx: number[] = [];
      // nearest-first for snappy response
      for (let i = to; i >= from; i--) idx.push(i);
      enqueue(idx, true);
    },
    [enqueue],
  );

  const getNearestLoadedIndex = useCallback((p: number): number | null => {
    const imgs = imagesRef.current;
    let idx = frameAt(p) - 1; // 0-based
    // Search outward for the nearest loaded frame (no flicker)
    if (!(imgs[idx]?.complete && imgs[idx]!.naturalWidth)) {
      let found = -1;
      for (let d = 0; d < FRAME_COUNT && found < 0; d++) {
        for (const j of [idx - d, idx + d]) {
          if (
            j >= 0 &&
            j < FRAME_COUNT &&
            imgs[j]?.complete &&
            imgs[j]!.naturalWidth
          ) {
            found = j;
            break;
          }
        }
      }
      if (found < 0) return null;
      idx = found;
    }
    return idx;
  }, []);

  // Bootstrap loading on mount
  useEffect(() => {
    let alive = true;

    // Phase 1: gate frames in sequential order
    enqueue(Array.from({ length: GATE }, (_, i) => i), false);

    // Phase 2: stream remaining frames
    const stream = setInterval(() => {
      const st = loadStateRef.current;
      if (st.queue.length < STREAM_LOW_WATERMARK) {
        const next: number[] = [];
        for (let i = 0; i < FRAME_COUNT && next.length < STREAM_BATCH_SIZE; i++) {
          if (!st.started.has(i) && !st.queue.includes(i)) next.push(i);
        }
        if (next.length) enqueue(next, false);
        else clearInterval(stream);
      }
    }, STREAM_INTERVAL_MS);

    // Gate check
    const check = setInterval(() => {
      if (gateCountRef.current >= GATE * GATE_COMPLETE_THRESHOLD) {
        clearInterval(check);
        if (alive) setReady(true);
      }
    }, GATE_CHECK_INTERVAL_MS);

    const safety = setTimeout(() => {
      clearInterval(check);
      if (alive) setReady(true);
    }, LOAD_SAFETY_TIMEOUT_MS);

    return () => {
      alive = false;
      clearInterval(stream);
      clearInterval(check);
      clearTimeout(safety);
    };
  }, [enqueue]);

  return {
    loadProgress,
    ready,
    imagesRef,
    prioritizeAround,
    getNearestLoadedIndex,
  };
}