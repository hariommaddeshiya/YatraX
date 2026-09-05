import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  saveTripOffline, 
  getSavedTripOffline, 
  saveOfflinePackage, 
  getOfflinePackage, 
  getAllOfflinePackages, 
  removeOfflinePackage, 
  saveEmergencyDirectoryOffline,
  getEmergencyDirectoryOffline,
  getAllDestinationsOffline
} from '../utils/indexedDb.js';
import api from '../utils/api.js';

const OfflineContext = createContext();

export const NATIONAL_EMERGENCY_DIRECTORY = [
  { service: 'National All-in-One Emergency', number: '112', desc: 'Unified Police, Fire & Medical dispatch across India.' },
  { service: 'Incredible India Tourist Helpline', number: '1363', desc: '24x7 Multi-lingual Tourist Guide & Safety Assistance.' },
  { service: 'Ambulance & Trauma Care', number: '108', desc: 'Rapid emergency medical response & oxygen transport.' },
  { service: 'Disaster Management (NDRF)', number: '1078', desc: 'Landslide, flash-flood & avalanche rescue division.' },
  { service: 'Women Safety Helpline', number: '1091', desc: 'Dedicated 24x7 women safety dispatch.' },
  { service: 'Railway Helpline (Security & Medical)', number: '139', desc: 'Emergency response on Indian Railways corridors.' }
];

export const OfflineProvider = ({ children }) => {
  const [isRealOnline, setIsRealOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState('ONLINE'); // ONLINE, WEAK, OFFLINE
  const [offlinePackages, setOfflinePackages] = useState([]);
  const [offlineTrip, setOfflineTrip] = useState(null);
  const [isSavedForOffline, setIsSavedForOffline] = useState(false);

  const [isDbReady, setIsDbReady] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('IDLE');
  const [downloadStage, setDownloadStage] = useState('Idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);
  const [activeDownloadingId, setActiveDownloadingId] = useState(null);

  // Load saved packages from IndexedDB on startup
  const refreshOfflinePackages = useCallback(async () => {
    try {
      const pkgs = await getAllOfflinePackages();
      setOfflinePackages(pkgs || []);

      const saved = await getSavedTripOffline();
      if (saved) {
        setOfflineTrip(saved);
        setIsSavedForOffline(true);
      }
      setIsDbReady(true);
    } catch (err) {
      console.warn('[OfflineContext] Could not load offline packages from IndexedDB:', err);
    }
  }, []);

  useEffect(() => {
    refreshOfflinePackages();
  }, [refreshOfflinePackages]);

  // Online / Offline browser event listeners + Real reachability ping
  useEffect(() => {
    const handleOnline = async () => {
      setIsRealOnline(true);
      if (!isSimulatedOffline) setOfflineStatus('ONLINE');
      refreshOfflinePackages();
    };

    const handleOffline = () => {
      setIsRealOnline(false);
      setOfflineStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check: also save default emergency directory offline
    saveEmergencyDirectoryOffline(NATIONAL_EMERGENCY_DIRECTORY).catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline, refreshOfflinePackages]);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      setOfflineStatus(next ? 'OFFLINE' : (navigator.onLine ? 'ONLINE' : 'OFFLINE'));
      return next;
    });
  };

  const setWeakConnection = () => {
    setOfflineStatus('WEAK');
  };

  // Legacy helper for active trip
  const downloadTripForOffline = async (trip) => {
    if (!trip) return false;
    try {
      await saveTripOffline(trip);
      setOfflineTrip(trip);
      setIsSavedForOffline(true);
      await refreshOfflinePackages();
      return true;
    } catch (err) {
      console.error('Error saving trip for offline:', err);
      return false;
    }
  };

  // Pre-cache image URLs into Service Worker cache
  const cacheImagesOffline = async (urls) => {
    if (!('caches' in window) || !urls || urls.length === 0) return;
    try {
      // Ensure cache name matches current active SW image cache version (v3)
      const cacheNames = await caches.keys();
      const imgCacheName = cacheNames.find(c => c.startsWith('yatrax-images-')) || 'yatrax-images-v3';
      const cache = await caches.open(imgCacheName);
      const uniqueUrls = [...new Set(urls.filter(Boolean))];
      await Promise.all(
        uniqueUrls.map(async (url) => {
          try {
            const req = new Request(url, { mode: 'no-cors' });
            const res = await fetch(req);
            if (res) {
              await cache.put(req, res);
            }
          } catch (e) {
            // Ignore individual image download error
          }
        })
      );
    } catch (e) {
      console.warn('[Offline] Image pre-caching warning:', e);
    }
  };

  /**
   * Complete Download Destination Workflow
   * Downloads destination info, POIs, safety, emergency, routes, itinerary, and all required images
   */
  const downloadDestination = async (destInput, extraData = {}) => {
    if (!destInput) return { success: false, message: 'No destination provided' };

    const destId = destInput.id || 
                   destInput.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 
                   'custom-destination';
    const destName = destInput.name || 'Selected Sanctuary';

    try {
      setDownloadStatus('DOWNLOADING');
      setDownloadStage('Preparing offline package...');
      setActiveDownloadingId(destId);
      setDownloadProgress(15);
      setDownloadError(null);

      // 1. Destination data & Stays (35%)
      let destinationData = { ...destInput };
      if (!destinationData.culturalDescription || !destinationData.coordinates) {
        try {
          const res = await api.get(`/destinations/${destId}`);
          if (res.success && res.destination) {
            destinationData = { ...destinationData, ...res.destination };
          }
        } catch (e) {}
      }
      setDownloadStage('Saving destination details & itinerary...');
      setDownloadProgress(40);

      // 2. POIs & Places (60%)
      const lat = destinationData.coordinates?.lat || 25.5788;
      const lng = destinationData.coordinates?.lng || 91.8933;
      let places = [];
      try {
        const poiRes = await api.get('/places/pois', { params: { lat, lng, radius: 10000 } });
        if (poiRes.success && poiRes.data) {
          places = poiRes.data;
        }
      } catch (e) {}
      setDownloadStage('Caching POIs & safety telemetry...');
      setDownloadProgress(65);

      // 3. Safety & Emergency Telemetry (75%)
      let safetyData = {
        safetyScore: 92,
        riskLevel: 'LOW',
        radarTelemetry: {
          weatherRisk: 'Optimal Weather',
          roadConditions: 'Clear & Open',
          crowdDensity: 'Normal',
          geofenceStatus: 'Safe Sanctuary Perimeter',
          networkStatus: 'Cached Offline',
          emergencyProximity: '3.2 km Hospital'
        },
        nearestHospital: { name: 'District Civil Trauma Centre (NABH)', distanceKm: 3.2, phone: '108' },
        policeStation: { name: 'Tourist Police Assistance Booth', helpline: '1363' }
      };

      try {
        const safetyRes = await api.get('/safety/score', {
          params: { weatherRisk: 'LOW', crowdSurge: 'LOW', isGeofenced: 'false', networkAvailable: 'true' }
        });
        if (safetyRes.success) {
          safetyData = { ...safetyData, ...safetyRes };
        }
      } catch (e) {}
      setDownloadStage('Caching images & media assets...');
      setDownloadProgress(80);

      // 4. Pre-cache all required destination images (85%)
      const imagesToCache = [
        destinationData.image,
        ...(destinationData.stays || []).map(s => s.image),
        ...(places || []).map(p => p.image),
        extraData?.heritageSite?.image,
        extraData?.trip?.image,
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80'
      ].filter(Boolean);

      await cacheImagesOffline(imagesToCache);
      setDownloadStage('Finalizing offline package...');
      setDownloadProgress(95);

      // 5. Synthesize complete self-contained Trip if none exists for this destination
      const destinationTrip = extraData.trip && (
        extraData.trip.destination?.toLowerCase().includes(destName.toLowerCase()) || 
        destName.toLowerCase().includes(extraData.trip.destination?.toLowerCase())
      ) ? extraData.trip : {
        id: `trip-${destId}`,
        origin: 'Delhi',
        destination: destName,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        totalDays: 4,
        travellers: 2,
        travelStyle: 'Eco-Heritage',
        isConfirmed: true,
        budgetBreakdown: {
          transport: 3800,
          stay: 7200,
          food: 2800,
          activities: 1600,
          emergencyBuffer: 2000,
          estimatedTotalCost: 17400
        },
        transportOptions: [
          { mode: 'Train', name: 'Vande Bharat / Express Rail', co2Kg: 28, cost: 2400, duration: '6h 30m', selected: true },
          { mode: 'Electric Bus', name: 'State Green EV Corridor', co2Kg: 18, cost: 1600, duration: '8h 00m' },
          { mode: 'Flight', name: 'Solar Airport Link', co2Kg: 95, cost: 6400, duration: '1h 45m' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival & Eco-Check-in', activities: ['Arrival at sanctuary rail/transit hub', 'Check into certified solar eco-stay', 'Sunset orientation walk & local heritage cuisine'] },
          { day: 2, title: 'Deep Cultural & Architectural Immersion', activities: ['Guided walking tour of ancient monuments and sanctums', 'Local community craft & artisanal workshop', 'Traditional classical cultural performance & stargazing'] },
          { day: 3, title: 'Bio-Trails & Natural Wonders', activities: ['Morning biodiversity trail & ecological forest walk', 'Sacred riverfront/mountain reflection', 'Zero-waste organic dinner with host family'] },
          { day: 4, title: 'Local Souvenirs & Sustainable Departure', activities: ['Visit GI-tagged village weavers market', 'Farewell interaction with conservation guides', 'Departure via low-carbon electric rail corridor'] }
        ],
        weatherSummary: {
          condition: 'Optimal Season',
          tempC: 25,
          humidity: 58,
          airQuality: 'Clean & Pure (AQI 32)'
        },
        safetyScore: 92
      };

      // 6. Structure & Save complete package to IndexedDB (100%)
      const offlinePackage = {
        destinationId: destId,
        destinationName: destName,
        destination: destinationData,
        places: places.length > 0 ? places : (destinationData.places || []),
        safety: safetyData,
        emergency: NATIONAL_EMERGENCY_DIRECTORY,
        trip: destinationTrip,
        heritage: extraData.heritageSite || null,
        images: imagesToCache,
        components: ['Places & POIs', 'Safety Radar', 'Emergency 24x7', 'Trip Itinerary', '360° Heritage Data'],
        approximateSizeKB: Math.round(JSON.stringify(destinationData).length / 1024 + 48)
      };

      await saveOfflinePackage(offlinePackage);
      setOfflineTrip(destinationTrip);
      setIsSavedForOffline(true);
      await refreshOfflinePackages();

      setDownloadProgress(100);
      setDownloadStage('✓ Available Offline');
      setDownloadStatus('READY');
      return { success: true, package: offlinePackage };
    } catch (err) {
      console.error('[Offline] Download failed:', err);
      setDownloadStatus('FAILED');
      setDownloadStage('Download failed');
      setDownloadError(err.message || 'Failed to download destination offline package');
      return { success: false, message: err.message };
    } finally {
      // Clear downloading ID after a short delay
      setTimeout(() => {
        setActiveDownloadingId(null);
      }, 3000);
    }
  };

  const removeDestinationPackage = async (destinationId) => {
    try {
      await removeOfflinePackage(destinationId);
      await refreshOfflinePackages();
      if (activeDownloadingId === destinationId) {
        setDownloadStatus('IDLE');
      }
      return true;
    } catch (err) {
      console.error('Error removing offline package:', err);
      return false;
    }
  };

  const isDestinationDownloaded = useCallback((destIdOrName) => {
    if (!destIdOrName) return false;
    const norm = destIdOrName.toString().toLowerCase().trim();
    return offlinePackages.some(
      (p) => p.destinationId.toLowerCase() === norm || 
             p.destinationName.toLowerCase() === norm ||
             norm.includes(p.destinationId.toLowerCase()) ||
             p.destinationName.toLowerCase().includes(norm)
    );
  }, [offlinePackages]);

  const effectiveOffline = !isRealOnline || isSimulatedOffline;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__yatraxOffline = {
        saveOfflinePackage,
        getOfflinePackage,
        getAllOfflinePackages,
        saveTripOffline,
        getSavedTripOffline,
        downloadDestination
      };
    }
  }, [downloadDestination]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline: !effectiveOffline,
        isRealOnline,
        isOffline: effectiveOffline,
        offlineStatus,
        isSimulatedOffline,
        toggleSimulatedOffline,
        setWeakConnection,
        // Destination packages
        offlinePackages,
        downloadDestination,
        removeDestinationPackage,
        isDestinationDownloaded,
        downloadStatus,
        downloadStage,
        downloadProgress,
        downloadError,
        activeDownloadingId,
        refreshOfflinePackages,
        isDbReady,
        // Legacy trip support
        downloadTripForOffline,
        isSavedForOffline,
        offlineTrip
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);

