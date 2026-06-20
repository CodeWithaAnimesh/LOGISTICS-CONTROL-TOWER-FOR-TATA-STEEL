import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const inbound = [
  ['INB-2291', 'Iron Ore Fines', 'rail', 'Noamundi Mine', 'Gate 3', '19 Jun · 14:30', 'ok', 'In Transit', '3,200'],
  ['INB-2292', 'Coking Coal', 'rail', 'West Bokaro', 'Gate 1', '19 Jun · 18:00', 'info', 'On Schedule', '4,500'],
  ['INB-2293', 'Limestone', 'truck', 'Joda Quarry', 'Gate 2', '19 Jun · 11:15', 'warn', 'Delayed', '280'],
  ['INB-2294', 'Dolomite', 'truck', 'Birmitrapur', 'Gate 2', '19 Jun · 16:00', 'info', 'On Schedule', '320'],
  ['INB-2295', 'Imported Coking Coal', 'rail', 'Paradip Port', 'Gate 1', '20 Jun · 06:00', 'info', 'Loading', '5,100'],
  ['INB-2296', 'Manganese Ore', 'truck', 'Joda Mine', 'Gate 3', '19 Jun · 09:40', 'ok', 'Arrived', '95'],
  ['INB-2297', 'Iron Ore Lumps', 'rail', 'Noamundi Mine', 'Gate 3', '20 Jun · 02:15', 'ok', 'In Transit', '3,800'],
  ['INB-2298', 'Quartzite', 'truck', 'Joda Quarry', 'Gate 2', '19 Jun · 20:30', 'alert', 'Safety Hold', '150'],
];

const outbound = [
  ['OUT-5510', 'HR Coil', 'rail', 'Kolkata Port', 'Export Hub', '19 Jun · 22:00', 'info', 'On Schedule', '2,600'],
  ['OUT-5511', 'TMT Bars', 'truck', 'Patna Stockyard', 'Bihar Distribution', '19 Jun · 13:00', 'ok', 'In Transit', '180'],
  ['OUT-5512', 'CR Coil', 'rail', 'Chennai', 'Auto OEM Cluster', '20 Jun · 09:00', 'info', 'Loading', '1,950'],
  ['OUT-5513', 'Wire Rods', 'truck', 'Pune', 'Industrial Customer', '19 Jun · 15:45', 'warn', 'Delayed', '140'],
  ['OUT-5514', 'Plates', 'rail', 'Mumbai Port', 'Export Hub', '20 Jun · 04:30', 'info', 'On Schedule', '2,200'],
  ['OUT-5515', 'Galvanised Sheet', 'truck', 'Delhi-NCR', 'Appliance OEM', '19 Jun · 19:20', 'ok', 'In Transit', '95'],
  ['OUT-5516', 'TMT Bars', 'rail', 'Bhubaneswar', 'Construction Hub', '20 Jun · 11:00', 'info', 'On Schedule', '1,400'],
  ['OUT-5517', 'HR Coil', 'truck', 'Lucknow', 'Pipe Manufacturer', '19 Jun · 17:10', 'alert', 'Doc Pending', '210'],
];

const transit = [
  { id: 'INB-2291', mode: 'rail', route: ['Noamundi Mine', 'Jamshedpur Gate 3'], pct: 74, eta: '2h 10m', status: 'ok' },
  { id: 'OUT-5511', mode: 'truck', route: ['Jamshedpur Gate 1', 'Patna Stockyard'], pct: 48, eta: '5h 40m', status: 'ok' },
  { id: 'INB-2297', mode: 'rail', route: ['Noamundi Mine', 'Jamshedpur Gate 3'], pct: 29, eta: '7h 05m', status: 'ok' },
  { id: 'OUT-5513', mode: 'truck', route: ['Jamshedpur Gate 2', 'Pune'], pct: 61, eta: '9h 20m — delayed', status: 'warn' },
  { id: 'OUT-5515', mode: 'truck', route: ['Jamshedpur Gate 1', 'Delhi-NCR'], pct: 35, eta: '14h 50m', status: 'ok' },
  { id: 'INB-2293', mode: 'truck', route: ['Joda Quarry', 'Jamshedpur Gate 2'], pct: 82, eta: '40m — delayed', status: 'warn' },
  { id: 'OUT-5510', mode: 'rail', route: ['Jamshedpur Plant', 'Kolkata Port'], pct: 18, eta: '11h 30m', status: 'ok' },
];

const safety = [
  ['INB-2291', 'rail', true, true, true, true],
  ['INB-2298', 'truck', true, false, true, true],
  ['OUT-5517', 'truck', true, true, true, false],
  ['OUT-5511', 'truck', true, true, true, true],
  ['INB-2293', 'truck', true, true, false, true],
  ['OUT-5510', 'rail', true, true, true, true],
];

const dms = [
  { id: 'DRV-114', mode: 'truck', role: 'Driver', vehicle: 'OUT-5513', eyes: 'critical', eyesNote: 'Eyes off road 4.2s, repeated', yawns: 5, yawnWin: '15 min', drowsy: 82, mobile: true, status: 'critical', note: 'In-cab alarm triggered · advisory sent to stop and rest' },
  { id: 'DRV-098', mode: 'truck', role: 'Driver', vehicle: 'INB-2293', eyes: 'ok', eyesNote: 'On road, steady gaze', yawns: 1, yawnWin: '30 min', drowsy: 18, mobile: false, status: 'ok', note: 'Normal alertness' },
  { id: 'DRV-205', mode: 'truck', role: 'Driver', vehicle: 'OUT-5515', eyes: 'ok', eyesNote: 'On road, steady gaze', yawns: 0, yawnWin: '30 min', drowsy: 9, mobile: false, status: 'ok', note: 'Normal alertness' },
  { id: 'DRV-142', mode: 'truck', role: 'Driver', vehicle: 'INB-2298', eyes: 'warn', eyesNote: 'Brief glance-away 1.8s', yawns: 2, yawnWin: '20 min', drowsy: 34, mobile: false, status: 'warn', note: 'Vehicle also held for tarpaulin check' },
  { id: 'LP-3301', mode: 'rail', role: 'Loco Pilot', vehicle: 'INB-2291', eyes: 'ok', eyesNote: 'Alert, console-focused', yawns: 0, yawnWin: '30 min', drowsy: 12, mobile: false, status: 'ok', note: 'Normal alertness' },
  { id: 'LP-3309', mode: 'rail', role: 'Loco Pilot', vehicle: 'OUT-5510', eyes: 'warn', eyesNote: 'Distraction 2.1s detected', yawns: 1, yawnWin: '25 min', drowsy: 29, mobile: false, status: 'warn', note: 'Watch — re-check in 10 min' },
];

const formatNumber = (value) => Number(String(value).replace(/,/g, '')).toLocaleString('en-IN');

const statusLabels = {
  ok: 'On Track',
  info: 'On Schedule',
  warn: 'Delayed',
  alert: 'Hold',
  critical: 'Critical',
};

const eyesLabel = (eyes) => (eyes === 'critical' ? 'Eyes Off Road' : eyes === 'warn' ? 'Brief Distraction' : 'Eyes On Road');

const modePill = (mode) => (
  <span className={`mode-pill ${mode}`}>
    {mode === 'rail' ? '🚆 Rail' : '🚛 Truck'}
  </span>
);

const statusPill = (status) => <span className={`status-pill ${status}`}>{statusLabels[status] || status}</span>;

function App() {
  const [currentMode, setCurrentMode] = useState('all');
  const [showLanding, setShowLanding] = useState(true);
  const [view, setView] = useState('overview');
  const [clockTime, setClockTime] = useState('--:--:--');
  const [clockDate, setClockDate] = useState('--');
  const throughputRef = useRef(null);
  const modeRef = useRef(null);
  const throughputChart = useRef(null);
  const modeChart = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('en-IN', { hour12: false }));
      setClockDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }));
    };
    updateTime();
    const id = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(id);
  }, []);

  const filteredInbound = useMemo(() => (currentMode === 'all' ? inbound : inbound.filter((row) => row[2] === currentMode)), [currentMode]);
  const filteredOutbound = useMemo(() => (currentMode === 'all' ? outbound : outbound.filter((row) => row[2] === currentMode)), [currentMode]);
  const filteredTransit = useMemo(() => (currentMode === 'all' ? transit : transit.filter((row) => row.mode === currentMode)), [currentMode]);
  const filteredSafety = useMemo(() => (currentMode === 'all' ? safety : safety.filter((row) => row[1] === currentMode)), [currentMode]);
  const filteredDms = useMemo(() => (currentMode === 'all' ? dms : dms.filter((row) => row.mode === currentMode)), [currentMode]);

  const allRows = [...filteredInbound, ...filteredOutbound];
  const activeCount = allRows.length;
  const onTimeCount = allRows.filter((row) => row[6] === 'ok' || row[6] === 'info').length;
  const onTimePct = activeCount ? ((onTimeCount / activeCount) * 100).toFixed(1) : '0.0';
  const safetyPassed = filteredSafety.filter((row) => row[2] && row[3] && row[4] && row[5]).length;
  const safetyPct = filteredSafety.length ? ((safetyPassed / filteredSafety.length) * 100).toFixed(1) : '0.0';
  const dmsAlerts = filteredDms.filter((row) => row.status !== 'ok').length;

  const truckCount = allRows.filter((row) => row[2] === 'truck').length;
  const railCount = allRows.filter((row) => row[2] === 'rail').length;

  useEffect(() => {
    if (throughputRef.current) {
      throughputChart.current?.destroy();
      throughputChart.current = new Chart(throughputRef.current, {
        type: 'line',
        data: {
          labels: ['13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun'],
          datasets: [
            {
              label: 'kt',
              data: currentMode === 'truck' ? [18.2, 19.4, 20.1, 21.0, 18.9, 19.7, 20.3] : currentMode === 'rail' ? [26.1, 25.8, 27.2, 26.7, 27.9, 28.3, 27.5] : [34.3, 35.2, 37.3, 36.5, 36.8, 38.0, 37.8],
              borderColor: '#8FB4D6',
              backgroundColor: 'rgba(143,180,214,0.18)',
              fill: true,
              tension: 0.35,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false }, ticks: { color: '#9aa3b1' } },
            y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#9aa3b1' } },
          },
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
        },
      });
    }

    if (modeRef.current) {
      modeChart.current?.destroy();
      modeChart.current = new Chart(modeRef.current, {
        type: 'doughnut',
        data: {
          labels: currentMode === 'all' ? ['Truck', 'Rail'] : ['Inbound', 'Outbound'],
          datasets: [
            {
              data: currentMode === 'all' ? [truckCount, railCount] : [filteredInbound.length, filteredOutbound.length],
              backgroundColor: ['#8FB4D6', '#F2641A'],
              borderColor: '#1A2129',
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: { legend: { display: false } },
        },
      });
    }
  }, [currentMode, filteredInbound.length, filteredOutbound.length, railCount, truckCount]);

  const networkLabel = currentMode === 'all' ? 'Jamshedpur · Kalinganagar · Network' : currentMode === 'truck' ? 'Truck Network' : 'Rail Network';
  const headline = currentMode === 'all' ? 'Network Overview' : currentMode === 'truck' ? 'Truck Control Tower' : 'Rail Control Tower';
  const overviewSub = currentMode === 'all' ? 'Network status' : `${currentMode === 'truck' ? 'Truck' : 'Rail'} status and operations`;

  return (
    <div className="app-root">
      <div className={`landing ${showLanding ? '' : 'hidden'}`}>
        <div className="landing-head">
          <div className="landing-brand-row">
            <div className="brand-mark">
              <img src="/download.png" alt="Tata Steel logo" />
            </div>
            <div className="landing-brand-text">Tata Steel</div>
          </div>
          <h1>Tata Steel Logistics Control Tower</h1>
          <p>Choose a network to open its dedicated control tower — inbound, outbound, transit and safety monitoring.</p>
          <div className="landing-hero-meta">
            <span className="hero-pill">24/7 shipment visibility</span>
            <span className="hero-pill">Realtime driver & loco monitoring</span>
            <span className="hero-pill">Integrated truck + rail operations</span>
          </div>
        </div>
        <div className="mode-cards">
          <button className="mode-card truck" onClick={() => { setCurrentMode('truck'); setShowLanding(false); setView('overview'); }}>
            <span className="ic">🚛</span>
            <h2>Truck Control Tower</h2>
            <p>Road movement of raw material and finished steel — fleet status, gate activity, route progress and driver monitoring.</p>
            <div className="stats">
              <div className="stat"><div className="n">126</div><div className="l">Active</div></div>
              <div className="stat"><div className="n">88.9%</div><div className="l">On-Time</div></div>
              <div className="stat"><div className="n">2</div><div className="l">DMS Alerts</div></div>
            </div>
            <span className="enter">Enter Truck Tower →</span>
          </button>
          <button className="mode-card rail" onClick={() => { setCurrentMode('rail'); setShowLanding(false); setView('overview'); }}>
            <span className="ic">🚆</span>
            <h2>Rail Control Tower</h2>
            <p>Rake movement of ore, coal and finished product — siding status, rake position and loco pilot monitoring.</p>
            <div className="stats">
              <div className="stat"><div className="n">58</div><div className="l">Active</div></div>
              <div className="stat"><div className="n">96.5%</div><div className="l">On-Time</div></div>
              <div className="stat"><div className="n">1</div><div className="l">DMS Alerts</div></div>
            </div>
            <span className="enter">Enter Rail Tower →</span>
          </button>
        </div>
        <button className="skip-link" onClick={() => { setCurrentMode('all'); setShowLanding(false); setView('overview'); }}>View combined network overview instead</button>
      </div>

      <div id="dashboard" className={showLanding ? 'hidden' : ''}>
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">
              <img src="/download.png" alt="Tata Steel logo" />
            </div>
            <div className="brand-text">
              <div className="t1 display">Control Tower</div>
              <div className="t2">Tata Steel · Logistics</div>
            </div>
          </div>
          {currentMode !== 'all' && <span className={`mode-badge ${currentMode}`}>{currentMode === 'truck' ? 'TRUCK NETWORK' : 'RAIL NETWORK'}</span>}
          <button className="home-btn" onClick={() => { setShowLanding(true); setView('overview'); }}>
            ⌂ Home
          </button>
          <button className="mode-switch-btn" onClick={() => setCurrentMode(currentMode === 'truck' ? 'rail' : currentMode === 'rail' ? 'all' : 'truck')}>
            ⇄ Switch Network
          </button>
          <div className="ticker-wrap">
            <div className="ticker-label">Live</div>
            <div className="ticker-track">
              <span><b>INB-2291</b> arriving Gate 3</span>
              <span><b>OUT-5510</b> on-time to Kolkata</span>
              <span><b>DRV-114</b> advisory raised</span>
              <span><b>OUT-5513</b> delay checkpoint</span>
            </div>
          </div>
          <div className="clock-block">
            <div className="clock-time mono">{clockTime}</div>
            <div className="clock-date">{clockDate}</div>
          </div>
        </div>

        <div className="layout">
          <nav className="nav-rail">
            <div className="rail-track-line" />
            <div className="nav-items">
              {['overview', 'inbound', 'outbound', 'transit', 'safety'].map((item) => (
                <button
                  key={item}
                  className={`nav-item ${view === item ? 'active' : ''}`}
                  onClick={() => setView(item)}
                >
                  <span className="dot" />
                  <span>
                    <span className="label">{item === 'overview' ? 'Overview' : item.charAt(0).toUpperCase() + item.slice(1)}</span>
                    <span className="sub">{item === 'overview' ? 'Network status' : item === 'inbound' ? 'Raw material' : item === 'outbound' ? 'Finished steel' : item === 'transit' ? 'Live movement' : 'Checks & DMS'}</span>
                  </span>
                </button>
              ))}
              <div className="loco" />
            </div>
          </nav>

          <main className="main">
            <section className={`view ${view === 'overview' ? 'active' : ''}`}>
              <div className="view-head">
                <div>
                  <span className="eyebrow">{networkLabel}</span>
                  <h1>{headline}</h1>
                </div>
                <div className="meta">Last sync: <span className="mono">{clockTime}</span></div>
              </div>

              <div className="kpi-row">
                <div className="kpi-card" style={{ '--accent': 'var(--steel)' }}>
                  <div className="klabel">Active Shipments</div>
                  <div className="kval">{activeCount}</div>
                  <div className="ksub">{currentMode === 'all' ? `Truck ${truckCount} · Rail ${railCount}` : `In ${currentMode} network`}</div>
                </div>
                <div className="kpi-card" style={{ '--accent': 'var(--green)' }}>
                  <div className="klabel">On-Time Performance</div>
                  <div className="kval">{onTimePct}%</div>
                  <div className="ksub">{onTimeCount} of {activeCount} consignments</div>
                </div>
                <div className="kpi-card" style={{ '--accent': 'var(--amber)' }}>
                  <div className="klabel">In Transit Right Now</div>
                  <div className="kval">{filteredTransit.length}</div>
                  <div className="ksub">{currentMode === 'all' ? 'Across truck + rail' : currentMode === 'truck' ? 'Truck movements live' : 'Rail rakes live'}</div>
                </div>
                <div className="kpi-card" style={{ '--accent': 'var(--red)' }}>
                  <div className="klabel">Safety Compliance</div>
                  <div className="kval">{safetyPct}%</div>
                  <div className="ksub">{dmsAlerts} active DMS alert{dmsAlerts === 1 ? '' : 's'}</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="panel" style={{ marginBottom: 0 }}>
                  <h3>Daily Throughput — Last 7 Days <span className="tag">kt = '000 MT</span></h3>
                  <div className="chart-box"><canvas ref={throughputRef} /></div>
                </div>
                <div className="panel" style={{ marginBottom: 0 }}>
                  <h3>{currentMode === 'all' ? 'Shipment Mix by Mode' : 'Inbound vs Outbound Split'}</h3>
                  <div className="chart-box"><canvas ref={modeRef} /></div>
                  <div className="legend-row">
                    {currentMode === 'all' ? (
                      <>
                        <div className="li"><span className="sw" style={{ background: '#8FB4D6' }}></span>Truck — {truckCount}</div>
                        <div className="li"><span className="sw" style={{ background: '#F2641A' }}></span>Rail — {railCount}</div>
                      </>
                    ) : (
                      <>
                        <div className="li"><span className="sw" style={{ background: '#8FB4D6' }}></span>Inbound — {filteredInbound.length}</div>
                        <div className="li"><span className="sw" style={{ background: '#F2641A' }}></span>Outbound — {filteredOutbound.length}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3>Active Exceptions <span className="tag">{filteredSafety.filter((row) => !row[2] || !row[3] || !row[4] || !row[5]).length + filteredDms.filter((row) => row.status !== 'ok').length} open</span></h3>
                <div className="alert-list">
                  {allRows.filter((row) => row[6] === 'warn' || row[6] === 'alert').map((row) => (
                    <div key={`${row[0]}-${row[6]}`} className="alert-row">
                      <span className="a-id">{row[0]}</span>
                      <span className="a-text"><b>{row[1]}</b> — {row[7]}.</span>
                    </div>
                  ))}
                  {filteredDms.filter((row) => row.status !== 'ok').map((row) => (
                    <div key={row.id} className="alert-row">
                      <span className="a-id">{row.id}</span>
                      <span className="a-text">{row.role} on <b>{row.vehicle}</b> — {eyesLabel(row.eyes).toLowerCase()}, drowsiness {row.drowsy}/100.</span>
                    </div>
                  ))}
                  {allRows.every((row) => row[6] !== 'warn' && row[6] !== 'alert') && filteredDms.every((row) => row.status === 'ok') && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '12.5px' }}>No open exceptions for this network.</div>
                  )}
                </div>
              </div>
            </section>

            <section className={`view ${view === 'inbound' ? 'active' : ''}`}>
              <div className="view-head">
                <div>
                  <span className="eyebrow">Mines · Ports · Quarries → Plant Gate</span>
                  <h1>Inbound — Raw Material</h1>
                </div>
                <div className="meta">{filteredInbound.length} inbound shipments · {currentMode === 'all' ? 'Combined view' : `${currentMode} mode`}</div>
              </div>
              <div className="panel">
                <table>
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Material</th>
                      <th>Mode</th>
                      <th>Origin</th>
                      <th>Plant Gate</th>
                      <th>ETA</th>
                      <th>Status</th>
                      <th className="qty-h">Qty (MT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInbound.map((row) => (
                      <tr key={row[0]}>
                        <td className="id">{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{modePill(row[2])}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{statusPill(row[6])}</td>
                        <td className="qty">{row[8]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={`view ${view === 'outbound' ? 'active' : ''}`}>
              <div className="view-head">
                <div>
                  <span className="eyebrow">Plant Gate → Ports · OEMs · Stockyards</span>
                  <h1>Outbound — Finished Steel</h1>
                </div>
                <div className="meta">{filteredOutbound.length} outbound consignments · {currentMode === 'all' ? 'Combined view' : `${currentMode} mode`}</div>
              </div>
              <div className="panel">
                <table>
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Product</th>
                      <th>Mode</th>
                      <th>Destination</th>
                      <th>Customer / Hub</th>
                      <th>Dispatch</th>
                      <th>Status</th>
                      <th className="qty-h">Qty (MT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOutbound.map((row) => (
                      <tr key={row[0]}>
                        <td className="id">{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{modePill(row[2])}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{statusPill(row[6])}</td>
                        <td className="qty">{row[8]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={`view ${view === 'transit' ? 'active' : ''}`}>
              <div className="view-head">
                <div>
                  <span className="eyebrow">Live Movement Tracking</span>
                  <h1>In Transit</h1>
                </div>
                <div className="meta">Auto-refreshing route progress · GPS / RFID feed</div>
              </div>
              {filteredTransit.length > 0 ? filteredTransit.map((item) => (
                <div key={item.id} className="transit-card">
                  <div className="transit-top">
                    <div>
                      <div className="transit-route">{item.route[0]}<span className="arrow">→</span>{item.route[1]}</div>
                      <div className="transit-meta">{modePill(item.mode)} <span className="transit-id">{item.id}</span> · ETA {item.eta}</div>
                    </div>
                    {statusPill(item.status)}
                  </div>
                  <div className="progress-row">
                    <div className="progress-track"><div className={`progress-fill ${item.mode === 'rail' ? 'rail-fill' : item.status === 'warn' ? 'delay-fill' : ''}`} style={{ width: `${item.pct}%` }} /></div>
                    <div className="progress-pct">{item.pct}%</div>
                  </div>
                </div>
              )) : <div className="panel">No shipments currently in transit for this network.</div>}
            </section>

            <section className={`view ${view === 'safety' ? 'active' : ''}`}>
              <div className="view-head">
                <div>
                  <span className="eyebrow">Pre-Movement, In-Transit & Driver Checks</span>
                  <h1>Safety Compliance</h1>
                </div>
                <div className="meta">Standard: TS Logistics Safety Protocol v4</div>
              </div>
              <div className="grid-2">
                <div className="panel" style={{ marginBottom: 0 }}>
                  <h3>Overall Compliance Score — Today</h3>
                  <div className="gauge-wrap">
                    <div className="chart-box" style={{ height: 130, width: 130, flexShrink: 0 }}>
                      <div className="gauge-circle">
                        <div className="gauge-fill" style={{ '--pct': '96.2' }} />
                        <div className="gauge-label">96%</div>
                      </div>
                    </div>
                    <div>
                      <div className="gauge-num">96.2<span style={{ fontSize: 16, color: 'var(--text-dim)' }}>%</span></div>
                      <div className="gauge-cap">186 of 193 checks passed</div>
                      <div className="gauge-cap" style={{ marginTop: 8 }}>2 active holds · 5 pending re-check</div>
                    </div>
                  </div>
                </div>
                <div className="panel" style={{ marginBottom: 0 }}>
                  <h3>Checklist Categories</h3>
                  <div className="check-grid">
                    {[
                      ['✓', 'PPE — Driver / Loco Pilot', 'pass'],
                      ['✓', 'Vehicle / Rake Fitness', 'pass'],
                      ['!', 'Load Securing & Tarpaulin', 'fail'],
                      ['✓', 'Driver Fitness & Rest Hours', 'pass'],
                      ['✓', 'GPS / RFID Tracking Active', 'pass'],
                      ['✓', 'Weighbridge Clearance', 'pass'],
                      ['✓', 'Tool Box Talk Completed', 'pass'],
                      ['!', 'E-Way Bill / Documentation', 'fail'],
                    ].map(([icon, label, type]) => (
                      <div key={label} className="check-item">
                        <span className={`ic ${type}`}>{icon}</span>{label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3>Driver Monitoring System — DMS <span className="tag">live · camera + IR sensor feed</span></h3>
                <p style={{ fontSize: 11.5, color: 'var(--text-dim)', marginBottom: 14, maxWidth: 680 }}>
                  In-cab AI camera tracks each driver / loco pilot for drowsiness and distraction in real time: eyelid closure and yawning frequency, gaze direction, head-pose drop, and mobile phone use.
                </p>
                <div className="dms-grid">
                  {filteredDms.map((item) => (
                    <div key={item.id} className={`dms-card ${item.status}`}>
                      <div className="dms-top">
                        <div className="dms-who">
                          <div className="id">{item.id}</div>
                          <div className="role">{item.role}</div>
                        </div>
                        <div className="dms-veh">{modePill(item.mode)}<br />{item.vehicle}</div>
                      </div>
                      <div className="dms-row"><span>👁 Gaze</span><span className={`dms-flag ${item.eyes}`}>{eyesLabel(item.eyes)}</span></div>
                      <div className="dms-row" style={{ marginBottom: 2 }}><span>🥱 Yawns ({item.yawnWin})</span><span className="v">{item.yawns}</span></div>
                      <div className="dms-row" style={{ marginBottom: 2 }}><span>📱 Mobile use</span><span className="v">{item.mobile ? 'Detected' : 'None'}</span></div>
                      <div className="dms-row" style={{ marginBottom: 4 }}><span>Drowsiness score</span><span className="v">{item.drowsy}/100</span></div>
                      <div className="drowsy-meter"><div className="drowsy-fill" style={{ width: `${item.drowsy}%`, background: item.drowsy >= 60 ? 'var(--red)' : item.drowsy >= 30 ? 'var(--yellow)' : 'var(--green)' }} /></div>
                      <div className="dms-note">{item.eyesNote} · {item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h3>Per-Shipment Safety Log <span className="tag">today</span></h3>
                <table>
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Mode</th>
                      <th>PPE</th>
                      <th>Load Securing</th>
                      <th>Vehicle Fitness</th>
                      <th>Documentation</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSafety.map((item) => (
                      <tr key={item[0]}>
                        <td className="id">{item[0]}</td>
                        <td>{modePill(item[1])}</td>
                        <td>{item[2] ? <span className="ic pass">✓</span> : <span className="ic fail">!</span>}</td>
                        <td>{item[3] ? <span className="ic pass">✓</span> : <span className="ic fail">!</span>}</td>
                        <td>{item[4] ? <span className="ic pass">✓</span> : <span className="ic fail">!</span>}</td>
                        <td>{item[5] ? <span className="ic pass">✓</span> : <span className="ic fail">!</span>}</td>
                        <td>{item.every((value) => value === true) ? statusPill('ok') : statusPill('alert')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
