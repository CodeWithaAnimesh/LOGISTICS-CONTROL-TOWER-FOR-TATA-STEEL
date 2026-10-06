import React from 'react';
import { PageShell } from '../../components/common/PageShell';
import { transitData } from '../../constants/uiMockData';
import ReactECharts from 'echarts-for-react';

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

const DelayBarChart: React.FC<{ data: any, color: string }> = ({ data, color }) => {
  const option = {
    grid: { left: '10%', right: '5%', top: '20%', bottom: '20%' },
    xAxis: {
      type: 'category',
      data: ['On-time', '1-day', '2-day', '3-day+'],
      axisLabel: { color: '#94A3B8', fontSize: 9 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: { show: false },
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        data: [
          { value: data.onTimeVehicles || data.onTimeRakes, itemStyle: { color } },
          { value: data.delay1Day.vehicles || data.delay1Day.rakes, itemStyle: { color: '#F59E0B' } },
          { value: data.delay2Day.vehicles || data.delay2Day.rakes, itemStyle: { color: '#F59E0B' } },
          { value: data.delay3DayPlus.vehicles || data.delay3DayPlus.rakes, itemStyle: { color: '#3B82F6' } },
        ],
        label: {
          show: true,
          position: 'top',
          formatter: (p: any) => {
            const percentages = [data.onTimePercent, data.delay1Day.percent, data.delay2Day.percent, data.delay3DayPlus.percent];
            const labels = [`${data.onTimeVehicles || data.onTimeRakes} Veh`, `${data.delay1Day.vehicles || data.delay1Day.rakes} Veh`, `${data.delay2Day.vehicles || data.delay2Day.rakes} Veh`, `${data.delay3DayPlus.vehicles || data.delay3DayPlus.rakes} Veh`];
            return `{per|${percentages[p.dataIndex]}%}\n{val|${labels[p.dataIndex]}}`;
          },
          rich: {
            per: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
            val: { color: 'white', fontSize: 8 }
          }
        },
        itemStyle: { borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1 }
      }
    ]
  };
  
  if (data.onTimeVehicles !== undefined) {
    option.series[0].label.rich.per.color = '#10B981'; // Green for road
  }

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />;
};

const GPSDonut: React.FC<{ connected: number, disconnected: number, color: string, subtext: string }> = ({ connected, disconnected, color, subtext }) => {
  const option = {
    series: [
      {
        type: 'pie',
        radius: ['65%', '85%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: connected, itemStyle: { color: color, shadowBlur: 10, shadowColor: color } },
          { value: disconnected, itemStyle: { color: 'rgba(255,255,255,0.1)' } }
        ]
      }
    ]
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div className="w-[80px] h-[80px] relative">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white hud-glow-blue">{connected}%</span>
        </div>
      </div>
      <span className="text-[9px] text-[#F59E0B] mt-2 font-bold text-center">{subtext}</span>
    </div>
  );
};

const DetentionLineChart: React.FC<{ data: any }> = ({ data }) => {
  const option = {
    grid: { left: '10%', right: '5%', top: '10%', bottom: '15%' },
    xAxis: { show: false, type: 'category', data: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    yAxis: { show: false, type: 'value', min: 0, max: 25 },
    series: [
      {
        type: 'line',
        data: [25, 18, 12, 8, 15, 10, 18, 19],
        smooth: true,
        lineStyle: { color: '#3B82F6', width: 2 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]
          }
        },
        symbol: 'none'
      },
      {
        type: 'line',
        data: [8, 6, 5, 6, 7, 6, 6, 6],
        smooth: true,
        lineStyle: { color: '#F59E0B', width: 2 },
        symbol: 'none'
      }
    ]
  };
  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />;
};

export const TransitDashboard: React.FC = () => {
  const data = transitData;

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
               <h1 className="text-sm 2xl:text-base font-extrabold text-white tracking-widest uppercase hud-glow-blue whitespace-nowrap">GLOBAL LOGISTICS CONTROL TOWER - OUTBOUND OPERATIONS</h1>
            </div>
            {/* Tabs */}
            <div className="flex gap-4 mt-2">
               <button className="px-6 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)]">Intra Plant</button>
               <button className="px-6 py-1 rounded-full border-[#06B6D4] bg-[rgba(6,182,212,0.15)] text-white text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.4)]">Transit</button>
               <button className="px-6 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)]">Reports</button>
            </div>
         </div>
      </header>

      {/* Main Content Layout - Forced Side-by-Side Flex! */}
      <div className="flex-1 w-full p-4 flex gap-4 relative mx-auto">
         
         {/* LEFT: ROAD TRANSIT OPERATIONS */}
         <div className="w-[30%] sci-fi-panel flex flex-col p-4 gap-4">
            <h2 className="absolute -top-3 left-8 bg-[#050A15] px-3 py-1 text-sm font-bold text-[#06B6D4] uppercase tracking-widest border border-[#06B6D4] rounded-full hud-glow-blue z-10">ROAD TRANSIT OPERATIONS</h2>
            
            {/* Delay Analysis */}
            <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 relative mt-2 h-[150px]">
               <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3 z-10">Delay Analysis (Road)</h3>
               <div className="absolute top-3 right-3 text-right z-10">
                  <div className="text-2xl font-bold text-[#10B981] leading-none hud-glow-green">{data.road.delayAnalysis.onTimePercent}%</div>
                  <div className="text-[9px] text-[#94A3B8]">{data.road.delayAnalysis.onTimeVehicles} Vehicles</div>
               </div>
               <div className="flex-1 mt-6">
                  <DelayBarChart data={data.road.delayAnalysis} color="#10B981" />
               </div>
            </div>

            {/* Middle row: Delivery Status & GPS */}
            <div className="grid grid-cols-2 gap-4 h-[120px]">
               <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 justify-center gap-4 relative">
                  <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3">Delivery Status</h3>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="text-[#F59E0B] text-xl font-bold drop-shadow-[0_0_5px_#F59E0B]">⚠</div>
                     <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#F59E0B] leading-none">{data.road.deliveryStatus.undelivered}</span>
                        <span className="text-[9px] text-[#94A3B8] leading-tight">Undelivered</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="text-[#F59E0B] text-xl font-bold drop-shadow-[0_0_5px_#F59E0B]">⚠</div>
                     <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#F59E0B] leading-none">{data.road.deliveryStatus.missingDates}</span>
                        <span className="text-[9px] text-[#94A3B8] leading-tight">Missing Dates</span>
                     </div>
                  </div>
               </div>
               <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 relative">
                  <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3">GPS Health</h3>
                  <div className="flex-1 mt-4">
                    <GPSDonut 
                       connected={data.road.gpsHealth.connectedPercent} 
                       disconnected={data.road.gpsHealth.disconnectedPercent} 
                       color="#10B981"
                       subtext={`${data.road.gpsHealth.disconnectedVehicles} Veh Offline`}
                    />
                  </div>
               </div>
            </div>

            {/* Safety & Compliance */}
            <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 flex-1">
               <h3 className="text-[10px] text-white font-semibold mb-3">Road Safety & Compliance</h3>
               <div className="grid grid-cols-2 gap-2 flex-1 items-start">
                  <SafetyBox label="Speed<br/>Violations" value={data.road.safety.speed} type="warning" icon="⚠" />
                  <SafetyBox label="Drowsy<br/>Driving" value={data.road.safety.drowsy} type="warning" icon="⚠" />
                  <SafetyBox label="Distraction" value={data.road.safety.distraction} type="warning" icon="📱" />
                  <SafetyBox label="No Entry" value={data.road.safety.noEntry} type="info" icon="⛔" />
                  <SafetyBox label="Restricted" value={data.road.safety.restricted} type="success" icon="⚠" />
                  <SafetyBox label="No Parking" value={data.road.safety.haltNoParking} type="warning" icon="Ⓟ" />
               </div>
            </div>
         </div>

         {/* CENTER: MAP */}
         <div className="w-[40%] sci-fi-panel flex flex-col relative overflow-hidden css-grid-bg">
            <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
               <h2 className="text-white text-sm font-bold uppercase tracking-widest bg-[rgba(11,18,32,0.9)] px-6 py-2 rounded-full border border-[rgba(59,130,246,0.5)] shadow-[0_0_15px_rgba(59,130,246,0.3)] hud-glow-blue">GLOBAL TRANSIT ROUTES</h2>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-xs border border-[#3B82F6] bg-[rgba(59,130,246,0.1)] px-6 py-3 absolute z-20 shadow-[0_0_15px_rgba(59,130,246,0.5)] font-bold tracking-widest uppercase hud-glow-blue">Live Logistics Map Overlay Active</div>
            </div>
         </div>

         {/* RIGHT: RAIL TRANSIT OPERATIONS */}
         <div className="w-[30%] sci-fi-panel flex flex-col p-4 gap-4">
            <h2 className="absolute -top-3 left-8 bg-[#050A15] px-3 py-1 text-sm font-bold text-[#06B6D4] uppercase tracking-widest border border-[#06B6D4] rounded-full hud-glow-blue z-10">RAIL TRANSIT OPERATIONS</h2>
            
            {/* Delay Analysis */}
            <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 relative mt-2 h-[150px]">
               <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3 z-10">Delay Analysis (Rail)</h3>
               <div className="absolute top-3 right-3 text-right z-10">
                  <div className="text-2xl font-bold text-[#10B981] leading-none hud-glow-green">{data.rail.delayAnalysis.onTimePercent}%</div>
                  <div className="text-[9px] text-[#94A3B8]">{data.rail.delayAnalysis.onTimeRakes} Rakes</div>
               </div>
               <div className="flex-1 mt-6">
                  <DelayBarChart data={data.rail.delayAnalysis} color="#10B981" />
               </div>
            </div>

            {/* Middle row: Delivery Status & GPS */}
            <div className="grid grid-cols-2 gap-4 h-[120px]">
               <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 justify-center gap-4 relative">
                  <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3">Delivery Status</h3>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="text-[#F59E0B] text-xl font-bold drop-shadow-[0_0_5px_#F59E0B]">⚠</div>
                     <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#F59E0B] leading-none">{data.rail.deliveryStatus.undelivered}</span>
                        <span className="text-[9px] text-[#94A3B8] leading-tight">Undelivered</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="text-[#F59E0B] text-xl font-bold drop-shadow-[0_0_5px_#F59E0B]">⚠</div>
                     <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#F59E0B] leading-none">{data.rail.deliveryStatus.missingDates}</span>
                        <span className="text-[9px] text-[#94A3B8] leading-tight">Missing Dates</span>
                     </div>
                  </div>
               </div>
               <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 relative">
                  <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3">GPS Health</h3>
                  <div className="flex-1 mt-4">
                    <GPSDonut 
                       connected={data.rail.gpsHealth.connectedPercent} 
                       disconnected={100 - data.rail.gpsHealth.connectedPercent} 
                       color="#10B981"
                       subtext={`${data.rail.gpsHealth.disconnectedRakes} Rakes Offline`}
                    />
                  </div>
               </div>
            </div>

            {/* Detention Metrics */}
            <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(0,0,0,0.3)] flex flex-col p-3 relative h-[140px] flex-1">
               <h3 className="text-[10px] text-white font-semibold absolute top-3 left-3">Detention Metrics (Rail)</h3>
               <div className="absolute top-3 right-3 text-right z-10 flex gap-4">
                  <div>
                     <span className="text-[8px] text-[#94A3B8] block">Avg</span>
                     <span className="text-sm font-bold text-[#3B82F6]">{data.rail.detention.averageDetention}h</span>
                  </div>
                  <div>
                     <span className="text-[8px] text-[#94A3B8] block">Post-Pilot</span>
                     <span className="text-sm font-bold text-[#F59E0B]">⚠ {data.rail.detention.postPilot}h</span>
                  </div>
               </div>
               <div className="flex-1 mt-8">
                  <DetentionLineChart data={null} />
               </div>
            </div>
         </div>
         
      </div>
    </div>
  );
};
