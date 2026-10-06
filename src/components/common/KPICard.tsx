import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { KPICardData } from '../../types';

interface KPICardProps extends KPICardData {
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit,
  trend,
  color,
  onClick,
  className = '',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className={`rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 h-[120px] ${className}`}>
        <div className="h-3 w-20 bg-[var(--bg-border)] rounded animate-pulse mb-4" />
        <div className="h-8 w-24 bg-[var(--bg-border)] rounded animate-pulse" />
      </div>
    );
  }

  const renderTrend = () => {
    if (!trend) return null;
    const { direction, percentage } = trend;
    const isUp = direction === 'up';
    const isDown = direction === 'down';

    return (
      <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-md ${
        isUp ? 'text-[var(--status-green)] bg-[var(--status-green-bg)]' :
        isDown ? 'text-[var(--status-red)] bg-[var(--status-red-bg)]' :
        'text-[var(--text-tertiary)] bg-[var(--bg-hover)]'
      }`}>
        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> :
         isDown ? <ArrowDownRight className="w-3.5 h-3.5" /> :
         <Minus className="w-3.5 h-3.5" />}
        <span>{percentage}%</span>
      </div>
    );
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between h-[120px] transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-[var(--accent-blue-dim)] hover:shadow-card-hover active:scale-[0.98]' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Subtle accent glow on hover */}
      {color && (
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
          style={{ backgroundColor: color }}
        />
      )}

      <div className="flex justify-between items-start relative z-10">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] leading-tight">
          {label}
        </h3>
        {renderTrend()}
      </div>

      <div className="flex items-baseline gap-1.5 relative z-10">
        <span
          className={`text-[2rem] font-extrabold leading-none tracking-tight tabular-nums ${
            onClick ? 'group-hover:text-[var(--accent-blue-lt)] transition-colors duration-300' : ''
          }`}
          style={{ color: onClick ? undefined : (color || 'var(--text-primary)') }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-[var(--text-tertiary)]">{unit}</span>
        )}
      </div>
    </div>
  );
};
