import React from 'react';
import { useNavigate } from 'react-router-dom';

export type RoadTab = 'outbound' | 'intra-plant' | 'transit' | 'safety' | 'efficiency';

interface RoadPageHeaderProps {
  activeTab: RoadTab;
  pageTitle: string;
  alertText?: string;
}

const TABS: { id: RoadTab; label: string; path: string }[] = [
  { id: 'outbound',    label: 'Outbound',    path: '/road/outbound'   },
  { id: 'intra-plant', label: 'Intra Plant', path: '/road/intra-plant'},
  { id: 'transit',     label: 'Transit',     path: '/road/transit'    },
  { id: 'safety',      label: 'Safety',      path: '/road/safety'     },
  { id: 'efficiency',  label: 'Efficiency',  path: '/road/efficiency' },
];

export const RoadPageHeader: React.FC<RoadPageHeaderProps> = ({
  activeTab,
  pageTitle,
  alertText = 'Critical Road Vehicle Breakdown in Sector C.',
}) => {
  const navigate = useNavigate();

  return (
    <header className="relative w-full pt-4 pb-2 bg-[#080D1A] border-b border-[rgba(59,130,246,0.3)] z-50 flex flex-col items-center gap-2">
      {/* Status bar */}
      <div className="w-full flex justify-between px-6 text-[10px] font-bold tracking-widest uppercase absolute top-4">
        <div>
          <span className="text-[#475569]">System Status: </span>
          <span className="text-[#10B981] hud-glow-green">All Systems Operational.</span>
        </div>
        <div className="text-[#F59E0B]">
          ALERT: <span className="text-[#94A3B8]">{alertText}</span>
        </div>
      </div>

      {/* Title + Tabs */}
      <div className="flex flex-col items-center mt-4">
        <div className="px-8 py-1 bg-gradient-to-r from-transparent via-[#0F172A] to-transparent border-b-2 border-[#3B82F6]">
          <h1 className="text-sm 2xl:text-base font-extrabold text-white tracking-widest uppercase hud-glow-blue whitespace-nowrap">
            {pageTitle}
          </h1>
        </div>

        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {TABS.map((tab) =>
            activeTab === tab.id ? (
              <button
                key={tab.id}
                className="px-5 py-1 rounded-full border border-[#06B6D4] bg-[rgba(6,182,212,0.15)] text-white text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-default"
              >
                {tab.label}
              </button>
            ) : (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="px-5 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                {tab.label}
              </button>
            )
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-1 ml-4 rounded-full border border-[rgba(255,255,255,0.1)] text-[#94A3B8] text-[10px] font-bold uppercase hover:bg-[#EF4444] hover:text-white transition-colors"
          >
            Exit to Root
          </button>
        </div>
      </div>
    </header>
  );
};
