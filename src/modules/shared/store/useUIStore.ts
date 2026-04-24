import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  notifications: any[];
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: any) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activeModal: null,
  notifications: [],

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebar: (open) => set({ isSidebarOpen: open }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  addNotification: (n) => set((state) => ({ 
    notifications: [...state.notifications, { ...n, id: Date.now() }] 
  })),
}));
