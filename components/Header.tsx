'use client';

import { useState, useEffect, useRef } from 'react';
import { useLinkBoard } from '@/store/useLinkBoard';
import { SidebarMenu } from './SidebarMenu';

export function Header() {
  const { settings, lastSaved, exportState, importState } = useLinkBoard();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme, mounted]);

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

        if (
          confirm(
            `Import ${parsed.links?.length || 0} links? This will replace your current board.`
          )
        ) {
          importState(parsed);
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

  if (!settings.showHeader) return null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarMenu onImport={handleImport} onExport={handleExport} />

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {settings.title}
                </h1>
                {settings.subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {settings.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/media"
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-cyan-500 to-orange-500 text-white hover:from-cyan-600 hover:to-orange-600 transition-all"
              >
                Media Dashboard
              </a>
              {lastSaved && (
                <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400">
                  Last saved: {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
