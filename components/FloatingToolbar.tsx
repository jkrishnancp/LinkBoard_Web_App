'use client';

import { Button } from '@/components/ui/button';
import {
  Squares2X2Icon,
  CheckIcon,
  PlusIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface FloatingToolbarProps {
  isArrangeMode: boolean;
  onToggleArrange: () => void;
  onAddLink: () => void;
  onOpenSettings: () => void;
}

export function FloatingToolbar({
  isArrangeMode,
  onToggleArrange,
  onAddLink,
  onOpenSettings,
}: FloatingToolbarProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Button
        onClick={onToggleArrange}
        size="lg"
        variant={isArrangeMode ? 'default' : 'outline'}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all ${
          isArrangeMode
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-white dark:bg-gray-800'
        }`}
        title={isArrangeMode ? 'Done Arranging' : 'Arrange Mode'}
      >
        {isArrangeMode ? (
          <CheckIcon className="w-6 h-6" />
        ) : (
          <Squares2X2Icon className="w-6 h-6" />
        )}
      </Button>

      <Button
        onClick={onAddLink}
        size="lg"
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        title="Add Link"
      >
        <PlusIcon className="w-6 h-6" />
      </Button>

      <Button
        onClick={onOpenSettings}
        size="lg"
        variant="outline"
        className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
        title="Settings"
      >
        <Cog6ToothIcon className="w-6 h-6" />
      </Button>
    </div>
  );
}
