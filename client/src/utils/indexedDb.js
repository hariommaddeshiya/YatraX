import { openDB } from 'idb';

const DB_NAME = 'safarai_offline_db';
const DB_VERSION = 1;

export const initOfflineDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
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
    }
  });
};

export const saveTripOffline = async (trip) => {
  const db = await initOfflineDB();
  await db.put('trips', { ...trip, savedAt: new Date().toISOString() });
  await db.put('offlineState', { key: 'activeTripId', value: trip.id });
  return true;
};

export const getSavedTripOffline = async (tripId = 'active-trip') => {
  const db = await initOfflineDB();
  const all = await db.getAll('trips');
  if (all && all.length > 0) {
    return all[all.length - 1]; // Return most recently saved trip
  }
  return null;
};

export const saveEmergencyDirectoryOffline = async (emergencyData) => {
  const db = await initOfflineDB();
  await db.put('emergency', { id: 'emergency-contacts', data: emergencyData });
};

export const getEmergencyDirectoryOffline = async () => {
  const db = await initOfflineDB();
  return db.get('emergency', 'emergency-contacts');
};
