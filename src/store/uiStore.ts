import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  activeAlerts: string[];
  dismissedAlerts: string[];
  currentSection: 'rail' | 'road';
  intraPlantTab: 'road' | 'rail';
  isLoading: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  dismissAlert: (id: string) => void;
  addAlert: (id: string) => void;
  setSection: (section: 'rail' | 'road') => void;
  setIntraPlantTab: (tab: 'road' | 'rail') => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  activeAlerts: [],
  dismissedAlerts: [],
  currentSection: 'rail',
  intraPlantTab: 'rail',
  isLoading: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  dismissAlert: (id) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((a) => a !== id),
      dismissedAlerts: [...state.dismissedAlerts, id],
    })),

  addAlert: (id) =>
    set((state) => {
      if (state.dismissedAlerts.includes(id)) return state;
      if (state.activeAlerts.includes(id)) return state;
      return { activeAlerts: [...state.activeAlerts, id] };
    }),

  setSection: (section) =>
    set({ currentSection: section }),

  setIntraPlantTab: (tab) =>
    set({ intraPlantTab: tab }),

  setLoading: (loading) =>
    set({ isLoading: loading }),
}));
