import type { FilterState } from '../types/common.types';
import type {
  RailOutboundKPIs,
  RailRake,
  RailIntraPlantKPIs,
  OperatorPerformance,
  DelayTrendData,
  SpeedViolationData,
} from '../types/rail.types';
import {
  mockRailOutboundKPIs,
  mockRailRakes,
  mockRailIntraPlantKPIs,
  mockOperatorPerformance,
  mockDelayTrendData,
  mockSpeedViolationData,
} from '../constants/mockData';
// import api from './api';

const simulateDelay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const railService = {
  /**
   * Fetch rail outbound KPIs with optional filters
   * Real endpoint: GET /api/rail/outbound/kpis
   */
  getOutboundKPIs: async (_filters: FilterState): Promise<RailOutboundKPIs> => {
    // return api.get<RailOutboundKPIs>('/rail/outbound/kpis', { params: filters }).then(res => res.data);
    await simulateDelay();
    return { ...mockRailOutboundKPIs };
  },

  /**
   * Fetch list of rail rakes with filtering
   * Real endpoint: GET /api/rail/outbound/rakes
   */
  getRakeList: async (filters: FilterState): Promise<RailRake[]> => {
    // return api.get<RailRake[]>('/rail/outbound/rakes', { params: filters }).then(res => res.data);
    await simulateDelay(600);

    let rakes = [...mockRailRakes];

    if (filters.plant && filters.plant !== 'All Plants') {
      rakes = rakes.filter((r) => r.plant === filters.plant);
    }
    if (filters.destination && filters.destination !== 'All Destinations') {
      rakes = rakes.filter((r) => r.destination === filters.destination);
    }
    if (filters.fnrNumber) {
      rakes = rakes.filter((r) =>
        r.fnrNumber.toLowerCase().includes(filters.fnrNumber.toLowerCase())
      );
    }
    if (filters.rrNumber) {
      rakes = rakes.filter((r) =>
        r.rrNumber.toLowerCase().includes(filters.rrNumber.toLowerCase())
      );
    }
    if (filters.status && filters.status !== 'All Statuses') {
      rakes = rakes.filter((r) => r.status === filters.status);
    }
    if (filters.delay && filters.delay !== 'All Delays') {
      const delayThresholdDays = Number.parseInt(filters.delay, 10);
      rakes = rakes.filter((r) => r.delayDays >= delayThresholdDays);
    }
    if (filters.gpsStatus && filters.gpsStatus !== 'All GPS Statuses') {
      rakes = rakes.filter((r) => r.gpsStatus === filters.gpsStatus);
    }

    return rakes;
  },

  /**
   * Fetch intra-plant KPIs
   * Real endpoint: GET /api/rail/intra-plant/kpis
   */
  getIntraPlantKPIs: async (): Promise<RailIntraPlantKPIs> => {
    // return api.get<RailIntraPlantKPIs>('/rail/intra-plant/kpis').then(res => res.data);
    await simulateDelay(400);
    return { ...mockRailIntraPlantKPIs };
  },

  /**
   * Fetch operator performance data
   * Real endpoint: GET /api/rail/operators/performance
   */
  getOperatorPerformance: async (): Promise<OperatorPerformance[]> => {
    // return api.get<OperatorPerformance[]>('/rail/operators/performance').then(res => res.data);
    await simulateDelay(500);
    return [...mockOperatorPerformance];
  },

  /**
   * Fetch delay trend data (8 months)
   * Real endpoint: GET /api/rail/analytics/delay-trends
   */
  getDelayTrends: async (): Promise<DelayTrendData[]> => {
    // return api.get<DelayTrendData[]>('/rail/analytics/delay-trends').then(res => res.data);
    await simulateDelay(300);
    return [...mockDelayTrendData];
  },

  /**
   * Fetch speed violation data by loco
   * Real endpoint: GET /api/rail/safety/speed-violations
   */
  getSpeedViolations: async (): Promise<SpeedViolationData[]> => {
    // return api.get<SpeedViolationData[]>('/rail/safety/speed-violations').then(res => res.data);
    await simulateDelay(400);
    return [...mockSpeedViolationData];
  },
};
