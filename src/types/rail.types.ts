import type { GPSStatus, RakeStatus } from './common.types';

export interface RailRake {
  id: string;
  date: string;
  plant: string;
  destination: string;
  transporter: string;
  invoiceNumber: string;
  fnrNumber: string;
  rrNumber: string;
  status: RakeStatus;
  delayDays: number;
  delayHours: number;
  gpsStatus: GPSStatus;
  latitude: number;
  longitude: number;
}

export interface RailOutboundKPIs {
  totalRakes: number;
  onTime: number;
  delayed: number;
  expectedDelays: { gt1Day: number; gt2Day: number; gt3Day: number };
  stabledRakes: { lt6hrs: number; gt10hrs: number; gt20hrs: number };
  missingWagons: { gt10Days: number; gt20Days: number; gt30Days: number };
  gpsWorking: number;
  gpsNotWorking: number;
  gpsIntermittent: number;
  exSidingPipeline: { sidingA: number; sidingB: number; sidingC: number; sidingD: number; sidingE: number };
}

export interface RailIntraPlantKPIs {
  running: number;
  notRunning: number;
  breakdown: number;
  available: number;
  overallEfficiency: number;
  totalActiveAssets: number;
  pendingAlerts: number;
  gpsRunning: number;
  gpsNotRunning: number;
  idleHoursAvg: number;
  assetUtilization: number;
  speedViolations: number;
  drowsyDriving: number;
  distractions: number;
  noEntry: number;
  restrictedArea: number;
  haltInNoParking: number;
}

export interface OperatorPerformance {
  id: string;
  date: string;
  locoNumber: string;
  yard: string;
  operator: string;
  absenteeismPercent: number;
  avgHotSeatExchangeTime: string;
  speedViolations: number;
  utilizationPercent: number;
  cellphoneDistractions: number;
  drowsyIncidents: number;
  movingHours: number;
  overallScore: number;
}

export interface DelayTrendData {
  month: string;
  avgDelayDuration: number;
}

export interface SpeedViolationData {
  locoNumber: string;
  count: number;
}
