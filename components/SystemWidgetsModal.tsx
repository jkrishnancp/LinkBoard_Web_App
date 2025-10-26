'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WIDGET_METADATA, WidgetType } from '@/lib/systemInfo';
import {
  ComputerDesktopIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowPathIcon,
  BoltIcon,
  SignalIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface SystemWidgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType) => void;
  enabledWidgets: WidgetType[];
}

const WIDGET_ICONS: Record<WidgetType, React.ComponentType<{ className?: string }>> = {
  'local-ip': ComputerDesktopIcon,
  'public-ip': GlobeAltIcon,
  'datetime': ClockIcon,
  'uptime': ArrowPathIcon,
  'battery': BoltIcon,
  'network': SignalIcon,
  'performance': ChartBarIcon,
};

export function SystemWidgetsModal({
  isOpen,
  onClose,
  onAddWidget,
  enabledWidgets,
}: SystemWidgetsModalProps) {
  const handleAddWidget = (type: WidgetType) => {
    onAddWidget(type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add System Widget</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose a system information widget to add to your board. Widgets display live data and update automatically.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(WIDGET_METADATA) as WidgetType[]).map((type) => {
              const metadata = WIDGET_METADATA[type];
              const Icon = WIDGET_ICONS[type];
              const isEnabled = enabledWidgets.includes(type);

              return (
                <button
                  key={type}
                  onClick={() => !isEnabled && handleAddWidget(type)}
                  disabled={isEnabled}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    isEnabled
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <Icon className={`w-6 h-6 flex-shrink-0 ${
                    isEnabled ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {metadata.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {metadata.description}
                    </p>
                    {isEnabled && (
                      <span className="inline-block mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                        Already added
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
