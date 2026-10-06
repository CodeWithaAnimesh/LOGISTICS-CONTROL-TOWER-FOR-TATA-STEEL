import { useState, useEffect, useCallback } from 'react';
import { railService } from '../services/railService';
import { useFilters } from './useFilters';
import type { FilterState } from '../types';
import type {
  RailOutboundKPIs,
  RailRake,
  RailIntraPlantKPIs,
  OperatorPerformance,
  DelayTrendData,
  SpeedViolationData,
} from '../types/rail.types';

// Generic hook factory pattern
function createFetchHook<T, P = void>(
  fetcher: (params: P) => Promise<T>,
  getParams?: () => P
) {
  return function useFetchHook(dependencies: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = getParams ? getParams() : (undefined as unknown as P);
        const result = await fetcher(params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }, dependencies);

    useEffect(() => {
      execute();
    }, [execute]);

    return { data, loading, error, refetch: execute };
  };
}

export function useRailOutboundKPIs() {
  const { railFilters } = useFilters();
  
  const [data, setData] = useState<RailOutboundKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await railService.getOutboundKPIs(railFilters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch KPIs'));
    } finally {
      setLoading(false);
    }
  }, [railFilters]); // Refetch when filters change

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRailRakeList() {
  const { railFilters } = useFilters();
  
  const [data, setData] = useState<RailRake[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await railService.getRakeList(railFilters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch rakes'));
    } finally {
      setLoading(false);
    }
  }, [railFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export const useRailIntraPlantKPIs = createFetchHook<RailIntraPlantKPIs>(railService.getIntraPlantKPIs);
export const useOperatorPerformance = createFetchHook<OperatorPerformance[]>(railService.getOperatorPerformance);
export const useDelayTrends = createFetchHook<DelayTrendData[]>(railService.getDelayTrends);
export const useSpeedViolations = createFetchHook<SpeedViolationData[]>(railService.getSpeedViolations);
