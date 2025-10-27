'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useLinkBoard } from '@/store/useLinkBoard';
import { appStateSchema } from '@/lib/validators';

export function JsonImportExport() {
  const { exportState, importState } = useLinkBoard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const state = exportState();
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const validated = appStateSchema.parse(parsed);

        const totalLinks = validated.pages.reduce((sum, page) => sum + page.links.length, 0);
        const pageCount = validated.pages.length;

        if (
          confirm(
            `Import ${totalLinks} links across ${pageCount} page(s)? This will replace your current board.`
          )
        ) {
          importState(validated);
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid LinkBoard export file.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
        <ArrowDownTrayIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button onClick={handleImport} variant="outline" size="sm" className="gap-2">
        <ArrowUpTrayIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
