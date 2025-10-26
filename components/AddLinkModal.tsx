'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addLinkFormSchema, type AddLinkForm } from '@/lib/validators';
import { useLinkBoard } from '@/store/useLinkBoard';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  editLink?: { id: string; name: string; customName?: string; url: string; description?: string; color?: string };
}

export function AddLinkModal({ isOpen, onClose, editLink }: AddLinkModalProps) {
  const { addLink, updateLink } = useLinkBoard();
  const [formData, setFormData] = useState<AddLinkForm>({
    name: editLink?.name || '',
    url: editLink?.url || '',
    description: editLink?.description || '',
    color: editLink?.color || '',
  });
  const [customName, setCustomName] = useState<string>(editLink?.customName || '');
  const [errors, setErrors] = useState<Partial<Record<keyof AddLinkForm, string>>>({});

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
