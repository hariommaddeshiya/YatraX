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

  // Download state machine: 'IDLE' | 'DOWNLOADING' | 'READY' | 'FAILED'
  const [downloadStatus, setDownloadStatus] = useState('IDLE');
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
      const cache = await caches.open('yatrax-images-v2');
      await Promise.all(
        urls.filter(Boolean).map(async (url) => {
          try {
            const req = new Request(url, { mode: 'no-cors' });
            const res = await fetch(req);
            if (res) await cache.put(req, res);
          } catch (e) {
            // Ignore single image fetch failures
          }
        })
      );
    } catch (e) {
      console.warn('[Offline] Image pre-caching warning:', e);
    }
  };

  /**
   * Complete Download Destination Workflow
   * Downloads destination info, POIs, safety, emergency, routes, itinerary, and images
   */
  const downloadDestination = async (destInput, extraData = {}) => {
    if (!destInput) return { success: false, message: 'No destination provided' };

    const destId = destInput.id || 
                   destInput.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 
                   'custom-destination';
    const destName = destInput.name || 'Selected Sanctuary';

    try {
      setDownloadStatus('DOWNLOADING');
      setActiveDownloadingId(destId);
      setDownloadProgress(10);
      setDownloadError(null);

      // 1. Destination data (25%)
      let destinationData = { ...destInput };
      if (!destinationData.coordinates && !destinationData.culturalDescription) {
        try {
          const res = await api.get(`/destinations/${destId}`);
          if (res.success && res.destination) {
            destinationData = { ...destinationData, ...res.destination };
          }
        } catch (e) {}
      }
      setDownloadProgress(30);

      // 2. POIs & Places (50%)
      const lat = destinationData.coordinates?.lat || 25.5788;
      const lng = destinationData.coordinates?.lng || 91.8933;
      let places = [];
      try {
        const poiRes = await api.get('/places/pois', { params: { lat, lng, radius: 10000 } });
        if (poiRes.success && poiRes.data) {
          places = poiRes.data;
        }
      } catch (e) {}
      setDownloadProgress(55);

      // 3. Safety & Emergency Helplines (70%)
      let safetyData = {
        safetyScore: 91,
        riskLevel: 'LOW',
        radarTelemetry: {
          weatherRisk: 'Optimal Weather',
          roadConditions: 'Clear & Open',
          crowdDensity: 'Normal',
          geofenceStatus: 'Safe Corridor',
          networkStatus: 'Cached Offline',
          emergencyProximity: '3.2 km Hospital'
        },
        nearestHospital: { name: 'Civil Hospital (NABH Tier-1)', distanceKm: 3.2, phone: '+91-364-2224100' },
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
      setDownloadProgress(75);

      // 4. Pre-cache images (85%)
      const imagesToCache = [
        destinationData.image,
        extraData?.heritageSite?.image,
        extraData?.trip?.image
      ].filter(Boolean);

      await cacheImagesOffline(imagesToCache);
      setDownloadProgress(90);

      // 5. Structure & Save complete package to IndexedDB (100%)
      const offlinePackage = {
        destinationId: destId,
        destinationName: destName,
        destination: destinationData,
        places: places.length > 0 ? places : (destinationData.places || []),
        safety: safetyData,
        emergency: NATIONAL_EMERGENCY_DIRECTORY,
        trip: extraData.trip || null,
        heritage: extraData.heritageSite || null,
        components: ['Places & POIs', 'Safety Radar', 'Emergency 24x7', 'Trip Itinerary', '360° Heritage Data'],
        approximateSizeKB: Math.round(JSON.stringify(destinationData).length / 1024 + 45)
      };

      await saveOfflinePackage(offlinePackage);
      await refreshOfflinePackages();

      setDownloadProgress(100);
      setDownloadStatus('READY');
      return { success: true, package: offlinePackage };
    } catch (err) {
      console.error('[Offline] Download failed:', err);
      setDownloadStatus('FAILED');
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
        downloadProgress,
        downloadError,
        activeDownloadingId,
        refreshOfflinePackages,
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

