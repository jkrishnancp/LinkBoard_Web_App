'use client';

import { useState, useEffect } from 'react';
import { getLocalIP } from '@/lib/systemInfo';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

export function LocalIPWidget() {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIP = async () => {
      const localIP = await getLocalIP();
      setIp(localIP);
      setLoading(false);
    };

    fetchIP();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <ComputerDesktopIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Local IP</h3>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        ) : ip ? (
          <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
            {ip}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">Unavailable</div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Your device's local network address
      </div>
    </div>
  );
}
