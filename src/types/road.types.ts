import type { GPSStatus, VehicleStatus, AlertType } from './common.types';

export interface RoadVehicle {
  id: string;
  date: string;
  vehicleNumber: string;
  invoiceNumber?: string;
  transporter: string;
  driver: string;
  origin: string;
  destination: string;
  status: VehicleStatus;
  delayDays: number;
  gpsStatus: GPSStatus;
  location: string;
  contactNumber: string;
  latitude: number;
  longitude: number;
}

export interface RoadOutboundKPIs {
  totalVehicles: number;
  moving: number;
  stopped: number;
  breakdown: number;
  gpsDown: number;
  undelivered: number;
  missingGPS: number;
  onTimePercent: number;
  delayBuckets: { oneToTwo: number; twoToThree: number; gtThree: number };
}

export interface SafetyAlert {
  id: string;
  vehicleNumber: string;
  transporter: string;
  alertTime: string;
  location: string;
  driverName: string;
  liveTrackUrl: string;
  contactNumber: string;
  alertType: AlertType;
  severity: 'critical' | 'warning' | 'info';
  actionTaken: boolean;
  latitude: number;
  longitude: number;
}

export interface SafetyKPIs {
  totalAssets: number;
  breakdown: number;
  moving: number;
  nonMoving: number;
  dfmsDown: number;
  totalAlerts: number;
  withActionTaken: number;
  pendingAction: number;
  pendingGt5Min: number;
  repeatedAlerts: number;
  alertsByType: {
    speedViolation: number;
    drowsiness: number;
    distraction: number;
    riskyDriving: number;
    noParking: number;
  };
}

export interface FleetStatus {
  moving: number;
  stopped: number;
  idle: number;
  accident: number;
  breakdown: number;
  maintenance: number;
  idlingGt20Min: number;
  transitDelay: { oneToTwo: number; twoToThree: number; gtThree: number };
  highAlertZones: number;
  restrictedZones: number;
  nonMovingGt1Hour: number;
}
