'use client';

import { useState, useEffect } from 'react';
import { LinkCard as LinkCardType } from '@/lib/validators';
import { Toolbar } from './Toolbar';
import { LinkPreviewToggle } from './LinkPreviewToggle';
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
  onTogglePreview?: (linkId: string, enabled: boolean) => void;
  isArrangeMode: boolean;
  isPreviewMode?: boolean;
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
  onTogglePreview,
  isArrangeMode,
  isPreviewMode = false,
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
        {isPreviewMode ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  {displayName}
                </h3>
                {onTogglePreview && (
                  <LinkPreviewToggle
                    linkId={link.id}
                    url={link.url}
                    isPreviewMode={isPreviewMode}
                    onToggle={(enabled) => onTogglePreview(link.id, enabled)}
                  />
                )}
              </div>
            </div>
            <div className="flex-1 relative min-h-0 bg-white dark:bg-gray-900">
              <iframe
                src={link.url}
                title={displayName}
                className="absolute inset-0 w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-100/50 to-transparent dark:from-gray-900/50" />
            </div>
          </div>
        ) : (
          <>
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

            <div className="mt-auto space-y-2">
              {onTogglePreview && (
                <LinkPreviewToggle
                  linkId={link.id}
                  url={link.url}
                  isPreviewMode={isPreviewMode}
                  onToggle={(enabled) => onTogglePreview(link.id, enabled)}
                />
              )}
              {!isArrangeMode && (
                <button
                  onClick={handleOpen}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <span>Open in New Tab</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
