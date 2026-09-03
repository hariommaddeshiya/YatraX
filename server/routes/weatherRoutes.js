import express from 'express';
import { getLiveWeather } from '../services/weatherService.js';

const router = express.Router();

router.get('/live', async (req, res) => {
  const lat = parseFloat(req.query.lat) || 25.5788;
  const lng = parseFloat(req.query.lng) || 91.8933;
  const locationName = req.query.location || 'Meghalaya';

  try {
    const data = await getLiveWeather(lat, lng, locationName);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
