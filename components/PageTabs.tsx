'use client';

import { useState } from 'react';
import { useLinkBoard } from '@/store/useLinkBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function PageTabs() {
  const { pages, currentPageId, setCurrentPage, addPage, renamePage, deletePage } = useLinkBoard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageIcon, setNewPageIcon] = useState('📄');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim(), newPageIcon);
      setNewPageName('');
      setNewPageIcon('📄');
      setIsAddDialogOpen(false);
    }
  };

  const handleRenamePage = () => {
    if (editingPageId && newPageName.trim()) {
      renamePage(editingPageId, newPageName.trim());
      setNewPageName('');
      setEditingPageId(null);
      setIsRenameDialogOpen(false);
    }
  };

  const handleDeletePage = () => {
    if (deletePageId) {
      deletePage(deletePageId);
      setDeletePageId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openRenameDialog = (pageId: string, currentName: string) => {
    setEditingPageId(pageId);
    setNewPageName(currentName);
    setIsRenameDialogOpen(true);
  };

  const openDeleteDialog = (pageId: string) => {
    setDeletePageId(pageId);
    setIsDeleteDialogOpen(true);
  };

  const commonIcons = ['🏠', '💼', '📱', '🎮', '📚', '🎨', '⚙️', '📄', '🌐', '💡'];

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-1 flex-shrink-0">
          {pages.map((page) => (
            <div key={page.id} className="group relative">
              <button
                onClick={() => setCurrentPage(page.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                  currentPageId === page.id
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{page.icon}</span>
                <span className="text-sm">{page.name}</span>
                <span className="text-xs text-gray-400 ml-1">({page.links.length})</span>
              </button>
              {currentPageId === page.id && (
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRenameDialog(page.id, page.name);
                    }}
                    className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Rename page"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(page.id);
                      }}
                      className="p-1 rounded bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
                      title="Delete page"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          variant="ghost"
          size="sm"
          className="flex-shrink-0"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          New Page
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new workspace page to organize your links.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Name</label>
              <Input
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="e.g., Work, Personal, Projects"
                onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon (optional)</label>
              <div className="flex gap-2 flex-wrap">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewPageIcon(icon)}
                    className={`text-2xl p-2 rounded border-2 transition-colors ${
                      newPageIcon === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPage} disabled={!newPageName.trim()}>
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Page</DialogTitle>
            <DialogDescription>
              Enter a new name for this page.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Page name"
              onKeyDown={(e) => e.key === 'Enter' && handleRenamePage()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenamePage} disabled={!newPageName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this page? All links on this page will be permanently removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
