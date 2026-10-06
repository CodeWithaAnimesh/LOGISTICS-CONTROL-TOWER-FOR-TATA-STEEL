import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FilterBar, KPICard, KPICardBucketed, DataTable, DonutChart, StatusBadge } from '../../../components/common';
import { RailMap } from './RailMap';
import { DrillDownContainer } from './components/DrillDownContainer';
import { useRailOutboundKPIs, useRailRakeList } from '../../../hooks/useRailData';
import type { RailRake, TableColumn } from '../../../types';
import { useNavigate } from 'react-router-dom';

export const RailOutbound: React.FC = () => {
  const { data: kpis, loading: kpisLoading } = useRailOutboundKPIs();
  const { data: rakes, loading: rakesLoading } = useRailRakeList();
  const navigate = useNavigate();
  const [transporterSearch, setTransporterSearch] = React.useState('');
  const [invoiceSearch, setInvoiceSearch] = React.useState('');
  const [fnrSearch, setFnrSearch] = React.useState('');
  const [rrSearch, setRrSearch] = React.useState('');

  const filteredRakes = React.useMemo(() => {
    let rows = rakes || [];
    const tQuery = transporterSearch.trim().toLowerCase();
    const iQuery = invoiceSearch.trim().toLowerCase();
    const fQuery = fnrSearch.trim().toLowerCase();
    const rQuery = rrSearch.trim().toLowerCase();
    
    if (tQuery) rows = rows.filter((rake) => rake.transporter.toLowerCase().includes(tQuery));
    if (iQuery) rows = rows.filter((rake) => rake.invoiceNumber?.toLowerCase().includes(iQuery));
    if (fQuery) rows = rows.filter((rake) => rake.fnrNumber?.toLowerCase().includes(fQuery));
    if (rQuery) rows = rows.filter((rake) => rake.rrNumber?.toLowerCase().includes(rQuery));
    
    return rows;
  }, [rakes, transporterSearch, invoiceSearch, fnrSearch, rrSearch]);

  const columns: TableColumn<RailRake>[] = [
    { key: 'date', label: 'Date' },
    { key: 'plant', label: 'Plant' },
    { key: 'destination', label: 'Destination' },
    {
      key: 'transporter',
      label: 'Transporter',
      filter: (
        <input
          type="text"
          aria-label="Search rail transporter"
          placeholder="Search"
          value={transporterSearch}
          onChange={(event) => setTransporterSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[130px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)]"
        />
      ),
    },
    { 
      key: 'invoiceNumber', 
      label: 'Invoice No.',
      filter: (
        <input
          type="text"
          aria-label="Search invoice number"
          placeholder="Search"
          value={invoiceSearch}
          onChange={(event) => setInvoiceSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[120px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)] mt-1"
        />
      ),
    },
    { 
      key: 'fnrNumber', 
      label: 'FNR No.',
      filter: (
        <input
          type="text"
          aria-label="Search FNR number"
          placeholder="Search"
          value={fnrSearch}
          onChange={(event) => setFnrSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[120px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)] mt-1"
        />
      ),
    },
    { 
      key: 'rrNumber', 
      label: 'RR No.',
      filter: (
        <input
          type="text"
          aria-label="Search RR number"
          placeholder="Search"
          value={rrSearch}
          onChange={(event) => setRrSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[120px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)] mt-1"
        />
      ),
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => <StatusBadge status={val as any} />
    },
    { 
      key: 'delayDays', 
      label: 'Delay',
      render: (_, row) => row.delayDays > 0 ? (
        <span className="text-[var(--status-red)] font-medium">
          {row.delayDays}d {row.delayHours}h
        </span>
      ) : '-'
    },
    { 
      key: 'gpsStatus', 
      label: 'GPS Status',
      render: (val) => <StatusBadge status={val as any} />
    },
  ];

  const exSidingOption = React.useMemo(() => {
    if (!kpis) return {};
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(15,23,42,0.9)',
        borderColor: 'rgba(59,130,246,0.3)',
        textStyle: { color: '#fff' },
      },
      grid: { left: '5%', right: '5%', top: '15%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['Siding A', 'Siding B', 'Siding C', 'Siding D', 'Siding E'],
        axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { show: false } // Hide y-axis numbers as they are on the bars
      },
      series: [
        {
          name: 'Count',
          type: 'bar',
          barWidth: '40%',
          data: [
            kpis.exSidingPipeline.sidingA,
            kpis.exSidingPipeline.sidingB,
            kpis.exSidingPipeline.sidingC,
            kpis.exSidingPipeline.sidingD,
            kpis.exSidingPipeline.sidingE,
          ],
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold'
          },
          itemStyle: {
            color: '#06b6d4', // Cyan color matching the image
            borderRadius: [2, 2, 0, 0]
          }
        }
      ]
    };
  }, [kpis]);

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
              ALERT: <span className="text-[#94A3B8]">Rail Network Congestion in Zone B.</span>
            </div>
         </div>
         
         <div className="flex flex-col items-center mt-4">
            <div className="px-8 py-1 bg-gradient-to-r from-transparent via-[#0F172A] to-transparent border-b-2 border-[#3B82F6]">
               <h1 className="text-sm 2xl:text-base font-extrabold text-white tracking-widest uppercase hud-glow-blue whitespace-nowrap">GLOBAL LOGISTICS CONTROL TOWER - RAIL OUTBOUND</h1>
            </div>
            {/* Tabs */}
            <div className="flex gap-4 mt-2">
               <button className="px-6 py-1 rounded-full border border-[#06B6D4] bg-[rgba(6,182,212,0.15)] text-white text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.4)]">Outbound</button>
               <button onClick={() => navigate('/rail/transit')} className="px-6 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)] transition-colors">Transit</button>
               <button onClick={() => navigate('/dashboard')} className="px-6 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[#EF4444] hover:text-white transition-colors ml-8">Exit to Root</button>
            </div>
         </div>
      </header>

      <div className="flex-1 w-full p-4 flex flex-col gap-6 relative mx-auto">
        <div className="mb-2"><FilterBar type="rail" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in flex-1 min-h-[600px]">
        
        {/* Left Column: Map + Table */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6 h-full">
          {/* Map Section */}
          <div className="flex-1 min-h-[300px] xl:min-h-[400px]">
            <RailMap rakes={rakes} loading={rakesLoading} />
          </div>

          {/* Table Section */}
          <div className="h-[250px] xl:h-[300px]">
            <div className="card h-full flex flex-col">
              <div className="p-3 border-b border-[var(--bg-border)]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">RR-wise Line Item Details</h3>
              </div>
              <div className="flex-1 overflow-hidden p-0">
                <DataTable
                  data={filteredRakes}
                  columns={columns}
                  loading={rakesLoading}
                  className="border-0 rounded-none h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: KPIs Stacked */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            Select any KPI(s) to view RR-wise line item details below
          </div>

          <DrillDownContainer kpis={kpis} loading={kpisLoading} />

          <div className="grid grid-cols-2 gap-4">
            <DonutChart
              title="FOIS Runtime Error"
              loading={kpisLoading}
              height={180}
              data={[
                { name: 'Working', value: kpis?.gpsWorking ?? 0, itemStyle: { color: 'var(--status-green)' } },
                { name: 'Intermittent', value: kpis?.gpsIntermittent ?? 0, itemStyle: { color: 'var(--status-amber)' } },
                { name: 'Not Working', value: kpis?.gpsNotWorking ?? 0, itemStyle: { color: 'var(--status-red)' } },
              ]}
              centerValue={((kpis?.gpsWorking ?? 0) / Math.max(1, (kpis?.totalRakes ?? 1)) * 100).toFixed(0) + '%'}
            />

            <div className="card p-3 h-[180px] flex flex-col">
              <h3 className="kpi-label mb-2">Ex-Siding Pipeline</h3>
              {kpisLoading ? (
                <div className="flex-1 skeleton rounded" />
              ) : (
                <div className="flex-1 -mx-2 -mt-2">
                  <ReactECharts option={exSidingOption} style={{ height: '100%', width: '100%' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
