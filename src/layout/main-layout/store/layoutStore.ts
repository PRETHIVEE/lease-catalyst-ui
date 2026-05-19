import { create } from "zustand";

const SIDEBAR_TRANSITION_MS = 300;

type LayoutState = {
  isSidebarPinned: boolean;
  isSidebarPinClosing: boolean;
  isSidebarHovered: boolean;
  toggleSidebarPinned: () => void;
  setSidebarHovered: (hovered: boolean) => void;
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  isSidebarPinned: false,
  isSidebarPinClosing: false,
  isSidebarHovered: false,

  toggleSidebarPinned: () => {
    const { isSidebarPinned } = get();

    if (isSidebarPinned) {
      set({ isSidebarPinClosing: true, isSidebarPinned: false });
      window.setTimeout(
        () => set({ isSidebarPinClosing: false }),
        SIDEBAR_TRANSITION_MS,
      );
    } else {
      set({ isSidebarPinned: true });
    }
  },

  setSidebarHovered: (hovered) => set({ isSidebarHovered: hovered }),
}));
