import React from 'react';
import ReactECharts from 'echarts-for-react';
import { transitData } from '../../../constants/uiMockData';
import { RoadPageHeader } from '../../../components/road/RoadPageHeader';
import { useNavigate } from 'react-router-dom';

const d = transitData.road;

/* ═══════════════════════════════════════════
   MICRO-COMPONENTS
═══════════════════════════════════════════ */

const MetricCard: React.FC<{ label: string; value: number | string; sub?: string; color: string; size?: 'lg' | 'sm' }> = ({ label, value, sub, color, size = 'sm' }) => (
  <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-xl border"
    style={{ borderColor: `${color}35`, background: `${color}08` }}>
    <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl"
      style={{ background: `linear-gradient(90deg,transparent,${color}60,transparent)` }} />
    <span className={`font-black tabular-nums leading-none ${size === 'lg' ? 'text-5xl' : 'text-3xl'}`}
      style={{ color, textShadow: `0 0 16px ${color}80` }}>
      {value}
    </span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] text-center leading-tight">{label}</span>
    {sub && <span className="text-[9px] text-[#475569]">{sub}</span>}
  </div>
);

const SafetyChip: React.FC<{ label: string; value: number; color: string; icon: string }> = ({ label, value, color, icon }) => (
  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border gap-2"
    style={{ borderColor: `${color}35`, background: `${color}08` }}>
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-semibold text-[#94A3B8] leading-tight">{label}</span>
    </div>
    <span className="text-lg font-black tabular-nums shrink-0" style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</span>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export const RoadTransit: React.FC = () => {
  const navigate = useNavigate();

  /* Delay bar chart */
  const delayOption = {
    backgroundColor: 'transparent',
    grid: { left: '4%', right: '4%', top: '18%', bottom: '14%', containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8,13,26,0.95)',
      borderColor: 'rgba(59,130,246,0.3)',
      textStyle: { color: '#F1F5F9', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: ['On-time', '1-Day Delay', '2-Day Delay', '3-Day+ Delay'],
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      axisTick: { show: false },
    },
    yAxis: { show: false },
    series: [{
      type: 'bar',
      barWidth: '45%',
      data: [
        { value: d.delayAnalysis.onTimeVehicles, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#10B981' }, { offset: 1, color: '#059669' }] } } },
        { value: d.delayAnalysis.delay1Day.vehicles, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#F59E0B' }, { offset: 1, color: '#D97706' }] } } },
        { value: d.delayAnalysis.delay2Day.vehicles, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#F97316' }, { offset: 1, color: '#EA580C' }] } } },
        { value: d.delayAnalysis.delay3DayPlus.vehicles, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#EF4444' }, { offset: 1, color: '#DC2626' }] } } },
      ],
      label: {
        show: true,
        position: 'top',
        formatter: (p: any) => {
          const pcts = [d.delayAnalysis.onTimePercent, d.delayAnalysis.delay1Day.percent, d.delayAnalysis.delay2Day.percent, d.delayAnalysis.delay3DayPlus.percent];
          return `{pct|${pcts[p.dataIndex]}%}\n{val|${p.value}}`;
        },
        rich: {
          pct: { fontSize: 12, fontWeight: 900, color: '#F1F5F9', lineHeight: 18 },
          val: { fontSize: 9, color: '#94A3B8', lineHeight: 14 },
        },
      },
      itemStyle: { borderRadius: [4, 4, 0, 0] },
    }],
  };

  /* GPS donut */
  const gpsOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'pie',
      radius: ['60%', '82%'],
      center: ['50%', '50%'],
      label: { show: false },
      data: [
        { value: d.gpsHealth.connectedPercent, name: 'Connected', itemStyle: { color: '#10B981', shadowBlur: 10, shadowColor: '#10B98160' } },
        { value: d.gpsHealth.disconnectedPercent, name: 'Offline', itemStyle: { color: 'rgba(255,255,255,0.06)' } },
      ],
      itemStyle: { borderColor: '#050A15', borderWidth: 2 },
    }],
  };

  return (
    <div className="h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-hidden font-sans flex flex-col">
      <RoadPageHeader activeTab="transit" pageTitle="GLOBAL LOGISTICS CONTROL TOWER — ROAD TRANSIT" />

      <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden min-h-0">

        {/* ── TOP KPI STRIP ── */}
        <div className="flex gap-3 shrink-0">
          {/* On-time hero */}
          <div className="sci-fi-panel flex items-center justify-around px-8 py-3" style={{ flex: 2 }}>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">On-Time Delivery</span>
              <span className="text-5xl font-black text-[#10B981]" style={{ textShadow: '0 0 20px rgba(16,185,129,0.7)' }}>
                {d.delayAnalysis.onTimePercent}%
              </span>
              <span className="text-[9px] text-[#475569] mt-1">{d.delayAnalysis.onTimeVehicles} vehicles on schedule</span>
            </div>
            <div className="w-px h-16 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">1-Day</span>
                <span className="text-3xl font-black text-[#F59E0B]">{d.delayAnalysis.delay1Day.vehicles}</span>
                <span className="text-[9px] text-[#475569]">{d.delayAnalysis.delay1Day.percent}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">2-Day</span>
                <span className="text-3xl font-black text-[#F97316]">{d.delayAnalysis.delay2Day.vehicles}</span>
                <span className="text-[9px] text-[#475569]">{d.delayAnalysis.delay2Day.percent}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">3-Day+</span>
                <span className="text-3xl font-black text-[#EF4444]">{d.delayAnalysis.delay3DayPlus.vehicles}</span>
                <span className="text-[9px] text-[#475569]">{d.delayAnalysis.delay3DayPlus.percent}%</span>
              </div>
            </div>
          </div>
          {/* Delivery exceptions */}
          <div className="flex gap-3 shrink-0">
            <MetricCard label="Undelivered" value={d.deliveryStatus.undelivered} sub=">48 hrs" color="#F59E0B" size="sm" />
            <MetricCard label="Missing Dates" value={d.deliveryStatus.missingDates} color="#EF4444" size="sm" />
            <MetricCard label="GPS Connected" value={`${d.gpsHealth.connectedPercent}%`} sub={`${d.gpsHealth.disconnectedVehicles} offline`} color="#10B981" size="sm" />
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* LEFT: Charts & Safety */}
          <div className="w-[42%] flex flex-col gap-3 min-h-0">

            {/* Delay Bar Chart */}
            <div className="sci-fi-panel p-4 flex flex-col" style={{ flex: '3' }}>
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                Delay Analysis
              </h3>
              <div className="flex-1 min-h-0 mt-2">
                <ReactECharts option={delayOption} style={{ height: '100%', width: '100%', minHeight: 160 }} opts={{ renderer: 'svg' }} />
              </div>
            </div>

            {/* GPS Donut + Stats */}
            <div className="flex gap-3" style={{ flex: '2' }}>
              <div className="sci-fi-panel flex-1 p-3 flex flex-col">
                <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">GPS Health</h3>
                <div className="flex-1 relative min-h-0">
                  <ReactECharts option={gpsOption} style={{ height: '100%', width: '100%', minHeight: 100 }} opts={{ renderer: 'svg' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-[#10B981]">{d.gpsHealth.connectedPercent}%</span>
                    <span className="text-[8px] text-[#94A3B8] uppercase tracking-wide">Connected</span>
                  </div>
                </div>
                <p className="text-center text-[9px] text-[#F59E0B] font-bold mt-1">
                  {d.gpsHealth.disconnectedVehicles} Vehicles Offline
                </p>
              </div>

              <div className="sci-fi-panel flex-1 p-3 flex flex-col justify-center gap-3">
                <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">Delivery</h3>
                <div className="flex flex-col items-center p-3 rounded-lg border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.06)]">
                  <span className="text-3xl font-black text-[#F59E0B]" style={{ textShadow: '0 0 12px rgba(245,158,11,0.7)' }}>
                    {d.deliveryStatus.undelivered}
                  </span>
                  <span className="text-[9px] text-[#F59E0B] font-bold uppercase mt-0.5">Undelivered</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)]">
                  <span className="text-3xl font-black text-[#EF4444]" style={{ textShadow: '0 0 12px rgba(239,68,68,0.7)' }}>
                    {d.deliveryStatus.missingDates}
                  </span>
                  <span className="text-[9px] text-[#EF4444] font-bold uppercase mt-0.5">Missing Dates</span>
                </div>
              </div>
            </div>

            {/* Safety Grid */}
            <div className="sci-fi-panel p-3 shrink-0">
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">Safety &amp; Compliance</h3>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <SafetyChip label="Speed Violations" value={d.safety.speed}         color="#F59E0B" icon="⚠️" />
                <SafetyChip label="Drowsy Driving"   value={d.safety.drowsy}        color="#F59E0B" icon="😴" />
                <SafetyChip label="Distraction"      value={d.safety.distraction}   color="#EF4444" icon="📱" />
                <SafetyChip label="Halt No-Parking"  value={d.safety.haltNoParking} color="#F59E0B" icon="🅿️" />
              </div>
            </div>
          </div>

          {/* RIGHT: Map */}
          <div className="flex-1 sci-fi-panel relative overflow-hidden css-grid-bg flex flex-col min-h-0">
            <h3 className="absolute -top-2.5 left-4 z-10 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
              Global Transit Routes — Live
            </h3>

            {/* Route line animation */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }} preserveAspectRatio="none">
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#10B981" />
                </marker>
              </defs>
              <polyline points="5%,50% 25%,30% 50%,45% 75%,25% 95%,40%" stroke="#10B981" strokeWidth="1.5" fill="none" strokeDasharray="6 4" markerEnd="url(#arrowhead)" />
              <polyline points="5%,70% 20%,65% 45%,70% 70%,60% 95%,65%" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
              <polyline points="10%,20% 35%,35% 60%,20% 85%,30%" stroke="#F59E0B" strokeWidth="1" fill="none" strokeDasharray="4 6" />
            </svg>

            {/* Vehicle pings */}
            {[
              { top: '30%', left: '25%', color: '#10B981', label: 'MH-1234', status: 'On Route' },
              { top: '45%', left: '50%', color: '#10B981', label: 'GJ-5678', status: 'On Route' },
              { top: '25%', left: '75%', color: '#F59E0B', label: 'TN-9012', status: '1-Day Late' },
              { top: '65%', left: '20%', color: '#10B981', label: 'DL-3456', status: 'On Route' },
              { top: '60%', left: '60%', color: '#EF4444', label: 'KA-7890', status: 'Breakdown' },
              { top: '20%', left: '55%', color: '#10B981', label: 'WB-2345', status: 'On Route' },
              { top: '70%', left: '80%', color: '#F97316', label: 'RJ-6789', status: '2-Day Late' },
            ].map((v, i) => (
              <div key={i} className="absolute flex flex-col items-center" style={{ top: v.top, left: v.left, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: v.color, boxShadow: `0 0 12px ${v.color}` }} />
                  <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ background: v.color, animationDuration: `${1.5 + i * 0.3}s` }} />
                </div>
                <div className="mt-1 text-center">
                  <div className="text-[8px] font-mono font-bold px-1 rounded" style={{ color: v.color, background: 'rgba(5,10,21,0.9)' }}>{v.label}</div>
                  <div className="text-[7px] text-[#475569]">{v.status}</div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[9px]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>On Route</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>Delayed</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Breakdown</span>
              </div>
              <div className="text-[9px] px-2 py-1 rounded border border-[rgba(59,130,246,0.3)] text-[#3B82F6] font-mono">
                LIVE • {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Centre label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1a2a44] select-none">
                INDIA LOGISTICS NETWORK
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
