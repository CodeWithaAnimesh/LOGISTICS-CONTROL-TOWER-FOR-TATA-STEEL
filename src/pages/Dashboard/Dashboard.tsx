import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Truck, ArrowRight, Activity, Shield, Gauge, MapPin, Clock, Zap, Radio } from 'lucide-react';
import dayjs from 'dayjs';
import { useUIStore } from '../../store/uiStore';
import { mockSystemStatus, mockRailOutboundKPIs, mockRoadOutboundKPIs } from '../../constants/mockData';

const STATS_RAIL = [
  { label: 'Active Rakes', value: '156', icon: Train },
  { label: 'On-Time Rate', value: '71.8%', icon: Gauge },
  { label: 'GPS Uptime', value: '88.5%', icon: Radio },
];

const STATS_ROAD = [
  { label: 'Active Fleet', value: '342', icon: Truck },
  { label: 'On-Time Rate', value: '78.4%', icon: Gauge },
  { label: 'GPS Uptime', value: '92.1%', icon: Radio },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setSection } = useUIStore();
  const [time, setTime] = useState(dayjs());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSection('rail');
    setMounted(true);
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, [setSection]);

  const handleNavigate = (path: string, section: 'rail' | 'road') => {
    setSection(section);
    navigate(path);
  };

  const systemOk = mockSystemStatus.overall === 'operational';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] bg-[var(--tata-blue)] rounded-full mix-blend-screen blur-[180px] opacity-[0.12]" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-blue)] rounded-full mix-blend-screen blur-[160px] opacity-[0.08]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-[var(--status-blue)] rounded-full mix-blend-screen blur-[200px] opacity-[0.04]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Header */}
      <header className={`p-6 lg:p-8 xl:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--tata-blue)] to-[var(--accent-blue)] flex items-center justify-center border border-[rgba(59,130,246,0.3)] shadow-glow-blue">
              <span className="font-extrabold text-white text-3xl leading-none tracking-tighter">T</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--status-green)] border-2 border-[var(--bg-primary)] animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
              TATA STEEL
            </h1>
            <p className="text-sm lg:text-base text-[var(--accent-blue-lt)] font-semibold tracking-[0.2em] uppercase mt-1">
              Logistics Control Tower
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-3 bg-[var(--bg-elevated)] px-5 py-3 rounded-xl border border-[var(--bg-border)]">
            <Clock className="w-5 h-5 text-[var(--accent-blue-lt)]" />
            <div>
              <div className="text-lg font-mono font-bold text-white tabular-nums tracking-wide">
                {time.format('HH:mm:ss')}
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">
                {time.format('DD MMM YYYY')} · IST
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${systemOk ? 'bg-[var(--status-green-bg)] border-[rgba(16,185,129,0.2)]' : 'bg-[var(--status-amber-bg)] border-[rgba(245,158,11,0.2)]'}`}>
            <div className="relative">
              <Activity className={`w-4 h-4 ${systemOk ? 'text-[var(--status-green)]' : 'text-[var(--status-amber)]'}`} />
              <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${systemOk ? 'bg-[var(--status-green)]' : 'bg-[var(--status-amber)]'} animate-pulse-slow`} />
            </div>
            <span className={`text-sm font-semibold ${systemOk ? 'text-[var(--status-green)]' : 'text-[var(--status-amber)]'}`}>
              {systemOk ? 'All Systems Operational' : 'Degraded Performance'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-10 relative z-10">
        <div className={`w-full max-w-7xl transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Section Title */}
          <div className="text-center mb-10">
            <h2 className="text-lg font-semibold text-[var(--text-secondary)] uppercase tracking-[0.15em]">
              Select Operations Module
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-blue)] to-transparent mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Rail Navigation Card */}
            <div
              onClick={() => handleNavigate('/rail/outbound', 'rail')}
              className="group relative overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] hover:border-[var(--accent-blue)] transition-all duration-500 cursor-pointer hover:shadow-glow-blue"
            >
              {/* Decorative BG icon */}
              <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 group-hover:scale-110 transform origin-top-right">
                <Train size={240} strokeWidth={1} />
              </div>
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-blue)] via-[var(--status-blue)] to-[var(--tata-blue)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-8 lg:p-10 flex flex-col justify-between min-h-[380px] relative">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[var(--status-blue-bg)] text-[var(--status-blue)] flex items-center justify-center mb-7 border border-[rgba(59,130,246,0.15)] group-hover:border-[rgba(59,130,246,0.4)] group-hover:shadow-glow-blue transition-all duration-500">
                    <Train size={28} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Transport by Rail</h2>
                  <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-md">
                    Monitor inbound and outbound rail rakes, track missing wagons, analyze delays, and manage intra-plant rail safety operations.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {STATS_RAIL.map((stat) => (
                    <div key={stat.label} className="bg-[var(--bg-primary)] rounded-xl p-3 border border-[var(--bg-border)] group-hover:border-[rgba(59,130,246,0.15)] transition-colors">
                      <stat.icon className="w-4 h-4 text-[var(--status-blue)] mb-2" />
                      <div className="text-xl font-bold text-white tabular-nums">{stat.value}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center text-[var(--accent-blue-lt)] font-semibold text-base group-hover:translate-x-2 transition-transform duration-300">
                  <Zap className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Enter Rail Control Room
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Road Navigation Card */}
            <div
              onClick={() => handleNavigate('/road/outbound', 'road')}
              className="group relative overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] hover:border-[var(--status-green)] transition-all duration-500 cursor-pointer hover:shadow-glow-green"
            >
              {/* Decorative BG icon */}
              <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 group-hover:scale-110 transform origin-top-right">
                <Truck size={240} strokeWidth={1} />
              </div>
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--status-green)] via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-8 lg:p-10 flex flex-col justify-between min-h-[380px] relative">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[var(--status-green-bg)] text-[var(--status-green)] flex items-center justify-center mb-7 border border-[rgba(16,185,129,0.15)] group-hover:border-[rgba(16,185,129,0.4)] group-hover:shadow-glow-green transition-all duration-500">
                    <Truck size={28} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Transport by Road</h2>
                  <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-md">
                    Track fleet status in real-time, monitor transit delays, analyze GPS health, and review road safety alerts across India.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {STATS_ROAD.map((stat) => (
                    <div key={stat.label} className="bg-[var(--bg-primary)] rounded-xl p-3 border border-[var(--bg-border)] group-hover:border-[rgba(16,185,129,0.15)] transition-colors">
                      <stat.icon className="w-4 h-4 text-[var(--status-green)] mb-2" />
                      <div className="text-xl font-bold text-white tabular-nums">{stat.value}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center text-[var(--status-green)] font-semibold text-base group-hover:translate-x-2 transition-transform duration-300">
                  <Zap className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Enter Road Control Room
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Service Status Bar */}
          <div className={`mt-10 flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {mockSystemStatus.services.map((svc) => (
              <div key={svc.name} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${svc.status === 'operational' ? 'bg-[var(--status-green)]' : svc.status === 'degraded' ? 'bg-[var(--status-amber)] animate-pulse' : 'bg-[var(--status-red)]'}`} />
                <span className="text-[var(--text-tertiary)] font-medium">{svc.name}</span>
                <span className={`text-xs font-semibold ${svc.status === 'operational' ? 'text-[var(--status-green)]' : 'text-[var(--status-amber)]'}`}>
                  {svc.status === 'operational' ? '●' : '◐'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--bg-border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
          <Shield className="w-3.5 h-3.5" />
          <span>Tata Steel Limited · Logistics Control Tower v2.0</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Jamshedpur, Jharkhand, India</span>
        </div>
      </footer>
    </div>
  );
};
