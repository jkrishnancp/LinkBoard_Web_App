import { useState, useEffect, useCallback } from 'react';
import { getLinkCache, updateLinkCache, fetchLinkMetadata, LinkCache } from '@/lib/supabase';

export function useLinkCache(linkId: string, url: string, enabled: boolean = true) {
  const [cache, setCache] = useState<LinkCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCache = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const metadata = await fetchLinkMetadata(url);

      const updatedCache = await updateLinkCache(linkId, url, metadata);

      if (updatedCache) {
        setCache(updatedCache);
      }
    } catch (err) {
      console.error('Error refreshing cache:', err);
      setError('Failed to refresh cache');
    } finally {
      setLoading(false);
    }
  }, [linkId, url, enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const loadCache = async () => {
      try {
        const existingCache = await getLinkCache(linkId);

        if (existingCache) {
          setCache(existingCache);
          setLoading(false);
        } else {
          await refreshCache();
        }
      } catch (err) {
        console.error('Error loading cache:', err);
        setError('Failed to load cache');
        setLoading(false);
      }
    };

    loadCache();

    const interval = setInterval(() => {
      refreshCache();
    }, 8 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [linkId, url, enabled, refreshCache]);

  return {
    cache,
    loading,
    error,
    refresh: refreshCache,
  };
}
