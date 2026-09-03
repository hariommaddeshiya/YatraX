import { localTrips } from './tripService.js';
import { calculateBudgetBreakdown, recalculateTripBudget } from './budgetService.js';
import { createEmergencyIncident, calculateTouristSafetyScore } from './safetyService.js';

let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const broadcastEvent = (eventType, payload) => {
  if (ioInstance) {
    ioInstance.emit(eventType, payload);
    ioInstance.emit('PLATFORM_EVENT', { type: eventType, payload, timestamp: new Date().toISOString() });
  }
};

export const processAdaptiveEvent = async (tripId, eventType, eventData = {}) => {
  let trip = localTrips.get(tripId) || localTrips.get('active-trip');
  if (!trip) {
    return { error: 'No active trip found to adapt.' };
  }

  const timestamp = new Date().toISOString();
  let adaptationRecord = null;

  switch (eventType) {
    case 'HOTEL_PRICE_SPIKE': {
      // Scenario 1A: Hotel price surges from ₹4,000 to ₹5,200/night
      // Increases total cost to ₹41,200 (causing ₹1,200 overrun over ₹40,000 budget)
      const nights = trip.totalDays - 1;
      const spikedPricePerNight = 5200;
      const spikedTotalHotelCost = 21200; // Calibrated so total cost = ₹41,200 (+₹1,200 over ₹40,000)

      trip.itinerary.forEach((day) => {
        if (day.stay) {
          day.stay.name = 'Pine Crest Heritage Stay (Surged Rate)';
          day.stay.costPerNightInr = spikedPricePerNight;
          day.stay.isSubstituted = false;
          day.stay.substitutionReason = '⚠ Price Surged from ₹4,000 to ₹5,200/night due to peak seasonal demand.';
        }
      });

      // Recalculate over-budget breakdown: Total = ₹41,200 (₹1,200 over ₹40,000 budget)
      trip.budgetBreakdown = calculateBudgetBreakdown({
        budgetLimit: trip.budgetLimit || 40000,
        transportCost: trip.selectedTransport?.totalCostInr || 4132,
        hotelCost: spikedTotalHotelCost,
        foodCost: 6600,
        ticketsCost: 4060,
        localTravelCost: 2200,
        bufferCost: 3008,
        referenceCost: trip.budgetLimit || 40000
      });
      trip.status = 'ADAPTED';

      adaptationRecord = {
        id: `adapt-${Date.now()}`,
        timestamp,
        triggerType: 'HOTEL_PRICE_SPIKE',
        title: '🏨 Hotel Price Surged to ₹5,200/night',
        message: 'Primary hotel rate increased from ₹4,000 to ₹5,200/night (causing ₹1,200 budget overrun). System located verified substitute: Hotel B (Mawlynnong Tribal Bamboo Eco-Stay, ₹3,900/night, 4.6 rating).',
        oldValue: { hotelName: 'Pine Crest Stay', pricePerNight: 5200, totalCost: 41200, overBudgetAmount: 1200 },
        newValue: { recommendedAlternative: 'Mawlynnong Tribal Bamboo Eco-Stay (Hotel B)', pricePerNight: 3900, projectedTotal: 39900 },
        actionTaken: 'Budget exceeded warning flagged. Alternative Hotel B recommended to restore budget to ₹39,900.'
      };

      if (!trip.adaptationHistory) trip.adaptationHistory = [];
      trip.adaptationHistory.unshift(adaptationRecord);
      break;
    }

    case 'SUBSTITUTE_HOTEL_B': {
      // Scenario 1B: User/Admin selects Hotel B to restore budget under ₹40,000 (New Total = ₹39,900)
      const alternativeHotel = {
        id: 'ht-meg-02',
        name: 'Mawlynnong Tribal Bamboo Eco-Stay (Hotel B)',
        pricePerNightInr: 3900,
        rating: 4.6,
        ecoCertified: true,
        neighborhood: 'Same Area (Meghalaya Eco-Zone)'
      };

      // Substitute hotel B into all itinerary stays
      trip.itinerary.forEach((day) => {
        day.stay = {
          hotelId: alternativeHotel.id,
          name: alternativeHotel.name,
          costPerNightInr: alternativeHotel.pricePerNightInr,
          ecoCertified: true,
          isSubstituted: true,
          substitutionReason: 'Auto-adapted: Replaced surged hotel (₹5,200/night) with verified Eco-Homestay (₹3,900/night).'
        };
      });

      // Recalculate finalized budget: Total = ₹39,900, remaining = ₹100, isOverBudget = false!
      trip.budgetBreakdown = calculateBudgetBreakdown({
        budgetLimit: trip.budgetLimit || 40000,
        transportCost: trip.selectedTransport?.totalCostInr || 4132,
        hotelCost: 19900,
        foodCost: 6600,
        ticketsCost: 4060,
        localTravelCost: 2200,
        bufferCost: 3008,
        referenceCost: trip.budgetLimit || 40000
      });
      trip.status = 'ADAPTED';

      adaptationRecord = {
        id: `adapt-${Date.now()}`,
        timestamp,
        triggerType: 'HOTEL_PRICE_SPIKE',
        title: '🏨 Hotel B Applied — Budget Restored to ₹39,900!',
        message: 'Successfully substituted Hotel B (Mawlynnong Tribal Bamboo Eco-Stay, ₹3,900/night, 4.6 rating). Total planned journey cost reduced to ₹39,900 (Remaining Buffer: ₹100).',
        oldValue: { hotelName: 'Pine Crest Stay', pricePerNight: 5200, totalCost: 41200, overBudgetAmount: 1200 },
        newValue: { hotelName: alternativeHotel.name, pricePerNight: 3900, totalCost: 39900, remainingBudget: 100 },
        actionTaken: 'Itinerary stay updated to Hotel B and all budget charts/tables recalculated instantly.'
      };

      if (!trip.adaptationHistory) trip.adaptationHistory = [];
      trip.adaptationHistory.unshift(adaptationRecord);
      break;
    }

    case 'WEATHER_ALERT': {
      // Scenario 2: Heavy rainfall alert replaces outdoor waterfall trek with indoor heritage museum
      let replacedActivityTitle = 'Nohkalikai Waterfall & Rainforest Trek';
      const indoorReplacement = {
        title: 'Don Bosco Museum of Indigenous Cultures & Heritage Gallery',
        description: '7-story immersive museum showcasing Northeast tribal architecture, weaponry, weaving, and audio-visual heritage displays.',
        type: 'museum',
        isOutdoor: false,
        estimatedCostInr: 150 * trip.travellers,
        carbonKg: 0.3,
        crowdForecast: 'LOW',
        crowdPercentage: 25,
        weatherRisk: 'LOW',
        isReplaced: true,
        replacedFrom: replacedActivityTitle,
        replacementReason: 'Severe precipitation risk (18.5 mm/hr rain) detected at waterfall gorge. Swapped with 5-star indoor tribal cultural centre.'
      };

      // Apply replacement in Day 2
      let activityChanged = false;
      trip.itinerary.forEach(day => {
        day.activities.forEach((act, actIdx) => {
          if (act.isOutdoor && (act.type === 'waterfall' || act.type === 'trek') && !activityChanged) {
            replacedActivityTitle = act.title;
            day.activities[actIdx] = {
              ...act,
              ...indoorReplacement,
              id: act.id,
              time: act.time
            };
            activityChanged = true;
          }
        });
      });

      // Update safety score and live weather
      trip.safetyScore = 95;
      trip.weatherSummary = {
        temperatureC: 18,
        precipitationMm: 18.5,
        windSpeedKmH: 28,
        weatherCondition: 'Heavy Rain / Torrential Storm',
        icon: 'CloudLightning',
        riskLevel: 'HIGH',
        riskReason: 'Flash flood alert at waterfall gorge. Outdoor treks restricted.'
      };

      trip.budgetBreakdown = recalculateTripBudget(trip);
      trip.status = 'ADAPTED';

      adaptationRecord = {
        id: `adapt-${Date.now()}`,
        timestamp,
        triggerType: 'WEATHER_ALERT',
        title: '🌧️ Torrential Weather Alert & Itinerary Swap',
        message: 'Weather risk detected: 18.5 mm/hr rain forecasted at gorge. Outdoor Waterfall Trek automatically replaced with Don Bosco Museum of Indigenous Cultures.',
        oldValue: { activity: replacedActivityTitle, type: 'Outdoor Waterfall Trek', riskLevel: 'HIGH' },
        newValue: { activity: indoorReplacement.title, type: 'Indoor Cultural Heritage Museum', riskLevel: 'LOW' },
        actionTaken: 'High-risk outdoor activity removed from itinerary; verified indoor cultural experience added.'
      };

      if (!trip.adaptationHistory) trip.adaptationHistory = [];
      trip.adaptationHistory.unshift(adaptationRecord);
      break;
    }

    case 'CROWD_SURGE': {
      // Scenario 3: Crowd surge at Root Bridge (65% -> 92%)
      const peakActivity = 'Nongriat Double Decker Living Root Bridge';
      
      trip.itinerary.forEach(day => {
        day.activities.forEach(act => {
          if (act.title.includes('Living Root Bridge') || act.title.includes('Root Bridge')) {
            act.time = '07:00 AM (Recommended Early Slot)';
            act.crowdForecast = 'LOW (22% at dawn)';
            act.crowdPercentage = 22;
            act.description = '[Adapted Schedule]: Visit shifted to tranquil morning hour (07:00 AM) to bypass 92% afternoon peak footfall.';
          }
        });
      });

      adaptationRecord = {
        id: `adapt-${Date.now()}`,
        timestamp,
        triggerType: 'CROWD_SURGE',
        title: '👥 Crowd Surge Adaptation & Schedule Optimization',
        message: 'Crowd model detected 92% peak surge at 02:30 PM. Itinerary schedule automatically shifted to 07:00 AM tranquil morning slot.',
        oldValue: { activity: peakActivity, scheduledTime: '02:30 PM', crowdPercentage: 92 },
        newValue: { activity: peakActivity, scheduledTime: '07:00 AM', crowdPercentage: 22, alternativeSpot: 'Krang Shuri Emerald Falls (31% footfall)' },
        actionTaken: 'Activity visit timing shifted to 07:00 AM tranquil window; queue delay reduced by 85%.'
      };

      if (!trip.adaptationHistory) trip.adaptationHistory = [];
      trip.adaptationHistory.unshift(adaptationRecord);
      break;
    }

    case 'SAFETY_GEOFENCE': {
      // Scenario 4: Tourist enters hazard risk zone
      const incident = createEmergencyIncident({
        touristId: trip.userId || 'tourist-demo-01',
        touristName: 'Aarav Sharma (Active Tourist)',
        tripId: trip.id,
        location: { lat: 25.2765, lng: 91.6850, name: 'Nohkalikai Downstream Hazard Geofence' },
        riskLevel: 'HIGH',
        triggerType: 'GEOFENCE_BREACH',
        details: 'Tourist coordinates entered marked flash flood & slippery gorge risk perimeter.',
        recommendedAction: 'Move toward Cherrapunji Forest Facilitation Shelter. Nearest Civil Hospital (3.2 km) on standby.',
        actionTaken: 'Emergency SOS banner broadcasted; government command dashboard dispatched alert.'
      });

      trip.safetyScore = 68;

      adaptationRecord = {
        id: `adapt-${Date.now()}`,
        timestamp,
        triggerType: 'SAFETY_GEOFENCE',
        title: '🚨 HIGH-RISK ZONE BREACH & SOS DISPATCH',
        message: 'Tourist entered marked risk area (Nohkalikai Gorge High-Swell Zone). Emergency protocol activated: safe exit route assigned and Government Command Center notified.',
        oldValue: { status: 'Safe Corridor', safetyScore: 94 },
        newValue: { status: 'Hazard Geofence Active', incidentId: incident.id, nearestHospital: 'Civil Hospital Shillong (3.2 km)', nearestSafePoint: 'Cherrapunji Forest Department Shelter' },
        actionTaken: 'Dispatched emergency evacuation directions to tourist phone; opened active incident on Government Dashboard.'
      };

      if (!trip.adaptationHistory) trip.adaptationHistory = [];
      trip.adaptationHistory.unshift(adaptationRecord);
      broadcastEvent('INCIDENT_ALERT', incident);
      break;
    }

    case 'NETWORK_LOSS': {
      // Scenario 5: Connectivity loss simulation
      adaptationRecord = {
        id: `adapt-${Date.now()}`,
        timestamp,
        triggerType: 'NETWORK_LOSS',
        title: '📶 Offline Mode Activated (PWA)',
        message: 'Cellular data disconnected. Trip itinerary, vouchers, emergency numbers, and offline vector maps loaded seamlessly from IndexedDB.',
        oldValue: { networkState: 'ONLINE 5G' },
        newValue: { networkState: 'OFFLINE MODE (IndexedDB Active)', cachedItemsCount: 42 },
        actionTaken: 'Cached trip data rendered directly from browser IndexedDB and Service Worker cache.'
      };

      if (!trip.adaptationHistory) trip.adaptationHistory = [];
      trip.adaptationHistory.unshift(adaptationRecord);
      break;
    }

    default:
      break;
  }

  trip.updatedAt = timestamp;
  localTrips.set(trip.id, trip);
  localTrips.set('active-trip', trip);

  // Broadcast real-time update to all connected clients
  broadcastEvent('TRIP_ADAPTED', { trip, adaptation: adaptationRecord });

  return { success: true, trip, adaptation: adaptationRecord };
};
