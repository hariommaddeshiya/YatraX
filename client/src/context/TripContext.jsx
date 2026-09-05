import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api.js';
import { useSocket } from './SocketContext.jsx';
import { useOffline } from './OfflineContext.jsx';
import { 
  getSavedTripOffline, 
  getAllDestinationsOffline, 
  saveDestinationOffline,
  getAllOfflinePackages
} from '../utils/indexedDb.js';

const TripContext = createContext();

const DEFAULT_DESTINATIONS = [
  { id: 'taj-mahal', name: 'Taj Mahal & Agra Fort', state: 'Uttar Pradesh', region: 'North' },
  { id: 'varanasi-ghats', name: 'Varanasi Ghats & Kashi', state: 'Uttar Pradesh', region: 'North' },
  { id: 'hampi-vijayanagara', name: 'Hampi Vijayanagara Ruins', state: 'Karnataka', region: 'South' },
  { id: 'golden-temple', name: 'Golden Temple (Amritsar)', state: 'Punjab', region: 'North' },
  { id: 'konark-sun-temple', name: 'Konark Sun Temple', state: 'Odisha', region: 'East' },
  { id: 'meenakshi-temple', name: 'Meenakshi Temple (Madurai)', state: 'Tamil Nadu', region: 'South' },
  { id: 'jaisalmer-fort', name: 'Jaisalmer Living Fort', state: 'Rajasthan', region: 'West' },
  { id: 'alleppey-backwaters', name: 'Alleppey Backwaters', state: 'Kerala', region: 'South' },
  { id: 'ajanta-ellora', name: 'Ajanta & Ellora Caves', state: 'Maharashtra', region: 'West' },
  { id: 'nongriat-bridges', name: 'Meghalaya Living Roots', state: 'Meghalaya', region: 'Northeast' }
];

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [error, setError] = useState(null);

  const { socket } = useSocket();
  const { downloadTripForOffline, offlineTrip } = useOffline();

  // Load initial destinations & active trip on mount
  const fetchInitialData = useCallback(async () => {
    // 1. If offline, immediately hydrate from IndexedDB without network lag
    if (!navigator.onLine) {
      try {
        setLoading(true);
        const [savedTrip, savedDestinations, savedPackages] = await Promise.all([
          getSavedTripOffline(),
          getAllDestinationsOffline(),
          getAllOfflinePackages()
        ]);

        if (savedTrip) {
          setActiveTrip(savedTrip);
        } else if (savedPackages && savedPackages.length > 0 && savedPackages[0].trip) {
          setActiveTrip(savedPackages[0].trip);
        }

        if (savedDestinations && savedDestinations.length > 0) {
          setDestinations(savedDestinations);
        } else if (savedPackages && savedPackages.length > 0) {
          const pkgDestinations = savedPackages.map(p => p.destination).filter(Boolean);
          if (pkgDestinations.length > 0) {
            setDestinations(pkgDestinations);
          }
        }
      } catch (e) {
        console.warn('[TripContext] Offline initialization error:', e);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. If online: Fetch fresh API data and update IndexedDB
    try {
      setLoading(true);
      const [destRes, tripRes] = await Promise.all([
        api.get('/destinations'),
        api.get('/trips/active-trip')
      ]);

      if (destRes.success && destRes.destinations?.length > 0) {
        setDestinations(destRes.destinations);
        // Persist online destinations to IndexedDB for seamless future offline access
        destRes.destinations.forEach((d) => saveDestinationOffline(d).catch(() => {}));
      }
      if (tripRes.success && tripRes.trip) {
        setActiveTrip(tripRes.trip);
      }
    } catch (err) {
      console.warn('[TripContext] Network fetch failed, reading saved data from IndexedDB:', err);
      // Graceful offline fallback from IndexedDB
      try {
        const [savedTrip, savedDestinations, savedPackages] = await Promise.all([
          getSavedTripOffline(),
          getAllDestinationsOffline(),
          getAllOfflinePackages()
        ]);

        if (savedTrip) {
          setActiveTrip(savedTrip);
        } else if (savedPackages && savedPackages.length > 0 && savedPackages[0].trip) {
          setActiveTrip(savedPackages[0].trip);
        }

        if (savedDestinations && savedDestinations.length > 0) {
          setDestinations(savedDestinations);
        } else if (savedPackages && savedPackages.length > 0) {
          const pkgDestinations = savedPackages.map(p => p.destination).filter(Boolean);
          if (pkgDestinations.length > 0) {
            setDestinations(pkgDestinations);
          }
        }
      } catch (dbErr) {
        console.warn('[TripContext] IndexedDB fallback read error:', dbErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Sync with offlineTrip if activeTrip is empty or if offline
  useEffect(() => {
    if (offlineTrip && (!activeTrip || !navigator.onLine)) {
      setActiveTrip(offlineTrip);
    }
  }, [offlineTrip, activeTrip]);

  // Socket listener to auto-update activeTrip when an adaptation occurs
  useEffect(() => {
    if (!socket) return;

    const handleTripAdapted = (data) => {
      if (data && data.trip) {
        setActiveTrip(data.trip);
        downloadTripForOffline(data.trip);
      }
    };

    const handleTransportChanged = (data) => {
      if (data && data.trip) {
        setActiveTrip(data.trip);
      }
    };

    const handleDemoReset = (cleanTrip) => {
      if (cleanTrip) {
        setActiveTrip(cleanTrip);
        downloadTripForOffline(cleanTrip);
        setActiveSimulation(null);
      }
    };

    socket.on('TRIP_ADAPTED', handleTripAdapted);
    socket.on('TRANSPORT_CHANGED', handleTransportChanged);
    socket.on('DEMO_RESET', handleDemoReset);

    return () => {
      socket.off('TRIP_ADAPTED', handleTripAdapted);
      socket.off('TRANSPORT_CHANGED', handleTransportChanged);
      socket.off('DEMO_RESET', handleDemoReset);
    };
  }, [socket, downloadTripForOffline]);

  // Generate new trip
  const generateTrip = async (formData) => {
    try {
      setGenerating(true);
      setError(null);
      const res = await api.post('/trips/generate', formData);
      if (res.success && res.trip) {
        setActiveTrip(res.trip);
        await downloadTripForOffline(res.trip);
        return res.trip;
      }
    } catch (err) {
      setError(err.message || 'Failed to generate smart trip');
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Change transport mode
  const changeTransportMode = async (mode) => {
    try {
      const res = await api.post('/trips/active-trip/transport', { mode });
      if (res.success && res.trip) {
        setActiveTrip(res.trip);
        await downloadTripForOffline(res.trip);
      }
    } catch (err) {
      console.error('Error changing transport mode:', err);
    }
  };

  // Confirm Active Trip & Mark as Confirmed Journey
  const confirmTrip = async (tripId) => {
    try {
      const id = tripId || activeTrip?.id || 'active-trip';
      const res = await api.post(`/trips/${id}/confirm`);
      if (res.success && res.trip) {
        setActiveTrip(res.trip);
        await downloadTripForOffline(res.trip);

        // Record confirmed destination in localStorage for instant Explore India Map updates
        try {
          const rawConfirmed = localStorage.getItem('yatrax_confirmed_trips');
          const list = rawConfirmed ? JSON.parse(rawConfirmed) : [];
          if (!list.some(t => t.id === res.trip.id || t.destination === res.trip.destination)) {
            list.unshift(res.trip);
            localStorage.setItem('yatrax_confirmed_trips', JSON.stringify(list));
          }

          if (res.exploredDestination) {
            const rawExplored = localStorage.getItem('yatrax_explored_destinations');
            const exploredList = rawExplored ? JSON.parse(rawExplored) : [];
            if (!exploredList.some(d => d.destinationId === res.exploredDestination.id)) {
              exploredList.push({
                destinationId: res.exploredDestination.id,
                stateId: res.state?.id || 'uttar-pradesh',
                destinationName: res.exploredDestination.name,
                completedAt: new Date().toISOString()
              });
              localStorage.setItem('yatrax_explored_destinations', JSON.stringify(exploredList));
            }
          }
        } catch (e) {}

        return res.trip;
      }
    } catch (err) {
      console.error('Error confirming trip:', err);
      throw err;
    }
  };

  // Direct Hotel B Substitution
  const substituteHotelB = async () => {
    try {
      const res = await api.post('/demo/substitute-hotel-b');
      if (res.success && res.trip) {
        setActiveTrip(res.trip);
        await downloadTripForOffline(res.trip);
        setActiveSimulation(null);
      }
      return res;
    } catch (err) {
      console.error('Error substituting hotel B:', err);
      throw err;
    }
  };

  // Direct Hotel Price Surge
  const simulateHotelPriceSurge = async () => {
    try {
      const res = await api.post('/demo/hotel-price-surge');
      if (res.success && res.trip) {
        setActiveTrip(res.trip);
        await downloadTripForOffline(res.trip);
        setActiveSimulation('HOTEL_PRICE');
      }
      return res;
    } catch (err) {
      console.error('Error triggering hotel price surge:', err);
      throw err;
    }
  };

  // Simulation Triggers for SIH Presentation
  const triggerSimulation = async (simType) => {
    setActiveSimulation(simType);
    try {
      let endpoint = '';
      if (simType === 'HOTEL_PRICE') {
        // Toggle between surge and substitute
        endpoint = activeTrip?.budgetBreakdown?.isOverBudget ? '/demo/substitute-hotel-b' : '/demo/hotel-price-surge';
      }
      else if (simType === 'SUBSTITUTE_HOTEL_B') endpoint = '/demo/substitute-hotel-b';
      else if (simType === 'HOTEL_PRICE_SURGE') endpoint = '/demo/hotel-price-surge';
      else if (simType === 'WEATHER_RAIN') endpoint = '/demo/heavy-rain';
      else if (simType === 'CROWD_SURGE') endpoint = '/demo/crowd-surge';
      else if (simType === 'RISK_ZONE') endpoint = '/demo/risk-zone';
      else if (simType === 'INTERNET_LOSS') endpoint = '/demo/internet-loss';
      else if (simType === 'RESET') endpoint = '/demo/reset';

      const res = await api.post(endpoint);
      if (res.success && res.trip) {
        setActiveTrip(res.trip);
        await downloadTripForOffline(res.trip);
      }
      return res;
    } catch (err) {
      console.error('Simulation trigger failed:', err);
      throw err;
    }
  };

  return (
    <TripContext.Provider value={{
      activeTrip,
      setActiveTrip,
      destinations,
      loading,
      generating,
      error,
      generateTrip,
      changeTransportMode,
      confirmTrip,
      substituteHotelB,
      simulateHotelPriceSurge,
      triggerSimulation,
      activeSimulation,
      refreshData: fetchInitialData
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
