'use client';

import { useState } from 'react';
import { useLinkBoard } from '@/store/useLinkBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export function CategoryManager() {
  const { categories = [], addCategory, updateCategory, deleteCategory, toggleCategoryCollapse } = useLinkBoard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const categoryColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  const categoryIcons = ['📁', '🏷️', '⭐', '💼', '🎯', '📚', '🎨', '⚡'];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor, newCategoryIcon);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = () => {
    if (editingCategoryId && newCategoryName.trim()) {
      updateCategory(editingCategoryId, {
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: newCategoryIcon,
      });
      resetForm();
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Delete this category? Links will not be deleted, just uncategorized.')) {
      deleteCategory(categoryId);
    }
  };

  const openEditDialog = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setEditingCategoryId(categoryId);
      setNewCategoryName(category.name);
      setNewCategoryColor(category.color || '#3B82F6');
      setNewCategoryIcon(category.icon || '📁');
      setIsEditDialogOpen(true);
    }
  };

  const resetForm = () => {
    setNewCategoryName('');
    setNewCategoryColor('#3B82F6');
    setNewCategoryIcon('📁');
    setEditingCategoryId(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Categories</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-1">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <button
              onClick={() => toggleCategoryCollapse(category.id)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              {category.collapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-lg">{category.icon}</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
            <div className="hidden group-hover:flex gap-1">
              <button
                onClick={() => openEditDialog(category.id)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Edit category"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                title="Delete category"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your links.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Work, Social Media, Tools"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {categoryIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewCategoryIcon(icon)}
                    className={`text-2xl p-2 rounded border-2 transition-colors ${
                      newCategoryIcon === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {categoryColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-10 h-10 rounded border-2 transition-all ${
                      newCategoryColor === color
                        ? 'border-gray-900 dark:border-gray-100 scale-110'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category name, icon, or color.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditCategory()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {categoryIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewCategoryIcon(icon)}
                    className={`text-2xl p-2 rounded border-2 ${
                      newCategoryIcon === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {categoryColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-10 h-10 rounded border-2 ${
                      newCategoryColor === color
                        ? 'border-gray-900 dark:border-gray-100 scale-110'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={!newCategoryName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
