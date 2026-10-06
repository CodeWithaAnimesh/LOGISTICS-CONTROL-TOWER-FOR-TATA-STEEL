import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useUIStore } from '../../store/uiStore';
import { mockSystemStatus } from '../../constants/mockData';

dayjs.extend(utc);

const NAV_ITEMS = [
  { label: 'Intra Plant', path: '/intra-plant' },
  { label: 'Transit', path: '/transit' },
  { label: 'Reports', path: '/reports' },
];

export const TopNavBar: React.FC = () => {
  const [time, setTime] = useState(dayjs().utc().format('HH:mm:ss [UTC]'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs().utc().format('HH:mm:ss [UTC]'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitle = location.pathname.includes('/intra-plant') 
    ? 'INTRA PLANT OPERATIONS' 
    : location.pathname.includes('/transit') 
    ? 'OUTBOUND OPERATIONS'
    : 'OPERATIONS';

  return (
    <header className="sticky top-0 z-[var(--z-navbar)] bg-[#0B1120] border-b border-[var(--bg-border)]">
      {/* Top Title Bar */}
      <div className="flex justify-center items-center py-2 px-4 relative border-b border-white/5 bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent">
        <h1 className="text-xl font-bold text-white tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(59,130,246,0.5)' }}>
          <span className="text-[var(--accent-blue-lt)]">GLOBAL LOGISTICS CONTROL TOWER</span> - {pageTitle}
        </h1>
        {/* Decorative corner accents could go here */}
      </div>

      {/* Main Nav Bar */}
      <div className="flex items-center justify-between px-4 h-12 text-[11px] font-medium tracking-wide uppercase">
        
        {/* Left: System Status */}
        <div className="flex items-center gap-2 text-[var(--text-secondary)] w-1/3">
          <span className="text-[var(--text-tertiary)]">System Status:</span>
          <span className={mockSystemStatus.overall === 'operational' ? 'text-[var(--status-green)]' : 'text-[var(--status-amber)]'}>
            {mockSystemStatus.overall === 'operational' ? 'All Systems Operational.' : 'Systems Degraded.'}
          </span>
          <span className="text-[var(--text-tertiary)] ml-2">Data Last Updated:</span>
          <span className="text-white">{time}</span>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-2 w-1/3 justify-center">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-6 py-1.5 rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'border-[var(--bg-border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-tertiary)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Alerts */}
        <div className="flex items-center justify-end gap-2 w-1/3 text-right">
           <span className="text-[var(--status-amber)] font-bold">ALERT:</span>
           <span className="text-[var(--status-amber)] truncate max-w-[400px]" title="Critical Road Vehicle Breakdown in Sector C. Rail Operations Normal">
             Critical Road Vehicle Breakdown in Sector C. Rail Operations Normal
           </span>
        </div>
      </div>
    </header>
  );
};

