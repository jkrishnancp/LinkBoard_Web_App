import { useEffect, useRef, useCallback } from 'react';

interface UseAutoRefreshOptions {
  onRefresh: () => void | Promise<void>;
  enabled: boolean;
  refreshInterval?: number;
}

export function useAutoRefresh({
  onRefresh,
  enabled,
  refreshInterval = 8 * 60 * 60 * 1000,
}: UseAutoRefreshOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    clearTimer();

    if (!enabled) return;

    timerRef.current = setTimeout(async () => {
      lastRefreshRef.current = Date.now();
      await onRefresh();
      scheduleRefresh();
    }, refreshInterval);
  }, [enabled, refreshInterval, onRefresh, clearTimer]);

  const triggerImmediateRefresh = useCallback(async () => {
    if (!enabled) return;

    lastRefreshRef.current = Date.now();
    await onRefresh();
    clearTimer();
    scheduleRefresh();
  }, [enabled, onRefresh, clearTimer, scheduleRefresh]);

  useEffect(() => {
    if (enabled) {
      scheduleRefresh();
    } else {
      clearTimer();
    }

    return () => {
      clearTimer();
    };
  }, [enabled, scheduleRefresh, clearTimer]);

  return {
    triggerImmediateRefresh,
    lastRefresh: lastRefreshRef.current,
    clearTimer,
  };
}
