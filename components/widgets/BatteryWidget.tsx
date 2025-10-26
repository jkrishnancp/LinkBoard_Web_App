'use client';

import { useState, useEffect } from 'react';
import { getBatteryInfo } from '@/lib/systemInfo';
import { BoltIcon, Battery50Icon } from '@heroicons/react/24/outline';

export function BatteryWidget() {
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattery = async () => {
      const info = await getBatteryInfo();
      setBattery(info);
      setLoading(false);
    };

    fetchBattery();

    const interval = setInterval(fetchBattery, 30000);
    return () => clearInterval(interval);
  }, []);

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-600 dark:text-green-400';
    if (level > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        {battery?.charging ? (
          <BoltIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        ) : (
          <Battery50Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Battery</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        ) : battery ? (
          <>
            <div className={`text-4xl font-bold ${getBatteryColor(battery.level)}`}>
              {battery.level}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {battery.charging ? 'Charging' : 'Discharging'}
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Not available on this device
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Current battery status
      </div>
    </div>
  );
}
