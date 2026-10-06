import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { PageShell, FilterBar, KPICard } from '../../../components/common';
import { useRailIntraPlantKPIs, useOperatorPerformance } from '../../../hooks/useRailData';

export const RailIntraPlant: React.FC = () => {
  const { data: kpis, loading: kpisLoading } = useRailIntraPlantKPIs();
  const { data: operators, loading: opLoading } = useOperatorPerformance();
  const [activeTab, setActiveTab] = useState<'rail' | 'road'>('rail');

  const operatorChartOption = React.useMemo(() => {
    if (!operators) return {};
    const top3 = [...operators].sort((a, b) => b.overallScore - a.overallScore).slice(0, 3);
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--bg-border)',
        textStyle: { color: 'var(--text-primary)' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: 'var(--bg-border)' } },
        axisLabel: { color: 'var(--text-secondary)' }
      },
      yAxis: {
        type: 'category',
        data: top3.map(o => o.operator),
        axisLabel: { color: 'var(--text-secondary)' }
      },
      series: [
        {
          name: 'Score',
          type: 'bar',
          data: top3.map(o => o.overallScore),
          itemStyle: {
            color: 'var(--status-green)',
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    };
  }, [operators]);

  return (
    <PageShell filterBar={<FilterBar type={activeTab} />}>
      <div className="flex flex-col gap-6 animate-fade-in">
        
        {/* Tab Toggle */}
        <div className="flex bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--bg-border)] self-start">
          <button 
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'rail' ? 'bg-[var(--tata-blue)] text-white shadow-glow-blue' : 'text-[var(--text-secondary)] hover:text-white'}`}
            onClick={() => setActiveTab('rail')}
          >
            RAIL
          </button>
          <button 
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'road' ? 'bg-[var(--tata-blue)] text-white shadow-glow-blue' : 'text-[var(--text-secondary)] hover:text-white'}`}
            onClick={() => setActiveTab('road')}
          >
            ROAD
          </button>
        </div>

        {/* Sci-Fi Top Banner Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-between mb-2">
          
          {/* Left: Asset Status */}
          <div className="flex-1 card p-4 border-[rgba(59,130,246,0.3)] bg-gradient-to-r from-[var(--bg-elevated)] to-transparent flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Asset Status Status</h3>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-green)] flex items-center justify-center text-[var(--status-green)] font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">{kpis?.running ?? 0}</div>
                <span className="text-[9px] uppercase font-semibold">Running</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-blue)] flex items-center justify-center text-[var(--status-blue)] font-extrabold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">{kpis?.notRunning ?? 0}</div>
                <span className="text-[9px] uppercase font-semibold">Not Running</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-red)] flex items-center justify-center text-[var(--status-red)] font-extrabold text-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">{kpis?.breakdown ?? 0}</div>
                <span className="text-[9px] uppercase font-semibold">Breakdown</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-amber)] flex items-center justify-center text-[var(--status-amber)] font-extrabold text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">{kpis?.available ?? 0}</div>
                <span className="text-[9px] uppercase font-semibold">Available</span>
              </div>
            </div>
          </div>

          {/* Center: Overall Efficiency */}
          <div className="flex-[1.5] card p-0 border border-[var(--status-green)] bg-[var(--bg-surface)] relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] shadow-[0_0_30px_rgba(16,185,129,0.1)] group">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--status-green)] to-transparent" />
            <h3 className="text-[11px] font-bold text-[var(--status-green)] uppercase tracking-[0.2em] mt-4 mb-1">Overall Plant Efficiency</h3>
            {kpisLoading ? (
               <div className="w-32 h-16 skeleton rounded z-10" />
            ) : (
               <div className="text-6xl font-extrabold text-white z-10 tabular-nums tracking-tighter drop-shadow-md">
                 {kpis?.overallEfficiency}<span className="text-3xl text-[var(--status-green)] ml-1">% ↗</span>
               </div>
            )}
            <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Target: 95%</div>
            
            <div className="absolute bottom-0 w-full flex border-t border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)]">
              <div className="flex-1 text-center py-1.5 border-r border-[rgba(16,185,129,0.2)] text-[10px] uppercase font-semibold text-[var(--text-secondary)]">
                Total Active Assets: <span className="text-white font-bold">{kpis?.totalActiveAssets}</span>
              </div>
              <div className="flex-1 text-center py-1.5 text-[10px] uppercase font-semibold text-[var(--status-amber)]">
                Pending Alerts: <span className="text-white font-bold">{kpis?.pendingAlerts}</span>
              </div>
            </div>
          </div>

          {/* Right: Rail Asset Status (Mirror for aesthetics) */}
          <div className="flex-1 card p-4 border-[rgba(59,130,246,0.3)] bg-gradient-to-l from-[var(--bg-elevated)] to-transparent flex flex-col justify-center items-end">
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Rail Asset Status</h3>
            <div className="flex items-center gap-4 sm:gap-6 flex-row-reverse">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-green)] flex items-center justify-center text-[var(--status-green)] font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">{kpis?.running ? kpis.running + 13 : 0}</div>
                <span className="text-[9px] uppercase font-semibold">Running</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-blue)] flex items-center justify-center text-[var(--status-blue)] font-extrabold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">{kpis?.notRunning ? kpis.notRunning - 7 : 0}</div>
                <span className="text-[9px] uppercase font-semibold">Not Running</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-red)] flex items-center justify-center text-[var(--status-red)] font-extrabold text-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">{kpis?.breakdown ? kpis.breakdown - 3 : 0}</div>
                <span className="text-[9px] uppercase font-semibold">Breakdown</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--status-amber)] flex items-center justify-center text-[var(--status-amber)] font-extrabold text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">{kpis?.available ? kpis.available + 2 : 0}</div>
                <span className="text-[9px] uppercase font-semibold">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: GPS & Utilization */}
          <div className="flex flex-col gap-6">
            <div className="card p-4 border-[rgba(59,130,246,0.3)] bg-[var(--bg-surface)] relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--accent-blue)]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[var(--accent-blue)]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[var(--accent-blue)]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--accent-blue)]" />
              
              <h3 className="kpi-label mb-4">GPS Status</h3>
              <div className="flex justify-around items-center mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--status-green)] mb-1">Running</span>
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--status-green)] flex items-center justify-center text-xl font-extrabold">{kpis?.gpsRunning ?? 0}</div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--status-blue)] mb-1">Not Running</span>
                  <div className="w-14 h-14 rounded-full border-4 border-[var(--status-blue)] flex items-center justify-center text-lg font-extrabold">{kpis?.gpsNotRunning ?? 0}</div>
                </div>
              </div>
            </div>

            <div className="card p-4 border-[rgba(59,130,246,0.3)] bg-[var(--bg-surface)] relative flex-1">
              <h3 className="kpi-label mb-4">Rail Asset Utilization</h3>
              <div className="flex justify-around items-center h-full pb-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-2">Idle Hours</span>
                  <div className="w-20 h-20 rounded-full border-[6px] border-[var(--bg-border)] border-t-[var(--status-amber)] flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-white">{kpis?.idleHoursAvg ?? 0}</span>
                    <span className="text-[9px] uppercase text-[var(--text-tertiary)]">Avg</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-2">Asset Utilization</span>
                  <div className="w-20 h-20 rounded-full border-[6px] border-[var(--bg-border)] border-t-[var(--status-green)] border-r-[var(--status-green)] border-b-[var(--status-green)] flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-[var(--status-green)]">{kpis?.assetUtilization ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Sci-Fi Map */}
          <div className="card p-4 border-[rgba(59,130,246,0.5)] lg:col-span-2 flex flex-col min-h-[400px] shadow-[0_0_20px_rgba(59,130,246,0.05)] relative overflow-hidden group">
             {/* Tech Corners */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--accent-blue-lt)] opacity-70 group-hover:opacity-100 transition-opacity" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--accent-blue-lt)] opacity-70 group-hover:opacity-100 transition-opacity" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--accent-blue-lt)] opacity-70 group-hover:opacity-100 transition-opacity" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--accent-blue-lt)] opacity-70 group-hover:opacity-100 transition-opacity" />

             <div className="flex justify-between items-center mb-4 relative z-10">
               <h3 className="kpi-label text-[var(--accent-blue-lt)]">Real-time Rail GPS Map</h3>
               <div className="flex gap-4 text-xs font-medium">
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse-slow" /> Active Regions</div>
               </div>
             </div>
             
             <div className="flex-1 bg-[var(--bg-primary)] border border-[rgba(59,130,246,0.2)] rounded-lg flex items-center justify-center relative overflow-hidden group/map">
                {/* Grid Pattern overlay */}
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(var(--accent-blue) 1px, transparent 1px), linear-gradient(90deg, var(--accent-blue) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Simulated Radar Sweep */}
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0)_0deg,rgba(59,130,246,0.1)_300deg,rgba(59,130,246,0.8)_360deg)] -translate-x-1/2 -translate-y-1/2 rounded-full animate-[spin_4s_linear_infinite] mix-blend-screen opacity-30"></div>
                
                <span className="text-[var(--accent-blue-lt)] font-mono z-10 group-hover/map:scale-110 transition-transform tracking-widest text-sm bg-black/50 px-4 py-2 rounded backdrop-blur-sm border border-[var(--accent-blue-dim)]">
                  INTERACTIVE BLUEPRINT VIEW
                </span>

                {/* Simulated Nodes */}
                <div className="absolute top-[30%] left-[40%] w-3 h-3 bg-[var(--status-green)] rounded-full shadow-[0_0_10px_var(--status-green)] animate-pulse" />
                <div className="absolute top-[60%] left-[55%] w-3 h-3 bg-[var(--status-blue)] rounded-full shadow-[0_0_10px_var(--status-blue)] animate-pulse delay-75" />
                <div className="absolute top-[45%] left-[70%] w-3 h-3 bg-[var(--status-red)] rounded-full shadow-[0_0_10px_var(--status-red)] animate-pulse delay-150" />
             </div>
          </div>
        </div>

        {/* Lower Section: Safety & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4 border-[rgba(59,130,246,0.3)] bg-[var(--bg-surface)]">
            <h3 className="kpi-label mb-4 border-b border-[var(--bg-border)] pb-2 text-[var(--accent-blue-lt)]">Rail Safety & Compliance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <KPICard label="Speed Violations" value={kpis?.speedViolations ?? 0} color="var(--status-red)" loading={kpisLoading} className="h-[90px]" />
              <KPICard label="Drowsy Driving" value={kpis?.drowsyDriving ?? 0} color="var(--status-amber)" loading={kpisLoading} className="h-[90px]" />
              <KPICard label="Distractions" value={kpis?.distractions ?? 0} color="var(--status-amber)" loading={kpisLoading} className="h-[90px]" />
              <KPICard label="No Entry" value={kpis?.noEntry ?? 0} color="var(--status-red)" loading={kpisLoading} className="h-[90px]" />
              <KPICard label="Restricted Area" value={kpis?.restrictedArea ?? 0} color="var(--status-red)" loading={kpisLoading} className="h-[90px]" />
              <KPICard label="No Parking" value={kpis?.haltInNoParking ?? 0} color="var(--status-amber)" loading={kpisLoading} className="h-[90px]" />
            </div>
          </div>

          <div className="card p-4 border-[rgba(59,130,246,0.3)] bg-[var(--bg-surface)] flex flex-col">
            <h3 className="kpi-label mb-4 border-b border-[var(--bg-border)] pb-2 text-[var(--accent-blue-lt)]">Operator Performance Dashboard Summary</h3>
            <div className="flex-1 flex flex-col min-h-[150px]">
               <div className="flex justify-between items-center mb-2 px-2">
                 <span className="text-[10px] font-semibold uppercase text-[var(--text-secondary)]">Top 3 Operators</span>
                 <div className="flex gap-4 text-[10px] uppercase font-bold text-[var(--text-tertiary)]">
                   <span className="text-[var(--status-green)]">■ Score</span>
                   <span className="text-[var(--status-amber)]">■ Incidents</span>
                 </div>
               </div>
               {opLoading ? (
                 <div className="flex-1 skeleton rounded" />
               ) : (
                 <div className="flex-1 -mx-2 -mt-4">
                   <ReactECharts option={operatorChartOption} style={{ height: '100%', width: '100%' }} />
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
