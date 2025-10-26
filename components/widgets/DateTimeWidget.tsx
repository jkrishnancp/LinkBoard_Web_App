'use client';

import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export function DateTimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <ClockIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Date & Time</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {formatDate(currentTime)}
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Updates every second
      </div>
    </div>
  );
}
