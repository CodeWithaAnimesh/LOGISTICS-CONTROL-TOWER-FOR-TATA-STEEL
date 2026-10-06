import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { RoadPageHeader } from '../../../components/road/RoadPageHeader';

/* ─── Mock Data ────────────────────────────────── */
const effData = {
  assets: { total: 350, breakdown: 43, moving: 261, stopped: 20, gpsDown: 26 },
  fleet: {
    moving: 3.8,
    stopped: 21.1,
    gpsDown: 44.9,
    accident: 0.0,
    maintenance: 28.2,
    utilization: 6,
    idlingGt20Min: 20,
  },
  metrics: {
    delayedTransit: 30,
    highAlertZones: 10,
    nonMovingGt1hr: 2,
  },
  table: [
    { veh: 'MH-04-AB-1234', trans: 'TCI Express',  loc: 'Sector C, NH6',      delay1: 12, delay2: 5, delay3: 1, contact: '98765 43210' },
    { veh: 'GJ-01-XY-5678', trans: 'Gati Ltd',      loc: 'Andheri E, Mumbai', delay1: 8,  delay2: 2, delay3: 0, contact: '97654 32109' },
    { veh: 'TN-09-CD-9012', trans: 'VRL Logistics', loc: 'Chennai NH4',        delay1: 15, delay2: 7, delay3: 2, contact: '96543 21098' },
    { veh: 'DL-01-EF-3456', trans: 'Delhivery',     loc: 'Gurgaon Toll',       delay1: 6,  delay2: 1, delay3: 0, contact: '95432 10987' },
    { veh: 'KA-03-GH-7890', trans: 'Rivigo',        loc: 'Hosur Road, Blr',   delay1: 9,  delay2: 3, delay3: 1, contact: '94321 09876' },
    { veh: 'WB-06-KL-2345', trans: 'Safexpress',    loc: 'Kolkata Port Rd',   delay1: 4,  delay2: 0, delay3: 0, contact: '93210 98765' },
  ],
};

/* ─── Sub-components ───────────────────────────── */
const AssetKPI: React.FC<{
  label: string; value: number; color: string; icon: string;
}> = ({ label, value, color, icon }) => (
  <div
    className="flex-1 flex flex-col items-center justify-center gap-2 py-3 px-2 border rounded-xl relative overflow-hidden"
    style={{ borderColor: `${color}55`, background: `${color}08` }}
  >
    <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
    <span className="text-2xl">{icon}</span>
    <span className="text-2xl font-black tabular-nums leading-none"
      style={{ color, textShadow: `0 0 12px ${color}` }}>{value}</span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] text-center leading-tight">{label}</span>
  </div>
);

const MetricCircle: React.FC<{
  value: number; label: string; color: string; note?: string;
}> = ({ value, label, color, note }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="w-28 h-28 rounded-full flex items-center justify-center border-4 relative"
      style={{
        borderColor: color,
        background: `${color}18`,
        boxShadow: `0 0 30px ${color}50, inset 0 0 20px ${color}18`,
      }}
    >
      <div className="absolute inset-2 rounded-full border opacity-25" style={{ borderColor: color }} />
      <span className="text-4xl font-black tabular-nums" style={{ color }}>{value}</span>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8] text-center max-w-[110px] leading-tight">{label}</span>
    {note && <span className="text-[9px] text-[#475569] italic text-center max-w-[130px] leading-tight">{note}</span>}
  </div>
);

/* ─── Main Page ─────────────────────────────────── */
export const RoadEfficiency: React.FC = () => {
  const d = effData;
  const [shiftReason, setShiftReason] = useState('');

  /* Fleet donut chart */
  const fleetOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(8,13,26,0.95)',
      borderColor: 'rgba(59,130,246,0.3)',
      textStyle: { color: '#F1F5F9', fontSize: 12 },
      formatter: '{b}: {c}% ({d}%)',
    },
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['42%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          color: '#94A3B8',
          fontSize: 10,
          formatter: (p: any) => `{name|${p.name}}\n{val|${p.value}%}`,
          rich: {
            name: { fontSize: 9, color: '#94A3B8', lineHeight: 14 },
            val: { fontSize: 11, fontWeight: 'bold', color: '#F1F5F9', lineHeight: 16 },
          },
        },
        labelLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        data: [
          { value: d.fleet.moving,      name: 'Moving',      itemStyle: { color: '#10B981' } },
          { value: d.fleet.stopped,     name: 'Stopped',     itemStyle: { color: '#F59E0B' } },
          { value: d.fleet.gpsDown,     name: 'GPS Down',    itemStyle: { color: '#3B82F6' } },
          { value: d.fleet.accident,    name: 'Accident',    itemStyle: { color: '#EF4444' } },
          { value: d.fleet.maintenance, name: 'Maintenance', itemStyle: { color: '#8B5CF6' } },
        ],
        emphasis: {
          itemStyle: { shadowBlur: 15, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' },
        },
        itemStyle: { borderColor: '#050A15', borderWidth: 2 },
      },
    ],
  };

  return (
    <div className="min-h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-x-hidden font-sans flex flex-col">
      <RoadPageHeader
        activeTab="efficiency"
        pageTitle="GLOBAL LOGISTICS CONTROL TOWER — ROAD EFFICIENCY"
        alertText="20 vehicles idling for more than 20 minutes."
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
          <AssetKPI label="Total No of Assets" value={d.assets.total}     color="#3B82F6" icon="🚛" />
          <AssetKPI label="Breakdown"           value={d.assets.breakdown} color="#EC4899" icon="🔧" />
          <AssetKPI label="Moving Asset"        value={d.assets.moving}    color="#06B6D4" icon="🚗" />
          <AssetKPI label="Stopped"             value={d.assets.stopped}   color="#10B981" icon="🅿️" />
          <AssetKPI label="GPS Down"            value={d.assets.gpsDown}   color="#EF4444" icon="📡" />
        </div>

        {/* ── Middle Row: Fleet Chart + Metrics ── */}
        <div className="flex gap-4" style={{ minHeight: '280px' }}>

          {/* Fleet Pie Chart */}
          <div className="sci-fi-panel p-4 flex flex-col" style={{ width: '38%' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Current Fleet</h3>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#94A3B8]">Utilization</span>
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: '#3B82F6', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }}
                  >
                    <span className="text-[10px] font-black text-[#3B82F6]">{d.fleet.utilization}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#94A3B8]">Idling {'>'}20 Min</span>
                  <span className="text-2xl font-black text-[#F59E0B]" style={{ textShadow: '0 0 10px rgba(245,158,11,0.6)' }}>
                    {d.fleet.idlingGt20Min}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ReactECharts option={fleetOption} style={{ height: '100%', width: '100%', minHeight: 200 }} opts={{ renderer: 'svg' }} />
            </div>
          </div>

          {/* Three Metric Circles */}
          <div className="flex-1 sci-fi-panel flex items-center justify-around px-6">
            <MetricCircle
              value={d.metrics.delayedTransit}
              label="No of Vehicles Delayed During Transit"
              color="#EC4899"
            />
            <div className="w-px h-24 bg-[rgba(59,130,246,0.15)]" />
            <MetricCircle
              value={d.metrics.highAlertZones}
              label="Vehicles in High Alert Zones / Restricted Zones"
              color="#EC4899"
            />
            <div className="w-px h-24 bg-[rgba(59,130,246,0.15)]" />
            <div className="flex flex-col items-center gap-3">
              <MetricCircle
                value={d.metrics.nonMovingGt1hr}
                label="No of Vehicles Non-moving for More than an Hour"
                color="#EF4444"
                note="There should be an option to shift person to provide a reason from dropdown list"
              />
              {/* Shift Reason Dropdown */}
              <select
                value={shiftReason}
                onChange={(e) => setShiftReason(e.target.value)}
                className="text-[9px] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#94A3B8] rounded px-2 py-1 outline-none cursor-pointer max-w-[140px]"
              >
                <option value="">Select Reason...</option>
                <option value="breakdown">Breakdown</option>
                <option value="rest">Driver Rest</option>
                <option value="loading">Loading / Unloading</option>
                <option value="traffic">Traffic Jam</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Data Table ── */}
        <div className="flex-1 sci-fi-panel flex flex-col overflow-hidden min-h-0">
          <div className="px-4 py-3 border-b border-[rgba(59,130,246,0.2)]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
              Efficiency Line Item Details
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(59,130,246,0.15)]">
                  {['Vehicle No', 'Transporter', 'Location', '1–2 Day Delay', '2–3 Days Delay', '>3 Days Delay', 'Live Track', 'Contact Number'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-bold uppercase tracking-wider text-[#475569] bg-[rgba(59,130,246,0.05)] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.table.map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(59,130,246,0.05)] transition-colors">
                    <td className="px-3 py-2.5 font-mono text-[#06B6D4] font-semibold whitespace-nowrap">{row.veh}</td>
                    <td className="px-3 py-2.5 text-white whitespace-nowrap">{row.trans}</td>
                    <td className="px-3 py-2.5 text-[#94A3B8]">{row.loc}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-bold tabular-nums ${row.delay1 > 10 ? 'text-[#F59E0B]' : 'text-white'}`}>{row.delay1}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-bold tabular-nums ${row.delay2 > 5 ? 'text-[#F97316]' : 'text-white'}`}>{row.delay2}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-bold tabular-nums ${row.delay3 > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>{row.delay3}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <a href="#" className="flex items-center gap-1 text-[#3B82F6] hover:text-[#06B6D4] transition-colors font-semibold"
                        onClick={(e) => e.preventDefault()}>
                        Track <ExternalLink size={10} />
                      </a>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#94A3B8] whitespace-nowrap">{row.contact}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 4 - d.table.length) }).map((_, i) => (
                  <tr key={`e-${i}`} className="border-b border-[rgba(255,255,255,0.04)]">
                    {Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-3 py-3">&nbsp;</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
