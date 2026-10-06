import React from 'react';
import ReactECharts from 'echarts-for-react';
import { intraPlantData } from '../../../constants/uiMockData';
import { RoadPageHeader } from '../../../components/road/RoadPageHeader';
import { useNavigate } from 'react-router-dom';

const d = intraPlantData;

/* ═══════════════════════════════════════════
   SHARED MICRO-COMPONENTS
═══════════════════════════════════════════ */

const StatPill: React.FC<{ label: string; value: number | string; color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border"
    style={{ borderColor: `${color}40`, background: `${color}10` }}>
    <span className="text-2xl font-black tabular-nums" style={{ color, textShadow: `0 0 12px ${color}80` }}>{value}</span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] text-center leading-tight">{label}</span>
  </div>
);

const GlowBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">{label}</span>
        <span className="text-sm font-black tabular-nums" style={{ color }}>{value}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}` }} />
      </div>
    </div>
  );
};

const SafetyChip: React.FC<{ label: string; value: number; color: string; icon: string }> = ({ label, value, color, icon }) => (
  <div className="flex items-center justify-between px-3 py-2 rounded-lg border gap-3"
    style={{ borderColor: `${color}40`, background: `${color}0A` }}>
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-semibold text-[#94A3B8] leading-tight">{label}</span>
    </div>
    <span className="text-xl font-black tabular-nums shrink-0" style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</span>
  </div>
);

const OperatorCard: React.FC<{ id: string; score: number; rank: number }> = ({ id, score, rank }) => {
  const color = rank === 1 ? '#F59E0B' : rank === 2 ? '#94A3B8' : '#CD7F32';
  const barColor = score >= 90 ? '#10B981' : score >= 80 ? '#3B82F6' : '#F59E0B';
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors">
      <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0"
        style={{ borderColor: color, color }}>{rank}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-bold text-white font-mono">{id}</span>
          <span className="text-sm font-black" style={{ color: barColor }}>{score}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.06)]">
          <div className="h-full rounded-full" style={{ width: `${score}%`, background: barColor, boxShadow: `0 0 6px ${barColor}` }} />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export const RoadIntraPlant: React.FC = () => {
  const navigate = useNavigate();
  const road = d.road;

  /* Asset donut chart */
  const assetDonutOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(8,13,26,0.95)',
      borderColor: 'rgba(59,130,246,0.3)',
      textStyle: { color: '#F1F5F9', fontSize: 11 },
    },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['48%', '75%'],
      center: ['50%', '52%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: [
        { value: road.assetStatus.running,    name: 'Running',    itemStyle: { color: '#10B981' } },
        { value: road.assetStatus.notRunning, name: 'Not Running',itemStyle: { color: '#06B6D4' } },
        { value: road.assetStatus.breakdown,  name: 'Breakdown',  itemStyle: { color: '#F59E0B' } },
        { value: road.assetStatus.available,  name: 'Available',  itemStyle: { color: '#3B82F6' } },
      ],
      emphasis: { itemStyle: { shadowBlur: 15 } },
      itemStyle: { borderColor: '#050A15', borderWidth: 2 },
    }],
  };

  /* Utilization radial bar */
  const utilizationOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 200, endAngle: -20,
      min: 0, max: 100,
      radius: '90%',
      center: ['50%', '60%'],
      pointer: { show: false },
      progress: { show: true, width: 14, itemStyle: { color: '#10B981', shadowBlur: 10, shadowColor: '#10B98160' } },
      axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(255,255,255,0.06)']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      detail: {
        show: true, offsetCenter: [0, '0%'],
        formatter: `{val|${road.utilization.utilizationPercent}%}\n{sub|Utilization}`,
        rich: {
          val: { fontSize: 26, fontWeight: 900, color: '#10B981', lineHeight: 36 },
          sub: { fontSize: 9, color: '#94A3B8', lineHeight: 18, letterSpacing: 2 },
        },
      },
      data: [{ value: road.utilization.utilizationPercent }],
    }],
  };

  return (
    <div className="h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-hidden font-sans flex flex-col">
      <RoadPageHeader activeTab="intra-plant" pageTitle="GLOBAL LOGISTICS CONTROL TOWER — ROAD INTRA PLANT" />

      {/* ── CONTENT ── */}
      <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden min-h-0">

        {/* ── TOP KPI STRIP ── */}
        <div className="flex gap-3 shrink-0">
          {/* Efficiency hero */}
          <div className="flex-1 sci-fi-panel flex items-center justify-around px-6 py-3">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Overall Efficiency</span>
              <span className="text-5xl font-black text-[#10B981] leading-none" style={{ textShadow: '0 0 20px rgba(16,185,129,0.7)' }}>96.2%</span>
              <span className="text-[9px] text-[#475569] mt-1">Target: 95%</span>
            </div>
            <div className="w-px h-16 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Total Assets</span>
              <span className="text-4xl font-black text-[#3B82F6]" style={{ textShadow: '0 0 16px rgba(59,130,246,0.6)' }}>285</span>
              <span className="text-[9px] text-[#475569] mt-1">140 Road / 145 Rail</span>
            </div>
            <div className="w-px h-16 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Pending Alerts</span>
              <span className="text-4xl font-black text-[#F59E0B]" style={{ textShadow: '0 0 16px rgba(245,158,11,0.6)' }}>18</span>
              <span className="text-[9px] text-[#F59E0B] mt-1">High Priority: 3</span>
            </div>
            <div className="w-px h-16 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Idle Time</span>
              <span className="text-4xl font-black text-[#06B6D4]" style={{ textShadow: '0 0 16px rgba(6,182,212,0.6)' }}>45m</span>
              <span className="text-[9px] text-[#475569] mt-1">Last 24h: 38 hrs</span>
            </div>
          </div>

          {/* Asset status pills */}
          <div className="flex gap-2 shrink-0">
            <StatPill label="Running"     value={road.assetStatus.running}    color="#10B981" />
            <StatPill label="Not Running" value={road.assetStatus.notRunning} color="#06B6D4" />
            <StatPill label="Breakdown"   value={road.assetStatus.breakdown}  color="#F59E0B" />
            <StatPill label="Available"   value={road.assetStatus.available}  color="#3B82F6" />
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* LEFT PANEL: Metrics */}
          <div className="w-[38%] flex flex-col gap-3 min-h-0">

            {/* Asset Donut */}
            <div className="sci-fi-panel flex flex-col p-4" style={{ flex: '2' }}>
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                Asset Status Distribution
              </h3>
              <div className="flex flex-1 gap-4 mt-2 min-h-0">
                <div className="flex-1 min-h-0">
                  <ReactECharts option={assetDonutOption} style={{ height: '100%', width: '100%', minHeight: 140 }} opts={{ renderer: 'svg' }} />
                </div>
                <div className="flex flex-col justify-center gap-2.5 pr-2">
                  {[
                    { label: 'Running',     value: road.assetStatus.running,    color: '#10B981' },
                    { label: 'Not Running', value: road.assetStatus.notRunning, color: '#06B6D4' },
                    { label: 'Breakdown',   value: road.assetStatus.breakdown,  color: '#F59E0B' },
                    { label: 'Available',   value: road.assetStatus.available,  color: '#3B82F6' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                      <span className="text-[10px] text-[#94A3B8]">{item.label}</span>
                      <span className="ml-auto text-sm font-black tabular-nums" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Utilization Gauge + GPS */}
            <div className="flex gap-3" style={{ flex: '1.5' }}>
              <div className="sci-fi-panel flex-1 p-3 flex flex-col">
                <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                  Utilization
                </h3>
                <div className="flex-1 min-h-0 mt-1">
                  <ReactECharts option={utilizationOption} style={{ height: '100%', width: '100%', minHeight: 100 }} opts={{ renderer: 'svg' }} />
                </div>
                <div className="mt-1">
                  <GlowBar label="Idle Mins" value={road.utilization.idleMins} max={120} color="#06B6D4" />
                </div>
              </div>

              <div className="sci-fi-panel flex-1 p-3 flex flex-col">
                <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                  GPS Status
                </h3>
                <div className="flex-1 flex flex-col justify-center gap-3 mt-2">
                  <div className="flex flex-col items-center p-3 rounded-lg border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)]">
                    <span className="text-3xl font-black text-[#10B981]" style={{ textShadow: '0 0 12px rgba(16,185,129,0.7)' }}>
                      {road.gpsStatus.running}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#10B981] mt-0.5">Active GPS</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)]">
                    <span className="text-3xl font-black text-[#EF4444]" style={{ textShadow: '0 0 12px rgba(239,68,68,0.7)' }}>
                      {road.gpsStatus.notRunning}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#EF4444] mt-0.5">GPS Offline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operator Performance */}
            <div className="sci-fi-panel p-4 flex flex-col" style={{ flex: '1.5' }}>
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                Operator Performance
              </h3>
              <div className="flex flex-col gap-2 mt-3">
                {road.operators.top.map((op, i) => (
                  <OperatorCard key={op.id} id={op.id} score={op.score} rank={i + 1} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Map + Safety */}
          <div className="flex-1 flex flex-col gap-3 min-h-0">

            {/* Plant GPS Map */}
            <div className="flex-1 sci-fi-panel relative overflow-hidden css-grid-bg min-h-0">
              <h3 className="absolute -top-2.5 left-4 z-10 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                Real-time Plant GPS Map
              </h3>

              {/* Animated vehicle dots */}
              {[
                { top: '25%', left: '20%', color: '#10B981', label: 'V-101' },
                { top: '55%', left: '45%', color: '#10B981', label: 'V-102' },
                { top: '35%', left: '70%', color: '#F59E0B', label: 'V-103' },
                { top: '70%', left: '25%', color: '#10B981', label: 'V-104' },
                { top: '15%', left: '60%', color: '#EF4444', label: 'V-105' },
                { top: '80%', left: '65%', color: '#10B981', label: 'V-106' },
                { top: '45%', left: '85%', color: '#10B981', label: 'V-107' },
              ].map((dot, i) => (
                <div key={i} className="absolute flex flex-col items-center" style={{ top: dot.top, left: dot.left, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full" style={{ background: dot.color, boxShadow: `0 0 10px ${dot.color}` }} />
                    <div className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: dot.color }} />
                  </div>
                  <span className="text-[8px] font-mono font-bold mt-1 px-1 rounded" style={{ color: dot.color, background: 'rgba(5,10,21,0.85)' }}>{dot.label}</span>
                </div>
              ))}

              {/* Route lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
                <polyline points="20%,25% 45%,55% 70%,35%" stroke="#10B981" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
                <polyline points="25%,70% 45%,55% 85%,45%" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
              </svg>

              {/* Map info overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[9px]">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Moving</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>Halted</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Breakdown</span>
                </div>
                <div className="text-[9px] px-2 py-1 rounded border border-[rgba(59,130,246,0.3)] text-[#3B82F6] font-mono">
                  LIVE • {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Safety Grid */}
            <div className="sci-fi-panel p-4 shrink-0">
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest text-[#06B6D4]">
                Road Safety &amp; Compliance
              </h3>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <SafetyChip label="Speed Violations" value={road.safety.speed}         color="#F59E0B" icon="⚠️" />
                <SafetyChip label="Drowsy Driving"   value={road.safety.drowsy}        color="#F59E0B" icon="😴" />
                <SafetyChip label="Distraction"      value={road.safety.distraction}   color="#EF4444" icon="📱" />
                <SafetyChip label="No Entry"         value={road.safety.noEntry}        color="#3B82F6" icon="⛔" />
                <SafetyChip label="Restricted Zone"  value={road.safety.restricted}    color="#10B981" icon="🚧" />
                <SafetyChip label="Halt No Parking"  value={road.safety.haltNoParking} color="#F59E0B" icon="🅿️" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
