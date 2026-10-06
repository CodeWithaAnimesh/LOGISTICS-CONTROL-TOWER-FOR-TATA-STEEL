import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Road Routes
import { RoadOutbound } from './pages/Road/RoadOutbound';
import { RoadIntraPlant } from './pages/Road/RoadIntraPlant';
import { RoadTransit } from './pages/Road/RoadTransit';
import { RoadSafety } from './pages/Road/RoadSafety';
import { RoadEfficiency } from './pages/Road/RoadEfficiency';
// import { RoadReports } from './pages/Road/RoadReports';

// Rail Routes
import { RailOutbound } from './pages/Rail/RailOutbound';
import { RailTransit } from './pages/Rail/RailTransit';
// import { RailIntraPlant } from './pages/Rail/RailIntraPlant';
// import { RailSafety } from './pages/Rail/RailSafety';
// import { RailReports } from './pages/Rail/RailReports';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Road Universe */}
          <Route path="/road/outbound" element={<RoadOutbound />} />
          <Route path="/road/intra-plant" element={<RoadIntraPlant />} />
          <Route path="/road/transit" element={<RoadTransit />} />
          <Route path="/road/safety" element={<RoadSafety />} />
          <Route path="/road/efficiency" element={<RoadEfficiency />} />

          {/* Rail Universe */}
          <Route path="/rail/outbound" element={<RailOutbound />} />
          <Route path="/rail/transit" element={<RailTransit />} />
          
          {/* Redirect Root to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
