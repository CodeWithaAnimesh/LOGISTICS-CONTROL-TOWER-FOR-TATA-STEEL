import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertCircle, Info, X, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { mockSafetyAlerts } from '../../constants/mockData';

export const AlertBanner: React.FC = () => {
  const { activeAlerts, dismissAlert } = useUIStore();
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    if (activeAlerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % activeAlerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAlerts.length]);

  if (activeAlerts.length === 0) return null;

  const currentAlertId = activeAlerts[currentAlertIndex % activeAlerts.length];
  const alertDetail = mockSafetyAlerts.find(a => a.id === currentAlertId) || mockSafetyAlerts[0];

  const severityConfig = {
    critical: {
      className: 'bg-gradient-to-r from-[rgba(239,68,68,0.15)] via-[rgba(239,68,68,0.08)] to-transparent border-t-2 border-[var(--status-red)] text-[var(--status-red)]',
      icon: ShieldAlert,
    },
    warning: {
      className: 'bg-gradient-to-r from-[rgba(245,158,11,0.15)] via-[rgba(245,158,11,0.08)] to-transparent border-t-2 border-[var(--status-amber)] text-[var(--status-amber)]',
      icon: AlertCircle,
    },
    info: {
      className: 'bg-gradient-to-r from-[rgba(59,130,246,0.15)] via-[rgba(59,130,246,0.08)] to-transparent border-t-2 border-[var(--status-blue)] text-[var(--status-blue)]',
      icon: Info,
    },
  };

  const config = severityConfig[alertDetail.severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[var(--z-alert)] px-4 lg:px-6 py-2.5 text-sm font-medium flex items-center justify-between backdrop-blur-sm animate-slide-up ${config.className}`}>
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <Icon className="w-4.5 h-4.5 flex-shrink-0" />
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold tracking-wide uppercase text-xs px-2 py-0.5 rounded bg-current/10 border border-current/20">
            {alertDetail.alertType.replace(/-/g, ' ')}
          </span>
          <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />
          <span className="truncate opacity-90 text-xs">
            {alertDetail.vehicleNumber} · {alertDetail.transporter} · {alertDetail.location}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {activeAlerts.length > 1 && (
          <span className="text-[10px] font-bold opacity-60 tabular-nums">
            {(currentAlertIndex % activeAlerts.length) + 1}/{activeAlerts.length}
          </span>
        )}
        <button
          onClick={() => dismissAlert(currentAlertId)}
          className="p-1 rounded-md hover:bg-black/10 transition-colors"
          title="Dismiss Alert"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
