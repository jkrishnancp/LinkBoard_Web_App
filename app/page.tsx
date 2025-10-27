'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useLinkBoard } from '@/store/useLinkBoard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Header } from '@/components/Header';
import { LinkCard } from '@/components/LinkCard';
import { AddLinkModal } from '@/components/AddLinkModal';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { ResizeModal } from '@/components/ResizeModal';
import { FloatingToolbar } from '@/components/FloatingToolbar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { PageTabs } from '@/components/PageTabs';
import { SearchBar, SearchFilters } from '@/components/SearchBar';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Home() {
  const {
    getCurrentLinks,
    getCurrentPage,
    widgets,
    settings,
    categories,
    isArrangeMode,
    setArrangeMode,
    showWelcome,
    updateLayout,
    updateWidgetLayout,
    updateLink,
    deleteLink,
    duplicateLink,
    toggleLinkVisibility,
    toggleLinkPreview,
    removeWidget,
    dismissWelcome,
    hydrateFromStorage,
    markSaved,
    exportState,
    currentPageId,
    pages,
    setCurrentPage,
  } = useLinkBoard();

  const links = getCurrentLinks();

  const [storageState, setStorageState] = useLocalStorage('linkboard-state', exportState(), 250);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    categories: [],
    tags: [],
    showHidden: false,
    previewOnly: false,
  });
  const [editingLink, setEditingLink] = useState<{
    id: string;
    name: string;
    customName?: string;
    url: string;
    description?: string;
    color?: string;
    category?: string;
    refreshInterval?: number;
  } | undefined>();
  const [resizingItem, setResizingItem] = useState<{
    id: string;
    type: 'link' | 'widget';
    name: string;
    w: number;
    h: number;
  } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'hide' | 'remove-widget';
    id: string;
    name: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const prevLinksLengthRef = useRef(links.length);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.warn('Service Worker registration failed (this is expected in development):', error.message);
        });
    }
  }, []);

  const handleRefreshPreviews = async () => {
    console.log('[Auto-Refresh] Triggered at:', new Date().toISOString());
    setRefreshKey((prev) => prev + 1);
  };

  const { triggerImmediateRefresh, lastRefresh } = useAutoRefresh({
    onRefresh: handleRefreshPreviews,
    enabled: true,
    refreshInterval: 8 * 60 * 60 * 1000,
  });

  const keyboardShortcuts = useMemo(
    () => [
      {
        key: 'n',
        ctrl: true,
        description: 'Add new link',
        action: () => setIsAddModalOpen(true),
      },
      {
        key: 'k',
        ctrl: true,
        description: 'Open search',
        action: () => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(),
      },
      {
        key: ',',
        ctrl: true,
        description: 'Open settings',
        action: () => setIsSettingsOpen(true),
      },
      {
        key: 'a',
        ctrl: true,
        shift: true,
        description: 'Toggle arrange mode',
        action: () => setArrangeMode(!isArrangeMode),
      },
      {
        key: 'r',
        ctrl: true,
        description: 'Refresh all previews',
        action: () => handleRefreshPreviews(),
      },
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        action: () => setIsShortcutsHelpOpen(true),
      },
      {
        key: 'Escape',
        description: 'Close dialogs',
        action: () => {
          setIsAddModalOpen(false);
          setIsSettingsOpen(false);
          setIsShortcutsHelpOpen(false);
        },
      },
      ...pages.map((page, index) => ({
        key: (index + 1).toString(),
        ctrl: true,
        description: `Switch to page: ${page.name}`,
        action: () => setCurrentPage(page.id),
      })),
    ],
    [isArrangeMode, setArrangeMode, pages, setCurrentPage]
  );

  useKeyboardShortcuts(keyboardShortcuts, !isAddModalOpen && !isSettingsOpen);

  useEffect(() => {
    setMounted(true);
    if (storageState) {
      hydrateFromStorage(storageState);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentState = exportState();
    setStorageState(currentState);
    markSaved();
  }, [pages, widgets, settings, mounted, currentPageId, exportState, setStorageState, markSaved]);

  useEffect(() => {
    if (mounted && links.length > prevLinksLengthRef.current) {
      console.log('[Auto-Refresh] New link added, triggering immediate refresh');
      triggerImmediateRefresh();
    }
    prevLinksLengthRef.current = links.length;
  }, [links.length, mounted, triggerImmediateRefresh]);

  const handleLayoutChange = (layout: Layout[]) => {
    if (isArrangeMode) {
      const linkLayouts = layout.filter((l) => l.i.startsWith('link-'));
      const widgetLayouts = layout.filter((l) => l.i.startsWith('widget-'));

      updateLayout(linkLayouts);
      updateWidgetLayout(widgetLayouts);
    }
  };

  const handleEdit = (link: typeof links[0]) => {
    setEditingLink({
      id: link.id,
      name: link.name,
      customName: link.customName,
      url: link.url,
      description: link.description,
      color: link.color,
      category: link.category,
      refreshInterval: link.refreshInterval,
    });
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingLink(undefined);
  };

  const handleResizeLink = (link: typeof links[0]) => {
    setResizingItem({
      id: link.id,
      type: 'link',
      name: link.name,
      w: link.w,
      h: link.h,
    });
  };

  const handleResizeWidget = (widget: typeof widgets[0]) => {
    const widgetNames: Record<string, string> = {
      'local-ip': 'Local IP',
      'public-ip': 'Public IP',
      datetime: 'Date & Time',
      uptime: 'Uptime',
      battery: 'Battery',
      network: 'Network',
      performance: 'Memory Usage',
    };

    setResizingItem({
      id: widget.id,
      type: 'widget',
      name: widgetNames[widget.type] || widget.type,
      w: widget.w,
      h: widget.h,
    });
  };

  const handleApplyResize = (width: number, height: number) => {
    if (!resizingItem) return;

    if (resizingItem.type === 'link') {
      updateLink(resizingItem.id, { w: width, h: height });
    } else {
      const widget = widgets.find((w) => w.id === resizingItem.id);
      if (widget) {
        const updatedLayout = [
          {
            i: widget.i,
            x: widget.x,
            y: widget.y,
            w: width,
            h: height,
          },
        ];
        updateWidgetLayout(updatedLayout);
      }
    }

    setResizingItem(null);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case 'delete':
        deleteLink(confirmAction.id);
        break;
      case 'hide':
        toggleLinkVisibility(confirmAction.id);
        break;
      case 'remove-widget':
        removeWidget(confirmAction.id);
        break;
    }

    setConfirmAction(null);
  };

  const handleDeleteClick = (link: typeof links[0]) => {
    setConfirmAction({
      type: 'delete',
      id: link.id,
      name: link.customName || link.name,
    });
  };

  const handleHideClick = (link: typeof links[0]) => {
    setConfirmAction({
      type: 'hide',
      id: link.id,
      name: link.customName || link.name,
    });
  };

  const handleRemoveWidgetClick = (widget: typeof widgets[0]) => {
    const widgetNames: Record<string, string> = {
      'local-ip': 'Local IP',
      'public-ip': 'Public IP',
      datetime: 'Date & Time',
      uptime: 'Uptime',
      battery: 'Battery',
      network: 'Network',
      performance: 'Memory Usage',
    };

    setConfirmAction({
      type: 'remove-widget',
      id: widget.id,
      name: widgetNames[widget.type] || widget.type,
    });
  };

  const filteredLinks = useMemo(() => {
    let result = links;

    if (!searchFilters.showHidden) {
      result = result.filter((link) => !link.hidden);
    }

    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      result = result.filter(
        (link) =>
          link.name.toLowerCase().includes(term) ||
          link.url.toLowerCase().includes(term) ||
          link.description?.toLowerCase().includes(term) ||
          link.customName?.toLowerCase().includes(term)
      );
    }

    if (searchFilters.categories.length > 0) {
      result = result.filter((link) => link.category && searchFilters.categories.includes(link.category));
    }

    if (searchFilters.tags.length > 0) {
      result = result.filter(
        (link) => link.tags && link.tags.some((tag) => searchFilters.tags.includes(tag))
      );
    }

    if (searchFilters.previewOnly) {
      result = result.filter((link) => link.previewMode);
    }

    return result;
  }, [links, searchFilters]);

  const allItems = [...filteredLinks, ...widgets];

  const availableCategories = useMemo(() => {
    return categories?.map((cat) => cat.name) || [];
  }, [categories]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    links.forEach((link) => {
      link.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [links]);

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <PageTabs />

      {showWelcome && links.length === 0 && widgets.length === 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Welcome to LinkBoard!
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Get started by adding your first link or widget. Use Ctrl+N to add a link, or press ? to see all keyboard shortcuts.
            </p>
            <button onClick={dismissWelcome} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <SearchBar
            onSearch={setSearchFilters}
            availableCategories={availableCategories}
            availableTags={availableTags}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 pb-8">
        {allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {searchFilters.searchTerm
                ? 'No links match your search'
                : 'No items yet. Add links or widgets to get started.'}
            </p>
            {searchFilters.searchTerm && (
              <button
                onClick={() => setSearchFilters({ ...searchFilters, searchTerm: '' })}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: allItems }}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={100}
            isDraggable={isArrangeMode}
            isResizable={isArrangeMode}
            onLayoutChange={handleLayoutChange}
            compactType="vertical"
            preventCollision={false}
          >
            {filteredLinks.map((link) => (
              <div key={link.i} data-grid={{ x: link.x, y: link.y, w: link.w, h: link.h, i: link.i }}>
                <LinkCard
                  link={link}
                  density={settings.density}
                  cardRadius={settings.cardRadius}
                  onEdit={() => handleEdit(link)}
                  onDelete={() => handleDeleteClick(link)}
                  onDuplicate={() => duplicateLink(link.id)}
                  onToggleVisibility={() => handleHideClick(link)}
                  onResize={() => handleResizeLink(link)}
                  onTogglePreview={toggleLinkPreview}
                  isArrangeMode={isArrangeMode}
                  isPreviewMode={link.previewMode}
                  refreshKey={refreshKey}
                />
              </div>
            ))}
            {widgets.map((widget) => (
              <div key={widget.i} data-grid={{ x: widget.x, y: widget.y, w: widget.w, h: widget.h, i: widget.i }}>
                <WidgetCard
                  type={widget.type}
                  onRemove={() => handleRemoveWidgetClick(widget)}
                  onResize={() => handleResizeWidget(widget)}
                  isArrangeMode={isArrangeMode}
                  cardRadius={settings.cardRadius}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </main>

      <FloatingToolbar
        isArrangeMode={isArrangeMode}
        onToggleArrange={() => setArrangeMode(!isArrangeMode)}
        onAddLink={() => setIsAddModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <AddLinkModal isOpen={isAddModalOpen} onClose={handleCloseModal} editLink={editingLink} />

      {resizingItem && (
        <ResizeModal
          isOpen={true}
          onClose={() => setResizingItem(null)}
          onApply={handleApplyResize}
          currentWidth={resizingItem.w}
          currentHeight={resizingItem.h}
          itemName={resizingItem.name}
          containerWidth={1200}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          title={
            confirmAction.type === 'delete'
              ? 'Delete Link?'
              : confirmAction.type === 'hide'
              ? 'Hide Link?'
              : 'Remove Widget?'
          }
          description={
            confirmAction.type === 'delete'
              ? `Are you sure you want to permanently delete "${confirmAction.name}"? This action cannot be undone.`
              : confirmAction.type === 'hide'
              ? `Are you sure you want to hide "${confirmAction.name}"? You can restore it later from the sidebar menu.`
              : `Are you sure you want to remove the "${confirmAction.name}" widget from your dashboard?`
          }
          confirmText={
            confirmAction.type === 'delete'
              ? 'Delete Permanently'
              : confirmAction.type === 'hide'
              ? 'Hide Temporarily'
              : 'Remove Widget'
          }
          confirmVariant={confirmAction.type === 'delete' ? 'destructive' : 'default'}
        />
      )}

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <KeyboardShortcutsHelp
        shortcuts={keyboardShortcuts}
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
    </div>
  );
}
