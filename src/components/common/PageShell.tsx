import React from 'react';
import { TopNavBar } from './TopNavBar';
import { AlertBanner } from './AlertBanner';
import { useUIStore } from '../../store/uiStore';

interface PageShellProps {
  children: React.ReactNode;
  filterBar?: React.ReactNode;
  noPadding?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  filterBar,
  noPadding = false,
}) => {
  const { activeAlerts } = useUIStore();
  const hasAlerts = activeAlerts.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TopNavBar />

      {filterBar && (
        <div className="sticky top-16 z-[var(--z-sticky)] bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--bg-border)]">
          {filterBar}
        </div>
      )}

      <main
        className={`flex-grow flex flex-col relative ${
          noPadding ? '' : 'p-4 lg:p-6'
        } ${hasAlerts ? 'pb-16' : ''}`}
      >
        {children}
      </main>

      <AlertBanner />
    </div>
  );
};
