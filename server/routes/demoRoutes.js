import express from 'express';
import { processAdaptiveEvent } from '../services/adaptiveEngine.js';
import { generateSmartTrip, getTripById, localTrips } from '../services/tripService.js';
import { broadcastEvent } from '../services/adaptiveEngine.js';

const router = express.Router();

// 1. Simulate Hotel Price Spike (₹4,000 -> ₹5,200)
router.post('/hotel-price', async (req, res) => {
  try {
    const trip = getTripById('active-trip');
    // If already over budget, toggle/substitute Hotel B; otherwise trigger price spike
    const eventType = trip?.budgetBreakdown?.isOverBudget ? 'SUBSTITUTE_HOTEL_B' : 'HOTEL_PRICE_SPIKE';
    const result = await processAdaptiveEvent('active-trip', eventType);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Explicit Substitute Hotel B endpoint
router.post('/substitute-hotel-b', async (req, res) => {
  try {
    const result = await processAdaptiveEvent('active-trip', 'SUBSTITUTE_HOTEL_B');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Explicit Hotel Price Surge endpoint
router.post('/hotel-price-surge', async (req, res) => {
  try {
    const result = await processAdaptiveEvent('active-trip', 'HOTEL_PRICE_SPIKE');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Simulate Heavy Rain / Torrential Storm
router.post('/heavy-rain', async (req, res) => {
  try {
    const result = await processAdaptiveEvent('active-trip', 'WEATHER_ALERT');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Simulate Crowd Surge
router.post('/crowd-surge', async (req, res) => {
  try {
    const result = await processAdaptiveEvent('active-trip', 'CROWD_SURGE');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Simulate Tourist In Hazard Risk Zone
router.post('/risk-zone', async (req, res) => {
  try {
    const result = await processAdaptiveEvent('active-trip', 'SAFETY_GEOFENCE');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Simulate Internet Connectivity Loss
router.post('/internet-loss', async (req, res) => {
  try {
    const result = await processAdaptiveEvent('active-trip', 'NETWORK_LOSS');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reset Demo Trip to Initial Clean State
router.post('/reset', async (req, res) => {
  try {
    const cleanTrip = await generateSmartTrip({
      origin: 'Delhi',
      destination: 'Meghalaya',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      travellers: 2,
      budget: 40000,
      travelStyle: 'Eco',
      interests: ['Waterfalls', 'Mountains', 'Heritage', 'Villages']
    });

    broadcastEvent('DEMO_RESET', cleanTrip);
    res.json({ success: true, message: 'Demo environment reset to baseline pristine state.', trip: cleanTrip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
