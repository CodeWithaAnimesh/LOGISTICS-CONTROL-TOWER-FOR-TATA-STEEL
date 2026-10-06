import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { PageShell, FilterBar, KPICard, DataTable, StatusBadge } from '../../../components/common';
import { useSafetyAlerts, useSafetyKPIs } from '../../../hooks/useRoadData'; // Reusing mock data hooks for simplicity
import type { SafetyAlert, TableColumn } from '../../../types';

export const RailSafety: React.FC = () => {
  const { data: kpis, loading: kpisLoading } = useSafetyKPIs();
  const { data: alerts, loading: alertsLoading } = useSafetyAlerts();
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const columns: TableColumn<SafetyAlert>[] = [
    { key: 'vehicleNumber', label: 'Loco No.' },
    { key: 'transporter', label: 'Operator' },
    { key: 'alertTime', label: 'Alert Time' },
    { key: 'location', label: 'Location' },
    { key: 'driverName', label: 'Operator Name' },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (val) => <StatusBadge status={val as any} />
    },
    { 
      key: 'liveTrackUrl', 
      label: 'Live Track',
      render: (_, row) => (
        <a href={row.liveTrackUrl} target="_blank" rel="noreferrer" className="text-[var(--accent-blue-lt)] hover:underline flex items-center gap-1">
          Track <ExternalLink className="w-3 h-3" />
        </a>
      )
    },
    { key: 'contactNumber', label: 'Contact Number', sortable: false },
  ];

  const alertTypes = [
    { id: 'speed-violation', label: 'Speed Violation', count: kpis?.alertsByType.speedViolation ?? 0 },
    { id: 'drowsiness', label: 'Drowsiness', count: kpis?.alertsByType.drowsiness ?? 0 },
    { id: 'distraction', label: 'Distraction', count: kpis?.alertsByType.distraction ?? 0 },
    { id: 'risky-driving', label: 'Risky Driving', count: kpis?.alertsByType.riskyDriving ?? 0 },
    { id: 'no-parking', label: 'Parked in No-Parking Zone', count: kpis?.alertsByType.noParking ?? 0 },
  ];

  return (
    <PageShell filterBar={<FilterBar type="rail" />}>
      <div className="flex flex-col gap-6 animate-fade-in">
        
        {/* Top Asset Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KPICard label="Total Assets" value={kpis?.totalAssets ?? 0} loading={kpisLoading} />
          <KPICard label="Breakdown" value={kpis?.breakdown ?? 0} color="var(--status-red)" loading={kpisLoading} />
          <KPICard label="Moving" value={kpis?.moving ?? 0} color="var(--status-green)" loading={kpisLoading} />
          <KPICard label="Non-Moving" value={kpis?.nonMoving ?? 0} color="var(--status-amber)" loading={kpisLoading} />
          <KPICard label="DFMS Down" value={kpis?.dfmsDown ?? 0} color="var(--status-gray)" loading={kpisLoading} />
        </div>

        {/* Alert Counts Row */}
        <div className="card p-4 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full border-4 border-[var(--bg-border)] flex items-center justify-center text-xl font-bold">{kpis?.totalAlerts ?? 0}</div>
             <span className="font-semibold text-[var(--text-secondary)] uppercase">Total Alerts</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-4 border-[var(--status-green)] flex items-center justify-center font-bold">{kpis?.withActionTaken ?? 0}</div>
             <span className="text-sm font-medium">With Action Taken</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-4 border-[var(--status-red)] flex items-center justify-center font-bold">{kpis?.pendingAction ?? 0}</div>
             <span className="text-sm font-medium">Pending Action</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-4 border-[var(--status-red)] border-t-transparent animate-spin flex items-center justify-center font-bold" style={{animationDuration: '3s'}}>{kpis?.pendingGt5Min ?? 0}</div>
             <span className="text-sm font-medium text-[var(--status-red)]">Pending &gt; 5 mins</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-4 border-[var(--status-amber)] flex items-center justify-center font-bold">{kpis?.repeatedAlerts ?? 0}</div>
             <span className="text-sm font-medium text-[var(--status-amber)]">Repeated Alerts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
           
           {/* Alerts Table (Left Side) */}
           <div className="xl:col-span-3 card h-[600px] flex flex-col">
             <div className="p-4 border-b border-[var(--bg-border)]">
               <h3 className="kpi-label">A Simple table showing all alerts as per their severity:</h3>
             </div>
             <div className="flex-1 overflow-hidden p-0">
               <DataTable
                 data={alerts || []}
                 columns={columns}
                 loading={alertsLoading}
                 className="border-0 rounded-none h-full"
               />
             </div>
           </div>

           {/* Alert Type Sidebar (Right Side) */}
           <div className="xl:col-span-1 flex flex-col gap-3">
             <h3 className="kpi-label mb-2 text-right">Alert Categories</h3>
             {alertTypes.map((type) => (
               <div 
                 key={type.id}
                 onClick={() => setActiveVideoModal(type.id)}
                 className="card p-4 flex items-center justify-between cursor-pointer hover:border-[var(--accent-blue)] group transition-all bg-[var(--status-blue-bg)] border-[rgba(59,130,246,0.3)]"
               >
                 <span className="font-bold text-white group-hover:text-[var(--accent-blue-lt)]">{type.label}</span>
                 <div className="flex items-center gap-3">
                   <span className="font-extrabold text-xl text-white">{type.count}</span>
                   <Play className="w-4 h-4 text-white opacity-70 group-hover:opacity-100" />
                 </div>
               </div>
             ))}
             <p className="text-[10px] text-[var(--text-tertiary)] mt-2 italic text-right">
               Upon clicking these alerts bars there should be a DFMS video screen
             </p>
           </div>
        </div>
        
        {/* Placeholder Modal for DFMS Video */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setActiveVideoModal(null)}>
            <div className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
               <div className="p-4 border-b border-[var(--bg-border)] flex justify-between items-center bg-[var(--bg-surface)]">
                 <h2 className="font-bold text-lg">DFMS Video Feed: {alertTypes.find(t => t.id === activeVideoModal)?.label}</h2>
                 <button onClick={() => setActiveVideoModal(null)} className="text-[var(--text-secondary)] hover:text-white">✕</button>
               </div>
               <div className="aspect-video bg-black flex items-center justify-center relative">
                  <span className="text-[var(--text-tertiary)] font-mono text-lg tracking-widest">NO VIDEO SIGNAL</span>
                  <div className="absolute inset-0 border-[4px] border-red-500/20 animate-pulse pointer-events-none" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">REC</span>
                     <span className="bg-black/50 text-white text-xs font-mono px-2 py-1 rounded border border-white/20">CAM-04</span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white/50 font-mono text-xs">
                     {new Date().toISOString()}
                  </div>
               </div>
               <div className="p-4 bg-[var(--bg-surface)] flex justify-end gap-3">
                 <button className="btn btn-ghost" onClick={() => setActiveVideoModal(null)}>Close</button>
                 <button className="btn btn-primary bg-[var(--status-green)] hover:bg-[var(--status-green)] shadow-none">Acknowledge & Resolve</button>
               </div>
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
};
