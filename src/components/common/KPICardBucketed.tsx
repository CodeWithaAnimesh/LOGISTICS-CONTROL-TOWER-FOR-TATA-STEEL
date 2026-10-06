import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import type { BucketData } from '../../types';

interface KPICardBucketedProps {
  title: string;
  totalValue?: number;
  buckets: BucketData[];
  onBucketClick?: (bucket: BucketData) => void;
  className?: string;
  loading?: boolean;
}

export const KPICardBucketed: React.FC<KPICardBucketedProps> = ({
  title,
  totalValue,
  buckets,
  onBucketClick,
  className = '',
  loading = false,
}) => {
  const [showSlider, setShowSlider] = useState(false);
  const [customThreshold, setCustomThreshold] = useState(buckets[0]?.threshold || 0);

  if (loading) {
    return (
      <div className={`rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 min-h-[160px] ${className}`}>
        <div className="h-3 w-28 bg-[var(--bg-border)] rounded animate-pulse mb-3" />
        <div className="h-7 w-16 bg-[var(--bg-border)] rounded animate-pulse mb-6" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-16 bg-[var(--bg-border)] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-[var(--accent-blue-dim)] ${className}`}>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{title}</h3>
          {totalValue !== undefined && (
            <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">{totalValue.toLocaleString()}</div>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setShowSlider(!showSlider); }}
          className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          title="Adjust Threshold"
          aria-label="Adjust threshold"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {showSlider && (
        <div className="absolute top-14 right-4 z-20 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl p-3.5 shadow-elevated w-52 animate-fade-in">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Custom Threshold</label>
          <input
            type="range"
            min="0"
            max="100"
            value={customThreshold}
            onChange={(e) => setCustomThreshold(parseInt(e.target.value))}
            className="w-full accent-[var(--accent-blue)] h-1.5"
          />
          <div className="text-right text-xs mt-1.5 font-bold text-[var(--accent-blue-lt)] tabular-nums">{customThreshold}</div>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-3 border-t border-[var(--bg-border)]">
        {buckets.map((bucket, idx) => (
          <div
            key={idx}
            onClick={() => onBucketClick && onBucketClick(bucket)}
            className={`flex-1 flex flex-col items-center justify-center p-2.5 rounded-lg bg-[var(--bg-primary)] border border-transparent transition-all duration-200 ${
              onBucketClick ? 'cursor-pointer hover:border-[var(--accent-blue-dim)] hover:bg-[var(--bg-hover)] active:scale-95' : ''
            }`}
          >
            <span className="text-xl font-extrabold text-white leading-none tabular-nums">
              {bucket.value.toLocaleString()}
            </span>
            <span className="text-[9px] text-[var(--text-tertiary)] uppercase mt-1.5 font-bold tracking-wider text-center leading-tight">
              {bucket.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
