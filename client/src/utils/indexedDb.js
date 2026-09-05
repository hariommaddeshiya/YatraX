import { openDB } from 'idb';

const DB_NAME = 'safarai_offline_db';
const DB_VERSION = 2;

export const initOfflineDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('trips')) {
        db.createObjectStore('trips', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('destinations')) {
        db.createObjectStore('destinations', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('emergency')) {
        db.createObjectStore('emergency', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offlineState')) {
        db.createObjectStore('offlineState', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('offlinePackages')) {
        db.createObjectStore('offlinePackages', { keyPath: 'destinationId' });
      }
      if (!db.objectStoreNames.contains('places')) {
        db.createObjectStore('places', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('safety')) {
        db.createObjectStore('safety', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('routes')) {
        db.createObjectStore('routes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    }
  });
};

// ==========================================
// TRIPS STORAGE
// ==========================================
export const saveTripOffline = async (trip) => {
  if (!trip) return false;
  const db = await initOfflineDB();
  const id = trip.id || 'active-trip';
  await db.put('trips', { ...trip, id, savedAt: new Date().toISOString() });
  await db.put('offlineState', { key: 'activeTripId', value: id });
  return true;
};

export const getSavedTripOffline = async (tripId = 'active-trip') => {
  const db = await initOfflineDB();
  
  // 1. If a specific non-default ID is requested
  if (tripId && tripId !== 'active-trip') {
    const specific = await db.get('trips', tripId);
    if (specific) return specific;
  }

  // 2. Check activeTripId pointer from offlineState
  try {
    const activePointer = await db.get('offlineState', 'activeTripId');
    if (activePointer && activePointer.value) {
      const active = await db.get('trips', activePointer.value);
      if (active) return active;
    }
  } catch (e) {}

  // 3. Check direct 'active-trip' key in trips store
  try {
    const directActive = await db.get('trips', 'active-trip');
    if (directActive) return directActive;
  } catch (e) {}

  // 4. Return most recently saved trip sorted by savedAt descending
  const all = await db.getAll('trips');
  if (all && all.length > 0) {
    all.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
    return all[0];
  }

  // 5. Fallback: check latest offline package
  try {
    const allPkgs = await db.getAll('offlinePackages');
    if (allPkgs && allPkgs.length > 0) {
      allPkgs.sort((a, b) => new Date(b.downloadedAt || 0) - new Date(a.downloadedAt || 0));
      if (allPkgs[0].trip) return allPkgs[0].trip;
    }
  } catch (e) {}

  return null;
};

export const getAllSavedTripsOffline = async () => {
  const db = await initOfflineDB();
  return db.getAll('trips');
};

// ==========================================
// EMERGENCY & SAFETY DIRECTORY
// ==========================================
export const saveEmergencyDirectoryOffline = async (emergencyData) => {
  const db = await initOfflineDB();
  await db.put('emergency', { id: 'emergency-contacts', data: emergencyData, savedAt: new Date().toISOString() });
  return true;
};

export const getEmergencyDirectoryOffline = async () => {
  const db = await initOfflineDB();
  return db.get('emergency', 'emergency-contacts');
};

export const saveSafetyOffline = async (id, data) => {
  const db = await initOfflineDB();
  await db.put('safety', { id, data, savedAt: new Date().toISOString() });
  return true;
};

export const getSafetyOffline = async (id) => {
  const db = await initOfflineDB();
  const record = await db.get('safety', id);
  return record?.data || null;
};

// ==========================================
// DESTINATIONS & PLACES STORAGE
// ==========================================
export const saveDestinationOffline = async (destination) => {
  if (!destination) return false;
  const db = await initOfflineDB();
  const id = destination.id || destination.name?.toLowerCase().replace(/\s+/g, '-');
  await db.put('destinations', { ...destination, id, savedAt: new Date().toISOString() });
  return true;
};

export const getDestinationOffline = async (destinationId) => {
  const db = await initOfflineDB();
  return db.get('destinations', destinationId);
};

export const getAllDestinationsOffline = async () => {
  const db = await initOfflineDB();
  return db.getAll('destinations');
};

export const savePlacesOffline = async (destinationId, places) => {
  const db = await initOfflineDB();
  await db.put('places', { id: destinationId, places, savedAt: new Date().toISOString() });
  return true;
};

export const getPlacesOffline = async (destinationId) => {
  const db = await initOfflineDB();
  const record = await db.get('places', destinationId);
  return record?.places || [];
};

// ==========================================
// COMPREHENSIVE OFFLINE DESTINATION PACKAGES
// ==========================================
export const saveOfflinePackage = async (packageData) => {
  if (!packageData || !packageData.destinationId) {
    throw new Error('Invalid offline package data');
  }
  const db = await initOfflineDB();
  const tx = db.transaction(
    ['offlinePackages', 'destinations', 'trips', 'emergency', 'safety', 'places', 'offlineState'],
    'readwrite'
  );

  const timestamp = new Date().toISOString();
  const pkgRecord = {
    ...packageData,
    downloadedAt: timestamp,
    lastUpdated: timestamp,
    version: '1.0.0',
    dataVersion: 1
  };

  // 1. Put into offlinePackages
  await tx.objectStore('offlinePackages').put(pkgRecord);

  // 2. Put into destinations
  if (packageData.destination) {
    await tx.objectStore('destinations').put({
      ...packageData.destination,
      id: packageData.destinationId,
      savedAt: timestamp
    });
  }

  // 3. Put into trips if included
  if (packageData.trip) {
    await tx.objectStore('trips').put({
      ...packageData.trip,
      id: packageData.trip.id || `trip-${packageData.destinationId}`,
      savedAt: timestamp
    });
  }

  // 4. Put emergency data if included
  if (packageData.emergency) {
    await tx.objectStore('emergency').put({
      id: `emergency-${packageData.destinationId}`,
      data: packageData.emergency,
      savedAt: timestamp
    });
    // Also save as global default if none exists
    await tx.objectStore('emergency').put({
      id: 'emergency-contacts',
      data: packageData.emergency,
      savedAt: timestamp
    });
  }

  // 5. Put safety data if included
  if (packageData.safety) {
    await tx.objectStore('safety').put({
      id: packageData.destinationId,
      data: packageData.safety,
      savedAt: timestamp
    });
  }

  // 6. Put places if included
  if (packageData.places) {
    await tx.objectStore('places').put({
      id: packageData.destinationId,
      places: packageData.places,
      savedAt: timestamp
    });
  }

  // 7. Record active offline destination & active trip
  await tx.objectStore('offlineState').put({
    key: 'lastDownloadedDestinationId',
    value: packageData.destinationId
  });

  if (packageData.trip) {
    // Also save as default active-trip so offline refresh instantly finds it
    await tx.objectStore('trips').put({
      ...packageData.trip,
      id: 'active-trip',
      savedAt: timestamp
    });
    await tx.objectStore('offlineState').put({
      key: 'activeTripId',
      value: packageData.trip.id || `trip-${packageData.destinationId}`
    });
  }

  await tx.done;
  return pkgRecord;
};

export const getOfflinePackage = async (destinationId) => {
  if (!destinationId) return null;
  const db = await initOfflineDB();
  return db.get('offlinePackages', destinationId);
};

export const getLatestOfflinePackage = async () => {
  const db = await initOfflineDB();
  const lastId = await getOfflineState('lastDownloadedDestinationId');
  if (lastId) {
    const pkg = await db.get('offlinePackages', lastId);
    if (pkg) return pkg;
  }
  const all = await db.getAll('offlinePackages');
  if (all && all.length > 0) {
    return all[all.length - 1];
  }
  return null;
};

export const getOfflinePackageByQuery = async (query) => {
  if (!query) return null;
  const db = await initOfflineDB();
  const norm = query.toString().toLowerCase().trim();
  
  // Try exact key first
  const exact = await db.get('offlinePackages', norm);
  if (exact) return exact;

  // Search across all saved packages
  const all = await db.getAll('offlinePackages');
  if (!all || all.length === 0) return null;

  return all.find(p => 
    p.destinationId?.toLowerCase() === norm ||
    p.destinationName?.toLowerCase() === norm ||
    norm.includes(p.destinationId?.toLowerCase() || '') ||
    p.destinationName?.toLowerCase().includes(norm) ||
    p.destination?.state?.toLowerCase().includes(norm)
  ) || null;
};

export const getAllOfflinePackages = async () => {
  const db = await initOfflineDB();
  return db.getAll('offlinePackages');
};

export const removeOfflinePackage = async (destinationId) => {
  const db = await initOfflineDB();
  const tx = db.transaction(
    ['offlinePackages', 'destinations', 'places', 'safety'],
    'readwrite'
  );
  await tx.objectStore('offlinePackages').delete(destinationId);
  await tx.objectStore('destinations').delete(destinationId);
  await tx.objectStore('places').delete(destinationId);
  await tx.objectStore('safety').delete(destinationId);
  await tx.done;
  return true;
};

// ==========================================
// OFFLINE STATE KEY-VALUE HELPER
// ==========================================
export const saveOfflineState = async (key, value) => {
  const db = await initOfflineDB();
  await db.put('offlineState', { key, value });
  return true;
};

export const getOfflineState = async (key) => {
  const db = await initOfflineDB();
  const record = await db.get('offlineState', key);
  return record?.value ?? null;
};
