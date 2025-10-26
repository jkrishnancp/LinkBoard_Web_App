import { useState, useEffect, useCallback } from 'react';
import { getLinkStatus, updateLinkStatus, LinkStatus } from '@/lib/supabase';

export function useLinkStatus(linkId: string, url: string, enabled: boolean = true) {
  const [status, setStatus] = useState<'up' | 'down' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const checkStatus = useCallback(async () => {
    if (!enabled) return;

    setStatus('checking');
    const startTime = Date.now();

    try {
      const result = await updateLinkStatus(linkId, url);

      if (result) {
        setStatus(result.status);
        setLastChecked(new Date(result.last_checked));
        setResponseTime(Date.now() - startTime);
      }
    } catch (error) {
      console.error('Error checking link status:', error);
      setStatus('down');
    }
  }, [linkId, url, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const loadInitialStatus = async () => {
      const existingStatus = await getLinkStatus(linkId);

      if (existingStatus) {
        setStatus(existingStatus.status);
        setLastChecked(new Date(existingStatus.last_checked));
        setResponseTime(existingStatus.response_time || null);

        const lastCheckedDate = new Date(existingStatus.last_checked);
        const now = new Date();
        const minutesSinceCheck = (now.getTime() - lastCheckedDate.getTime()) / 1000 / 60;

        if (minutesSinceCheck > 5) {
          checkStatus();
        }
      } else {
        checkStatus();
      }
    };

    loadInitialStatus();

    const interval = setInterval(() => {
      checkStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [linkId, url, enabled, checkStatus]);

  return {
    status,
    lastChecked,
    responseTime,
    refresh: checkStatus,
  };
}
