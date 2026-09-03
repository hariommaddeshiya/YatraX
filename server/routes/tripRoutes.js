import express from 'express';
import { generateSmartTrip, getTripById, localTrips } from '../services/tripService.js';
import { recalculateTripBudget } from '../services/budgetService.js';
import { broadcastEvent } from '../services/adaptiveEngine.js';
import { indiaStatesData } from '../data/indiaStatesData.js';
import { localStore } from '../config/db.js';

const router = express.Router();

// Helper to resolve matching state & destination in India master catalog
export const resolveDestinationFromTrip = (destName) => {
  const norm = (destName || '').toLowerCase().trim();
  for (const state of indiaStatesData) {
    for (const d of state.destinations) {
      const dNorm = d.name.toLowerCase();
      const idNorm = d.id.toLowerCase();
      if (
        norm.includes(idNorm) ||
        norm.includes(dNorm) ||
        dNorm.includes(norm) ||
        (norm.includes('taj') && d.id === 'taj-mahal') ||
        (norm.includes('agra') && d.id === 'taj-mahal') ||
        (norm.includes('varanasi') && d.id === 'varanasi-ghats') ||
        (norm.includes('kashi') && d.id === 'varanasi-ghats') ||
        (norm.includes('hampi') && d.id === 'hampi-vijayanagara') ||
        (norm.includes('golden') && d.id === 'golden-temple') ||
        (norm.includes('amritsar') && d.id === 'golden-temple') ||
        (norm.includes('konark') && d.id === 'konark-sun-temple') ||
        (norm.includes('puri') && d.id === 'konark-sun-temple') ||
        (norm.includes('meenakshi') && d.id === 'meenakshi-temple') ||
        (norm.includes('madurai') && d.id === 'meenakshi-temple') ||
        (norm.includes('jaisalmer') && d.id === 'jaisalmer-fort') ||
        (norm.includes('alleppey') && d.id === 'alleppey-backwaters') ||
        (norm.includes('kerala') && d.id === 'alleppey-backwaters') ||
        (norm.includes('ajanta') && d.id === 'ajanta-ellora') ||
        (norm.includes('ellora') && d.id === 'ajanta-ellora') ||
        (norm.includes('meghalaya') && (d.id === 'nongriat-root-bridges' || d.id === 'cherrapunji-falls')) ||
        (norm.includes('nongriat') && d.id === 'nongriat-root-bridges') ||
        (norm.includes('cherrapunji') && d.id === 'cherrapunji-falls') ||
        (norm.includes('shillong') && d.id === 'shillong-peak') ||
        (norm.includes('jaipur') && d.id === 'hawa-mahal') ||
        (norm.includes('udaipur') && d.id === 'udaipur-lake-palace') ||
        (norm.includes('goa') && (d.id === 'panaji-heritage' || d.id === 'dudhsagar-falls')) ||
        (norm.includes('delhi') && (d.id === 'qutub-minar' || d.id === 'red-fort'))
      ) {
        return { destination: d, state };
      }
    }
  }
  return null;
};

// Generate smart trip
router.post('/generate', async (req, res) => {
  try {
    const { origin, destination, startDate, endDate, travellers, budget, travelStyle, interests } = req.body;
    const trip = await generateSmartTrip({
      origin: origin || 'Delhi',
      destination: destination || 'Meghalaya',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      travellers: Number(travellers) || 2,
      budget: Number(budget) || 40000,
      travelStyle: travelStyle || 'Eco',
      interests: interests || ['Waterfalls', 'Mountains', 'Heritage', 'Villages']
    });

    broadcastEvent('TRIP_CREATED', trip);
    res.json({ success: true, trip });
  } catch (error) {
    console.error('Error generating trip:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get active / specific trip
router.get('/:id?', (req, res) => {
  const tripId = req.params.id || 'active-trip';
  let trip = getTripById(tripId);
  
  // If no trip exists, auto-generate default Meghalaya trip for instant UI rendering
  if (!trip) {
    generateSmartTrip({
      origin: 'Delhi',
      destination: 'Meghalaya',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      travellers: 2,
      budget: 40000,
      travelStyle: 'Eco',
      interests: ['Waterfalls', 'Mountains', 'Heritage', 'Villages']
    }).then(newTrip => {
      res.json({ success: true, trip: newTrip });
    });
    return;
  }

  res.json({ success: true, trip });
});

// Switch transport mode and recalculate trip
router.post('/:id/transport', (req, res) => {
  const tripId = req.params.id || 'active-trip';
  const { mode } = req.body;
  const trip = getTripById(tripId);

  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

  const chosen = trip.transportOptions.find(t => t.mode.toLowerCase() === mode.toLowerCase());
  if (chosen) {
    trip.selectedTransport = chosen;
    trip.budgetBreakdown = recalculateTripBudget(trip, { transportCost: chosen.totalCostInr });
    trip.totalCarbonKg = chosen.co2Kg + (trip.destinationData?.carbonFootprintPerDayKg * trip.totalDays || 20);
    trip.updatedAt = new Date().toISOString();

    localTrips.set(trip.id, trip);
    localTrips.set('active-trip', trip);

    broadcastEvent('TRANSPORT_CHANGED', { trip, mode });
    res.json({ success: true, trip });
  } else {
    res.status(400).json({ success: false, message: 'Invalid transport mode' });
  }
});

// Confirm trip & add to My Trips & auto-update Explore India map
router.post('/:id/confirm', (req, res) => {
  const tripId = req.params.id || 'active-trip';
  const trip = getTripById(tripId);

  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

  trip.isConfirmed = true;
  trip.confirmedAt = new Date().toISOString();
  trip.updatedAt = new Date().toISOString();

  // Resolve matching destination in India master catalog
  const match = resolveDestinationFromTrip(trip.destination);
  if (match) {
    trip.completedDestination = match.destination.id;
    trip.completedDestinationName = match.destination.name;
    trip.completedStateId = match.state.id;
    trip.completedStateName = match.state.name;

    // Record in local store users
    if (localStore.users && localStore.users.length > 0) {
      localStore.users.forEach(user => {
        if (!user.exploredDestinations) user.exploredDestinations = [];
        const already = user.exploredDestinations.some(d => d.destinationId === match.destination.id);
        if (!already) {
          user.exploredDestinations.push({
            destinationId: match.destination.id,
            stateId: match.state.id,
            destinationName: match.destination.name,
            category: match.destination.category || 'Heritage',
            completedAt: new Date(),
            xpEarned: match.destination.xp || 150
          });
          user.xp = (user.xp || 0) + (match.destination.xp || 150);
        }
      });
    }

    // Also record in global in-memory explored list for instant guest retrieval
    if (!localStore.guestExploredDestinations) localStore.guestExploredDestinations = [];
    const guestAlready = localStore.guestExploredDestinations.some(d => d.destinationId === match.destination.id);
    if (!guestAlready) {
      localStore.guestExploredDestinations.push({
        destinationId: match.destination.id,
        stateId: match.state.id,
        destinationName: match.destination.name,
        category: match.destination.category || 'Heritage',
        completedAt: new Date(),
        xpEarned: match.destination.xp || 150
      });
    }
  }

  localTrips.set(trip.id, trip);
  localTrips.set('active-trip', trip);

  broadcastEvent('TRIP_CONFIRMED', { trip, exploredDestination: match?.destination, state: match?.state });
  broadcastEvent('EXPLORE_PROGRESS_UPDATED', { trip, exploredDestination: match?.destination, state: match?.state });

  res.json({
    success: true,
    message: `Trip to ${trip.destination} confirmed and updated on Explore India map!`,
    trip,
    exploredDestination: match?.destination,
    state: match?.state
  });
});

export default router;
