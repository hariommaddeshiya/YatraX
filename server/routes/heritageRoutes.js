import express from 'express';
import axios from 'axios';
import { getHeritageSites, getHeritageSiteById } from '../services/heritageService.js';

const router = express.Router();

// 1. Image proxy endpoint to eliminate CORS blocks on WebGL canvas / textures
router.get('/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const response = await axios({
      method: 'GET',
      url: targetUrl,
      responseType: 'stream',
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }

    response.data.pipe(res);
  } catch (err) {
    // If proxy fails, redirect to direct URL
    try {
      res.redirect(decodeURIComponent(url));
    } catch (e) {
      res.status(502).send('Failed to fetch image');
    }
  }
});

// 2. Get all 360 heritage destinations (supports filters: search, region, category, top10)
router.get('/', (req, res) => {
  const sites = getHeritageSites(req.query);
  res.json({ success: true, count: sites.length, sites });
});

// 3. Get single heritage destination with 360 panorama and hotspots
router.get('/:id', (req, res) => {
  const site = getHeritageSiteById(req.params.id);
  res.json({ success: true, site });
});

export default router;
