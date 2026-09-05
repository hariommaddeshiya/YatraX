import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2, RefreshCw } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext.jsx';

export const OfflineBanner = () => {
  const { isOffline, isSimulatedOffline, refreshOfflinePackages } = useOffline();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
      setShowReconnected(false);
    } else if (wasOffline && !isOffline) {
      // Transition from offline to online
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 animate-slideUp">
      {isOffline ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-950/95 text-amber-200 border border-amber-500/40 shadow-2xl backdrop-blur-md text-xs font-sora">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-amber-100 flex items-center gap-1.5">
              <span>Offline Mode</span>
              {isSimulatedOffline && (
                <span className="text-[9px] bg-amber-400/20 text-amber-300 font-mono px-1.5 py-0.2 rounded">
                  SIMULATED
                </span>
              )}
            </p>
            <p className="text-[10px] text-amber-300/80">Using cached shell & IndexedDB data</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-950/95 text-emerald-200 border border-emerald-500/40 shadow-2xl backdrop-blur-md text-xs font-sora animate-fadeIn">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-emerald-100">Back Online</p>
            <p className="text-[10px] text-emerald-300/80">Live APIs and sync reconnected</p>
          </div>
        </div>
      )}
    </div>
  );
};
