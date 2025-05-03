import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for displaying timed hints based on user inactivity
 *
 * @param hints - Array of hint strings to cycle through
 * @param idleMs - Milliseconds of inactivity before showing a hint (default: 10000ms)
 * @returns Object containing current hint and control functions
 */
export const useHintTimer = (
  hints: string[],
  idleMs = 10000
): {
  currentHint: string | null;
  nextHint: () => void;
  dismissHint: () => void;
  resetTimer: () => void;
} => {
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback((): void => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    lastActivityRef.current = Date.now();

    timerRef.current = window.setTimeout(() => {
      if (hints.length > 0) {
        setCurrentHintIndex(prev => (prev === -1 ? 0 : prev));
        setIsVisible(true);
      }
    }, idleMs);
  }, [hints, idleMs]);

  useEffect(() => {
    resetTimer();

    const events = ['mousedown', 'keydown', 'mousemove'];
    const handleActivity = (): void => resetTimer();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return (): void => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  const currentHint = isVisible && currentHintIndex >= 0 ? hints[currentHintIndex] : null;

  const nextHint = useCallback((): void => {
    if (hints.length > 0) {
      setCurrentHintIndex(prev => (prev + 1) % hints.length);
      setIsVisible(true);
      resetTimer();
    }
  }, [hints, resetTimer]);

  const dismissHint = useCallback((): void => {
    setIsVisible(false);
    resetTimer();
  }, [resetTimer]);

  return {
    currentHint,
    nextHint,
    dismissHint,
    resetTimer,
  };
};
