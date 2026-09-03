import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveTripOffline, getSavedTripOffline } from '../utils/indexedDb.js';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState('ONLINE'); // ONLINE, WEAK, OFFLINE
  const [isSavedForOffline, setIsSavedForOffline] = useState(false);
  const [offlineTrip, setOfflineTrip] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isSimulatedOffline) setOfflineStatus('ONLINE');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check from IndexedDB
    getSavedTripOffline().then(saved => {
      if (saved) {
        setOfflineTrip(saved);
        setIsSavedForOffline(true);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      setOfflineStatus(next ? 'OFFLINE' : (navigator.onLine ? 'ONLINE' : 'OFFLINE'));
      return next;
    });
  };

  const setWeakConnection = () => {
    setOfflineStatus('WEAK');
  };

  const downloadTripForOffline = async (trip) => {
    if (!trip) return false;
    try {
      await saveTripOffline(trip);
      setOfflineTrip(trip);
      setIsSavedForOffline(true);
      return true;
    } catch (err) {
      console.error('Error saving trip for offline:', err);
      return false;
    }
  };

  const effectiveOffline = !isOnline || isSimulatedOffline;

  return (
    <OfflineContext.Provider value={{
      isOnline: !effectiveOffline,
      offlineStatus,
      isSimulatedOffline,
      toggleSimulatedOffline,
      setWeakConnection,
      downloadTripForOffline,
      isSavedForOffline,
      offlineTrip
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
