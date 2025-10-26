'use client';

import { useState, useEffect } from 'react';
import { getUptimeSeconds, formatUptime } from '@/lib/systemInfo';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export function UptimeWidget() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const updateUptime = () => {
      setUptime(getUptimeSeconds());
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <ArrowPathIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Uptime</h3>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatUptime(uptime)}
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Browser session duration
      </div>
    </div>
  );
}
