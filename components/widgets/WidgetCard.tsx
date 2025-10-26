'use client';

import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { WidgetType } from '@/lib/systemInfo';
import { LocalIPWidget } from './LocalIPWidget';
import { PublicIPWidget } from './PublicIPWidget';
import { DateTimeWidget } from './DateTimeWidget';
import { UptimeWidget } from './UptimeWidget';
import { BatteryWidget } from './BatteryWidget';
import { NetworkWidget } from './NetworkWidget';
import { PerformanceWidget } from './PerformanceWidget';

interface WidgetCardProps {
  type: WidgetType;
  onRemove: () => void;
  onResize?: () => void;
  isArrangeMode: boolean;
  cardRadius: 'sm' | 'md' | 'lg' | 'xl';
}

export function WidgetCard({ type, onRemove, onResize, isArrangeMode, cardRadius }: WidgetCardProps) {
  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const renderWidget = () => {
    switch (type) {
      case 'local-ip':
        return <LocalIPWidget />;
      case 'public-ip':
        return <PublicIPWidget />;
      case 'datetime':
        return <DateTimeWidget />;
      case 'uptime':
        return <UptimeWidget />;
      case 'battery':
        return <BatteryWidget />;
      case 'network':
        return <NetworkWidget />;
      case 'performance':
        return <PerformanceWidget />;
      default:
        return <div>Unknown widget</div>;
    }
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 ${
        isArrangeMode ? 'border-blue-400 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'
      } ${radiusClasses[cardRadius]} p-4 shadow-sm hover:shadow-md transition-all h-full ${
        isArrangeMode ? 'cursor-move' : 'cursor-default'
      }`}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {isArrangeMode && onResize && (
          <button
            onClick={onResize}
            className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            title="Resize widget"
          >
            <ArrowsPointingOutIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          title="Remove widget"
        >
          <XMarkIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>

      {renderWidget()}
    </div>
  );
}
