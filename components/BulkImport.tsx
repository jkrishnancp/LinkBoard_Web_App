'use client';

import { useState, useCallback } from 'react';
import { useLinkBoard } from '@/store/useLinkBoard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowUpTrayIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getFaviconUrl } from '@/lib/defaultPages';

interface ImportedLink {
  name: string;
  url: string;
  description?: string;
  valid: boolean;
  error?: string;
}

export function BulkImport() {
  const { addLink } = useLinkBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importedLinks, setImportedLinks] = useState<ImportedLink[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const parseCSV = (content: string): ImportedLink[] => {
    const lines = content.split('\n').filter((line) => line.trim());
    const links: ImportedLink[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        const url = parts[1];
        const valid = validateUrl(url);
        links.push({
          name: parts[0] || 'Untitled',
          url,
          description: parts[2] || '',
          valid,
          error: valid ? undefined : 'Invalid URL',
        });
      }
    }

    return links;
  };

  const parseJSON = (content: string): ImportedLink[] => {
    try {
      const data = JSON.parse(content);
      const links: ImportedLink[] = [];

      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item.url) {
            const valid = validateUrl(item.url);
            links.push({
              name: item.name || item.title || 'Untitled',
              url: item.url,
              description: item.description || '',
              valid,
              error: valid ? undefined : 'Invalid URL',
            });
          }
        });
      } else if (data.pages && Array.isArray(data.pages)) {
        data.pages.forEach((page: any) => {
          if (page.links && Array.isArray(page.links)) {
            page.links.forEach((link: any) => {
              const valid = validateUrl(link.url);
              links.push({
                name: link.name || 'Untitled',
                url: link.url,
                description: link.description || '',
                valid,
                error: valid ? undefined : 'Invalid URL',
              });
            });
          }
        });
      }

      return links;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const parseBookmarksHTML = (content: string): ImportedLink[] => {
    const links: ImportedLink[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const anchors = doc.querySelectorAll('a');

    anchors.forEach((anchor) => {
      const url = anchor.getAttribute('href');
      if (url) {
        const valid = validateUrl(url);
        links.push({
          name: anchor.textContent || 'Untitled',
          url,
          valid,
          error: valid ? undefined : 'Invalid URL',
        });
      }
    });

    return links;
  };

  const handleFile = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let parsed: ImportedLink[] = [];

        if (file.name.endsWith('.csv')) {
          parsed = parseCSV(content);
        } else if (file.name.endsWith('.json')) {
          parsed = parseJSON(content);
        } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          parsed = parseBookmarksHTML(content);
        } else {
          alert('Unsupported file format. Please use CSV, JSON, or HTML.');
          setIsProcessing(false);
          return;
        }

        setImportedLinks(parsed);
        setIsProcessing(false);
      } catch (error) {
        alert(`Error parsing file: ${(error as Error).message}`);
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleImport = () => {
    const validLinks = importedLinks.filter((link) => link.valid);

    validLinks.forEach((link) => {
      addLink({
        name: link.name,
        url: link.url,
        description: link.description,
        logo: getFaviconUrl(link.url),
        previewMode: true,
      });
    });

    setImportedLinks([]);
    setIsOpen(false);
  };

  const validCount = importedLinks.filter((l) => l.valid).length;
  const invalidCount = importedLinks.length - validCount;

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-2">
        <ArrowUpTrayIcon className="w-4 h-4" />
        Bulk Import
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Bulk Import Links</DialogTitle>
            <DialogDescription>
              Import links from CSV, JSON, or browser bookmarks HTML files.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {importedLinks.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <ArrowUpTrayIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Drag and drop your file here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv,.json,.html,.htm"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <p className="text-xs text-gray-400 mt-4">
                  Supported formats: CSV, JSON, HTML (bookmarks)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      {importedLinks.length} links found
                    </p>
                    <p className="text-xs text-gray-500">
                      {validCount} valid, {invalidCount} invalid
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImportedLinks([])}
                  >
                    Clear
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {importedLinks.map((link, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        link.valid
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {link.valid ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{link.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {link.url}
                          </p>
                          {link.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          {link.error && (
                            <p className="text-xs text-red-600 mt-1">{link.error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            {importedLinks.length > 0 && (
              <Button onClick={handleImport} disabled={validCount === 0}>
                Import {validCount} Link{validCount !== 1 ? 's' : ''}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
