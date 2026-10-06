import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface DonutChartData {
  name: string;
  value: number;
  itemStyle?: { color: string };
}

interface DonutChartProps {
  data: DonutChartData[];
  title?: string;
  centerLabel?: string;
  centerValue?: string | number;
  height?: string | number;
  className?: string;
  loading?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  centerLabel,
  centerValue,
  height = 300,
  className = '',
  loading = false,
}) => {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item' as const,
        backgroundColor: '#1C2333',
        borderColor: '#2D3748',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 12 },
        formatter: '{b}: {c} ({d}%)',
        extraCssText: 'border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);',
      },
      legend: {
        orient: 'horizontal' as const,
        bottom: 0,
        textStyle: { color: '#94A3B8', fontSize: 11 },
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 12,
        icon: 'circle',
        // allow legend to wrap without overlapping the chart
        type: 'plain'
      },
      series: [
        {
          name: title || 'Data',
          type: 'pie' as const,
          radius: ['45%', '65%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#111827',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 4,
            label: { show: false },
          },
          labelLine: { show: false },
          data: data,
          animationType: 'expansion' as const,
          animationDuration: 800,
          animationEasing: 'cubicOut' as const,
        },
      ],
    };
  }, [data, title]);

  if (loading) {
    return (
      <div
        className={`rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-[3px] border-[var(--bg-border)] border-t-[var(--accent-blue)] animate-spin" />
          <div className="absolute inset-3 rounded-full border-[3px] border-[var(--bg-border)] border-b-[var(--status-green)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 relative overflow-hidden transition-all duration-300 hover:border-[var(--accent-blue-dim)] flex flex-col ${className}`} style={{ height }}>
      {title && (
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 shrink-0">{title}</h3>
      )}
      <div className="flex-1 -mx-2 relative">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
          notMerge={true}
          lazyUpdate={true}
        />
        {/* Static center label */}
        {centerValue !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-15%' }}>
            <span className="text-2xl font-extrabold text-white tabular-nums leading-none">{centerValue}</span>
            {centerLabel && <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mt-1">{centerLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
