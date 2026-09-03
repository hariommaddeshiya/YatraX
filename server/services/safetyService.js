import { seedSafetyZones } from '../seed/destinationsData.js';
import { calculateDistanceKm } from './routingService.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory active incidents store
export const activeIncidents = [
  {
    id: 'INC-2026-081',
    touristId: 'tourist-demo-01',
    touristName: 'Aarav Sharma',
    phone: '+91-9876543210',
    tripId: 'trip-demo-01',
    location: {
      lat: 25.2765,
      lng: 91.6850,
      name: 'Nohkalikai Downstream Trail, Meghalaya'
    },
    riskLevel: 'HIGH',
    triggerType: 'WEATHER_ALERT',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
    details: 'Heavy flash rain alert (18mm/hr) in gorge sector. Guide notified to divert group.',
    recommendedAction: 'Move toward Cherrapunji Forest Department Facilitation Shelter.',
    actionTaken: 'Itinerary automatically adjusted; indoor cultural tour assigned.'
  }
];

export let activeSafetyZones = [...seedSafetyZones];

export const addSafetyZone = (zoneData) => {
  const newZone = {
    id: `ZONE-${Date.now()}`,
    ...zoneData
  };
  activeSafetyZones.push(newZone);
  return newZone;
};

export const removeSafetyZone = (zoneId) => {
  activeSafetyZones = activeSafetyZones.filter(z => z.id !== zoneId);
};

export const checkGeofenceBreach = (lat, lng) => {
  for (const zone of activeSafetyZones) {
    const distKm = calculateDistanceKm(lat, lng, zone.coordinates.lat, zone.coordinates.lng);
    const distMeters = distKm * 1000;

    if (distMeters <= zone.radiusMeters) {
      return {
        isInRiskZone: true,
        zone,
        distanceMeters: Math.round(distMeters),
        alertMessage: `🚨 HIGH-RISK ZONE BREACH: You have entered ${zone.name}. Risk: ${zone.riskLevel} (${zone.riskType}).`,
        recommendedAction: `Move toward nearest safe point: ${zone.nearestSafePoint?.name || 'safe area'}. Follow marked eco-corridor.`,
        safePoint: zone.nearestSafePoint
      };
    }
  }

  return {
    isInRiskZone: false,
    alertMessage: 'You are in a verified safe tourism corridor.',
    recommendedAction: 'Continue following standard eco-trails.'
  };
};

export const calculateTouristSafetyScore = ({
  weatherRisk = 'LOW',
  crowdSurge = 'LOW',
  isGeofenced = false,
  networkAvailable = true,
  distanceToHospitalKm = 3.2
}) => {
  let score = 95;

  if (weatherRisk === 'HIGH') score -= 18;
  else if (weatherRisk === 'MODERATE') score -= 8;

  if (crowdSurge === 'HIGH_SURGE') score -= 10;
  if (isGeofenced) score -= 25;
  if (!networkAvailable) score -= 8;
  if (distanceToHospitalKm > 20) score -= 10;

  const finalScore = Math.max(25, Math.min(100, score));

  return {
    safetyScore: finalScore,
    telemetry: {
      weather: weatherRisk === 'LOW' ? '🟢 Optimal' : (weatherRisk === 'MODERATE' ? '🟡 Caution' : '🔴 Alert'),
      roadConditions: '🟢 Clear & Open',
      crowdDensity: crowdSurge === 'HIGH_SURGE' ? '🟡 High Surge' : '🟢 Normal',
      riskZoneStatus: isGeofenced ? '🔴 In Hazard Zone' : '🟢 Clear',
      networkAvailability: networkAvailable ? '🟢 5G / 4G Active' : '🔴 Offline / Weak',
      emergencyProximity: `🟢 Hospital within ${distanceToHospitalKm} km`
    },
    lastEvaluated: new Date().toISOString()
  };
};

export const createEmergencyIncident = (incidentData) => {
  const loc = incidentData.location || incidentData.deviceLocation || {};
  const lat = parseFloat(loc.lat) || 28.6139;
  const lng = parseFloat(loc.lng) || 77.2090;

  const incident = {
    id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
    touristId: incidentData.touristId || 'tourist-user-01',
    touristName: incidentData.touristName || 'Traveler',
    phone: incidentData.phone || '+91-9876543210',
    tripId: incidentData.tripId || 'trip-active-01',
    location: {
      lat,
      lng,
      name: loc.name || loc.address || `Live Device GPS (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
      accuracyMeters: loc.accuracyMeters || 10,
      address: loc.address || `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      mapsUrl: loc.mapsUrl || `https://www.google.com/maps?q=${lat},${lng}`,
      isRealDeviceGps: loc.isRealDeviceGps !== false
    },
    deviceTelemetry: incidentData.deviceTelemetry || {
      battery: incidentData.battery || 'Unknown',
      network: 'Active (Online)',
      timestamp: new Date().toISOString()
    },
    emergencyContact: incidentData.emergencyContact || null,
    riskLevel: incidentData.riskLevel || 'CRITICAL',
    triggerType: incidentData.triggerType || 'SOS_TRIGGERED',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
    details: incidentData.details || `Tourist activated High-Priority Distress Beacon from real device at ${lat.toFixed(5)}, ${lng.toFixed(5)}.`,
    recommendedAction: incidentData.recommendedAction || 'Dispatch nearest Tourist Police patrol and alert local District Trauma Center.',
    actionTaken: 'Live GPS Distress Beacon broadcasted to State Government Emergency Command Terminal.'
  };

  activeIncidents.unshift(incident);
  return incident;
};
