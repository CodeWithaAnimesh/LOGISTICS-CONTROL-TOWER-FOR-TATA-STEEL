import React from 'react';
import { PageShell } from '../../components/common/PageShell';
import { intraPlantData } from '../../constants/uiMockData';
import ReactECharts from 'echarts-for-react';

// Custom Sci-Fi Ring component
const SciFiRing: React.FC<{ label: string; value: number | string; color: string; subLabel?: string; icon?: React.ReactNode }> = ({ label, value, color, subLabel, icon }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: color, boxShadow: `0 0 10px ${color}, inset 0 0 5px ${color}` }}></div>
        {/* Inner inner border */}
        <div className="absolute inset-2 rounded-full border opacity-50" style={{ borderColor: color }}></div>
        {/* Value */}
        <div className="flex flex-col items-center justify-center z-10 text-center">
          <span className="text-base 2xl:text-lg font-bold leading-none" style={{ color }}>{value}</span>
          {icon && <div className="mt-0.5 opacity-80 text-[8px]" style={{ color }}>{icon}</div>}
        </div>
      </div>
      <span className="text-[9px] 2xl:text-[10px] font-medium text-[#94A3B8] mt-1 whitespace-nowrap text-center">{label}</span>
      {subLabel && <span className="text-[8px] text-[#475569]">{subLabel}</span>}
    </div>
  );
};

const GaugeChart: React.FC<{ label: string; value: string; subtext: string; color: string }> = ({ label, value, subtext, color }) => {
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '100%',
        center: ['50%', '75%'],
        splitNumber: 1,
        itemStyle: { color: color },
        progress: { show: true, width: 8 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(255,255,255,0.05)']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          show: true,
          offsetCenter: [0, '-10%'],
          formatter: value,
          color: color,
          fontSize: 16,
          fontWeight: 'bold',
          textShadowBlur: 5,
          textShadowColor: color
        },
        data: [{ value: parseInt(value, 10) || 75 }]
      }
    ]
  };
  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-[9px] 2xl:text-[10px] text-[#94A3B8] mb-1 font-semibold">{label}</span>
      <div className="w-full h-[60px] 2xl:h-[70px] relative">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] 2xl:text-[9px] text-[#475569] leading-tight" dangerouslySetInnerHTML={{ __html: subtext.replace('\n', '<br/>') }}></div>
      </div>
    </div>
  );
};

const SafetyBox: React.FC<{ label: string; value: number; type: 'warning' | 'danger' | 'info' | 'success'; icon?: string }> = ({ label, value, type, icon }) => {
  const colors = {
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    success: '#10B981'
  };
  const color = colors[type];
  
  return (
    <div className="relative flex items-center justify-between px-2 py-1.5 border rounded-md" style={{ borderColor: color, backgroundColor: 'rgba(11,18,32,0.6)' }}>
       <div className="flex items-center gap-1.5">
         {icon && <span style={{ color }} className="text-xs font-bold">{icon}</span>}
         <span className="text-[8px] 2xl:text-[9px] leading-tight font-semibold" style={{ color: '#94A3B8' }} dangerouslySetInnerHTML={{__html: label}}></span>
       </div>
       <div className="flex items-center gap-1">
         <span className="text-lg font-bold" style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</span>
       </div>
    </div>
  );
};

export const IntraPlantDashboard: React.FC = () => {
  const data = intraPlantData;

  return (
    <div className="min-h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-x-hidden font-sans flex flex-col">
      {/* Relative Header with Padding to prevent overlap */}
      <header className="relative w-full pt-4 pb-2 bg-[#080D1A] border-b border-[rgba(59,130,246,0.3)] z-50 flex flex-col items-center gap-2">
         
         <div className="w-full flex justify-between px-6 text-[10px] font-bold tracking-widest uppercase absolute top-4">
            <div>
              <span className="text-[#475569]">System Status: </span>
              <span className="text-[#10B981] hud-glow-green">All Systems Operational.</span>
            </div>
            <div className="text-[#F59E0B]">
              ALERT: <span className="text-[#94A3B8]">Critical Road Vehicle Breakdown in Sector C.</span>
            </div>
         </div>
         
         <div className="flex flex-col items-center mt-4">
            <div className="px-8 py-1 bg-gradient-to-r from-transparent via-[#0F172A] to-transparent border-b-2 border-[#3B82F6]">
               <h1 className="text-sm 2xl:text-base font-extrabold text-white tracking-widest uppercase hud-glow-blue whitespace-nowrap">GLOBAL LOGISTICS CONTROL TOWER - INTRA PLANT OPERATIONS</h1>
            </div>
            {/* Tabs */}
            <div className="flex gap-4 mt-2">
               <button className="px-6 py-1 rounded-full border border-[#06B6D4] bg-[rgba(6,182,212,0.15)] text-white text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.4)]">Intra Plant</button>
               <button className="px-6 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)]">Transit</button>
               <button className="px-6 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)]">Reports</button>
            </div>
         </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 w-full p-2 lg:p-4 flex flex-col gap-4 relative mx-auto">
         
         {/* Top Data Strip */}
         <div className="flex justify-between items-stretch gap-4">
            
            {/* Road Asset Status Rings */}
            <div className="sci-fi-panel w-[30%] flex flex-col justify-center px-4 py-4">
               <h3 className="absolute -top-3 left-4 bg-[#050A15] px-2 text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider">Asset Status</h3>
               <div className="flex justify-around items-center w-full">
                 <SciFiRing label="Running" value={102} color="#10B981" icon="🚚" />
                 <SciFiRing label="Not Running" value={25} color="#06B6D4" icon="🚚" />
                 <SciFiRing label="Breakdown" value={7} color="#F59E0B" icon="🛠" />
                 <SciFiRing label="Available" value={6} color="#3B82F6" icon="✔" />
               </div>
            </div>

            {/* OVERALL PLANT EFFICIENCY (Center Header) */}
            <div className="w-[40%] flex flex-col relative bg-[rgba(11,18,32,0.8)] border border-[rgba(6,182,212,0.5)] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)] py-3">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#050A15] px-4">
                  <h2 className="text-xs font-bold text-[#06B6D4] tracking-widest uppercase hud-glow-blue whitespace-nowrap">OVERALL PLANT EFFICIENCY</h2>
               </div>
               <div className="flex flex-1 items-center mt-2">
                  <div className="flex-1 flex flex-col items-center justify-center border-r border-dashed border-[rgba(255,255,255,0.2)]">
                     <span className="text-[9px] font-bold text-white uppercase mb-1">Efficiency</span>
                     <div className="flex items-start">
                        <span className="text-4xl font-extrabold text-[#10B981] hud-glow-green leading-none">96.2%</span>
                     </div>
                     <span className="text-[9px] text-[#475569] mt-1">Target: 95%</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center border-r border-dashed border-[rgba(255,255,255,0.2)]">
                     <span className="text-[9px] font-bold text-white uppercase mb-1">Total Assets</span>
                     <span className="text-3xl font-extrabold text-[#3B82F6] hud-glow-blue">285</span>
                     <span className="text-[8px] text-[#94A3B8] text-center mt-1">140 Road / 145 Rail</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center">
                     <span className="text-[9px] font-bold text-white uppercase mb-1">Pending Alerts</span>
                     <span className="text-3xl font-extrabold text-[#F59E0B] drop-shadow-[0_0_8px_#F59E0B]">18</span>
                     <span className="text-[8px] text-[#F59E0B] text-center mt-1">High Priority: 3</span>
                  </div>
               </div>
            </div>

            {/* Rail Asset Status Rings */}
            <div className="sci-fi-panel w-[30%] flex flex-col justify-center px-4 py-4">
               <h3 className="absolute -top-3 left-4 bg-[#050A15] px-2 text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider">Rail Asset Status</h3>
               <div className="flex justify-around items-center w-full">
                 <SciFiRing label="Running" value={115} color="#10B981" icon="🚆" />
                 <SciFiRing label="Not Running" value={18} color="#3B82F6" icon="🚆" />
                 <SciFiRing label="Breakdown" value={4} color="#F59E0B" icon="🛠" />
                 <SciFiRing label="Available" value={8} color="#06B6D4" icon="✔" />
               </div>
            </div>
         </div>

         {/* Bottom Split Area (FORCED side by side using Flex) */}
         <div className="flex w-full gap-4 pb-4">
            
            {/* ROAD OPERATIONS PANEL */}
            <div className="sci-fi-panel w-1/2 flex flex-col p-4 gap-4">
               <h2 className="absolute -top-3 left-8 bg-[#050A15] px-3 py-1 text-sm font-bold text-[#06B6D4] uppercase tracking-widest border border-[#06B6D4] rounded-full hud-glow-blue">ROAD OPERATIONS</h2>
               
               <div className="flex w-full gap-4 mt-2">
                  {/* Left Column: Metrics */}
                  <div className="w-[35%] flex flex-col gap-4">
                     {/* GPS Status */}
                     <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 flex-1 justify-center">
                        <h3 className="text-[10px] text-white font-semibold mb-3">GPS Status</h3>
                        <div className="flex justify-around items-center">
                           <SciFiRing label="Running" value={102} color="#10B981" />
                           <SciFiRing label="Not Running" value={25} color="#06B6D4" />
                        </div>
                     </div>
                     {/* Asset Utilization */}
                     <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 flex-1 justify-center">
                        <h3 className="text-[10px] text-white font-semibold mb-3">Road Asset Utilization</h3>
                        <div className="flex justify-around items-end">
                           <GaugeChart label="Idle Hours" value="45" subtext="Last 24h: 38 hrs" color="#06B6D4" />
                           <GaugeChart label="Asset Utilization" value="88%" subtext="Target: 85%" color="#10B981" />
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Real-time Map with CSS Grid Background */}
                  <div className="w-[65%] border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.5)] min-h-[250px] relative overflow-hidden flex flex-col p-3 css-grid-bg">
                     <h3 className="text-[10px] text-white font-semibold relative z-10">Real-time Road GPS Map</h3>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[10px] border border-[#3B82F6] bg-[rgba(59,130,246,0.1)] px-4 py-2 absolute z-20 shadow-[0_0_10px_rgba(59,130,246,0.5)]">3D Asset Map Overlay Active</div>
                     </div>
                  </div>
               </div>

               {/* Bottom Row: Safety & Performance */}
               <div className="flex w-full gap-4">
                  {/* Safety & Compliance */}
                  <div className="w-[60%] border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3">
                     <h3 className="text-[10px] text-white font-semibold mb-3">Road Safety & Compliance</h3>
                     <div className="grid grid-cols-3 gap-2">
                        <SafetyBox label="Speed<br/>Violations" value={25} type="warning" icon="⚠" />
                        <SafetyBox label="Drowsy<br/>Driving" value={10} type="warning" icon="⚠" />
                        <SafetyBox label="Distraction" value={15} type="warning" icon="📱" />
                        <SafetyBox label="No Entry" value={0} type="info" icon="⛔" />
                        <SafetyBox label="Restricted" value={2} type="success" icon="⚠" />
                        <SafetyBox label="No Parking" value={8} type="warning" icon="Ⓟ" />
                     </div>
                  </div>
                  {/* Operator Performance */}
                  <div className="w-[40%] border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3">
                     <h3 className="text-[10px] text-white font-semibold mb-3">Operator Performance</h3>
                     <div className="flex flex-1 items-end border-b border-[rgba(255,255,255,0.1)] pb-2 relative">
                        {[95, 88, 30].map((score, i) => (
                           <div key={i} className="flex-1 flex flex-col items-center px-1">
                              <div className="w-full max-w-[20px] bg-[#10B981] shadow-[0_0_8px_#10B981]" style={{ height: `${score}%` }}></div>
                              <div className="w-full max-w-[20px] bg-[#F59E0B]" style={{ height: `${100-score}%` }}></div>
                              <span className="text-[8px] mt-1">OP-10{i+1}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* RAIL OPERATIONS PANEL */}
            <div className="sci-fi-panel w-1/2 flex flex-col p-4 gap-4">
               <h2 className="absolute -top-3 left-8 bg-[#050A15] px-3 py-1 text-sm font-bold text-[#06B6D4] uppercase tracking-widest border border-[#06B6D4] rounded-full hud-glow-blue">RAIL OPERATIONS</h2>
               
               <div className="flex w-full gap-4 mt-2">
                  {/* Left Column: Metrics */}
                  <div className="w-[45%] flex flex-col gap-4">
                     {/* GPS & Pilot Status */}
                     <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex p-3 flex-1">
                        <div className="flex-1 flex flex-col border-r border-[rgba(255,255,255,0.1)] pr-3">
                           <h3 className="text-[10px] text-white font-semibold mb-3">GPS Status</h3>
                           <div className="flex justify-around items-center">
                              <SciFiRing label="Running" value={102} color="#10B981" />
                           </div>
                        </div>
                        <div className="flex-1 flex flex-col pl-3 justify-center">
                           <h3 className="text-[10px] text-white font-semibold mb-3">Pilot Status</h3>
                           <div className="flex items-center justify-around">
                              <SciFiRing label="" value={6} color="#10B981" />
                           </div>
                        </div>
                     </div>
                     {/* Asset Utilization */}
                     <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 flex-1 justify-center">
                        <h3 className="text-[10px] text-white font-semibold mb-3">Rail Asset Utilization</h3>
                        <div className="flex justify-around items-end">
                           <GaugeChart label="Idle Hours" value="60" subtext="Last 24h: 48 hrs" color="#06B6D4" />
                           <GaugeChart label="Asset Utilization" value="92%" subtext="Target: 90%" color="#10B981" />
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Real-time Map with CSS Grid Background */}
                  <div className="w-[55%] border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.5)] min-h-[250px] relative overflow-hidden flex flex-col p-3 css-grid-bg">
                     <h3 className="text-[10px] text-white font-semibold relative z-10">Real-time Rail GPS Map</h3>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[10px] border border-[#3B82F6] bg-[rgba(59,130,246,0.1)] px-4 py-2 absolute z-20 shadow-[0_0_10px_rgba(59,130,246,0.5)]">3D Rail Map Overlay Active</div>
                     </div>
                  </div>
               </div>

               {/* Bottom Row: Safety & Performance */}
               <div className="flex w-full gap-4">
                  {/* Safety & Compliance */}
                  <div className="w-[60%] border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3">
                     <h3 className="text-[10px] text-white font-semibold mb-3">Rail Safety & Compliance</h3>
                     <div className="grid grid-cols-3 gap-2">
                        <SafetyBox label="Speed<br/>Violations" value={5} type="warning" icon="⚠" />
                        <SafetyBox label="Distractive" value={0} type="success" icon="✔" />
                        <SafetyBox label="Drowsy" value={1} type="warning" icon="⚠" />
                     </div>
                  </div>
                  {/* Operator Performance */}
                  <div className="w-[40%] border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3">
                     <h3 className="text-[10px] text-white font-semibold mb-3">Operator Performance</h3>
                     <div className="flex flex-1 items-end border-b border-[rgba(255,255,255,0.1)] pb-2 relative">
                        {[92, 85, 20].map((score, i) => (
                           <div key={i} className="flex-1 flex flex-col items-center px-1">
                              <div className="w-full max-w-[20px] bg-[#10B981] shadow-[0_0_8px_#10B981]" style={{ height: `${score}%` }}></div>
                              <div className="w-full max-w-[20px] bg-[#F59E0B]" style={{ height: `${100-score}%` }}></div>
                              <span className="text-[8px] mt-1">OP-20{i+1}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};
