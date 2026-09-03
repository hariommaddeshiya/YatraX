import express from 'express';
import { 
  checkGeofenceBreach, 
  calculateTouristSafetyScore, 
  createEmergencyIncident, 
  activeIncidents 
} from '../services/safetyService.js';
import { broadcastEvent } from '../services/adaptiveEngine.js';

const router = express.Router();

// Get active safety score and radar telemetry
router.get('/score', (req, res) => {
  const { weatherRisk, crowdSurge, isGeofenced, networkAvailable, distanceKm } = req.query;
  const result = calculateTouristSafetyScore({
    weatherRisk: weatherRisk || 'LOW',
    crowdSurge: crowdSurge || 'LOW',
    isGeofenced: isGeofenced === 'true',
    networkAvailable: networkAvailable !== 'false',
    distanceToHospitalKm: parseFloat(distanceKm) || 3.2
  });

  res.json({ success: true, ...result });
});

// Check coordinates against safety geofences
router.post('/check-geofence', (req, res) => {
  const { lat, lng } = req.body;
  const result = checkGeofenceBreach(parseFloat(lat) || 25.5788, parseFloat(lng) || 91.8933);
  res.json({ success: true, result });
});

// Get active incidents for command center
router.get('/incidents', (req, res) => {
  res.json({ success: true, count: activeIncidents.length, incidents: activeIncidents });
});

// Trigger emergency SOS
router.post('/sos', (req, res) => {
  const { touristId, touristName, phone, location, deviceLocation, deviceTelemetry, emergencyContact, details } = req.body;
  const incident = createEmergencyIncident({
    touristId: touristId || 'tourist-user-01',
    touristName: touristName || 'Traveler',
    phone: phone || '+91-9876543210',
    location: location || deviceLocation || { lat: 28.6139, lng: 77.2090, name: 'Live Device GPS' },
    deviceTelemetry: deviceTelemetry || null,
    emergencyContact: emergencyContact || null,
    details: details || 'Tourist activated High-Priority Distress Beacon from real device.',
    riskLevel: 'CRITICAL',
    triggerType: 'SOS_TRIGGERED'
  });

  broadcastEvent('SOS_BROADCAST', incident);
  res.json({ success: true, incident, message: 'Emergency SOS signal dispatched. Government rescue unit notified.' });
});

export default router;
