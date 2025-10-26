'use client';

import { useEffect, useState, useRef } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useLinkBoard } from '@/store/useLinkBoard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { Header } from '@/components/Header';
import { LinkCard } from '@/components/LinkCard';
import { AddLinkModal } from '@/components/AddLinkModal';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { ResizeModal } from '@/components/ResizeModal';
import { FloatingToolbar } from '@/components/FloatingToolbar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Home() {
  const {
    links,
    widgets,
    settings,
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
  } = useLinkBoard();

  const [storageState, setStorageState] = useLocalStorage('linkboard-state', exportState(), 250);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<{ id: string; name: string; customName?: string; url: string; description?: string; color?: string } | undefined>();
  const [resizingItem, setResizingItem] = useState<{ id: string; type: 'link' | 'widget'; name: string; w: number; h: number } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'hide' | 'remove-widget';
    id: string;
    name: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const prevLinksLengthRef = useRef(links.length);

  const handleRefreshPreviews = async () => {
    console.log('[Auto-Refresh] Triggered at:', new Date().toISOString());
    setRefreshKey((prev) => prev + 1);
  };

  const { triggerImmediateRefresh, lastRefresh } = useAutoRefresh({
    onRefresh: handleRefreshPreviews,
    enabled: true,
    refreshInterval: 8 * 60 * 60 * 1000,
  });

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
  }, [links, widgets, settings, mounted]);

  useEffect(() => {
    if (mounted && links.length > prevLinksLengthRef.current) {
      console.log('[Auto-Refresh] New link added, triggering immediate refresh');
      triggerImmediateRefresh();
    }
    prevLinksLengthRef.current = links.length;
  }, [links.length, mounted, triggerImmediateRefresh]);

  const handleLayoutChange = (layout: Layout[]) => {
    if (isArrangeMode) {
      const linkLayouts = layout.filter(l => l.i.startsWith('link-'));
      const widgetLayouts = layout.filter(l => l.i.startsWith('widget-'));

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
      'datetime': 'Date & Time',
      'uptime': 'Uptime',
      'battery': 'Battery',
      'network': 'Network',
      'performance': 'Memory Usage',
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
      const widget = widgets.find(w => w.id === resizingItem.id);
      if (widget) {
        const updatedLayout = [{
          i: widget.i,
          x: widget.x,
          y: widget.y,
          w: width,
          h: height,
        }];
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
      'datetime': 'Date & Time',
      'uptime': 'Uptime',
      'battery': 'Battery',
      'network': 'Network',
      'performance': 'Memory Usage',
    };

    setConfirmAction({
      type: 'remove-widget',
      id: widget.id,
      name: widget.customName || widgetNames[widget.type] || widget.type,
    });
  };

  const visibleLinks = links.filter((link) => !link.hidden);
  const allItems = [...visibleLinks, ...widgets];

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {showWelcome && links.length === 0 && widgets.length === 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Welcome to LinkBoard!
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Get started by adding your first link or widget. Use the + button for links, or the widgets icon in the header for system information.
            </p>
            <button
              onClick={dismissWelcome}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No items yet. Add links or widgets to get started.
            </p>
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
            {visibleLinks.map((link) => (
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
          confirmText={confirmAction.type === 'delete' ? 'Delete Permanently' : confirmAction.type === 'hide' ? 'Hide Temporarily' : 'Remove Widget'}
          confirmVariant={confirmAction.type === 'delete' ? 'destructive' : 'default'}
        />
      )}

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
