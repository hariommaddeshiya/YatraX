import express from 'express';
import { 
  activeIncidents, 
  activeSafetyZones, 
  addSafetyZone, 
  removeSafetyZone 
} from '../services/safetyService.js';
import { seedSafetyZones } from '../seed/destinationsData.js';
import { broadcastEvent } from '../services/adaptiveEngine.js';

const router = express.Router();

// Mock active tourists data for government command dashboard
let activeTourists = [
  {
    id: 'tourist-demo-01',
    name: 'Aarav Sharma',
    phone: '+91-9876543210',
    origin: 'Delhi',
    destination: 'Meghalaya',
    groupSize: 2,
    lat: 25.2765,
    lng: 91.6850,
    status: 'ACTIVE',
    riskStatus: 'SAFE',
    safetyScore: 92,
    carbonOffsetKg: 42,
    lastPing: new Date().toISOString()
  },
  {
    id: 'tourist-demo-02',
    name: 'Meera Iyer',
    phone: '+91-9811223344',
    origin: 'Bengaluru',
    destination: 'Sikkim',
    groupSize: 4,
    lat: 27.3389,
    lng: 88.6065,
    status: 'ACTIVE',
    riskStatus: 'SAFE',
    safetyScore: 96,
    carbonOffsetKg: 85,
    lastPing: new Date().toISOString()
  },
  {
    id: 'tourist-demo-03',
    name: 'Kabir & Tanya Sen',
    phone: '+91-9844556677',
    origin: 'Kolkata',
    destination: 'Arunachal Pradesh',
    groupSize: 2,
    lat: 27.5861,
    lng: 91.8594,
    status: 'ACTIVE',
    riskStatus: 'SAFE',
    safetyScore: 91,
    carbonOffsetKg: 38,
    lastPing: new Date().toISOString()
  },
  {
    id: 'tourist-demo-04',
    name: 'Dr. Rameshwar Patel',
    phone: '+91-9822334455',
    origin: 'Ahmedabad',
    destination: 'Varanasi',
    groupSize: 3,
    lat: 25.3176,
    lng: 82.9739,
    status: 'ACTIVE',
    riskStatus: 'SAFE',
    safetyScore: 89,
    carbonOffsetKg: 50,
    lastPing: new Date().toISOString()
  }
];

// Get Government Dashboard Overview stats
router.get('/overview', (req, res) => {
  const stats = {
    totalTouristsActive: activeTourists.length + 142,
    highRiskTourists: activeIncidents.filter(i => i.status === 'ACTIVE').length,
    activeSosEvents: activeIncidents.filter(i => i.triggerType === 'SOS_TRIGGERED' && i.status === 'ACTIVE').length,
    weatherAlertsActive: 1,
    crowdAlertsActive: 2,
    offlineTouristsCount: 14,
    totalCarbonSavedKg: 12450,
    ecoHomestayUtilizationRate: '88.4%'
  };

  res.json({
    success: true,
    stats,
    activeTourists,
    incidents: activeIncidents,
    safetyZones: activeSafetyZones
  });
});

// Resolve an incident
router.post('/resolve-incident/:id', (req, res) => {
  const incident = activeIncidents.find(i => i.id === req.params.id);
  if (incident) {
    incident.status = 'RESOLVED';
    incident.actionTaken = req.body.actionTaken || 'Authority confirmed safety protocol compliance; tourist cleared safely.';
    incident.resolvedAt = new Date().toISOString();
    broadcastEvent('INCIDENT_RESOLVED', incident);
    res.json({ success: true, incident });
  } else {
    res.status(404).json({ success: false, message: 'Incident not found' });
  }
});

// Get active safety zones
router.get('/zones', (req, res) => {
  res.json({ success: true, zones: activeSafetyZones });
});

// Add a new risk zone
router.post('/zones', (req, res) => {
  const zone = addSafetyZone(req.body);
  broadcastEvent('ZONE_UPDATED', { type: 'ADDED', zone });
  res.json({ success: true, zone });
});

// Remove a risk zone
router.delete('/zones/:id', (req, res) => {
  removeSafetyZone(req.params.id);
  broadcastEvent('ZONE_UPDATED', { type: 'REMOVED', zoneId: req.params.id });
  res.json({ success: true, message: 'Zone removed' });
});

export default router;
