import React, { useState } from 'react';
import { DrillDownCard } from './DrillDownCard';
import { Train, Clock, HelpCircle, AlertCircle } from 'lucide-react';
import type { RailOutboundKPIs } from '../../../../types';

interface DrillDownContainerProps {
  kpis: RailOutboundKPIs | null;
  loading?: boolean;
}

export const DrillDownContainer: React.FC<DrillDownContainerProps> = ({ kpis, loading }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading || !kpis) {
    return (
       <div className="flex flex-col gap-4">
         {[1, 2, 3, 4].map(i => <div key={i} className="h-32 skeleton rounded-xl"></div>)}
       </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-4">
      <DrillDownCard
        id="physical"
        title="Physical Tracking"
        icon={<Train className="w-5 h-5" />}
        isExpanded={expandedId === 'physical'}
        onToggle={() => toggleExpand('physical')}
        type="physical"
        data={{
          total: kpis.totalRakes,
          onTime: kpis.onTime,
          delayed: kpis.delayed
        }}
      />

      <DrillDownCard
        id="delays"
        title="Expected Delays"
        icon={<Clock className="w-5 h-5" />}
        isExpanded={expandedId === 'delays'}
        onToggle={() => toggleExpand('delays')}
        type="delays"
        data={{
          buckets: [
            { label: '>1 Day', value: kpis.expectedDelays.gt1Day },
            { label: '>2 Days', value: kpis.expectedDelays.gt2Day },
            { label: '>3 Days', value: kpis.expectedDelays.gt3Day },
          ],
          threshold: 3
        }}
      />

      <DrillDownCard
        id="stabled"
        title="Stabled Rakes"
        icon={<HelpCircle className="w-5 h-5" />}
        isExpanded={expandedId === 'stabled'}
        onToggle={() => toggleExpand('stabled')}
        type="stabled"
        data={{
          buckets: [
            { label: '<6 Hrs', value: kpis.stabledRakes.lt6hrs },
            { label: '>10 Hrs', value: kpis.stabledRakes.gt10hrs },
            { label: '>20 Hrs', value: kpis.stabledRakes.gt20hrs },
          ],
          threshold: 10
        }}
      />

      <DrillDownCard
        id="missing"
        title="Missing Wagons"
        icon={<HelpCircle className="w-5 h-5" />}
        isExpanded={expandedId === 'missing'}
        onToggle={() => toggleExpand('missing')}
        type="missing"
        data={{
          buckets: [
            { label: '>10 Days', value: kpis.missingWagons.gt10Days },
            { label: '>20 Days', value: kpis.missingWagons.gt20Days },
            { label: '>30 Days', value: kpis.missingWagons.gt30Days },
          ],
          threshold: 30
        }}
      />
    </div>
  );
};
