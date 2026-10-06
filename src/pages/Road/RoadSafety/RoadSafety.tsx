import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ExternalLink, Video, X, CheckCircle } from 'lucide-react';
import { RoadPageHeader } from '../../../components/road/RoadPageHeader';
import { DataTable } from '../../../components/common';
import type { TableColumn } from '../../../types/common.types';
import type { SafetyAlert } from '../../../types/road.types';
import { mockSafetyAlerts } from '../../../constants/mockData';

type AssetKpiId = 'totalAssets' | 'breakdown' | 'moving' | 'nonMoving' | 'dfmsDown';

interface AssetKPIConfig {
  id: AssetKpiId;
  label: string;
  value: number;
  color: string;
  icon: string;
}

interface AssetDetailRow {
  assetNo: string;
  transporter: string;
  status: string;
  location: string;
  driver: string;
  gps: string;
  lastUpdate: string;
  remarks: string;
  contact: string;
}

/* ─── Mock Data ────────────────────────────────── */
const safetyData = {
  assets: { total: 350, breakdown: 43, moving: 261, nonMoving: 20, dfmsDown: 26 },
  alerts: { total: 50, actionTaken: 30, pendingAction: 30, pendingGt5Min: 10, repeated: 2 },
  alertTypes: [
    { id: 'speed',       label: 'Speed Violation Alert',    count: 20, color: '#3B82F6' },
    { id: 'drowsiness',  label: 'Drowsiness Alert',          count: 5,  color: '#06B6D4' },
    { id: 'distraction', label: 'Distraction Alert',         count: 9,  color: '#06B6D4' },
    { id: 'risky',       label: 'Risky Driving Alert',       count: 1,  color: '#3B82F6' },
    { id: 'parking',     label: 'Parked in No-parking Zone', count: 15, color: '#64748B' },
  ],
  table: [
    { veh: 'MH-04-AB-1234', trans: 'TCI Express',   time: '10:23 AM', loc: 'Sector C, NH6',        driver: 'Ramesh Kumar', contact: '98765 43210' },
    { veh: 'GJ-01-XY-5678', trans: 'Gati Ltd',       time: '10:45 AM', loc: 'Andheri E, Mumbai',   driver: 'Suresh Patel', contact: '97654 32109' },
    { veh: 'TN-09-CD-9012', trans: 'VRL Logistics',  time: '11:02 AM', loc: 'Chennai NH4',          driver: 'Vijay S',      contact: '96543 21098' },
    { veh: 'DL-01-EF-3456', trans: 'Delhivery',      time: '11:15 AM', loc: 'Gurgaon Toll',         driver: 'Ajay Singh',   contact: '95432 10987' },
    { veh: 'KA-03-GH-7890', trans: 'Rivigo',         time: '11:38 AM', loc: 'Hosur Road, Blr',      driver: 'Mohan Das',    contact: '94321 09876' },
    { veh: 'WB-06-KL-2345', trans: 'Safexpress',     time: '11:52 AM', loc: 'Kolkata Port Rd',      driver: 'Bikram Roy',   contact: '93210 98765' },
    { veh: 'RJ-14-MN-6789', trans: 'TCI Express',    time: '12:10 PM', loc: 'Jaipur NH8',           driver: 'Deepak V.',    contact: '92109 87654' },
  ],
};

/* ─── Sub-components ───────────────────────────── */

const assetKpis: AssetKPIConfig[] = [
  { id: 'totalAssets', label: 'Total No of Assets', value: safetyData.assets.total, color: '#3B82F6', icon: '🚛' },
  { id: 'breakdown', label: 'Breakdown', value: safetyData.assets.breakdown, color: '#EC4899', icon: '🔧' },
  { id: 'moving', label: 'Moving Asset', value: safetyData.assets.moving, color: '#06B6D4', icon: '🚗' },
  { id: 'nonMoving', label: 'Non-moving Asset', value: safetyData.assets.nonMoving, color: '#10B981', icon: '🅿️' },
  { id: 'dfmsDown', label: 'DFMS Down', value: safetyData.assets.dfmsDown, color: '#EF4444', icon: '📡' },
];

const assetDetailTables: Record<AssetKpiId, { title: string; subtitle: string; rows: AssetDetailRow[] }> = {
  totalAssets: {
    title: 'Total No of Assets',
    subtitle: 'Complete fleet sample across active, parked, breakdown, and DFMS-down assets.',
    rows: [
      { assetNo: 'MH-04-AB-1234', transporter: 'TCI Express', status: 'Moving', location: 'Sector C, NH6', driver: 'Ramesh Kumar', gps: 'Live', lastUpdate: '10:23 AM', remarks: 'On assigned outbound route', contact: '98765 43210' },
      { assetNo: 'GJ-01-XY-5678', transporter: 'Gati Ltd', status: 'Breakdown', location: 'Andheri E, Mumbai', driver: 'Suresh Patel', gps: 'Live', lastUpdate: '10:45 AM', remarks: 'Engine fault reported', contact: '97654 32109' },
      { assetNo: 'TN-09-CD-9012', transporter: 'VRL Logistics', status: 'Moving', location: 'Chennai NH4', driver: 'Vijay S', gps: 'Live', lastUpdate: '11:02 AM', remarks: 'No exception', contact: '96543 21098' },
      { assetNo: 'DL-01-EF-3456', transporter: 'Delhivery', status: 'Non-moving', location: 'Gurgaon Toll', driver: 'Ajay Singh', gps: 'Live', lastUpdate: '11:15 AM', remarks: 'Waiting at checkpoint', contact: '95432 10987' },
      { assetNo: 'KA-03-GH-7890', transporter: 'Rivigo', status: 'DFMS Down', location: 'Hosur Road, Blr', driver: 'Mohan Das', gps: 'Weak', lastUpdate: '11:38 AM', remarks: 'Camera feed unavailable', contact: '94321 09876' },
    ],
  },
  breakdown: {
    title: 'Breakdown Assets',
    subtitle: 'Vehicles currently marked as breakdown with owner, location, and recovery notes.',
    rows: [
      { assetNo: 'GJ-01-XY-5678', transporter: 'Gati Ltd', status: 'Breakdown', location: 'Andheri E, Mumbai', driver: 'Suresh Patel', gps: 'Live', lastUpdate: '10:45 AM', remarks: 'Engine fault, service team assigned', contact: '97654 32109' },
      { assetNo: 'RJ-14-MN-6789', transporter: 'TCI Express', status: 'Breakdown', location: 'Jaipur NH8', driver: 'Deepak V.', gps: 'Live', lastUpdate: '12:10 PM', remarks: 'Tyre burst, recovery ETA 35 min', contact: '92109 87654' },
      { assetNo: 'OD-05-PQ-4421', transporter: 'Safexpress', status: 'Breakdown', location: 'Kalinganagar Gate 2', driver: 'Prakash Nayak', gps: 'Live', lastUpdate: '12:18 PM', remarks: 'Hydraulic issue under inspection', contact: '90909 11223' },
      { assetNo: 'JH-05-MX-1188', transporter: 'Mahindra Logistics', status: 'Breakdown', location: 'Jamshedpur Yard', driver: 'Niraj Kumar', gps: 'Live', lastUpdate: '12:26 PM', remarks: 'Battery failure, tow requested', contact: '90011 22334' },
    ],
  },
  moving: {
    title: 'Moving Assets',
    subtitle: 'Vehicles moving on route with latest GPS signal and driver details.',
    rows: [
      { assetNo: 'MH-04-AB-1234', transporter: 'TCI Express', status: 'Moving', location: 'Sector C, NH6', driver: 'Ramesh Kumar', gps: 'Live', lastUpdate: '10:23 AM', remarks: 'Speed 42 km/h, on route', contact: '98765 43210' },
      { assetNo: 'TN-09-CD-9012', transporter: 'VRL Logistics', status: 'Moving', location: 'Chennai NH4', driver: 'Vijay S', gps: 'Live', lastUpdate: '11:02 AM', remarks: 'Speed 51 km/h, on route', contact: '96543 21098' },
      { assetNo: 'WB-06-KL-2345', transporter: 'Safexpress', status: 'Moving', location: 'Kolkata Port Rd', driver: 'Bikram Roy', gps: 'Live', lastUpdate: '11:52 AM', remarks: 'Speed 36 km/h, mild congestion', contact: '93210 98765' },
      { assetNo: 'CG-07-TR-6655', transporter: 'Rivigo', status: 'Moving', location: 'Raipur Bypass', driver: 'Anil Sahu', gps: 'Live', lastUpdate: '12:33 PM', remarks: 'Speed 47 km/h, no exception', contact: '91122 33445' },
    ],
  },
  nonMoving: {
    title: 'Non-moving Assets',
    subtitle: 'Parked or idle assets that are not currently moving.',
    rows: [
      { assetNo: 'DL-01-EF-3456', transporter: 'Delhivery', status: 'Non-moving', location: 'Gurgaon Toll', driver: 'Ajay Singh', gps: 'Live', lastUpdate: '11:15 AM', remarks: 'Waiting at checkpoint', contact: '95432 10987' },
      { assetNo: 'BR-02-KL-7710', transporter: 'Gati Ltd', status: 'Non-moving', location: 'Bokaro Yard', driver: 'Manoj Prasad', gps: 'Live', lastUpdate: '12:02 PM', remarks: 'Parked for loading clearance', contact: '92233 44556' },
      { assetNo: 'AP-16-WQ-2209', transporter: 'VRL Logistics', status: 'Non-moving', location: 'Vijayawada Hub', driver: 'Kiran Rao', gps: 'Live', lastUpdate: '12:21 PM', remarks: 'Scheduled halt', contact: '93344 55667' },
    ],
  },
  dfmsDown: {
    title: 'DFMS Down Assets',
    subtitle: 'Assets with driver monitoring feed unavailable or degraded.',
    rows: [
      { assetNo: 'KA-03-GH-7890', transporter: 'Rivigo', status: 'DFMS Down', location: 'Hosur Road, Blr', driver: 'Mohan Das', gps: 'Weak', lastUpdate: '11:38 AM', remarks: 'Camera feed unavailable', contact: '94321 09876' },
      { assetNo: 'MP-09-DS-4490', transporter: 'Mahindra Logistics', status: 'DFMS Down', location: 'Indore Bypass', driver: 'Harish Meena', gps: 'Live', lastUpdate: '12:06 PM', remarks: 'DFMS heartbeat missed', contact: '94455 66778' },
      { assetNo: 'UP-32-FT-5601', transporter: 'Delhivery', status: 'DFMS Down', location: 'Lucknow Outer Ring', driver: 'Imran Khan', gps: 'Live', lastUpdate: '12:17 PM', remarks: 'Lens obstruction reported', contact: '95566 77889' },
      { assetNo: 'JH-01-CC-9021', transporter: 'TCI Express', status: 'DFMS Down', location: 'Ranchi Yard', driver: 'Basant Oraon', gps: 'Weak', lastUpdate: '12:41 PM', remarks: 'Device offline for 18 min', contact: '96677 88990' },
    ],
  },
};

const AssetKPI: React.FC<{
  label: string; value: number; color: string; icon: string; active: boolean; onClick: () => void;
}> = ({ label, value, color, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center gap-2 py-3 px-2 border rounded-xl relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050A15]"
    style={{
      borderColor: active ? color : `${color}55`,
      background: active ? `linear-gradient(135deg, ${color}24 0%, ${color}08 100%)` : `${color}08`,
      boxShadow: active ? `0 0 24px ${color}35, inset 0 0 18px ${color}10` : undefined,
      '--tw-ring-color': color,
    } as React.CSSProperties}
  >
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
    <span className="text-2xl">{icon}</span>
    <span className="text-2xl font-black tabular-nums leading-none" style={{ color, textShadow: `0 0 12px ${color}` }}>
      {value}
    </span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] text-center leading-tight">
      {label}
    </span>
    {active && <span className="absolute bottom-2 right-3 text-[8px] font-black uppercase tracking-widest" style={{ color }}>Selected</span>}
  </button>
);

const AlertCircle: React.FC<{
  value: number; label: string; color: string; size?: 'lg' | 'sm';
}> = ({ value, label, color, size = 'sm' }) => {
  const dim = size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-2xl';
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${dim} rounded-full flex items-center justify-center border-4 relative`}
        style={{
          borderColor: color,
          background: `${color}15`,
          boxShadow: `0 0 20px ${color}40, inset 0 0 15px ${color}15`,
        }}
      >
        <div
          className="absolute inset-1 rounded-full border opacity-30"
          style={{ borderColor: color }}
        />
        <span className={`${textSize} font-black tabular-nums`} style={{ color }}>
          {value}
        </span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8] text-center max-w-[90px] leading-tight">
        {label}
      </span>
    </div>
  );
};
/* ─── Main Page ─────────────────────────────────── */
export const RoadSafety: React.FC = () => {
  const [activeAssetKpi, setActiveAssetKpi] = useState<AssetKpiId>('totalAssets');
  const [alertSearch, setAlertSearch] = useState('');
  const [alertTypeFilter, setAlertTypeFilter] = useState('');
  const d = safetyData;
  const activeTable = assetDetailTables[activeAssetKpi];

  const uniqueAlertTypes = useMemo(() => Array.from(new Set(mockSafetyAlerts.map(a => a.alertType))), []);

  const filteredAlerts = useMemo(() => {
    let result = mockSafetyAlerts;
    if (alertTypeFilter) {
      result = result.filter(a => a.alertType === alertTypeFilter);
    }
    const query = alertSearch.trim().toLowerCase();
    if (query) {
      result = result.filter(a => 
        a.vehicleNumber.toLowerCase().includes(query) || 
        a.alertType.toLowerCase().includes(query)
      );
    }
    return result;
  }, [alertSearch, alertTypeFilter]);

  const alertColumns: TableColumn<SafetyAlert>[] = [
    { key: 'alertTime', label: 'Timestamp' },
    { 
      key: 'vehicleNumber', 
      label: 'Vehicle No.',
      filter: (
        <input
          type="text"
          aria-label="Search vehicle"
          placeholder="Search..."
          value={alertSearch}
          onChange={(event) => setAlertSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[120px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)] mt-1"
        />
      ),
    },
    { key: 'transporter', label: 'Transporter' },
    { key: 'alertType', label: 'Alert Type' },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (val) => {
        let color = 'var(--text-secondary)';
        if (val === 'critical') color = 'var(--status-red)';
        if (val === 'warning') color = 'var(--status-amber)';
        if (val === 'info') color = 'var(--accent-blue)';
        return <span style={{ color, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}>{val as string}</span>;
      }
    },
    { key: 'location', label: 'Location' },
    { key: 'driverName', label: 'Driver Name' },
    { 
      key: 'actionTaken', 
      label: 'Action Taken',
      render: (val) => val ? (
        <span className="text-[var(--status-green)] font-bold text-[10px] uppercase">Yes</span>
      ) : (
        <span className="text-[var(--status-amber)] font-bold text-[10px] uppercase">No</span>
      )
    },
    { key: 'contactNumber', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-x-hidden font-sans flex flex-col">
      <RoadPageHeader
        activeTab="safety"
        pageTitle="GLOBAL LOGISTICS CONTROL TOWER — ROAD SAFETY"
        alertText="Speed Violation Alert: 20 active violations across fleet."
      />

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">

        {/* ── Filter Bar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.06)] text-xs font-bold tracking-wide text-white">
            <span className="text-[#94A3B8]">📍 Location :</span>
            <select className="bg-transparent border-none outline-none text-white text-xs cursor-pointer">
              <option>Filter (All as default)</option>
              <option>Jamshedpur</option>
              <option>Kalinganagar</option>
              <option>Meramandali</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.06)] text-xs font-bold tracking-wide text-white">
            <span className="text-[#94A3B8]">🗺️ Area :</span>
            <select className="bg-transparent border-none outline-none text-white text-xs cursor-pointer">
              <option>Filter (All as default)</option>
              <option>Zone A</option>
              <option>Zone B</option>
              <option>Zone C</option>
            </select>
          </div>
          <span className="text-[10px] text-[#475569] italic ml-2">
            Clicking on every item should show a detailed table about vehicles/Loco, their location, GPS link
          </span>
        </div>

        {/* ── Asset KPI Row ── */}
        <div className="flex gap-3">
          {assetKpis.map((kpi) => (
            <AssetKPI
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              color={kpi.color}
              icon={kpi.icon}
              active={activeAssetKpi === kpi.id}
              onClick={() => setActiveAssetKpi(kpi.id)}
            />
          ))}
        </div>

        {/* ── Alert Circles Row ── */}
        <div className="sci-fi-panel p-4 flex items-center justify-around gap-4">
          <AlertCircle value={d.alerts.total}        label="Total No of Alerts"               color="#7C3AED" size="lg" />
          <AlertCircle value={d.alerts.actionTaken}  label="Alerts with Action Taken"          color="#10B981" />
          <AlertCircle value={d.alerts.pendingAction} label="Alerts with Pending Action"       color="#EC4899" />
          <AlertCircle value={d.alerts.pendingGt5Min} label="Alerts Pending for More than 5 Mins" color="#EC4899" />
          <AlertCircle value={d.alerts.repeated}     label="Repeated Alerts for Same Asset"   color="#EF4444" />
        </div>

        {/* ── Tables Section ── */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

          {/* Asset Details Table */}
          <div className="sci-fi-panel flex flex-col shrink-0 min-h-[350px]">
            <div className="px-4 py-3 border-b border-[rgba(59,130,246,0.2)] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
                  {activeTable.title} Details
                </h3>
                <p className="text-[10px] text-[#64748B] mt-1">
                  {activeTable.subtitle}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] shrink-0">
                {activeTable.rows.length} visible records
              </span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[rgba(59,130,246,0.15)]">
                    {['Asset No', 'Transporter', 'Status', 'Location', 'Driver name', 'GPS link', 'Last update', 'Remarks', 'Contact number'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left font-bold uppercase tracking-wider text-[#475569] bg-[rgba(59,130,246,0.05)] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTable.rows.map((row, i) => (
                    <tr
                      key={`${activeAssetKpi}-${row.assetNo}-${i}`}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(59,130,246,0.05)] transition-colors group"
                    >
                      <td className="px-3 py-2.5 font-mono text-[#06B6D4] font-semibold whitespace-nowrap">{row.assetNo}</td>
                      <td className="px-3 py-2.5 text-white whitespace-nowrap">{row.transporter}</td>
                      <td className="px-3 py-2.5 text-[#F59E0B] font-bold whitespace-nowrap">{row.status}</td>
                      <td className="px-3 py-2.5 text-[#94A3B8] min-w-[160px]">{row.location}</td>
                      <td className="px-3 py-2.5 text-white whitespace-nowrap">{row.driver}</td>
                      <td className="px-3 py-2.5">
                        <a
                          href="#"
                          className="flex items-center gap-1 text-[#3B82F6] hover:text-[#06B6D4] transition-colors font-semibold"
                          onClick={(e) => e.preventDefault()}
                        >
                          {row.gps} <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[#94A3B8] whitespace-nowrap">{row.lastUpdate}</td>
                      <td className="px-3 py-2.5 text-[#94A3B8] min-w-[220px]">{row.remarks}</td>
                      <td className="px-3 py-2.5 font-mono text-[#94A3B8] whitespace-nowrap">{row.contact}</td>
                    </tr>
                  ))}
                  {/* Empty rows to fill space */}
                  {Array.from({ length: Math.max(0, 5 - activeTable.rows.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="border-b border-[rgba(255,255,255,0.04)]">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-3 py-3">&nbsp;</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="sci-fi-panel flex flex-col shrink-0 min-h-[400px]">
            <div className="px-4 py-3 border-b border-[rgba(59,130,246,0.2)] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
                  Active Safety Alerts
                </h3>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Real-time alerts triggered across the fleet.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.06)] text-xs font-bold tracking-wide text-white">
                  <span className="text-[#94A3B8]">⚠️ Alert Type:</span>
                  <select 
                    className="bg-transparent border-none outline-none text-white text-xs cursor-pointer capitalize"
                    value={alertTypeFilter}
                    onChange={(e) => setAlertTypeFilter(e.target.value)}
                  >
                    <option value="" className="bg-[#050A15]">All</option>
                    {uniqueAlertTypes.map(type => (
                      <option key={type} value={type} className="bg-[#050A15]">{type.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] shrink-0">
                  {filteredAlerts.length} records
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-0">
              <DataTable
                data={filteredAlerts}
                columns={alertColumns}
                className="border-0 rounded-none h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
