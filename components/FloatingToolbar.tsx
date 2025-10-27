'use client';

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
      <button
        onClick={onToggleArrange}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
          isArrangeMode
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
        }`}
        title={isArrangeMode ? 'Done Arranging' : 'Arrange Mode'}
      >
        {isArrangeMode ? (
          <CheckIcon className="w-6 h-6" />
        ) : (
          <Squares2X2Icon className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={onAddLink}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        title="Add Link"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <button
        onClick={onOpenSettings}
        className="w-14 h-14 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-center"
        title="Settings"
      >
        <Cog6ToothIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
