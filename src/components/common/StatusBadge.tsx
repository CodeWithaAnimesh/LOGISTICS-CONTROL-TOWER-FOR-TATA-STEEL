import React from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, HelpCircle,
  Clock, Truck, ShieldAlert, Wrench, Pause
} from 'lucide-react';

export type StatusVariant =
  | 'on-time' | 'delayed' | 'stabled' | 'missing-wagon'
  | 'working' | 'not-working' | 'intermittent'
  | 'moving' | 'stopped' | 'breakdown' | 'idle' | 'maintenance'
  | 'critical' | 'warning' | 'info';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusVariant, { colorClass: string; dotColor: string; label: string; icon: React.ElementType }> = {
  // Rake statuses
  'on-time':        { colorClass: 'badge-green',  dotColor: 'bg-[var(--status-green)]',  label: 'On Time',        icon: CheckCircle2 },
  'delayed':        { colorClass: 'badge-red',    dotColor: 'bg-[var(--status-red)]',    label: 'Delayed',        icon: Clock },
  'stabled':        { colorClass: 'badge-blue',   dotColor: 'bg-[var(--status-blue)]',   label: 'Stabled',        icon: Pause },
  'missing-wagon':  { colorClass: 'badge-gray',   dotColor: 'bg-[var(--status-gray)]',   label: 'Missing Wagon',  icon: HelpCircle },
  // Vehicle statuses
  'moving':         { colorClass: 'badge-green',  dotColor: 'bg-[var(--status-green)]',  label: 'Moving',         icon: Truck },
  'stopped':        { colorClass: 'badge-red',    dotColor: 'bg-[var(--status-red)]',    label: 'Stopped',        icon: Clock },
  'breakdown':      { colorClass: 'badge-amber',  dotColor: 'bg-[var(--status-amber)]',  label: 'Breakdown',      icon: AlertCircle },
  'idle':           { colorClass: 'badge-gray',   dotColor: 'bg-[var(--status-gray)]',   label: 'Idle',           icon: Pause },
  'maintenance':    { colorClass: 'badge-blue',   dotColor: 'bg-[var(--status-blue)]',   label: 'Maintenance',    icon: Wrench },
  // GPS statuses
  'working':        { colorClass: 'text-[var(--status-green)]',  dotColor: 'bg-[var(--status-green)]',  label: 'Working',       icon: CheckCircle2 },
  'not-working':    { colorClass: 'text-[var(--status-red)]',    dotColor: 'bg-[var(--status-red)]',    label: 'Not Working',   icon: XCircle },
  'intermittent':   { colorClass: 'text-[var(--status-amber)]',  dotColor: 'bg-[var(--status-amber)]',  label: 'Intermittent',  icon: AlertCircle },
  // Alert severities
  'critical':       { colorClass: 'badge-red',    dotColor: 'bg-[var(--status-red)]',    label: 'Critical',       icon: ShieldAlert },
  'warning':        { colorClass: 'badge-amber',  dotColor: 'bg-[var(--status-amber)]',  label: 'Warning',        icon: AlertCircle },
  'info':           { colorClass: 'badge-blue',   dotColor: 'bg-[var(--status-blue)]',   label: 'Info',           icon: HelpCircle },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const config = statusConfig[status];

  // GPS status uses inline text with dot, not a pill badge
  if (status === 'working' || status === 'not-working' || status === 'intermittent') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.colorClass} ${className}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor} ${status === 'working' ? 'animate-pulse-slow' : ''}`} />
        <span>{label || config.label}</span>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.colorClass} ${className}`}>
      <Icon className="w-3 h-3" />
      {label || config.label}
    </span>
  );
};
