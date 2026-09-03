import express from 'express';
import { getOverpassPOIs } from '../services/placesService.js';

const router = express.Router();

router.get('/pois', async (req, res) => {
  const lat = parseFloat(req.query.lat) || 25.5788;
  const lng = parseFloat(req.query.lng) || 91.8933;
  const radius = parseInt(req.query.radius) || 8000;

  try {
    const data = await getOverpassPOIs(lat, lng, radius);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
