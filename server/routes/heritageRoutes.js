import express from 'express';
import { getHeritageSites, getHeritageSiteById } from '../services/heritageService.js';

const router = express.Router();

// Get all 360 heritage destinations
router.get('/', (req, res) => {
  const sites = getHeritageSites();
  res.json({ success: true, count: sites.length, sites });
});

// Get single heritage destination with 360 panorama and hotspots
router.get('/:id', (req, res) => {
  const site = getHeritageSiteById(req.params.id);
  res.json({ success: true, site });
});

export default router;
