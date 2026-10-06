import React from 'react';
import { Search, Calendar, SlidersHorizontal, X } from 'lucide-react';
import { useFilters } from '../../hooks/useFilters';
import {
  plantOptions,
  destinationOptions,
  locationOptions,
  transporterOptions,
  railStatusOptions,
  railGpsStatusOptions,
  railDelayOptions,
  roadStatusOptions,
  roadGpsStatusOptions,
  roadDelayOptions,
} from '../../constants/mockData';
import type { FilterState, RoadFilterState } from '../../types';

interface FilterBarProps {
  type: 'rail' | 'road';
}

export const FilterBar: React.FC<FilterBarProps> = ({ type }) => {
  const {
    railFilters,
    roadFilters,
    setRailFilter,
    setRoadFilter,
    debouncedSetRailFilter,
    debouncedSetRoadFilter,
    resetRailFilters,
    resetRoadFilters,
  } = useFilters();

  const isRail = type === 'rail';

  const [localFnr, setLocalFnr] = React.useState(railFilters.fnrNumber);
  const [localRr, setLocalRr] = React.useState(railFilters.rrNumber);
  const [localVeh, setLocalVeh] = React.useState(roadFilters.vehicleNumber);

  React.useEffect(() => {
    if (isRail) {
      setLocalFnr(railFilters.fnrNumber);
      setLocalRr(railFilters.rrNumber);
    } else {
      setLocalVeh(roadFilters.vehicleNumber);
    }
  }, [railFilters.fnrNumber, railFilters.rrNumber, roadFilters.vehicleNumber, isRail]);

  const handleRailTextChange = (key: keyof FilterState, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    debouncedSetRailFilter(key, value);
  };

  const handleRoadTextChange = (key: keyof RoadFilterState, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    debouncedSetRoadFilter(key, value);
  };

  const hasActiveFilters = isRail
    ? railFilters.plant !== 'All Plants' ||
      railFilters.destination !== 'All Destinations' ||
      railFilters.fnrNumber !== '' ||
      railFilters.rrNumber !== '' ||
      (railFilters.status ?? 'All Statuses') !== 'All Statuses' ||
      (railFilters.delay ?? 'All Delays') !== 'All Delays' ||
      (railFilters.gpsStatus ?? 'All GPS Statuses') !== 'All GPS Statuses'
    : roadFilters.location !== 'All Locations' ||
      roadFilters.destination !== 'All Destinations' ||
      roadFilters.vehicleNumber !== '' ||
      roadFilters.transporter !== 'All Transporters' ||
      (roadFilters.status ?? 'All Statuses') !== 'All Statuses' ||
      (roadFilters.delay ?? 'All Delays') !== 'All Delays' ||
      (roadFilters.gpsStatus ?? 'All GPS Statuses') !== 'All GPS Statuses';

  const resetFilters = isRail ? resetRailFilters : resetRoadFilters;

  return (
    <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3 bg-[var(--bg-surface)]/80 backdrop-blur-sm">
      {/* Filter Label */}
      <div className="flex items-center gap-2 text-[var(--text-tertiary)] mr-1">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">Filters</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--bg-border)] hidden sm:block" />

      <div className="flex-1 flex flex-wrap items-center gap-2.5">
        {/* Date Picker */}
        <div className="relative">
          <input
            type="date"
            className="input pl-9 w-[150px] text-sm"
            value={isRail ? railFilters.date : roadFilters.date}
            onChange={(e) => isRail ? setRailFilter('date', e.target.value) : setRoadFilter('date', e.target.value)}
          />
          <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {isRail ? (
          <>
            <select
              className="select w-[150px] text-sm"
              value={railFilters.plant}
              onChange={(e) => setRailFilter('plant', e.target.value)}
            >
              {plantOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="select w-[170px] text-sm"
              value={railFilters.destination}
              onChange={(e) => setRailFilter('destination', e.target.value)}
            >
              {destinationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="select w-[145px] text-sm"
              value={railFilters.status ?? 'All Statuses'}
              onChange={(e) => setRailFilter('status', e.target.value as FilterState['status'])}
            >
              {railStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-primary)] p-1">
              {railDelayOptions.map((opt) => {
                const isActive = (railFilters.delay ?? 'All Delays') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setRailFilter('delay', opt.value as FilterState['delay'])}
                    className={`min-w-10 rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[var(--accent-blue)] text-white shadow-[0_0_10px_rgba(59,130,246,0.35)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <select
              className="select w-[170px] text-sm"
              value={railFilters.gpsStatus ?? 'All GPS Statuses'}
              onChange={(e) => setRailFilter('gpsStatus', e.target.value as FilterState['gpsStatus'])}
            >
              {railGpsStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="relative flex-1 min-w-[130px] max-w-[180px]">
              <input
                type="text"
                placeholder="FNR No."
                className="input pl-8 text-sm"
                value={localFnr}
                onChange={(e) => handleRailTextChange('fnrNumber', e.target.value, setLocalFnr)}
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[130px] max-w-[180px]">
              <input
                type="text"
                placeholder="RR No."
                className="input pl-8 text-sm"
                value={localRr}
                onChange={(e) => handleRailTextChange('rrNumber', e.target.value, setLocalRr)}
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </>
        ) : (
          <>
            <select
              className="select w-[150px] text-sm"
              value={roadFilters.location}
              onChange={(e) => setRoadFilter('location', e.target.value)}
            >
              {locationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="select w-[170px] text-sm"
              value={roadFilters.destination}
              onChange={(e) => setRoadFilter('destination', e.target.value)}
            >
              {destinationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="select w-[160px] text-sm"
              value={roadFilters.transporter}
              onChange={(e) => setRoadFilter('transporter', e.target.value)}
            >
              {transporterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="select w-[145px] text-sm"
              value={roadFilters.status ?? 'All Statuses'}
              onChange={(e) => setRoadFilter('status', e.target.value as RoadFilterState['status'])}
            >
              {roadStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-primary)] p-1">
              {roadDelayOptions.map((opt) => {
                const isActive = (roadFilters.delay ?? 'All Delays') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setRoadFilter('delay', opt.value as RoadFilterState['delay'])}
                    className={`min-w-10 rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[var(--accent-blue)] text-white shadow-[0_0_10px_rgba(59,130,246,0.35)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <select
              className="select w-[170px] text-sm"
              value={roadFilters.gpsStatus ?? 'All GPS Statuses'}
              onChange={(e) => setRoadFilter('gpsStatus', e.target.value as RoadFilterState['gpsStatus'])}
            >
              {roadGpsStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="relative flex-1 min-w-[130px] max-w-[180px]">
              <input
                type="text"
                placeholder="Vehicle No."
                className="input pl-8 text-sm"
                value={localVeh}
                onChange={(e) => handleRoadTextChange('vehicleNumber', e.target.value, setLocalVeh)}
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </>
        )}
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--status-red)] hover:text-white bg-[var(--status-red-bg)] hover:bg-[var(--status-red)] px-3 py-1.5 rounded-lg border border-[rgba(239,68,68,0.2)] transition-all duration-200"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};
