import React from 'react';
import ReactECharts from 'echarts-for-react';
import { transitData } from '../../../constants/uiMockData';
import { useNavigate } from 'react-router-dom';

const d = transitData.rail;
const RAIL_BLUE = '#3B82F6';
const RAIL_CYAN = '#06B6D4';

/* ═══════════════════════════════════════════
   MICRO-COMPONENTS
═══════════════════════════════════════════ */

const MetricCard: React.FC<{ label: string; value: number | string; sub?: string; color: string }> = ({ label, value, sub, color }) => (
  <div className="relative flex flex-col items-center justify-center gap-1 p-4 rounded-xl border overflow-hidden"
    style={{ borderColor: `${color}35`, background: `${color}08` }}>
    <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg,transparent,${color}60,transparent)` }} />
    <span className="text-3xl font-black tabular-nums leading-none"
      style={{ color, textShadow: `0 0 16px ${color}80` }}>{value}</span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] text-center leading-tight">{label}</span>
    {sub && <span className="text-[9px]" style={{ color: `${color}99` }}>{sub}</span>}
  </div>
);

const DetentionStat: React.FC<{ label: string; value: string; color: string; note?: string }> = ({ label, value, color, note }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-xl border"
    style={{ borderColor: `${color}35`, background: `${color}08` }}>
    <span className="text-3xl font-black tabular-nums" style={{ color, textShadow: `0 0 12px ${color}80` }}>{value}</span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] text-center mt-0.5">{label}</span>
    {note && <span className="text-[8px] text-[#475569] mt-1 text-center">{note}</span>}
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export const RailTransit: React.FC = () => {
  const navigate = useNavigate();

  /* Delay bar chart — rail theme */
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
      data: ['On-time', '1-Day Late', '2-Day Late', '3-Day+ Late'],
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      axisTick: { show: false },
    },
    yAxis: { show: false },
    series: [{
      type: 'bar',
      barWidth: '45%',
      data: [
        { value: d.delayAnalysis.onTimeRakes, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#3B82F6' }, { offset: 1, color: '#1D4ED8' }] } } },
        { value: d.delayAnalysis.delay1Day.rakes, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#F59E0B' }, { offset: 1, color: '#D97706' }] } } },
        { value: d.delayAnalysis.delay2Day.rakes, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#F97316' }, { offset: 1, color: '#EA580C' }] } } },
        { value: d.delayAnalysis.delay3DayPlus.rakes, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#EF4444' }, { offset: 1, color: '#DC2626' }] } } },
      ],
      label: {
        show: true,
        position: 'top',
        formatter: (p: any) => {
          const pcts = [d.delayAnalysis.onTimePercent, d.delayAnalysis.delay1Day.percent, d.delayAnalysis.delay2Day.percent, d.delayAnalysis.delay3DayPlus.percent];
          return `{pct|${pcts[p.dataIndex]}%}\n{val|${p.value} rakes}`;
        },
        rich: {
          pct: { fontSize: 12, fontWeight: 900, color: '#F1F5F9', lineHeight: 18 },
          val: { fontSize: 9, color: '#94A3B8', lineHeight: 14 },
        },
      },
      itemStyle: { borderRadius: [4, 4, 0, 0] },
    }],
  };

  /* GPS donut — rail blue */
  const gpsOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'pie',
      radius: ['60%', '82%'],
      center: ['50%', '50%'],
      label: { show: false },
      data: [
        { value: d.gpsHealth.connectedPercent, name: 'Connected', itemStyle: { color: RAIL_BLUE, shadowBlur: 10, shadowColor: `${RAIL_BLUE}60` } },
        { value: 100 - d.gpsHealth.connectedPercent, name: 'Offline', itemStyle: { color: 'rgba(255,255,255,0.06)' } },
      ],
      itemStyle: { borderColor: '#050A15', borderWidth: 2 },
    }],
  };

  /* Detention trend line */
  const detentionOption = {
    backgroundColor: 'transparent',
    grid: { left: '2%', right: '2%', top: '8%', bottom: '8%' },
    xAxis: { show: false, type: 'category', data: ['W1','W2','W3','W4','W5','W6','W7','W8'] },
    yAxis: { show: false, min: 0, max: 30 },
    series: [
      {
        type: 'line',
        data: [25, 20, 18, 14, 16, 12, 18, 19],
        smooth: true,
        lineStyle: { color: RAIL_BLUE, width: 2.5 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${RAIL_BLUE}40` }, { offset: 1, color: `${RAIL_BLUE}00` }] } },
        symbol: 'circle', symbolSize: 4,
        itemStyle: { color: RAIL_BLUE, borderColor: '#050A15', borderWidth: 2 },
      },
      {
        type: 'line',
        data: [8, 7, 7, 6, 6, 6, 6, 6],
        smooth: true,
        lineStyle: { color: '#F59E0B', width: 2, type: 'dashed' },
        symbol: 'none',
        name: 'Target',
      },
    ],
  };

  /* Rail network map dots */
  const rakePositions = [
    { top: '22%', left: '18%', color: RAIL_BLUE,   label: 'RAKE-01', status: 'In Transit' },
    { top: '40%', left: '38%', color: RAIL_BLUE,   label: 'RAKE-02', status: 'In Transit' },
    { top: '30%', left: '60%', color: RAIL_BLUE,   label: 'RAKE-03', status: 'In Transit' },
    { top: '60%', left: '25%', color: '#F59E0B',   label: 'RAKE-04', status: '1-Day Late' },
    { top: '55%', left: '72%', color: RAIL_BLUE,   label: 'RAKE-05', status: 'In Transit' },
    { top: '20%', left: '80%', color: '#EF4444',   label: 'RAKE-06', status: 'Detained' },
    { top: '75%', left: '55%', color: RAIL_BLUE,   label: 'RAKE-07', status: 'In Transit' },
    { top: '68%', left: '82%', color: '#F59E0B',   label: 'RAKE-08', status: '2-Day Late' },
  ];

  return (
    <div className="h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-hidden font-sans flex flex-col">

      {/* ── RAIL HEADER (inline — no shared RoadPageHeader) ── */}
      <header className="relative w-full pt-4 pb-2 bg-[#080D1A] border-b border-[rgba(59,130,246,0.3)] z-50 flex flex-col items-center gap-2 shrink-0">
        <div className="w-full flex justify-between px-6 text-[10px] font-bold tracking-widest uppercase absolute top-4">
          <div>
            <span className="text-[#475569]">System Status: </span>
            <span className="text-[#10B981] hud-glow-green">All Systems Operational.</span>
          </div>
          <div className="text-[#F59E0B]">
            ALERT: <span className="text-[#94A3B8]">Rail Network Congestion in Zone B.</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <div className="px-8 py-1 bg-gradient-to-r from-transparent via-[#0F172A] to-transparent border-b-2 border-[#3B82F6]">
            <h1 className="text-sm font-extrabold text-white tracking-widest uppercase hud-glow-blue whitespace-nowrap">
              GLOBAL LOGISTICS CONTROL TOWER — RAIL TRANSIT
            </h1>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => navigate('/rail/outbound')}
              className="px-5 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              Outbound
            </button>
            <button className="px-5 py-1 rounded-full border border-[#06B6D4] bg-[rgba(6,182,212,0.15)] text-white text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-default">
              Transit
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="px-5 py-1 ml-4 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[#EF4444] hover:text-white transition-colors">
              Exit to Root
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden min-h-0">

        {/* ── TOP KPI STRIP ── */}
        <div className="flex gap-3 shrink-0">
          {/* On-time hero */}
          <div className="sci-fi-panel flex items-center justify-around px-8 py-3" style={{ flex: 2 }}>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">On-Time Delivery</span>
              <span className="text-5xl font-black" style={{ color: RAIL_BLUE, textShadow: `0 0 20px ${RAIL_BLUE}90` }}>
                {d.delayAnalysis.onTimePercent}%
              </span>
              <span className="text-[9px] text-[#475569] mt-1">{d.delayAnalysis.onTimeRakes} rakes on schedule</span>
            </div>
            <div className="w-px h-16 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex gap-4">
              {[
                { label: '1-Day', val: d.delayAnalysis.delay1Day.rakes, pct: d.delayAnalysis.delay1Day.percent, color: '#F59E0B' },
                { label: '2-Day', val: d.delayAnalysis.delay2Day.rakes, pct: d.delayAnalysis.delay2Day.percent, color: '#F97316' },
                { label: '3-Day+', val: d.delayAnalysis.delay3DayPlus.rakes, pct: d.delayAnalysis.delay3DayPlus.percent, color: '#EF4444' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">{item.label}</span>
                  <span className="text-3xl font-black" style={{ color: item.color }}>{item.val}</span>
                  <span className="text-[9px] text-[#475569]">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Metric cards */}
          <div className="flex gap-3 shrink-0">
            <MetricCard label="Undelivered Rakes" value={d.deliveryStatus.undelivered} color="#F59E0B" />
            <MetricCard label="Missing Dates" value={d.deliveryStatus.missingDates} color="#EF4444" />
            <MetricCard label="GPS Offline" value={d.gpsHealth.disconnectedRakes} sub="rakes" color={RAIL_BLUE} />
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* LEFT PANEL */}
          <div className="w-[42%] flex flex-col gap-3 min-h-0">

            {/* Delay Bar Chart */}
            <div className="sci-fi-panel p-4 flex flex-col" style={{ flex: '3' }}>
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest" style={{ color: RAIL_CYAN }}>
                Rake Delay Analysis
              </h3>
              <div className="flex-1 min-h-0 mt-2">
                <ReactECharts option={delayOption} style={{ height: '100%', width: '100%', minHeight: 160 }} opts={{ renderer: 'svg' }} />
              </div>
            </div>

            {/* GPS Donut + Delivery */}
            <div className="flex gap-3" style={{ flex: '2' }}>
              <div className="sci-fi-panel flex-1 p-3 flex flex-col">
                <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest" style={{ color: RAIL_CYAN }}>GPS Health</h3>
                <div className="flex-1 relative min-h-0">
                  <ReactECharts option={gpsOption} style={{ height: '100%', width: '100%', minHeight: 100 }} opts={{ renderer: 'svg' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black" style={{ color: RAIL_BLUE }}>{d.gpsHealth.connectedPercent}%</span>
                    <span className="text-[8px] text-[#94A3B8] uppercase tracking-wide">Connected</span>
                  </div>
                </div>
                <p className="text-center text-[9px] text-[#F59E0B] font-bold mt-1">
                  {d.gpsHealth.disconnectedRakes} Rakes Offline
                </p>
              </div>

              <div className="sci-fi-panel flex-1 p-3 flex flex-col justify-center gap-3">
                <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest" style={{ color: RAIL_CYAN }}>Delivery</h3>
                <div className="flex flex-col items-center p-3 rounded-lg border gap-0.5"
                  style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.06)' }}>
                  <span className="text-3xl font-black text-[#F59E0B]" style={{ textShadow: '0 0 12px rgba(245,158,11,0.7)' }}>
                    {d.deliveryStatus.undelivered}
                  </span>
                  <span className="text-[9px] text-[#F59E0B] font-bold uppercase">Undelivered</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg border gap-0.5"
                  style={{ borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)' }}>
                  <span className="text-3xl font-black text-[#EF4444]" style={{ textShadow: '0 0 12px rgba(239,68,68,0.7)' }}>
                    {d.deliveryStatus.missingDates}
                  </span>
                  <span className="text-[9px] text-[#EF4444] font-bold uppercase">Missing Dates</span>
                </div>
              </div>
            </div>

            {/* Detention Metrics */}
            <div className="sci-fi-panel p-3 flex flex-col" style={{ flex: '2' }}>
              <h3 className="absolute -top-2.5 left-4 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest" style={{ color: RAIL_CYAN }}>
                Detention Metrics
              </h3>
              <div className="flex gap-3 mb-2 mt-3 shrink-0">
                <DetentionStat label="Avg Detention" value={`${d.detention.averageDetention}h`} color={RAIL_BLUE} note="Current average" />
                <DetentionStat label="Post-Pilot" value={`${d.detention.postPilot}h`} color="#F59E0B" note="⚠ Above threshold" />
                <DetentionStat label="Improvement" value={`${d.detention.averageDetention - d.detention.postPilot}h`} color="#10B981" note="vs target" />
              </div>
              <div className="flex-1 min-h-0">
                <ReactECharts option={detentionOption} style={{ height: '100%', width: '100%', minHeight: 60 }} opts={{ renderer: 'svg' }} />
              </div>
              <div className="flex items-center gap-4 text-[9px] mt-1 justify-center shrink-0">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: RAIL_BLUE }}></span>Detention hrs</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#F59E0B', borderTop: '1px dashed #F59E0B' }}></span>Target</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Rail Route Map */}
          <div className="flex-1 sci-fi-panel relative overflow-hidden css-grid-bg flex flex-col min-h-0">
            <h3 className="absolute -top-2.5 left-4 z-10 bg-[#050A15] px-3 text-[9px] font-black uppercase tracking-widest" style={{ color: RAIL_CYAN }}>
              Rail Network — Live Rake Positions
            </h3>

            {/* Rail track lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }} preserveAspectRatio="none">
              {/* Main rail corridors */}
              <line x1="5%" y1="40%" x2="95%" y2="40%" stroke={RAIL_BLUE} strokeWidth="2" strokeDasharray="8 4" />
              <line x1="5%" y1="65%" x2="95%" y2="65%" stroke={RAIL_BLUE} strokeWidth="2" strokeDasharray="8 4" />
              <line x1="30%" y1="10%" x2="30%" y2="90%" stroke={RAIL_BLUE} strokeWidth="1.5" strokeDasharray="8 4" />
              <line x1="65%" y1="10%" x2="65%" y2="90%" stroke={RAIL_BLUE} strokeWidth="1.5" strokeDasharray="8 4" />
              {/* Cross routes */}
              <line x1="5%" y1="40%" x2="30%" y2="65%" stroke={RAIL_CYAN} strokeWidth="1" strokeDasharray="4 6" />
              <line x1="65%" y1="40%" x2="95%" y2="65%" stroke={RAIL_CYAN} strokeWidth="1" strokeDasharray="4 6" />
              {/* Station dots */}
              {[['30%','40%'],['65%','40%'],['30%','65%'],['65%','65%']].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="4" fill={RAIL_BLUE} opacity="0.7" />
              ))}
            </svg>

            {/* Rake position pings */}
            {rakePositions.map((r, i) => (
              <div key={i} className="absolute flex flex-col items-center" style={{ top: r.top, left: r.left, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                <div className="relative">
                  {/* Rake icon shape */}
                  <div className="w-5 h-3 rounded-sm flex items-center justify-center"
                    style={{ background: r.color, boxShadow: `0 0 10px ${r.color}` }}>
                    <div className="w-3 h-1.5 border-t-2" style={{ borderColor: 'rgba(5,10,21,0.7)' }} />
                  </div>
                  <div className="absolute inset-0 rounded-sm animate-ping opacity-40" style={{ background: r.color, animationDuration: `${2 + i * 0.4}s` }} />
                </div>
                <div className="mt-1 text-center">
                  <div className="text-[8px] font-mono font-black px-1 rounded" style={{ color: r.color, background: 'rgba(5,10,21,0.9)' }}>{r.label}</div>
                  <div className="text-[7px] text-[#475569]">{r.status}</div>
                </div>
              </div>
            ))}

            {/* Station labels */}
            {[
              { x: '28%', y: '36%', name: 'JMO' },
              { x: '63%', y: '36%', name: 'RNC' },
              { x: '28%', y: '61%', name: 'TATA' },
              { x: '63%', y: '61%', name: 'KGP' },
            ].map((s, i) => (
              <div key={i} className="absolute text-[8px] font-mono font-black" style={{ top: s.y, left: s.x, transform: 'translate(-50%, -200%)', color: RAIL_CYAN, background: 'rgba(5,10,21,0.85)', padding: '1px 4px', borderRadius: 2, zIndex: 5 }}>
                {s.name}
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[9px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm" style={{ background: RAIL_BLUE }}></span>In Transit</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#F59E0B]"></span>Delayed</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-[#EF4444]"></span>Detained</span>
              </div>
              <div className="text-[9px] px-2 py-1 rounded border font-mono"
                style={{ borderColor: `${RAIL_BLUE}40`, color: RAIL_BLUE }}>
                LIVE • {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase select-none" style={{ color: '#0f1e36' }}>
                INDIAN RAIL NETWORK
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
