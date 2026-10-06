import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { RailRake } from '../../../types';
import { StatusBadge } from '../../../components/common';

interface RailMapProps {
  rakes: RailRake[] | null;
  loading: boolean;
}

export const RailMap: React.FC<RailMapProps> = ({ rakes, loading }) => {
  if (loading || !rakes) {
    return <div className="card h-full min-h-[400px] skeleton w-full" />;
  }

  const getMarkerColor = (status: RailRake['status']) => {
    switch (status) {
      case 'on-time': return 'var(--status-green)';
      case 'delayed': return 'var(--status-red)';
      case 'stabled': return 'var(--status-blue)';
      default: return 'var(--status-gray)';
    }
  };

  // Center of India roughly
  const center: [number, number] = [22.0, 79.0];

  return (
    <div className="card h-full min-h-[400px] w-full relative flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[var(--bg-border)] z-10 bg-[var(--bg-surface)]">
        <h3 className="kpi-label">Live Rake Tracking</h3>
      </div>
      
      <div className="flex-grow relative z-0">
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%', backgroundColor: 'var(--bg-primary)' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {rakes.map((rake) => (
            <CircleMarker
              key={rake.id}
              center={[rake.latitude, rake.longitude]}
              pathOptions={{
                color: getMarkerColor(rake.status),
                fillColor: getMarkerColor(rake.status),
                fillOpacity: 0.7,
                weight: 2,
              }}
              radius={6}
            >
              <Tooltip className="custom-tooltip">
                <div className="p-1">
                  <div className="font-bold mb-1">{rake.fnrNumber}</div>
                  <div className="text-xs mb-1">From: {rake.plant}</div>
                  <div className="text-xs mb-2">To: {rake.destination}</div>
                  <StatusBadge status={rake.status} />
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="p-3 border-t border-[var(--bg-border)] bg-[var(--bg-surface)] flex gap-4 text-xs font-medium z-10 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[var(--status-green)]" /> On Time
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[var(--status-red)]" /> Delayed
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[var(--status-blue)]" /> Stabled
        </div>
      </div>
    </div>
  );
};
