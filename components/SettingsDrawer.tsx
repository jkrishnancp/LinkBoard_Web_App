'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLinkBoard } from '@/store/useLinkBoard';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { settings, updateSettings, setDefaultPages } = useLinkBoard();

  const handleSetDefaults = () => {
    if (confirm('This will replace all your current links with the default pages. Continue?')) {
      setDefaultPages();
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Board Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              placeholder="My LinkBoard"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={settings.subtitle || ''}
              onChange={(e) => updateSettings({ subtitle: e.target.value })}
              placeholder="Quick access to your favorite sites"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value: 'system' | 'light' | 'dark') => updateSettings({ theme: value })}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="density">Card Density</Label>
            <Select
              value={settings.density}
              onValueChange={(value: 'compact' | 'comfy' | 'poster') => updateSettings({ density: value })}
            >
              <SelectTrigger id="density">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfy">Comfortable</SelectItem>
                <SelectItem value="poster">Poster</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Card Radius</Label>
            <Select
              value={settings.cardRadius}
              onValueChange={(value: 'sm' | 'md' | 'lg' | 'xl') => updateSettings({ cardRadius: value })}
            >
              <SelectTrigger id="radius">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-header">Show Header</Label>
            <Switch
              id="show-header"
              checked={settings.showHeader}
              onCheckedChange={(checked) => updateSettings({ showHeader: checked })}
            />
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleSetDefaults} variant="outline" className="w-full">
              Load Default Pages
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This will replace all current links with a curated set of default pages.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
