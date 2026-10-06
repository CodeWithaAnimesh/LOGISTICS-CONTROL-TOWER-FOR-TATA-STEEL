import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Download, Calendar, Filter, FileText, FileSpreadsheet } from 'lucide-react';
import { PageShell, KPICard, DonutChart, DataTable } from '../../../components/common';
import { useDelayTrends, useOperatorPerformance } from '../../../hooks/useRailData'; // Reusing mock data for simplicity
import type { TableColumn, OperatorPerformance } from '../../../types';

export const RoadReports: React.FC = () => {
  const { data: delayTrends, loading: trendsLoading } = useDelayTrends();
  const { data: operators, loading: opLoading } = useOperatorPerformance();

  const delayTrendOption = React.useMemo(() => {
    if (!delayTrends) return {};
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--bg-border)',
        textStyle: { color: 'var(--text-primary)' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: delayTrends.map(d => d.month),
        axisLabel: { color: 'var(--text-secondary)' }
      },
      yAxis: {
        type: 'value',
        name: 'Avg Delay (Days)',
        nameTextStyle: { color: 'var(--text-secondary)' },
        splitLine: { lineStyle: { color: 'var(--bg-border)' } },
        axisLabel: { color: 'var(--text-secondary)' }
      },
      series: [
        {
          name: 'Average Delay',
          type: 'line',
          smooth: true,
          data: delayTrends.map(d => d.avgDelayDuration),
          itemStyle: { color: 'var(--status-green)' },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.5)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0)' }
              ]
            }
          }
        }
      ]
    };
  }, [delayTrends]);

  const operatorColumns: TableColumn<OperatorPerformance>[] = [
    { key: 'date', label: 'Date' },
    { key: 'operator', label: 'Transporter' },
    { key: 'locoNumber', label: 'Fleet ID' },
    { key: 'yard', label: 'Region' },
    { key: 'overallScore', label: 'Score (%)', render: (val) => (
      <span className={`font-bold ${Number(val) >= 80 ? 'text-[var(--status-green)]' : Number(val) >= 60 ? 'text-[var(--status-amber)]' : 'text-[var(--status-red)]'}`}>
        {val}%
      </span>
    )},
    { key: 'utilizationPercent', label: 'Utilization (%)' },
    { key: 'speedViolations', label: 'Speed Violations' },
    { key: 'drowsyIncidents', label: 'Fatigue Incidents' },
  ];

  return (
    <PageShell>
      <div className="flex flex-col gap-6 animate-fade-in">
        
        {/* Reports Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--bg-border)]">
          <div className="flex items-center gap-4 flex-wrap">
             <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Report Filters</span>
             </div>
             <div className="relative">
                <input type="date" className="input pl-9 text-sm py-1.5 w-[140px]" defaultValue="2025-05-01" />
                <Calendar className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <span className="text-[var(--text-secondary)]">to</span>
             <div className="relative">
                <input type="date" className="input pl-9 text-sm py-1.5 w-[140px]" defaultValue="2025-05-26" />
                <Calendar className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <select className="select text-sm py-1.5 w-[140px]">
                <option value="all">All Segments</option>
                <option value="intra-plant">Intra-Plant</option>
                <option value="transit">Transit</option>
             </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-secondary text-sm py-1.5 px-3">
              <FileSpreadsheet className="w-4 h-4" /> CSV Dump
            </button>
            <button className="btn btn-primary text-sm py-1.5 px-3">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard label="On-Time Delivery Rate" value={88.2} unit="%" color="var(--status-green)" trend={{ direction: 'up', percentage: 1.4 }} />
          <KPICard label="Total Road Incidents YTD" value={214} color="var(--status-amber)" trend={{ direction: 'down', percentage: 2.1 }} />
          <KPICard label="Fleet Utilization" value={91.5} unit="%" color="var(--status-blue)" trend={{ direction: 'up', percentage: 3.2 }} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Row: 3 Columns */}
          <div className="card p-4 border-[rgba(16,185,129,0.3)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] flex flex-col items-center justify-center relative">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] absolute top-4 left-4 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Overall Performance Summary
            </h3>
            <div className="w-40 h-20 overflow-hidden relative mt-8">
               <div className="w-40 h-40 rounded-full border-[12px] border-[var(--bg-border)] border-t-[var(--status-green)] border-r-[var(--status-green)] border-l-[var(--status-green)] rotate-45 transform origin-center flex items-start justify-center pt-8">
               </div>
               <div className="absolute bottom-0 w-full text-center">
                 <span className="text-3xl font-extrabold text-white">96.8%</span>
                 <p className="text-[9px] uppercase text-[var(--text-tertiary)]">On-Time Delivery Rate</p>
               </div>
            </div>
          </div>

          <div className="card p-4 border-[rgba(16,185,129,0.3)] bg-[var(--bg-surface)] relative flex flex-col items-center">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] absolute top-4 left-4 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Asset Utilization Breakdown
            </h3>
            <div className="w-32 h-32 rounded-full border-[10px] border-[var(--bg-border)] border-t-[var(--status-green)] border-r-[var(--status-blue)] border-l-[var(--status-amber)] mt-8 flex flex-col items-center justify-center relative">
               <div className="text-xl font-extrabold text-white">65%</div>
               <div className="text-[9px] uppercase text-[var(--status-green)] font-bold">Running</div>
            </div>
          </div>

          <div className="card p-4 border-[rgba(16,185,129,0.3)] bg-[var(--bg-surface)] relative flex flex-col">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] absolute top-4 left-4 flex items-center gap-2 z-10">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Map-Based Visualization
            </h3>
            <div className="flex-1 mt-6 border border-[var(--bg-border)] rounded overflow-hidden relative bg-[var(--bg-primary)] flex items-center justify-center">
               <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(var(--status-green) 1px, transparent 1px), linear-gradient(90deg, var(--status-green) 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
               <span className="text-[10px] uppercase font-mono text-[var(--text-tertiary)]">Real-Time Locations Map Rendering...</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bottom Left: Trends (Takes 2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card p-4 border-[rgba(16,185,129,0.3)] flex-1 min-h-[250px] relative">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Detailed Performance Trends
              </h3>
              {trendsLoading ? (
                <div className="w-full h-40 skeleton rounded" />
              ) : (
                <div className="h-[200px] -ml-2">
                  <ReactECharts option={delayTrendOption} style={{ height: '100%', width: '100%' }} />
                </div>
              )}
            </div>
            
            <div className="card p-4 border-[rgba(16,185,129,0.3)] flex-1 min-h-[250px] relative">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Delay Analysis Over Time
              </h3>
              {trendsLoading ? (
                <div className="w-full h-40 skeleton rounded" />
              ) : (
                <div className="h-[200px] -ml-2">
                  <ReactECharts option={delayTrendOption} style={{ height: '100%', width: '100%' }} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Right: Leaderboard & Downloads */}
          <div className="flex flex-col gap-6">
            <div className="card p-4 border-[rgba(16,185,129,0.3)] bg-[var(--bg-surface)] flex-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Operator Performance Leaderboard
              </h3>
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex justify-between items-center p-2 rounded bg-[var(--bg-primary)] border border-[var(--bg-border)] text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] ${rank === 1 ? 'bg-[var(--status-green-bg)] text-[var(--status-green)]' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>{rank}</span>
                      <span className="font-semibold text-white">Operator {rank * 8}</span>
                    </div>
                    <span className="font-mono text-[var(--status-green)]">{(99.8 - rank * 0.3).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 border-[rgba(16,185,129,0.3)] bg-[var(--bg-surface)]">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--status-green)] mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)]"></span> Downloadable Report Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 text-xs font-semibold rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-border)] hover:border-[var(--accent-blue)] hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2 text-[var(--text-secondary)] hover:text-white">
                  <Download className="w-4 h-4 text-[var(--accent-blue)]" /> PDF Report
                </button>
                <button className="p-3 text-xs font-semibold rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-border)] hover:border-[var(--status-green)] hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2 text-[var(--text-secondary)] hover:text-white">
                  <FileText className="w-4 h-4 text-[var(--status-green)]" /> CSV Data
                </button>
                <button className="p-3 text-xs font-semibold rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-border)] hover:border-[var(--status-amber)] hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2 text-[var(--text-secondary)] hover:text-white">
                  <Filter className="w-4 h-4 text-[var(--status-amber)]" /> Report Builder
                </button>
                <button className="p-3 text-xs font-semibold rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-border)] hover:border-[var(--status-blue)] hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2 text-[var(--text-secondary)] hover:text-white">
                  <Calendar className="w-4 h-4 text-[var(--status-blue)]" /> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
