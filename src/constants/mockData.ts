import type {
  RailRake,
  RailOutboundKPIs,
  RailIntraPlantKPIs,
  OperatorPerformance,
  DelayTrendData,
  SpeedViolationData,
} from '../types/rail.types';
import type {
  RoadVehicle,
  RoadOutboundKPIs,
  SafetyAlert,
  SafetyKPIs,
  FleetStatus,
} from '../types/road.types';
import type { SystemStatus } from '../types/common.types';
import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');

export const plantOptions = ['All Plants', 'Jamshedpur', 'Kalinganagar', 'Meramandali', 'Sahibabad', 'Kharagpur'] as const;
export const destinationOptions = ['All Destinations', 'Mumbai Port', 'Vizag Port', 'Kolkata', 'Delhi', 'Chennai', 'Ahmedabad', 'Pune', 'Hyderabad'] as const;
export const locationOptions = ['All Locations', 'Jamshedpur', 'Kalinganagar', 'Meramandali', 'Sahibabad', 'Kharagpur'] as const;
export const transporterOptions = ['All Transporters', 'TCI Express', 'Gati Ltd', 'VRL Logistics', 'Delhivery', 'Rivigo', 'Safexpress'] as const;
export const railStatusOptions = [
  { value: 'All Statuses', label: 'All Statuses' },
  { value: 'on-time', label: 'On Time' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'stabled', label: 'Stabled' },
  { value: 'missing-wagon', label: 'Missing Wagon' },
] as const;
export const railGpsStatusOptions = [
  { value: 'All GPS Statuses', label: 'All GPS Statuses' },
  { value: 'working', label: 'Working' },
  { value: 'not-working', label: 'Not Working' },
  { value: 'intermittent', label: 'Intermittent' },
] as const;
export const railDelayOptions = [
  { value: 'All Delays', label: 'All' },
  { value: '1d+', label: '1d+' },
  { value: '2d+', label: '2d+' },
  { value: '3d+', label: '3d+' },
] as const;
export const roadStatusOptions = [
  { value: 'All Statuses', label: 'All Statuses' },
  { value: 'moving', label: 'Moving' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'breakdown', label: 'Breakdown' },
  { value: 'idle', label: 'Idle' },
  { value: 'maintenance', label: 'Maintenance' },
] as const;
export const roadGpsStatusOptions = [
  { value: 'All GPS Statuses', label: 'All GPS Statuses' },
  { value: 'working', label: 'Working' },
  { value: 'not-working', label: 'Not Working' },
  { value: 'intermittent', label: 'Intermittent' },
] as const;
export const roadDelayOptions = [
  { value: 'All Delays', label: 'All' },
  { value: '1d+', label: '1d+' },
  { value: '2d+', label: '2d+' },
  { value: '3d+', label: '3d+' },
] as const;

export const mockRailOutboundKPIs: RailOutboundKPIs = {
  totalRakes: 156,
  onTime: 112,
  delayed: 28,
  expectedDelays: { gt1Day: 18, gt2Day: 7, gt3Day: 3 },
  stabledRakes: { lt6hrs: 12, gt10hrs: 5, gt20hrs: 2 },
  missingWagons: { gt10Days: 8, gt20Days: 3, gt30Days: 1 },
  gpsWorking: 138,
  gpsNotWorking: 10,
  gpsIntermittent: 8,
  exSidingPipeline: { sidingA: 24, sidingB: 18, sidingC: 31, sidingD: 15, sidingE: 22 },
};

export const mockRailRakes: RailRake[] = Array.from({ length: 20 }).map((_, i) => {
  const statusDist = ['on-time', 'on-time', 'delayed', 'stabled', 'on-time', 'missing-wagon', 'delayed', 'on-time'];
  const status = statusDist[i % statusDist.length] as RailRake['status'];
  
  const gpsDist = ['working', 'working', 'working', 'working', 'working', 'not-working', 'intermittent'];
  const gpsStatus = gpsDist[i % gpsDist.length] as RailRake['gpsStatus'];

  return {
    id: `rake-${i + 1}`,
    date: today,
    plant: plantOptions[(i % (plantOptions.length - 1)) + 1],
    destination: destinationOptions[(i % (destinationOptions.length - 1)) + 1],
    transporter: transporterOptions[(i % (transporterOptions.length - 1)) + 1],
    invoiceNumber: `INV-RL-${String(240001 + i)}`,
    fnrNumber: `FNR-2024-${String(i + 1).padStart(4, '0')}`,
    rrNumber: `RR-TSL-${String(i + 1).padStart(3, '0')}`,
    status,
    delayDays: status === 'delayed' ? Math.floor(Math.random() * 5) + 1 : 0,
    delayHours: status === 'delayed' ? Math.floor(Math.random() * 24) : 0,
    gpsStatus,
    latitude: 22.8046 + (Math.random() - 0.5) * 5,
    longitude: 86.2029 + (Math.random() - 0.5) * 5,
  };
});

export const mockRailIntraPlantKPIs: RailIntraPlantKPIs = {
  running: 85,
  notRunning: 15,
  breakdown: 4,
  available: 104,
  overallEfficiency: 82.5,
  totalActiveAssets: 100,
  pendingAlerts: 12,
  gpsRunning: 96,
  gpsNotRunning: 8,
  idleHoursAvg: 2.4,
  assetUtilization: 78.5,
  speedViolations: 14,
  drowsyDriving: 2,
  distractions: 5,
  noEntry: 1,
  restrictedArea: 0,
  haltInNoParking: 3,
};

export const mockOperatorPerformance: OperatorPerformance[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `op-${i + 1}`,
  date: today,
  locoNumber: `LOCO-${100 + i}`,
  yard: `Yard ${['A', 'B', 'C'][i % 3]}`,
  operator: `Operator ${i + 1}`,
  absenteeismPercent: Math.floor(Math.random() * 15),
  avgHotSeatExchangeTime: `${10 + Math.floor(Math.random() * 20)} mins`,
  speedViolations: Math.floor(Math.random() * 5),
  utilizationPercent: 70 + Math.floor(Math.random() * 25),
  cellphoneDistractions: Math.floor(Math.random() * 4),
  drowsyIncidents: Math.floor(Math.random() * 2),
  movingHours: 40 + Math.floor(Math.random() * 40),
  overallScore: 60 + Math.floor(Math.random() * 40),
}));

export const mockDelayTrendData: DelayTrendData[] = [
  { month: 'Oct 2024', avgDelayDuration: 4.2 },
  { month: 'Nov 2024', avgDelayDuration: 3.8 },
  { month: 'Dec 2024', avgDelayDuration: 4.5 },
  { month: 'Jan 2025', avgDelayDuration: 5.1 },
  { month: 'Feb 2025', avgDelayDuration: 3.5 },
  { month: 'Mar 2025', avgDelayDuration: 3.0 },
  { month: 'Apr 2025', avgDelayDuration: 2.8 },
  { month: 'May 2025', avgDelayDuration: 2.5 },
];

export const mockSpeedViolationData: SpeedViolationData[] = Array.from({ length: 20 }).map((_, i) => ({
  locoNumber: `L-${100 + i}`,
  count: Math.floor(Math.random() * 15),
}));

export const mockRoadOutboundKPIs: RoadOutboundKPIs = {
  totalVehicles: 342,
  moving: 245,
  stopped: 52,
  breakdown: 18,
  gpsDown: 27,
  undelivered: 43,
  missingGPS: 15,
  onTimePercent: 78.4,
  delayBuckets: { oneToTwo: 32, twoToThree: 14, gtThree: 8 },
};

export const mockRoadVehicles: RoadVehicle[] = Array.from({ length: 20 }).map((_, i) => {
  const statusDist = ['moving', 'moving', 'moving', 'stopped', 'moving', 'breakdown', 'idle', 'maintenance'];
  const status = statusDist[i % statusDist.length] as RoadVehicle['status'];
  
  const gpsDist = ['working', 'working', 'working', 'working', 'working', 'not-working', 'intermittent'];
  const gpsStatus = gpsDist[i % gpsDist.length] as RoadVehicle['gpsStatus'];

  return {
    id: `veh-${i + 1}`,
    date: today,
    vehicleNumber: `MH${String(10 + (i % 20))}AB${String(1000 + i)}`,
    invoiceNumber: `INV-RD-${String(580001 + i)}`,
    transporter: transporterOptions[(i % (transporterOptions.length - 1)) + 1],
    driver: `Driver ${i + 1}`,
    origin: plantOptions[(i % (plantOptions.length - 1)) + 1],
    destination: destinationOptions[(i % (destinationOptions.length - 1)) + 1],
    status,
    delayDays: status === 'stopped' || status === 'breakdown' ? Math.floor(Math.random() * 5) + 1 : 0,
    gpsStatus,
    location: `Highway ${['NH-16', 'NH-33', 'SH-2', 'NH-49'][i % 4]}`,
    contactNumber: `+91 98${String(10000000 + i * 12345).substring(0, 8)}`,
    latitude: 22.8046 + (Math.random() - 0.5) * 5,
    longitude: 86.2029 + (Math.random() - 0.5) * 5,
  };
});

export const mockSafetyAlerts: SafetyAlert[] = Array.from({ length: 10 }).map((_, i) => {
  const alertTypes = ['speed-violation', 'drowsiness', 'distraction', 'risky-driving', 'no-parking'];
  const severities = ['critical', 'warning', 'info'];

  return {
    id: `alert-${i + 1}`,
    vehicleNumber: `JH${String(10 + (i % 20))}XY${String(2000 + i)}`,
    transporter: transporterOptions[(i % (transporterOptions.length - 1)) + 1],
    alertTime: dayjs().subtract(Math.floor(Math.random() * 60), 'minute').format('HH:mm'),
    location: `Zone ${['A', 'B', 'C', 'D'][i % 4]}`,
    driverName: `Driver ${i + 10}`,
    liveTrackUrl: '#',
    contactNumber: `+91 98${String(20000000 + i * 12345).substring(0, 8)}`,
    alertType: alertTypes[i % alertTypes.length] as SafetyAlert['alertType'],
    severity: severities[i % severities.length] as SafetyAlert['severity'],
    actionTaken: i % 3 === 0,
    latitude: 22.8046 + (Math.random() - 0.5) * 5,
    longitude: 86.2029 + (Math.random() - 0.5) * 5,
  };
});

export const mockSafetyKPIs: SafetyKPIs = {
  totalAssets: 450,
  breakdown: 25,
  moving: 380,
  nonMoving: 45,
  dfmsDown: 12,
  totalAlerts: 84,
  withActionTaken: 60,
  pendingAction: 24,
  pendingGt5Min: 8,
  repeatedAlerts: 15,
  alertsByType: {
    speedViolation: 42,
    drowsiness: 8,
    distraction: 15,
    riskyDriving: 12,
    noParking: 7,
  },
};

export const mockFleetStatus: FleetStatus = {
  moving: 380,
  stopped: 35,
  idle: 15,
  accident: 2,
  breakdown: 25,
  maintenance: 18,
  idlingGt20Min: 12,
  transitDelay: { oneToTwo: 24, twoToThree: 15, gtThree: 8 },
  highAlertZones: 14,
  restrictedZones: 3,
  nonMovingGt1Hour: 22,
};

export const mockSystemStatus: SystemStatus = {
  overall: 'operational',
  services: [
    { name: 'GPS Tracking', status: 'operational' },
    { name: 'FOIS Integration', status: 'operational' },
    { name: 'DFMS Video', status: 'degraded' },
    { name: 'Alert Engine', status: 'operational' },
  ],
};
