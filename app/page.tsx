'use client';

import { useEffect, useState } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useLinkBoard } from '@/store/useLinkBoard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Header } from '@/components/Header';
import { LinkCard } from '@/components/LinkCard';
import { AddLinkModal } from '@/components/AddLinkModal';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { ResizeModal } from '@/components/ResizeModal';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Home() {
  const {
    links,
    widgets,
    settings,
    isArrangeMode,
    showWelcome,
    updateLayout,
    updateWidgetLayout,
    updateLink,
    deleteLink,
    duplicateLink,
    toggleLinkVisibility,
    removeWidget,
    dismissWelcome,
    hydrateFromStorage,
    markSaved,
    exportState,
  } = useLinkBoard();

  const [storageState, setStorageState] = useLocalStorage('linkboard-state', exportState(), 250);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<{ id: string; name: string; customName?: string; url: string; description?: string; color?: string } | undefined>();
  const [resizingItem, setResizingItem] = useState<{ id: string; type: 'link' | 'widget'; name: string; w: number; h: number } | null>(null);
  const [mounted, setMounted] = useState(false);

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
                  onDelete={() => deleteLink(link.id)}
                  onDuplicate={() => duplicateLink(link.id)}
                  onToggleVisibility={() => toggleLinkVisibility(link.id)}
                  onResize={() => handleResizeLink(link)}
                  isArrangeMode={isArrangeMode}
                />
              </div>
            ))}
            {widgets.map((widget) => (
              <div key={widget.i} data-grid={{ x: widget.x, y: widget.y, w: widget.w, h: widget.h, i: widget.i }}>
                <WidgetCard
                  type={widget.type}
                  onRemove={() => removeWidget(widget.id)}
                  onResize={() => handleResizeWidget(widget)}
                  isArrangeMode={isArrangeMode}
                  cardRadius={settings.cardRadius}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </main>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
        title="Add Link"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

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
    </div>
  );
}
