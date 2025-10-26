import { PencilIcon, TrashIcon, DocumentDuplicateIcon, EyeIcon, EyeSlashIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface ToolbarProps {
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onResize?: () => void;
  isHidden: boolean;
  showResize?: boolean;
}

export function Toolbar({ onEdit, onDelete, onDuplicate, onToggleVisibility, onResize, isHidden, showResize = false }: ToolbarProps) {
  return (
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button
        onClick={onEdit}
        className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Edit"
      >
        <PencilIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
      {showResize && onResize && (
        <button
          onClick={onResize}
          className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          title="Resize"
        >
          <ArrowsPointingOutIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>
      )}
      <button
        onClick={onToggleVisibility}
        className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={isHidden ? 'Show' : 'Hide'}
      >
        {isHidden ? (
          <EyeIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <EyeSlashIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        )}
      </button>
      <button
        onClick={onDuplicate}
        className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Duplicate"
      >
        <DocumentDuplicateIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
        title="Delete"
      >
        <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
      </button>
    </div>
  );
}
