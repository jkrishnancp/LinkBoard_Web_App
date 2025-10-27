'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addLinkFormSchema, type AddLinkForm } from '@/lib/validators';
import { useLinkBoard } from '@/store/useLinkBoard';
import { RefreshIntervalSelector } from './RefreshIntervalSelector';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  editLink?: { id: string; name: string; customName?: string; url: string; description?: string; color?: string; category?: string; refreshInterval?: number };
}

export function AddLinkModal({ isOpen, onClose, editLink }: AddLinkModalProps) {
  const { addLink, updateLink, categories = [] } = useLinkBoard();
  const [formData, setFormData] = useState<AddLinkForm>({
    name: editLink?.name || '',
    url: editLink?.url || '',
    description: editLink?.description || '',
    color: editLink?.color || '',
  });
  const [customName, setCustomName] = useState<string>(editLink?.customName || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(editLink?.category || '');
  const [refreshInterval, setRefreshInterval] = useState<number>(editLink?.refreshInterval || 28800000);
  const [errors, setErrors] = useState<Partial<Record<keyof AddLinkForm, string>>>({});

  useEffect(() => {
    if (editLink) {
      setFormData({
        name: editLink.name,
        url: editLink.url,
        description: editLink.description || '',
        color: editLink.color || '',
      });
      setCustomName(editLink.customName || '');
      setSelectedCategory(editLink.category || '');
      setRefreshInterval(editLink.refreshInterval || 28800000);
    }
  }, [editLink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = addLinkFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddLinkForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof AddLinkForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const dataWithCustomName = {
      ...result.data,
      customName: customName.trim() || undefined,
      category: selectedCategory || undefined,
      refreshInterval,
    };

    if (editLink) {
      updateLink(editLink.id, dataWithCustomName);
    } else {
      addLink(dataWithCustomName);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', url: '', description: '', color: '' });
    setCustomName('');
    setSelectedCategory('');
    setRefreshInterval(28800000);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Google"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customName">Custom Display Name (Optional)</Label>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="My Custom Name"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Leave empty to use the default name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://www.google.com"
              className={errors.url ? 'border-red-500' : ''}
            />
            {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this link"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Accent Color</Label>
            <Input
              id="color"
              type="color"
              value={formData.color || '#3B82F6'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <RefreshIntervalSelector
            value={refreshInterval}
            onChange={setRefreshInterval}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{editLink ? 'Update' : 'Add Link'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
