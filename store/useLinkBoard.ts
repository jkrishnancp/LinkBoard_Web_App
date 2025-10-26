import { create } from 'zustand';
import { LinkCard, BoardSettings, AppState } from '@/lib/validators';
import { getDefaultLayout, getFaviconUrl } from '@/lib/defaultPages';
import { Layout } from 'react-grid-layout';
import { SystemWidget, WidgetType } from '@/lib/systemInfo';

interface LinkBoardStore extends AppState {
  isArrangeMode: boolean;
  showWelcome: boolean;
  lastSaved: string | null;
  widgets: SystemWidget[];

  setLinks: (links: LinkCard[]) => void;
  addLink: (link: Omit<LinkCard, 'id' | 'i' | 'x' | 'y' | 'w' | 'h'>) => void;
  updateLink: (id: string, updates: Partial<LinkCard>) => void;
  deleteLink: (id: string) => void;
  duplicateLink: (id: string) => void;
  toggleLinkVisibility: (id: string) => void;

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
}

const defaultSettings: BoardSettings = {
  title: 'My LinkBoard',
  subtitle: 'Quick access to your favorite sites',
  theme: 'system',
  density: 'comfy',
  cardRadius: 'lg',
  showHeader: true,
  gridCols: 12,
};

const initialState: AppState = {
  links: [],
  layoutVersion: 1,
  settings: defaultSettings,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useLinkBoard = create<LinkBoardStore>((set, get) => ({
  ...initialState,
  isArrangeMode: false,
  showWelcome: true,
  lastSaved: null,
  widgets: [],

  setLinks: (links) =>
    set({
      links,
      updatedAt: new Date().toISOString(),
    }),

  addLink: (link) => {
    const { links, settings } = get();
    const id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
    };

    set({
      links: [...links, newLink],
      updatedAt: new Date().toISOString(),
    });
  },

  updateLink: (id, updates) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      ),
      updatedAt: new Date().toISOString(),
    })),

  deleteLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
      updatedAt: new Date().toISOString(),
    })),

  duplicateLink: (id) => {
    const { links } = get();
    const linkToDuplicate = links.find((link) => link.id === id);

    if (!linkToDuplicate) return;

    const newId = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxY = Math.max(...links.map((l) => l.y + l.h));

    const duplicatedLink: LinkCard = {
      ...linkToDuplicate,
      id: newId,
      i: newId,
      name: `${linkToDuplicate.name} (Copy)`,
      x: 0,
      y: maxY,
    };

    set({
      links: [...links, duplicatedLink],
      updatedAt: new Date().toISOString(),
    });
  },

  toggleLinkVisibility: (id) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, hidden: !link.hidden } : link
      ),
      updatedAt: new Date().toISOString(),
    })),

  updateLayout: (layout) => {
    const { links } = get();
    const updatedLinks = links.map((link) => {
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
      links: updatedLinks,
      updatedAt: new Date().toISOString(),
    });
  },

  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
      updatedAt: new Date().toISOString(),
    })),

  setDefaultPages: () => {
    const { settings } = get();
    const defaultLinks = getDefaultLayout(settings.density);

    set({
      links: defaultLinks,
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
      links: state.links,
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
    if (state.links && state.links.length > 0) {
      set({
        ...state,
        showWelcome: false,
      });
    }
  },
}));
