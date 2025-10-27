'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bars3Icon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  CpuChipIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  Squares2X2Icon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useLinkBoard } from '@/store/useLinkBoard';
import { SettingsDrawer } from './SettingsDrawer';
import { SystemWidgetsModal } from './SystemWidgetsModal';
import { BulkImport } from './BulkImport';
import { CategoryManager } from './CategoryManager';
import { WidgetType } from '@/lib/systemInfo';

interface SidebarMenuProps {
  onImport: () => void;
  onExport: () => void;
}

export function SidebarMenu({ onImport, onExport }: SidebarMenuProps) {
  const { settings, updateSettings, isArrangeMode, setArrangeMode, widgets, addWidget } = useLinkBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWidgetsModalOpen, setIsWidgetsModalOpen] = useState(false);

  const toggleTheme = () => {
    const themes: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    updateSettings({ theme: nextTheme });
  };

  const getThemeIcon = () => {
    if (settings.theme === 'dark') return <MoonIcon className="w-5 h-5" />;
    if (settings.theme === 'light') return <SunIcon className="w-5 h-5" />;
    return <SunIcon className="w-5 h-5" />;
  };

  const getThemeLabel = () => {
    return settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Bars3Icon className="w-5 h-5" />
            <span className="hidden sm:inline">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-2">
            <Button
              onClick={() => {
                setArrangeMode(!isArrangeMode);
                handleMenuItemClick();
              }}
              variant={isArrangeMode ? 'default' : 'outline'}
              className="w-full justify-start gap-3"
            >
              {isArrangeMode ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  <span>Done Arranging</span>
                </>
              ) : (
                <>
                  <Squares2X2Icon className="w-5 h-5" />
                  <span>Arrange Mode</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setIsWidgetsModalOpen(true);
                handleMenuItemClick();
              }}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <CpuChipIcon className="w-5 h-5" />
              <span>Add Widgets</span>
            </Button>

            <div className="border-t my-4"></div>

            <Button
              onClick={() => {
                onExport();
                handleMenuItemClick();
              }}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Export Data</span>
            </Button>

            <Button
              onClick={() => {
                onImport();
                handleMenuItemClick();
              }}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span>Import Data</span>
            </Button>

            <div className="border-t my-4"></div>

            <div className="px-2 space-y-4">
              <CategoryManager />
              <BulkImport />
            </div>

            <div className="border-t my-4"></div>

            <Button
              onClick={() => {
                toggleTheme();
              }}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              {getThemeIcon()}
              <span>Theme: {getThemeLabel()}</span>
            </Button>

            <Button
              onClick={() => {
                setIsSettingsOpen(true);
                handleMenuItemClick();
              }}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span>Settings</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SystemWidgetsModal
        isOpen={isWidgetsModalOpen}
        onClose={() => setIsWidgetsModalOpen(false)}
        onAddWidget={(type: WidgetType) => {
          addWidget(type);
          setIsWidgetsModalOpen(false);
        }}
        enabledWidgets={widgets.map(w => w.type)}
      />
    </>
  );
}
