import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Leaf, 
  ShieldCheck, 
  Download, 
  CloudSun, 
  Clock, 
  Sparkles,
  ArrowRight,
  WifiOff,
  Wifi,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext.jsx';
import { useOffline } from '../context/OfflineContext.jsx';
import { getSavedTripOffline, getLatestOfflinePackage } from '../utils/indexedDb.js';
import { TransportSelector } from '../components/planner/TransportSelector.jsx';
import { BudgetDashboard } from '../components/planner/BudgetDashboard.jsx';
import { ItineraryTimeline } from '../components/planner/ItineraryTimeline.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const TripDetailPage = () => {
  const { activeTrip, setActiveTrip, loading: tripLoading } = useTrip();
  const { 
    isOnline, 
    isOffline, 
    downloadDestination, 
    isDestinationDownloaded, 
    downloadStatus, 
    downloadProgress, 
    downloadStage,
    isSavedForOffline,
    offlinePackages,
    offlineTrip
  } = useOffline();

  const [localTrip, setLocalTrip] = useState(activeTrip || offlineTrip || null);
  const [loadingLocal, setLoadingLocal] = useState(!activeTrip && !offlineTrip);

  // Hydrate from offlineTrip or IndexedDB if offline or activeTrip is null
  useEffect(() => {
    if (isOffline) {
      if (offlineTrip) {
        setLocalTrip(offlineTrip);
        setActiveTrip(offlineTrip);
        setLoadingLocal(false);
        return;
      }
      getSavedTripOffline().then((saved) => {
        if (saved) {
          setLocalTrip(saved);
          setActiveTrip(saved);
        } else {
          getLatestOfflinePackage().then((pkg) => {
            if (pkg && pkg.trip) {
              setLocalTrip(pkg.trip);
              setActiveTrip(pkg.trip);
            }
            setLoadingLocal(false);
          }).catch(() => setLoadingLocal(false));
          return;
        }
        setLoadingLocal(false);
      }).catch(() => setLoadingLocal(false));
      return;
    }

    if (activeTrip) {
      setLocalTrip(activeTrip);
      setLoadingLocal(false);
      return;
    }

    if (offlineTrip) {
      setLocalTrip(offlineTrip);
      setActiveTrip(offlineTrip);
      setLoadingLocal(false);
      return;
    }

    // Direct read from IndexedDB
    getSavedTripOffline().then((saved) => {
      if (saved) {
        setLocalTrip(saved);
        setActiveTrip(saved);
      } else {
        getLatestOfflinePackage().then((pkg) => {
          if (pkg && pkg.trip) {
            setLocalTrip(pkg.trip);
            setActiveTrip(pkg.trip);
          }
          setLoadingLocal(false);
        }).catch(() => setLoadingLocal(false));
        return;
      }
      setLoadingLocal(false);
    }).catch(() => setLoadingLocal(false));
  }, [activeTrip, offlineTrip, setActiveTrip, isOffline]);

  const effectiveTrip = isOffline 
    ? (offlineTrip || localTrip || activeTrip) 
    : (activeTrip || localTrip || offlineTrip);

  if (loadingLocal || tripLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-forest-800 animate-spin mx-auto" />
        <p className="text-xs font-sora font-semibold text-slate-500">Loading sanctuary journey...</p>
      </div>
    );
  }

  if (!effectiveTrip) {
    if (isOffline) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <WifiOff className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-sora font-bold text-slate-800">This destination hasn't been downloaded for offline use.</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please reconnect to the internet to download itineraries or plan new sustainable journeys.
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer"
            >
              <span>Reconnect & Retry</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-sora font-bold text-slate-800">No Active Trip Found</h2>
        <p className="text-xs text-slate-500">Configure a personalized itinerary using the AI Multi-Modal Planner.</p>
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-6 py-3 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer"
        >
          <span>Open AI Trip Planner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isDownloaded = isDestinationDownloaded(effectiveTrip.destination) || isSavedForOffline;

  const handleDownload = async () => {
    await downloadDestination(
      { 
        id: effectiveTrip.id || effectiveTrip.destination.toLowerCase().replace(/\s+/g, '-'), 
        name: effectiveTrip.destination 
      },
      { trip: effectiveTrip }
    );
  };

  const weatherData = effectiveTrip.weatherSummary || effectiveTrip.weather?.current;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Button */}
      <Link to="/trip" className="inline-flex items-center gap-2 text-xs font-sora font-bold text-slate-500 hover:text-forest-800 transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span>Back to My Trips</span>
      </Link>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-slate-900 to-forest-950 rounded-4xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider ${
              effectiveTrip.isConfirmed 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : 'bg-forest-800 text-emerald-300'
            }`}>
              {effectiveTrip.isConfirmed ? '✓ CONFIRMED ACTIVE JOURNEY' : 'Live Itinerary'}
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">
              #{effectiveTrip.id?.slice(0, 10)}
            </span>
            <DataSourceBadge 
              type={isOffline ? "OFFLINE CACHED" : "LIVE API DATA"} 
              source={isOffline ? "IndexedDB Saved Itinerary" : "Open-Meteo & IRCTC"} 
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-sora font-extrabold text-white">
            {effectiveTrip.origin} ➔ {effectiveTrip.destination}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
            <span>📅 {effectiveTrip.totalDays || 4} Days ({effectiveTrip.startDate} to {effectiveTrip.endDate})</span>
            <span>•</span>
            <span>👥 {effectiveTrip.travellers || 2} Travellers</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">🌿 Style: {effectiveTrip.travelStyle || 'Eco'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <Link
            to="/explore-india"
            className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-sora font-bold rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>View India Map</span>
          </Link>

          <button
            onClick={handleDownload}
            disabled={downloadStatus === 'DOWNLOADING'}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sora font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-emerald-400 cursor-pointer disabled:opacity-60"
          >
            {downloadStatus === 'DOWNLOADING' ? (
              <>
                <Loader2 className="w-4 h-4 text-emerald-200 animate-spin" />
                <span>Downloading… {downloadProgress}%</span>
              </>
            ) : isDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Available Offline in IndexedDB</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Download for Offline Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Weather Snapshot Widget */}
      {weatherData && (
        <div className="bg-sand-50 rounded-2xl p-4 border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl text-amber-500 border border-sand-200 shadow-2xs">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>{effectiveTrip.destination} Weather: {weatherData.temperatureC || 24}°C</span>
                <span className="text-[10px] text-slate-500 font-normal font-mono">({weatherData.weatherCondition || 'Clear'})</span>
              </div>
              <span className="text-[11px] text-slate-600">
                {isOffline
                  ? 'Showing last saved weather forecast from offline package.'
                  : (weatherData.riskReason || 'Optimal atmospheric conditions for eco-trail excursions.')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-sand-200">
            <span>🌧️ Precip: {weatherData.precipitationMm || 0} mm</span>
            <span>•</span>
            <span>💨 Wind: {weatherData.windSpeedKmH || 12} km/h</span>
          </div>
        </div>
      )}

      {/* Multi-Modal Logistics */}
      <TransportSelector />

      {/* Dynamic Budget Engine */}
      <BudgetDashboard />

      {/* Day-by-Day Schedule */}
      <ItineraryTimeline />

    </div>
  );
};
