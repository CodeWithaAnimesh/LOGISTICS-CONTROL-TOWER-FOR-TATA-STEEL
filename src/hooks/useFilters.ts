import { useCallback, useRef } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { FilterState, RoadFilterState, DateRangeFilterState } from '../types';

export function useFilters() {
  const railFilters = useFilterStore((state) => state.railFilters);
  const roadFilters = useFilterStore((state) => state.roadFilters);
  const reportFilters = useFilterStore((state) => state.reportFilters);

  const setRailFilter = useFilterStore((state) => state.setRailFilter);
  const setRoadFilter = useFilterStore((state) => state.setRoadFilter);
  const setReportFilter = useFilterStore((state) => state.setReportFilter);

  const resetRailFilters = useFilterStore((state) => state.resetRailFilters);
  const resetRoadFilters = useFilterStore((state) => state.resetRoadFilters);
  const resetReportFilters = useFilterStore((state) => state.resetReportFilters);

  const debounceTimer = useRef<any | null>(null);

  // Debounced specific for string text inputs
  const debouncedSetRailFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setRailFilter(key, value);
      }, 300);
    },
    [setRailFilter]
  );

  const debouncedSetRoadFilter = useCallback(
    <K extends keyof RoadFilterState>(key: K, value: RoadFilterState[K]) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setRoadFilter(key, value);
      }, 300);
    },
    [setRoadFilter]
  );

  return {
    railFilters,
    roadFilters,
    reportFilters,
    setRailFilter,
    setRoadFilter,
    setReportFilter,
    debouncedSetRailFilter,
    debouncedSetRoadFilter,
    resetRailFilters,
    resetRoadFilters,
    resetReportFilters,
  };
}
