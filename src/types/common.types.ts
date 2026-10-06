export type GPSStatus = 'working' | 'not-working' | 'intermittent';
export type RakeStatus = 'on-time' | 'delayed' | 'stabled' | 'missing-wagon';
export type VehicleStatus = 'moving' | 'stopped' | 'breakdown' | 'idle' | 'maintenance';
export type AlertType = 'speed-violation' | 'drowsiness' | 'distraction' | 'risky-driving' | 'no-parking';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type RailStatusFilter = 'All Statuses' | RakeStatus;
export type RailGpsStatusFilter = 'All GPS Statuses' | GPSStatus;
export type RailDelayFilter = 'All Delays' | '1d+' | '2d+' | '3d+';
export type RoadStatusFilter = 'All Statuses' | VehicleStatus;
export type RoadGpsStatusFilter = 'All GPS Statuses' | GPSStatus;
export type RoadDelayFilter = 'All Delays' | '1d+' | '2d+' | '3d+';

export interface FilterState {
  date: string;
  plant: string;
  destination: string;
  fnrNumber: string;
  rrNumber: string;
  status: RailStatusFilter;
  delay: RailDelayFilter;
  gpsStatus: RailGpsStatusFilter;
}

export interface RoadFilterState {
  date: string;
  location: string;
  destination: string;
  vehicleNumber: string;
  transporter: string;
  status: RoadStatusFilter;
  delay: RoadDelayFilter;
  gpsStatus: RoadGpsStatusFilter;
}

export interface DateRangeFilterState {
  startDate: string;
  endDate: string;
  transportMode: 'road' | 'rail';
  operationalSegment: 'intra-plant' | 'transit';
}

export interface KPICardData {
  label: string;
  value: number;
  unit?: string;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    percentage: number;
  };
  color?: string;
}

export interface BucketData {
  label: string;
  value: number;
  threshold: number;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  onSearch?: (value: string) => void;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  filter?: React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'down';
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
  }[];
}
