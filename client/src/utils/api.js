import axios from 'axios';
import { 
  getAllDestinationsOffline, 
  getDestinationOffline, 
  getSavedTripOffline, 
  getOfflinePackageByQuery,
  getSafetyOffline,
  getAllOfflinePackages
} from './indexedDb.js';

const apiBase = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor with graceful offline IndexedDB fallback
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const isOffline = !navigator.onLine || 
                      error.response?.status === 503 || 
                      error.code === 'ERR_NETWORK' ||
                      error.message?.includes('Network Error');

    const config = error.config;
    if (isOffline && config && config.method?.toLowerCase() === 'get') {
      const url = config.url || '';
      console.log(`[API Offline Fallback] Network unavailable for ${url}, reading from IndexedDB...`);

      try {
        // 1. /destinations or /destinations/
        if (url === '/destinations' || url === '/destinations/') {
          const savedDests = await getAllDestinationsOffline();
          if (savedDests && savedDests.length > 0) {
            return { success: true, count: savedDests.length, destinations: savedDests, offline: true };
          }
          const savedPkgs = await getAllOfflinePackages();
          const pkgDests = savedPkgs.map(p => p.destination).filter(Boolean);
          if (pkgDests.length > 0) {
            return { success: true, count: pkgDests.length, destinations: pkgDests, offline: true };
          }
        }

        // 2. /destinations/:id
        const destMatch = url.match(/^\/destinations\/([^\/?#]+)/);
        if (destMatch) {
          const destId = destMatch[1];
          const pkg = await getOfflinePackageByQuery(destId);
          if (pkg && pkg.destination) {
            return { success: true, destination: pkg.destination, offline: true };
          }
          const savedDest = await getDestinationOffline(destId);
          if (savedDest) {
            return { success: true, destination: savedDest, offline: true };
          }
        }

        // 3. /trips/active-trip
        if (url.includes('/trips/active-trip')) {
          const savedTrip = await getSavedTripOffline();
          if (savedTrip) {
            return { success: true, trip: savedTrip, offline: true };
          }
          const latestPkg = await getOfflinePackageByQuery('active-trip');
          if (latestPkg && latestPkg.trip) {
            return { success: true, trip: latestPkg.trip, offline: true };
          }
        }

        // 4. /places/pois
        if (url.includes('/places/pois')) {
          const pkgs = await getAllOfflinePackages();
          if (pkgs && pkgs.length > 0) {
            const places = pkgs[0].places || [];
            return { success: true, data: places, count: places.length, offline: true };
          }
        }

        // 5. /safety/score
        if (url.includes('/safety/score')) {
          const cachedSafety = await getSafetyOffline('live-safety-score');
          if (cachedSafety) {
            return { success: true, ...cachedSafety, offline: true };
          }
        }
      } catch (dbErr) {
        console.warn('[API Offline Fallback Error]:', dbErr);
      }
    }

    console.error('[API Error]:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || { success: false, message: error.message, offline: isOffline });
  }
);

export default api;
