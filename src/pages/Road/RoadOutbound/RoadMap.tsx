import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { RoadVehicle } from '../../../types';
import { StatusBadge } from '../../../components/common';

interface RoadMapProps {
  vehicles: RoadVehicle[] | null;
  loading: boolean;
}

export const RoadMap: React.FC<RoadMapProps> = ({ vehicles, loading }) => {
  if (loading || !vehicles) {
    return <div className="card h-full min-h-[400px] skeleton w-full" />;
  }

  const getMarkerColor = (status: RoadVehicle['status']) => {
    switch (status) {
      case 'moving': return 'var(--status-green)';
      case 'stopped': return 'var(--status-amber)';
      case 'breakdown': return 'var(--status-red)';
      default: return 'var(--status-gray)';
    }
  };

  // Center of India roughly
  const center: [number, number] = [22.0, 79.0];

  return (
    <div className="card h-full min-h-[400px] w-full relative flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[var(--bg-border)] z-10 bg-[var(--bg-surface)]">
        <h3 className="kpi-label">Live Fleet Tracking</h3>
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
          
          {/* Simulated Routes for visual effect */}
          {vehicles.slice(0, 5).map((vehicle, i) => (
             <Polyline 
               key={`route-${i}`}
               positions={[
                 [vehicle.latitude - 1, vehicle.longitude - 1],
                 [vehicle.latitude, vehicle.longitude],
                 [vehicle.latitude + 1.5, vehicle.longitude + 0.8]
               ]}
               pathOptions={{ color: 'var(--accent-blue-dim)', weight: 2, dashArray: '5, 10' }}
             />
          ))}

          {vehicles.map((vehicle) => (
            <CircleMarker
              key={vehicle.id}
              center={[vehicle.latitude, vehicle.longitude]}
              pathOptions={{
                color: getMarkerColor(vehicle.status),
                fillColor: getMarkerColor(vehicle.status),
                fillOpacity: 0.8,
                weight: 2,
              }}
              radius={5}
            >
              <Tooltip className="custom-tooltip">
                <div className="p-1 min-w-[150px]">
                  <div className="font-bold mb-1">{vehicle.vehicleNumber}</div>
                  <div className="text-xs mb-1 text-[var(--text-secondary)]">{vehicle.transporter}</div>
                  <div className="text-xs mb-1">Driver: {vehicle.driver}</div>
                  <div className="text-xs mb-2">Loc: {vehicle.location}</div>
                  <StatusBadge status={vehicle.status} />
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="p-3 border-t border-[var(--bg-border)] bg-[var(--bg-surface)] flex gap-4 text-xs font-medium z-10 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-green)]" /> Moving
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-amber)]" /> Stopped
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-red)]" /> Breakdown
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-gray)]" /> Offline
        </div>
      </div>
    </div>
  );
};
