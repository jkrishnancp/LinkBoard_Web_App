'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface LinkPreviewToggleProps {
  linkId: string;
  url: string;
  isPreviewMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export function LinkPreviewToggle({ linkId, url, isPreviewMode, onToggle }: LinkPreviewToggleProps) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
        {isPreviewMode ? (
          <>
            <EyeIcon className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </>
        ) : (
          <>
            <DocumentTextIcon className="w-3.5 h-3.5" />
            <span>Card View</span>
          </>
        )}
      </div>
      <Switch
        checked={isPreviewMode}
        onCheckedChange={onToggle}
        className="scale-75"
      />
    </div>
  );
}
