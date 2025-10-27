import { create } from 'zustand';
import { LinkCard, BoardSettings, AppState, Page, Category } from '@/lib/validators';
import { getDefaultLayout, getFaviconUrl } from '@/lib/defaultPages';
import { Layout } from 'react-grid-layout';
import { SystemWidget, WidgetType } from '@/lib/systemInfo';
import { DashboardPersistence } from '@/lib/persistence';

interface LinkBoardStore extends AppState {
  isArrangeMode: boolean;
  showWelcome: boolean;
  lastSaved: string | null;
  widgets: SystemWidget[];

  setCurrentPage: (pageId: string) => void;
  addPage: (name: string, icon?: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;

  addCategory: (name: string, color?: string, icon?: string) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  toggleCategoryCollapse: (categoryId: string) => void;

  setLinks: (links: LinkCard[]) => void;
  addLink: (link: Omit<LinkCard, 'id' | 'i' | 'x' | 'y' | 'w' | 'h'>) => void;
  updateLink: (id: string, updates: Partial<LinkCard>) => void;
  deleteLink: (id: string) => void;
  duplicateLink: (id: string) => void;
  toggleLinkVisibility: (id: string) => void;
  toggleLinkPreview: (id: string, enabled: boolean) => void;

  updateLayout: (layout: Layout[]) => void;

  updateSettings: (settings: Partial<BoardSettings>) => void;
  setDefaultPages: () => void;

  setArrangeMode: (mode: boolean) => void;
  dismissWelcome: () => void;

  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidgetLayout: (layout: Layout[]) => void;

  importState: (state: AppState) => void;
  exportState: () => AppState;

  markSaved: () => void;
  hydrateFromStorage: (state: Partial<AppState>) => void;
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;

  getCurrentPage: () => Page | undefined;
  getCurrentLinks: () => LinkCard[];
}

const dashboardDB = typeof window !== 'undefined' ? new DashboardPersistence() : null;

const defaultSettings: BoardSettings = {
  title: 'My LinkBoard',
  subtitle: 'Quick access to your favorite sites',
  theme: 'system',
  density: 'comfy',
  cardRadius: 'lg',
  showHeader: true,
  gridCols: 12,
};

const createDefaultPage = (): Page => ({
  id: `page-${Date.now()}`,
  name: 'Home',
  icon: '🏠',
  links: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const initialState: AppState = {
  pages: [createDefaultPage()],
  currentPageId: '',
  categories: [],
  layoutVersion: 1,
  settings: defaultSettings,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

initialState.currentPageId = initialState.pages[0].id;

export const useLinkBoard = create<LinkBoardStore>((set, get) => ({
  ...initialState,
  isArrangeMode: false,
  showWelcome: true,
  lastSaved: null,
  widgets: [],

  getCurrentPage: () => {
    const { pages, currentPageId } = get();
    return pages.find((p) => p.id === currentPageId);
  },

  getCurrentLinks: () => {
    const currentPage = get().getCurrentPage();
    return currentPage?.links || [];
  },

  setCurrentPage: (pageId) => {
    const { pages } = get();
    const pageExists = pages.some((p) => p.id === pageId);
    if (pageExists) {
      set({
        currentPageId: pageId,
        updatedAt: new Date().toISOString(),
      });
    }
  },

  addPage: (name, icon) => {
    const { pages } = get();
    const newPage: Page = {
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      icon: icon || '📄',
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({
      pages: [...pages, newPage],
      currentPageId: newPage.id,
      updatedAt: new Date().toISOString(),
    });
  },

  updatePage: (pageId, updates) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? { ...page, ...updates, updatedAt: new Date().toISOString() }
          : page
      ),
      updatedAt: new Date().toISOString(),
    })),

  deletePage: (pageId) => {
    const { pages, currentPageId } = get();
    if (pages.length <= 1) return;

    const updatedPages = pages.filter((page) => page.id !== pageId);
    const newCurrentPageId = currentPageId === pageId ? updatedPages[0].id : currentPageId;

    set({
      pages: updatedPages,
      currentPageId: newCurrentPageId,
      updatedAt: new Date().toISOString(),
    });
  },

  renamePage: (pageId, name) =>
    get().updatePage(pageId, { name }),

  addCategory: (name, color, icon) => {
    const { categories = [] } = get();
    const newCategory: Category = {
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color: color || '#3B82F6',
      icon: icon || '📁',
      collapsed: false,
    };

    set({
      categories: [...categories, newCategory],
      updatedAt: new Date().toISOString(),
    });
  },

  updateCategory: (categoryId, updates) =>
    set((state) => ({
      categories: (state.categories || []).map((cat) =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ),
      updatedAt: new Date().toISOString(),
    })),

  deleteCategory: (categoryId) => {
    const { categories = [], pages } = get();
    const updatedPages = pages.map((page) => ({
      ...page,
      links: page.links.map((link) =>
        link.category === categoryId ? { ...link, category: undefined } : link
      ),
    }));

    set({
      categories: categories.filter((cat) => cat.id !== categoryId),
      pages: updatedPages,
      updatedAt: new Date().toISOString(),
    });
  },

  toggleCategoryCollapse: (categoryId) =>
    set((state) => ({
      categories: (state.categories || []).map((cat) =>
        cat.id === categoryId ? { ...cat, collapsed: !cat.collapsed } : cat
      ),
      updatedAt: new Date().toISOString(),
    })),

  setLinks: (links) => {
    const { pages, currentPageId } = get();
    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? { ...page, links, updatedAt: new Date().toISOString() }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  addLink: (link) => {
    const { pages, currentPageId, settings } = get();
    const currentPage = pages.find((p) => p.id === currentPageId);
    if (!currentPage) return;

    const id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const links = currentPage.links;

    const maxY = links.length > 0 ? Math.max(...links.map((l) => l.y + l.h)) : 0;
    const cardSize = settings.density === 'compact' ? 2 : settings.density === 'comfy' ? 3 : 4;

    const logo = link.logo || getFaviconUrl(link.url);

    const newLink: LinkCard = {
      ...link,
      logo,
      id,
      i: id,
      x: 0,
      y: maxY,
      w: cardSize,
      h: cardSize,
      previewMode: link.previewMode !== undefined ? link.previewMode : true,
      refreshInterval: link.refreshInterval || 28800000,
    };

    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? { ...page, links: [...page.links, newLink], updatedAt: new Date().toISOString() }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  updateLink: (id, updates) => {
    const { pages, currentPageId } = get();
    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? {
              ...page,
              links: page.links.map((link) =>
                link.id === id ? { ...link, ...updates } : link
              ),
              updatedAt: new Date().toISOString(),
            }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  deleteLink: (id) => {
    const { pages, currentPageId } = get();
    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? {
              ...page,
              links: page.links.filter((link) => link.id !== id),
              updatedAt: new Date().toISOString(),
            }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  duplicateLink: (id) => {
    const { pages, currentPageId } = get();
    const currentPage = pages.find((p) => p.id === currentPageId);
    if (!currentPage) return;

    const linkToDuplicate = currentPage.links.find((link) => link.id === id);
    if (!linkToDuplicate) return;

    const newId = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxY = Math.max(...currentPage.links.map((l) => l.y + l.h));

    const duplicatedLink: LinkCard = {
      ...linkToDuplicate,
      id: newId,
      i: newId,
      name: `${linkToDuplicate.name} (Copy)`,
      x: 0,
      y: maxY,
    };

    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? { ...page, links: [...page.links, duplicatedLink], updatedAt: new Date().toISOString() }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  toggleLinkVisibility: (id) => {
    const { pages, currentPageId } = get();
    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? {
              ...page,
              links: page.links.map((link) =>
                link.id === id ? { ...link, hidden: !link.hidden } : link
              ),
              updatedAt: new Date().toISOString(),
            }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  toggleLinkPreview: (id: string, enabled: boolean) => {
    const { pages, currentPageId } = get();
    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? {
              ...page,
              links: page.links.map((link) =>
                link.id === id ? { ...link, previewMode: enabled } : link
              ),
              updatedAt: new Date().toISOString(),
            }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  updateLayout: (layout) => {
    const { pages, currentPageId } = get();
    const currentPage = pages.find((p) => p.id === currentPageId);
    if (!currentPage) return;

    const updatedLinks = currentPage.links.map((link) => {
      const layoutItem = layout.find((l) => l.i === link.i);
      if (!layoutItem) return link;

      return {
        ...link,
        x: layoutItem.x,
        y: layoutItem.y,
        w: layoutItem.w,
        h: layoutItem.h,
      };
    });

    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? { ...page, links: updatedLinks, updatedAt: new Date().toISOString() }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
      updatedAt: new Date().toISOString(),
    })),

  setDefaultPages: () => {
    const { settings, pages, currentPageId } = get();
    const defaultLinks = getDefaultLayout(settings.density);
    const currentPage = pages.find((p) => p.id === currentPageId);
    if (!currentPage) return;

    set({
      pages: pages.map((page) =>
        page.id === currentPageId
          ? { ...page, links: defaultLinks, updatedAt: new Date().toISOString() }
          : page
      ),
      updatedAt: new Date().toISOString(),
    });
  },

  setArrangeMode: (mode) => set({ isArrangeMode: mode }),

  dismissWelcome: () => set({ showWelcome: false }),

  importState: (state) =>
    set({
      ...state,
      updatedAt: new Date().toISOString(),
    }),

  exportState: () => {
    const state = get();
    return {
      pages: state.pages,
      currentPageId: state.currentPageId,
      categories: state.categories,
      layoutVersion: state.layoutVersion,
      settings: state.settings,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  },

  markSaved: () => set({ lastSaved: new Date().toISOString() }),

  addWidget: (type) => {
    const { widgets, settings } = get();

    if (widgets.some((w) => w.type === type)) {
      return;
    }

    const id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxY = widgets.length > 0 ? Math.max(...widgets.map((w) => w.y + w.h)) : 0;
    const cardSize = settings.density === 'compact' ? 2 : settings.density === 'comfy' ? 3 : 4;

    const newWidget: SystemWidget = {
      id,
      type,
      enabled: true,
      i: id,
      x: 0,
      y: maxY,
      w: cardSize,
      h: cardSize,
    };

    set({
      widgets: [...widgets, newWidget],
      updatedAt: new Date().toISOString(),
    });
  },

  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((widget) => widget.id !== id),
      updatedAt: new Date().toISOString(),
    })),

  updateWidgetLayout: (layout) => {
    const { widgets } = get();
    const updatedWidgets = widgets.map((widget) => {
      const layoutItem = layout.find((l) => l.i === widget.i);
      if (!layoutItem) return widget;

      return {
        ...widget,
        x: layoutItem.x,
        y: layoutItem.y,
        w: layoutItem.w,
        h: layoutItem.h,
      };
    });

    set({
      widgets: updatedWidgets,
      updatedAt: new Date().toISOString(),
    });
  },

  hydrateFromStorage: (state) => {
    if (state.pages && state.pages.length > 0) {
      const pagesWithPreview = state.pages.map((page) => ({
        ...page,
        links: page.links.map((link) => ({
          ...link,
          previewMode: link.previewMode !== undefined ? link.previewMode : true,
          refreshInterval: link.refreshInterval || 28800000,
        })),
      }));

      set({
        ...state,
        pages: pagesWithPreview,
        showWelcome: false,
      });
    } else if ((state as any).links) {
      const oldLinks = (state as any).links;
      const defaultPage: Page = {
        id: `page-${Date.now()}`,
        name: 'Home',
        icon: '🏠',
        links: oldLinks.map((link: any) => ({
          ...link,
          previewMode: link.previewMode !== undefined ? link.previewMode : true,
          refreshInterval: link.refreshInterval || 28800000,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set({
        pages: [defaultPage],
        currentPageId: defaultPage.id,
        categories: state.categories || [],
        settings: state.settings || defaultSettings,
        layoutVersion: state.layoutVersion || 1,
        createdAt: state.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        showWelcome: false,
      });
    }
  },

  saveToDatabase: async () => {
    if (!dashboardDB) return;
    const state = get().exportState();
    await dashboardDB.save(state);
  },

  loadFromDatabase: async () => {
    if (!dashboardDB) return;

    const state = await dashboardDB.load();
    if (state) {
      get().hydrateFromStorage(state);
      console.log('✓ Dashboard loaded from database');
    } else {
      console.log('No database state found, checking localStorage...');
      // Try to migrate from localStorage
      const migrated = await dashboardDB.migrateFromLocalStorage();
      if (migrated) {
        // Reload after migration
        const newState = await dashboardDB.load();
        if (newState) {
          get().hydrateFromStorage(newState);
        }
      }
    }
  },
}));
