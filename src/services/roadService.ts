import type { RoadFilterState } from '../types/common.types';
import type {
  RoadOutboundKPIs,
  RoadVehicle,
  SafetyAlert,
  SafetyKPIs,
  FleetStatus,
} from '../types/road.types';
import {
  mockRoadOutboundKPIs,
  mockRoadVehicles,
  mockSafetyAlerts,
  mockSafetyKPIs,
  mockFleetStatus,
} from '../constants/mockData';
// import api from './api';

const simulateDelay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const roadService = {
  /**
   * Fetch road outbound KPIs with optional filters
   * Real endpoint: GET /api/road/outbound/kpis
   */
  getOutboundKPIs: async (_filters: RoadFilterState): Promise<RoadOutboundKPIs> => {
    // return api.get<RoadOutboundKPIs>('/road/outbound/kpis', { params: filters }).then(res => res.data);
    await simulateDelay();
    return { ...mockRoadOutboundKPIs };
  },

  /**
   * Fetch list of road vehicles with filtering
   * Real endpoint: GET /api/road/outbound/vehicles
   */
  getVehicleList: async (filters: RoadFilterState): Promise<RoadVehicle[]> => {
    // return api.get<RoadVehicle[]>('/road/outbound/vehicles', { params: filters }).then(res => res.data);
    await simulateDelay(600);

    let vehicles = [...mockRoadVehicles];

    if (filters.location && filters.location !== 'All Locations') {
      vehicles = vehicles.filter((v) => v.origin === filters.location || v.destination === filters.location);
    }
    if (filters.destination && filters.destination !== 'All Destinations') {
      vehicles = vehicles.filter((v) => v.destination === filters.destination);
    }
    if (filters.vehicleNumber) {
      vehicles = vehicles.filter((v) =>
        v.vehicleNumber.toLowerCase().includes(filters.vehicleNumber.toLowerCase())
      );
    }
    if (filters.transporter && filters.transporter !== 'All Transporters') {
      vehicles = vehicles.filter((v) =>
        v.transporter.toLowerCase().includes(filters.transporter.toLowerCase())
      );
    }
    if (filters.status && filters.status !== 'All Statuses') {
      vehicles = vehicles.filter((v) => v.status === filters.status);
    }
    if (filters.delay && filters.delay !== 'All Delays') {
      const delayThresholdDays = Number.parseInt(filters.delay, 10);
      vehicles = vehicles.filter((v) => v.delayDays >= delayThresholdDays);
    }
    if (filters.gpsStatus && filters.gpsStatus !== 'All GPS Statuses') {
      vehicles = vehicles.filter((v) => v.gpsStatus === filters.gpsStatus);
    }

    return vehicles;
  },

  /**
   * Fetch safety alerts
   * Real endpoint: GET /api/road/safety/alerts
   */
  getSafetyAlerts: async (): Promise<SafetyAlert[]> => {
    // return api.get<SafetyAlert[]>('/road/safety/alerts').then(res => res.data);
    await simulateDelay(400);
    return [...mockSafetyAlerts];
  },

  /**
   * Fetch safety KPIs
   * Real endpoint: GET /api/road/safety/kpis
   */
  getSafetyKPIs: async (): Promise<SafetyKPIs> => {
    // return api.get<SafetyKPIs>('/road/safety/kpis').then(res => res.data);
    await simulateDelay(500);
    return { ...mockSafetyKPIs };
  },

  /**
   * Fetch fleet status overview
   * Real endpoint: GET /api/road/fleet/status
   */
  getFleetStatus: async (): Promise<FleetStatus> => {
    // return api.get<FleetStatus>('/road/fleet/status').then(res => res.data);
    await simulateDelay(300);
    return { ...mockFleetStatus };
  },
};
