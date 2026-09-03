import express from 'express';
import { seedDestinations } from '../seed/destinationsData.js';

const router = express.Router();

// Get all destinations
router.get('/', (req, res) => {
  const { category, offbeat } = req.query;
  let results = seedDestinations;

  if (offbeat === 'true') {
    results = results.filter(d => d.isOffbeat);
  }
  if (category) {
    results = results.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }

  res.json({ success: true, count: results.length, destinations: results });
});

// Get destination by ID
router.get('/:id', (req, res) => {
  const dest = seedDestinations.find(d => d.id === req.params.id) || seedDestinations[0];
  res.json({ success: true, destination: dest });
});

export default router;
