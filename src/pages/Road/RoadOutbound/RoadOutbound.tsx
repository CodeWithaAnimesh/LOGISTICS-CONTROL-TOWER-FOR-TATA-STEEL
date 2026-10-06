import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FilterBar, KPICard, KPICardBucketed, DataTable, DonutChart, StatusBadge } from '../../../components/common';
import { RoadMap } from './RoadMap';
import { useRoadOutboundKPIs, useRoadVehicleList } from '../../../hooks/useRoadData';
import type { RoadVehicle, TableColumn } from '../../../types';
import { RoadPageHeader } from '../../../components/road/RoadPageHeader';
import { Truck } from 'lucide-react';

export const RoadOutbound: React.FC = () => {
  const { data: kpis, loading: kpisLoading } = useRoadOutboundKPIs();
  const { data: vehicles, loading: vehiclesLoading } = useRoadVehicleList();
  const [transporterSearch, setTransporterSearch] = React.useState('');
  const [vehicleSearch, setVehicleSearch] = React.useState('');
  const [invoiceSearch, setInvoiceSearch] = React.useState('');
  const totalVehicles = kpis?.totalVehicles ?? 0;
  const movingVehicles = kpis?.moving ?? 0;
  const stoppedVehicles = kpis?.stopped ?? 0;
  const movingDegrees = totalVehicles > 0 ? Math.round((movingVehicles / totalVehicles) * 360) : 0;
  const stoppedDegrees = totalVehicles > 0 ? Math.round(((movingVehicles + stoppedVehicles) / totalVehicles) * 360) : movingDegrees;

  const filteredVehicles = React.useMemo(() => {
    let rows = vehicles || [];
    const tQuery = transporterSearch.trim().toLowerCase();
    const vQuery = vehicleSearch.trim().toLowerCase();
    const iQuery = invoiceSearch.trim().toLowerCase();
    if (tQuery) rows = rows.filter((v) => v.transporter.toLowerCase().includes(tQuery));
    if (vQuery) rows = rows.filter((v) => v.vehicleNumber.toLowerCase().includes(vQuery));
    if (iQuery) rows = rows.filter((v) => v.invoiceNumber?.toLowerCase().includes(iQuery));
    return rows;
  }, [vehicles, transporterSearch, vehicleSearch, invoiceSearch]);

  const columns: TableColumn<RoadVehicle>[] = [
    { key: 'date', label: 'Date' },
    { 
      key: 'vehicleNumber', 
      label: 'Vehicle No.',
      filter: (
        <input
          type="text"
          aria-label="Search vehicle number"
          placeholder="Search"
          value={vehicleSearch}
          onChange={(event) => setVehicleSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[130px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)] mt-1"
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
          className="h-7 w-[130px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)] mt-1"
        />
      ),
    },
    {
      key: 'transporter',
      label: 'Transporter',
      filter: (
        <input
          type="text"
          aria-label="Search road transporter"
          placeholder="Search"
          value={transporterSearch}
          onChange={(event) => setTransporterSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-7 w-[130px] rounded border border-[var(--bg-border)] bg-[var(--bg-primary)] px-2 text-xs font-medium normal-case tracking-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)]"
        />
      ),
    },
    { key: 'driver', label: 'Driver' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
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
          {row.delayDays}d
        </span>
      ) : '-'
    },
    { 
      key: 'gpsStatus', 
      label: 'GPS Status',
      render: (val) => <StatusBadge status={val as any} />
    },
    { key: 'location', label: 'Current Location' },
    { key: 'contactNumber', label: 'Contact', sortable: false },
  ];

  const onTimeTrendOption = React.useMemo(() => {
    if (!kpis) return {};
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--bg-border)',
        textStyle: { color: 'var(--text-primary)' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1-2 Days', '2-3 Days', '>3 Days'],
        axisLabel: { color: 'var(--text-secondary)' },
        axisLine: { lineStyle: { color: 'var(--bg-border)' } }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'var(--bg-border)' } },
        axisLabel: { color: 'var(--text-secondary)' }
      },
      series: [
        {
          name: 'Delayed Vehicles',
          type: 'bar',
          barWidth: '40%',
          data: [
            { value: kpis.delayBuckets.oneToTwo, itemStyle: { color: 'var(--status-amber)' } },
            { value: kpis.delayBuckets.twoToThree, itemStyle: { color: '#f97316' } }, // orange
            { value: kpis.delayBuckets.gtThree, itemStyle: { color: 'var(--status-red)' } }
          ],
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        }
      ]
    };
  }, [kpis]);

  return (
    <div className="min-h-screen w-screen bg-[#050A15] text-[#94A3B8] overflow-x-hidden font-sans flex flex-col">
      <RoadPageHeader activeTab="outbound" pageTitle="GLOBAL LOGISTICS CONTROL TOWER — ROAD OUTBOUND" />

      <div className="flex-1 w-full p-4 flex flex-col gap-6 relative mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Left Column: Map */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-[400px]">
          {/* Map Section */}
          <div className="flex-1 min-h-[300px]">
            <RoadMap vehicles={vehicles} loading={vehiclesLoading} />
          </div>
        </div>

        {/* Right Column: KPIs Stacked */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            Fleet Overview & Performance Metrics
          </div>

          <div className="card p-4 border border-[rgba(59,130,246,0.22)] bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(17,24,39,0.88))] transition-all hover:border-[rgba(59,130,246,0.38)]">
            <h3 className="kpi-label mb-5 flex items-center gap-3 text-[var(--text-secondary)]">
               <span className="w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.22)] flex items-center justify-center text-[var(--accent-blue-lt)]">
                 <Truck className="w-5 h-5" />
               </span>
               Physical Tracking
            </h3>
            <div className="grid grid-cols-[1fr_112px_1fr] items-center gap-4 px-2">
              <div className="flex flex-col items-start">
                 <div className="flex items-center gap-2 text-[10px] text-[var(--status-green)] font-bold uppercase mb-1">
                   <span className="w-2 h-2 rounded-full bg-[var(--status-green)]" />
                   Moving
                 </div>
                 <div className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">{movingVehicles}</div>
              </div>
              <div
                className="w-28 h-28 rounded-full p-1.5"
                style={{
                  background: `conic-gradient(var(--status-green) 0deg ${movingDegrees}deg, var(--status-amber) ${movingDegrees}deg ${stoppedDegrees}deg, rgba(71,85,105,0.35) ${stoppedDegrees}deg 360deg)`,
                }}
              >
                <div className="w-full h-full rounded-full bg-[var(--bg-surface)] border border-[rgba(148,163,184,0.14)] flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">{totalVehicles}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Total Fleet</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-2 text-[10px] text-[var(--status-amber)] font-bold uppercase mb-1">
                   <span className="w-2 h-2 rounded-sm bg-[var(--status-amber)]" />
                   Stopped
                 </div>
                 <div className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">{stoppedVehicles}</div>
              </div>
            </div>
            {false && (
            <div className="hidden">
              <div className="flex flex-col items-center">
                 <div className="text-[10px] text-[var(--status-green)] font-bold uppercase mb-1">● Moving</div>
                 <div className="text-xl font-bold">{kpis?.moving ?? 0}</div>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-border)] border-r-[var(--status-red)] border-t-[var(--status-green)] flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold">{kpis?.totalVehicles ?? 0}</span>
                <span className="text-[9px] uppercase text-[var(--text-tertiary)]">Total Fleet</span>
              </div>
              <div className="flex flex-col items-center">
                 <div className="text-[10px] text-[var(--status-amber)] font-bold uppercase mb-1">■ Stopped</div>
                 <div className="text-xl font-bold">{kpis?.stopped ?? 0}</div>
              </div>
            </div>
            )}
          </div>

          <KPICardBucketed
            title="Delivery Exceptions"
            loading={kpisLoading}
            buckets={[
              { label: 'Undelivered >48h', value: kpis?.undelivered ?? 0, threshold: 48 },
              { label: 'Missing GPS >24h', value: kpis?.missingGPS ?? 0, threshold: 24 },
            ]}
          />

          <KPICardBucketed
            title="Current Fleet Status"
            totalValue={kpis?.totalVehicles}
            loading={kpisLoading}
            buckets={[
              { label: 'Moving', value: kpis?.moving ?? 0, threshold: 0 },
              { label: 'Stopped', value: kpis?.stopped ?? 0, threshold: 0 },
              { label: 'Breakdown', value: kpis?.breakdown ?? 0, threshold: 0 },
              { label: 'GPS Down', value: kpis?.gpsDown ?? 0, threshold: 0 },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <DonutChart
              title="GPS Health"
              loading={kpisLoading}
              height={180}
              data={[
                { name: 'Connected', value: (kpis?.totalVehicles ?? 100) - (kpis?.gpsDown ?? 0), itemStyle: { color: 'var(--status-green)' } },
                { name: 'No GPS/Down', value: kpis?.gpsDown ?? 0, itemStyle: { color: 'var(--status-red)' } },
              ]}
              centerValue={(((kpis?.totalVehicles ?? 100) - (kpis?.gpsDown ?? 0)) / Math.max(1, (kpis?.totalVehicles ?? 1)) * 100).toFixed(0) + '%'}
            />

            <div className="card p-3 h-[180px] flex flex-col">
              <h3 className="kpi-label mb-2">Delay Buckets</h3>
              {kpisLoading ? (
                <div className="flex-1 skeleton rounded" />
              ) : (
                <div className="flex-1 -mx-2 -mt-4">
                  <ReactECharts option={onTimeTrendOption} style={{ height: '100%', width: '100%' }} />
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Bottom Section: Table taking leftover space on rhs */}
        <div className="flex flex-col gap-4 flex-1 mt-2">
          <div className="mb-2"><FilterBar type="road" /></div>
          <div className="card flex-1 flex flex-col min-h-[400px]">
            <div className="p-3 border-b border-[var(--bg-border)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Vehicle Line Item Details</h3>
            </div>
            <div className="flex-1 overflow-hidden p-0">
              <DataTable
                data={filteredVehicles}
                columns={columns}
                loading={vehiclesLoading}
                className="border-0 rounded-none h-full"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
