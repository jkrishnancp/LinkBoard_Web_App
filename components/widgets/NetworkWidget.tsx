'use client';

import { useState, useEffect } from 'react';
import { getNetworkInfo } from '@/lib/systemInfo';
import { SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline';

export function NetworkWidget() {
  const [network, setNetwork] = useState(getNetworkInfo());

  useEffect(() => {
    const updateNetwork = () => {
      setNetwork(getNetworkInfo());
    };

    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    const interval = setInterval(updateNetwork, 5000);

    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      clearInterval(interval);
    };
  }, []);

  const getConnectionType = () => {
    if (!network.effectiveType) return 'Unknown';

    const types: Record<string, string> = {
      'slow-2g': 'Slow 2G',
      '2g': '2G',
      '3g': '3G',
      '4g': '4G',
    };

    return types[network.effectiveType] || network.effectiveType.toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        {network.online ? (
          <SignalIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <SignalSlashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Network</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`text-2xl font-bold mb-2 ${
          network.online
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {network.online ? 'Online' : 'Offline'}
        </div>
        {network.online && network.effectiveType && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getConnectionType()}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Connection status
      </div>
    </div>
  );
}
