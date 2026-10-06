// Exact metrics extracted from the provided UI PDFs to ensure strict adherence.

export const intraPlantData = {
  overallEfficiency: {
    percentage: 96.2,
    target: 95,
  },
  activeAssets: {
    total: 285,
    road: 140,
    rail: 145,
    available: 212,
  },
  pendingAlerts: {
    total: 18,
    highPriority: 3,
    roadHigh: 2,
    railHigh: 1,
  },
  road: {
    assetStatus: { running: 102, notRunning: 25, breakdown: 7, available: 6 },
    gpsStatus: { running: 102, notRunning: 25 },
    utilization: { idleMins: 45, idleTotalHrs: 38, utilizationPercent: 88, targetPercent: 85 },
    safety: { speed: 25, drowsy: 10, distraction: 15, noEntry: 0, restricted: 2, haltNoParking: 8 },
    operators: {
      top: [
        { id: 'OP-101', score: 95 },
        { id: 'OP-102', score: 88 },
        { id: 'OP-103', score: 82 },
      ],
      needsImprovement: ['OP-101', 'OP-102', 'OP-103'],
    }
  },
  rail: {
    assetStatus: { running: 115, notRunning: 18, breakdown: 4, available: 8 },
    gpsStatus: { running: 102, notRunning: 25 },
    pilotStatus: { total: 6, breakdown: [{ count: 2, date: '13 Dec' }, { count: 1, date: '14 Dec' }, { count: 1, date: '15 Dec' }] },
    utilization: { idleMins: 60, idleTotalHrs: 48, utilizationPercent: 92, targetPercent: 90 },
    safety: { speed: 5, distractive: 0, drowsy: 1 },
    operators: {
      top: [
        { id: 'OP-201', score: 92 },
        { id: 'OP-202', score: 85 },
        { id: 'OP-203', score: 80 },
      ],
      needsImprovement: ['OP-201', 'OP-202', 'OP-203'],
    }
  }
};

export const transitData = {
  road: {
    delayAnalysis: {
      onTimePercent: 94.2,
      onTimeVehicles: 1234,
      delay1Day: { percent: 3.5, vehicles: 45 },
      delay2Day: { percent: 1.8, vehicles: 23 },
      delay3DayPlus: { percent: 0.5, vehicles: 6 },
    },
    deliveryStatus: { undelivered: 152, missingDates: 24 },
    gpsHealth: { connectedPercent: 97, disconnectedPercent: 3, disconnectedVehicles: 39 },
    safety: { speed: 25, drowsy: 10, distraction: 15, noEntry: 0, restricted: 2, haltNoParking: 8 },
  },
  rail: {
    delayAnalysis: {
      onTimePercent: 89.5,
      onTimeRakes: 280,
      delay1Day: { percent: 6.2, rakes: 19 },
      delay2Day: { percent: 3.1, rakes: 10 },
      delay3DayPlus: { percent: 1.2, rakes: 4 },
    },
    deliveryStatus: { undelivered: 38, missingDates: 12 },
    gpsHealth: { connectedPercent: 92, disconnectedRakes: 12 },
    detention: { averageDetention: 18, postPilot: 6 },
  }
};
