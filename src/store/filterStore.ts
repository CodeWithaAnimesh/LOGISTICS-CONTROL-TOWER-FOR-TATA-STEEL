import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FilterState, RoadFilterState, DateRangeFilterState } from '../types/common.types';
import dayjs from 'dayjs';

interface FilterStore {
  railFilters: FilterState;
  roadFilters: RoadFilterState;
  reportFilters: DateRangeFilterState;

  setRailFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setRoadFilter: <K extends keyof RoadFilterState>(key: K, value: RoadFilterState[K]) => void;
  setReportFilter: <K extends keyof DateRangeFilterState>(key: K, value: DateRangeFilterState[K]) => void;
  resetRailFilters: () => void;
  resetRoadFilters: () => void;
  resetReportFilters: () => void;
}

const today = dayjs().format('YYYY-MM-DD');

const defaultRailFilters: FilterState = {
  date: today,
  plant: 'All Plants',
  destination: 'All Destinations',
  fnrNumber: '',
  rrNumber: '',
  status: 'All Statuses',
  delay: 'All Delays',
  gpsStatus: 'All GPS Statuses',
};

const defaultRoadFilters: RoadFilterState = {
  date: today,
  location: 'All Locations',
  destination: 'All Destinations',
  vehicleNumber: '',
  transporter: 'All Transporters',
  status: 'All Statuses',
  delay: 'All Delays',
  gpsStatus: 'All GPS Statuses',
};

const defaultReportFilters: DateRangeFilterState = {
  startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  endDate: today,
  transportMode: 'rail',
  operationalSegment: 'transit',
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      railFilters: { ...defaultRailFilters },
      roadFilters: { ...defaultRoadFilters },
      reportFilters: { ...defaultReportFilters },

      setRailFilter: (key, value) =>
        set((state) => ({
          railFilters: { ...state.railFilters, [key]: value },
        })),

      setRoadFilter: (key, value) =>
        set((state) => ({
          roadFilters: { ...state.roadFilters, [key]: value },
        })),

      setReportFilter: (key, value) =>
        set((state) => ({
          reportFilters: { ...state.reportFilters, [key]: value },
        })),

      resetRailFilters: () =>
        set({ railFilters: { ...defaultRailFilters } }),

      resetRoadFilters: () =>
        set({ roadFilters: { ...defaultRoadFilters } }),

      resetReportFilters: () =>
        set({ reportFilters: { ...defaultReportFilters } }),
    }),
    {
      name: 'lct-filter-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
