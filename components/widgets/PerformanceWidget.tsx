'use client';

import { useState, useEffect } from 'react';
import { getPerformanceInfo, formatBytes } from '@/lib/systemInfo';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export function PerformanceWidget() {
  const [performance, setPerformance] = useState(getPerformanceInfo());

  useEffect(() => {
    const updatePerformance = () => {
      setPerformance(getPerformanceInfo());
    };

    const interval = setInterval(updatePerformance, 2000);

    return () => clearInterval(interval);
  }, []);

  const getUsagePercentage = () => {
    if (!performance.memory || !performance.memoryLimit) return 0;
    return Math.round((performance.memory / performance.memoryLimit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 80) return 'text-red-600 dark:text-red-400';
    if (percentage > 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Memory</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {performance.memory && performance.memoryLimit ? (
          <>
            <div className={`text-3xl font-bold ${getUsageColor(getUsagePercentage())}`}>
              {getUsagePercentage()}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              {formatBytes(performance.memory)} / {formatBytes(performance.memoryLimit)}
            </div>

            <div className="w-full mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  getUsagePercentage() > 80
                    ? 'bg-red-600'
                    : getUsagePercentage() > 60
                    ? 'bg-yellow-600'
                    : 'bg-green-600'
                }`}
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Not available in this browser
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        JavaScript heap memory usage
      </div>
    </div>
  );
}
