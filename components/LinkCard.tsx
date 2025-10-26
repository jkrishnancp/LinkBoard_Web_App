'use client';

import { LinkCard as LinkCardType } from '@/lib/validators';
import { Toolbar } from './Toolbar';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useLinkStatus } from '@/hooks/useLinkStatus';
import { useLinkCache } from '@/hooks/useLinkCache';

interface LinkCardProps {
  link: LinkCardType;
  density: 'compact' | 'comfy' | 'poster';
  cardRadius: 'sm' | 'md' | 'lg' | 'xl';
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onResize?: () => void;
  isArrangeMode: boolean;
}

export function LinkCard({
  link,
  density,
  cardRadius,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onResize,
  isArrangeMode,
}: LinkCardProps) {
  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const densityClasses = {
    compact: 'p-3',
    comfy: 'p-4',
    poster: 'p-6',
  };

  const logoSizes = {
    compact: 'w-8 h-8',
    comfy: 'w-12 h-12',
    poster: 'w-16 h-16',
  };

  const textSizes = {
    compact: {
      title: 'text-sm',
      desc: 'text-xs',
    },
    comfy: {
      title: 'text-base',
      desc: 'text-sm',
    },
    poster: {
      title: 'text-lg',
      desc: 'text-base',
    },
  };

  const { status } = useLinkStatus(link.id, link.url, !link.hidden);
  const { cache } = useLinkCache(link.id, link.url, !link.hidden);

  const displayName = link.customName || link.name;
  const displayLogo = cache?.favicon || link.logo;
  const displayDescription = cache?.description || link.description;

  const handleOpen = () => {
    if (!isArrangeMode) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 border ${
        isArrangeMode ? 'border-blue-400 dark:border-blue-600 border-2' : 'border-gray-200 dark:border-gray-700'
      } ${radiusClasses[cardRadius]} ${densityClasses[density]} shadow-sm hover:shadow-md transition-all h-full flex flex-col ${
        link.hidden ? 'opacity-50' : ''
      } ${isArrangeMode ? 'cursor-move' : 'cursor-default'}`}
    >
      <div className="absolute top-2 left-2 z-10">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor()} ring-2 ring-white dark:ring-gray-800`}
          title={`Status: ${status.toUpperCase()}`}
        />
      </div>

      <Toolbar
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onToggleVisibility={onToggleVisibility}
        onResize={onResize}
        isHidden={link.hidden || false}
        showResize={isArrangeMode}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-start gap-3 mb-3">
          {displayLogo && (
            <img
              src={displayLogo}
              alt={`${displayName} logo`}
              className={`${logoSizes[density]} object-contain flex-shrink-0`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${textSizes[density].title}`}>
              {displayName}
            </h3>
            {displayDescription && (
              <p className={`text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 ${textSizes[density].desc}`}>
                {displayDescription}
              </p>
            )}
          </div>
        </div>

        {!isArrangeMode && (
          <button
            onClick={handleOpen}
            className="mt-auto flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>Open</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
