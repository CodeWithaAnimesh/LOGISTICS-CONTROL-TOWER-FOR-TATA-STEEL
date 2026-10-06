import { useState, useEffect, useCallback } from 'react';
import { roadService } from '../services/roadService';
import { useFilters } from './useFilters';
import type { RoadFilterState } from '../types';
import type {
  RoadOutboundKPIs,
  RoadVehicle,
  SafetyAlert,
  SafetyKPIs,
  FleetStatus,
} from '../types/road.types';

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

export function useRoadOutboundKPIs() {
  const { roadFilters } = useFilters();
  
  const [data, setData] = useState<RoadOutboundKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await roadService.getOutboundKPIs(roadFilters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch KPIs'));
    } finally {
      setLoading(false);
    }
  }, [roadFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRoadVehicleList() {
  const { roadFilters } = useFilters();
  
  const [data, setData] = useState<RoadVehicle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await roadService.getVehicleList(roadFilters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vehicles'));
    } finally {
      setLoading(false);
    }
  }, [roadFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export const useSafetyAlerts = createFetchHook<SafetyAlert[]>(roadService.getSafetyAlerts);
export const useSafetyKPIs = createFetchHook<SafetyKPIs>(roadService.getSafetyKPIs);
export const useFleetStatus = createFetchHook<FleetStatus>(roadService.getFleetStatus);
