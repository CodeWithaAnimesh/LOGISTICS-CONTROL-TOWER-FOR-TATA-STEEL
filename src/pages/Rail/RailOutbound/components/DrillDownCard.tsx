import React, { useState } from 'react';
import { Filter, ChevronDown, CheckCircle2, AlertTriangle, X, ChevronRight, Train, Clock, HelpCircle, AlertCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

interface Bucket {
  label: string;
  value: number;
}

interface DrillDownCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  // Specific data for each type
  type: 'physical' | 'delays' | 'stabled' | 'missing';
  data: any;
}

export const DrillDownCard: React.FC<DrillDownCardProps> = ({ id, title, icon, isExpanded, onToggle, type, data }) => {

  const renderSummary = () => {
    switch (type) {
      case 'physical':
        const gaugeOption = {
          title: {
            text: data.total.toString(),
            subtext: 'TOTAL RAKES',
            left: 'center',
            top: '50%',
            textStyle: { color: 'white', fontSize: 24, fontWeight: '900' },
            subtextStyle: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold', align: 'center' },
            itemGap: 2
          },
          series: [
            {
              type: 'pie',
              radius: ['70%', '95%'],
              center: ['50%', '85%'],
              startAngle: 180,
              endAngle: 0,
              silent: true,
              labelLine: { show: false },
              data: [
                { value: data.onTime, itemStyle: { color: '#10b981' } }, // status-green
                { value: data.delayed, itemStyle: { color: '#ef4444' } } // status-red
              ]
            }
          ]
        };

        return (
          <div className="flex flex-col items-center justify-center w-[160px] relative">
             <div className="w-full h-[70px] relative overflow-hidden">
               <ReactECharts option={gaugeOption} style={{ height: '110px', width: '100%', position: 'absolute', top: -10 }} />
             </div>
             <div className="flex gap-3 text-[10px] font-bold mt-1.5 z-10 relative">
               <div className="flex items-center gap-1 text-[var(--status-green)]"><CheckCircle2 className="w-3.5 h-3.5" /> On-time: {data.onTime}</div>
               <div className="flex items-center gap-1 text-[var(--status-red)]"><AlertTriangle className="w-3.5 h-3.5" /> Delayed: {data.delayed}</div>
             </div>
          </div>
        );
      case 'delays':
      case 'stabled':
      case 'missing':
        const buckets = data.buckets as Bucket[];
        return (
          <div className="flex flex-col w-full max-w-[280px]">
             <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
               <span>Buckets</span>
             </div>
             <div className="flex justify-between gap-4 mb-2">
               {buckets.map((b, i) => (
                 <div key={i} className="flex flex-col items-center">
                    <span className="text-[10px] text-[var(--text-secondary)] whitespace-nowrap mb-0.5">{b.label}</span>
                    <span className={`text-base font-bold ${type === 'stabled' ? 'text-[var(--status-red)]' : 'text-white'}`}>{b.value}</span>
                 </div>
               ))}
             </div>
             <div className="flex flex-col gap-1 w-full relative mt-1">
               <div className="flex justify-between text-[8px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">
                  <span>{type === 'delays' ? 'Delay' : type === 'stabled' ? 'Stabling' : 'Missing'} threshold: [{data.threshold}] {type === 'stabled' ? 'hrs' : 'days'}</span>
               </div>
               <div className="h-1 bg-[var(--bg-border)] rounded-full w-full relative">
                 <div className="absolute top-0 left-0 h-1 bg-[var(--accent-blue)] rounded-full" style={{ width: '40%' }}></div>
                 <div className="absolute top-1/2 -translate-y-1/2 left-[40%] w-2.5 h-2.5 bg-white rounded-full border-2 border-[var(--accent-blue)] cursor-pointer"></div>
               </div>
             </div>
          </div>
        );
    }
  };

  const renderExpanded = () => {
    switch (type) {
      case 'physical':
        return (
          <div className="flex gap-3 p-3 bg-white rounded-b-lg">
            {/* Using a forced light theme style inside the expanded card to match Image 2 */}
            <div className="flex-1 bg-white border border-[var(--bg-border)] border-b-4 border-b-[var(--accent-blue)] rounded shadow-sm p-4 relative text-black">
              <span className="absolute top-2 right-2 text-gray-400">↗</span>
              <div className="text-xs font-bold text-gray-800 text-center mb-4">Total Number<br/>of Rakes</div>
              <div className="text-4xl font-black text-center mb-2">{data.total}</div>
              <div className="text-[10px] text-gray-500 text-center">Rakes</div>
            </div>
            <div className="flex-1 bg-[#fff5f5] border border-red-100 border-b-4 border-b-[var(--status-red)] rounded shadow-sm p-4 relative text-black">
              <span className="absolute top-2 right-2 text-gray-400">↗</span>
              <div className="text-xs font-bold text-gray-800 text-center mb-4">Number of Rakes<br/>Delayed</div>
              <div className="text-4xl font-black text-center mb-2">{data.delayed}</div>
              <div className="text-[10px] text-[var(--status-red)] font-bold text-center flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3"/> Delayed</div>
            </div>
            <div className="flex-1 bg-[#f0fdf4] border border-green-100 border-b-4 border-b-[var(--status-green)] rounded shadow-sm p-4 relative text-black">
              <span className="absolute top-2 right-2 text-gray-400">↗</span>
              <div className="text-xs font-bold text-gray-800 text-center mb-4">Number of Rakes<br/>On-Time</div>
              <div className="text-4xl font-black text-center mb-2">{data.onTime}</div>
              <div className="text-[10px] text-[var(--status-green)] font-bold text-center">On-Time</div>
            </div>
          </div>
        );
      case 'delays':
      case 'stabled':
      case 'missing':
        const buckets = data.buckets as Bucket[];
        const headerColor = type === 'delays' ? 'var(--status-amber)' : type === 'stabled' ? 'var(--status-amber)' : 'var(--status-red)';
        return (
          <div className="flex flex-col gap-3 p-3 bg-[#f8fafc] rounded-b-lg text-black">
             <div className="flex gap-2">
               {buckets.map((b, i) => (
                 <div key={i} className="flex-1 bg-white border border-gray-200 rounded shadow-sm flex items-center p-2 relative">
                    {/* Left colored accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: headerColor }}></div>
                    <div className="pl-2">
                      <div className="text-[10px] font-bold text-gray-600">{b.label}</div>
                      <div className="text-lg font-black text-gray-900">{b.value} Rakes</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                 </div>
               ))}
             </div>
             <div className="bg-white border border-gray-200 rounded p-3 flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-800">Custom {type === 'delays' ? 'Delay Days' : type === 'stabled' ? 'Stabled Hours' : 'Missing Days'}</span>
                  <span className="text-[9px] text-gray-500">{type === 'delays' ? 'Delay > X days' : type === 'stabled' ? 'Stabled > Y hours' : 'Missing > Z days'}</span>
                </div>
                <div className="flex-1 px-4">
                  <input type="range" className="w-full accent-blue-600" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 flex items-center justify-center border border-gray-300 rounded text-xs font-bold text-gray-700 bg-gray-50">{type === 'delays' ? 'X' : type === 'stabled' ? 'Y' : 'Z'}</div>
                  <button className="bg-[#1e40af] text-white text-[10px] font-bold px-4 py-1.5 rounded uppercase tracking-wider hover:bg-blue-900 transition-colors">Apply</button>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className={`card overflow-hidden border transition-all duration-300 ${isExpanded ? 'border-[var(--accent-blue)] shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-[rgba(59,130,246,0.2)] bg-gradient-to-r from-[rgba(59,130,246,0.1)] to-transparent'}`}>
      
      {!isExpanded ? (
        // Summary View: Horizontal layout matching Image 1 perfectly
        <div className="flex items-start justify-between p-3 cursor-pointer relative" onClick={onToggle}>
          
          {/* Left Side: Icon & Title */}
          <div className="flex items-start gap-3 w-[45%]">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(59,130,246,0.2)] to-transparent border border-[rgba(59,130,246,0.3)] text-[var(--accent-blue-lt)] shadow-inner mt-1">
               {icon}
            </div>
            <div className="flex flex-col mt-1">
              <h3 className="font-bold tracking-wide text-[var(--text-primary)] text-sm leading-tight">{title}</h3>
              <span className="text-[8px] text-[var(--text-tertiary)] uppercase mt-1">Click to drill down</span>
            </div>
          </div>

          {/* Right Side: KPI Data */}
          <div className="flex-1 flex justify-end pr-4">
            {renderSummary()}
          </div>

          {/* Absolute Top Right: Controls */}
          <div className="absolute top-3 right-3 flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
             <Filter className="w-3.5 h-3.5" />
             <ChevronDown className="w-3.5 h-3.5" />
          </div>

        </div>
      ) : (
        // Expanded View
        <div>
          <div className="flex items-center justify-between p-3 cursor-pointer bg-[#1e40af] border-b border-[var(--accent-blue)]" onClick={onToggle}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 text-white shadow-inner">
                 {icon}
              </div>
              <h3 className="font-bold tracking-wide text-white text-sm">{title}</h3>
            </div>
            <div className="flex items-center gap-3 text-white/70">
               <Filter className="w-4 h-4" />
               <X className="w-5 h-5" />
            </div>
          </div>
          <div className="opacity-100 transition-opacity duration-300">
             {renderExpanded()}
          </div>
        </div>
      )}

    </div>
  );
};
