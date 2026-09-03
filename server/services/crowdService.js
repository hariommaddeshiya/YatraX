// Crowd Prediction & Adaptation Engine

// Hourly base distribution curve for Indian heritage/tourist spots (0-23 hours)
const hourlyDistribution = {
  6: 15, 7: 22, 8: 35, 9: 50, 10: 68, 11: 78,
  12: 88, 13: 82, 14: 85, 15: 90, 16: 94, 17: 84,
  18: 72, 19: 55, 20: 38, 21: 20
};

export const predictCrowdLevel = (attractionName, hour = 11, isWeekend = false) => {
  const basePercent = hourlyDistribution[hour] || 45;
  const weekendMultiplier = isWeekend ? 1.25 : 1.0;
  
  // Specific location multiplier
  let locationFactor = 1.0;
  const lower = (attractionName || '').toLowerCase();
  if (lower.includes('root bridge') || lower.includes('taj') || lower.includes('ghat')) {
    locationFactor = 1.15;
  } else if (lower.includes('museum') || lower.includes('homestay') || lower.includes('craft')) {
    locationFactor = 0.75;
  }

  const crowdPercent = Math.min(98, Math.max(10, Math.round(basePercent * weekendMultiplier * locationFactor)));
  
  let crowdStatus = 'LOW';
  let badgeColor = 'green';
  let recommendation = 'Optimal time to visit. Minimal wait times and tranquil nature experience.';

  if (crowdPercent > 80) {
    crowdStatus = 'HIGH_SURGE';
    badgeColor = 'red';
    recommendation = 'Heavy crowd surge predicted. Recommended early morning visit at 07:00 AM or consider offbeat alternative spot.';
  } else if (crowdPercent > 55) {
    crowdStatus = 'MODERATE';
    badgeColor = 'yellow';
    recommendation = 'Moderate footfall. Standard visiting conditions.';
  }

  return {
    attractionName,
    queriedHour: hour,
    crowdPercent,
    crowdStatus,
    badgeColor,
    isWeekend,
    peakHours: '01:00 PM - 04:30 PM (88-94%)',
    recommendedSlot: '07:00 AM - 09:30 AM (22-35%)',
    recommendation,
    sourceType: 'AI PREDICTION (ESTIMATED)',
    source: 'SafarAI Crowd Predictor v2.1 (Historical Curves + Time-of-Day Analysis)',
    lastCalculated: new Date().toISOString()
  };
};

export const getAlternativeLowCrowdAttraction = (destinationId, currentAttractionName) => {
  const alternativesMap = {
    'meghalaya': {
      highCrowd: 'Nongriat Double Decker Living Root Bridge',
      alternative: {
        name: 'Krang Shuri Natural Emerald Pool & Waterfalls',
        crowdPercent: 32,
        recommendedVisit: '08:00 AM',
        ecoScore: 97,
        reason: 'Less crowded pristine waterfall basin with indigenous bamboo viewpoints and zero queue delays.'
      }
    }
  };

  const entry = alternativesMap[destinationId] || {
    highCrowd: currentAttractionName,
    alternative: {
      name: 'Mawphlang Sacred Ancient Forest Grove',
      crowdPercent: 28,
      recommendedVisit: '08:30 AM',
      ecoScore: 98,
      reason: 'Tranquil centuries-old biodiversity sanctuary guided by tribal elders with 70% lower crowd density.'
    }
  };

  return entry.alternative;
};
