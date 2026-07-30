import { useEffect, useRef, useCallback, useState } from 'react';

interface TimerState {
  /** Elapsed seconds (excluding paused time) */
  elapsed: number;
  isPaused: boolean;
  toggle: () => void;
  reset: () => void;
}

/**
 * Count-up timer with pause/resume.
 * Returns elapsed seconds that tick every second while not paused.
 */
export function useTimer(autoStart = true): TimerState {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop interval based on pause state
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused]);

  const toggle = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
    setIsPaused(false);
  }, []);

  return { elapsed, isPaused, toggle, reset };
}
