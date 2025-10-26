'use client';

import { useState, useEffect } from 'react';
import { getPublicIP } from '@/lib/systemInfo';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export function PublicIPWidget() {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const publicIP = await getPublicIP();
        setIp(publicIP);
        setError(!publicIP);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchIP();

    const interval = setInterval(fetchIP, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <GlobeAltIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Public IP</h3>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-500 dark:text-red-400">Failed to fetch</div>
        ) : ip ? (
          <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
            {ip}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">Unavailable</div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Your public-facing IP address
      </div>
    </div>
  );
}
