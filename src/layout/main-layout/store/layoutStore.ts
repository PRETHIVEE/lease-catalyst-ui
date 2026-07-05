import { create } from "zustand";

const SIDEBAR_TRANSITION_MS = 300;
const SIDEBAR_PINNED_STORAGE_KEY = "sidebar_pinned";

const DEFAULT_SIDEBAR_PINNED = true;

const readSidebarPinnedFromStorage = (): boolean => {
  const stored = localStorage.getItem(SIDEBAR_PINNED_STORAGE_KEY);
  if (stored === null) return DEFAULT_SIDEBAR_PINNED;
  if (stored === "false") return false;
  if (stored === "true") return true;
  return DEFAULT_SIDEBAR_PINNED;
};

type LayoutState = {
  isSidebarPinned: boolean;
  isSidebarPinClosing: boolean;
  isSidebarHovered: boolean;
  toggleSidebarPinned: () => void;
  closeSidebar: () => void;
  setSidebarHovered: (hovered: boolean) => void;
};

export const useLayoutStore = create<LayoutState>((set, get) => {
  const unpinSidebar = () => {
    localStorage.setItem(SIDEBAR_PINNED_STORAGE_KEY, "false");
    set({ isSidebarPinClosing: true, isSidebarPinned: false });
    window.setTimeout(
      () => set({ isSidebarPinClosing: false }),
      SIDEBAR_TRANSITION_MS,
    );
  };

  return {
    isSidebarPinned: readSidebarPinnedFromStorage(),
    isSidebarPinClosing: false,
    isSidebarHovered: false,

    toggleSidebarPinned: () => {
      const { isSidebarPinned } = get();

      if (isSidebarPinned) {
        unpinSidebar();
      } else {
        localStorage.setItem(SIDEBAR_PINNED_STORAGE_KEY, "true");
        set({ isSidebarPinned: true });
      }
    },

    closeSidebar: () => {
      set({ isSidebarHovered: false });
      if (get().isSidebarPinned) {
        unpinSidebar();
      }
    },

    setSidebarHovered: (hovered) => set({ isSidebarHovered: hovered }),
  };
});
