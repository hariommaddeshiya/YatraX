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
  Wifi
} from 'lucide-react';
import { useTrip } from '../context/TripContext.jsx';
import { useOffline } from '../context/OfflineContext.jsx';
import { TransportSelector } from '../components/planner/TransportSelector.jsx';
import { BudgetDashboard } from '../components/planner/BudgetDashboard.jsx';
import { ItineraryTimeline } from '../components/planner/ItineraryTimeline.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const TripDetailPage = () => {
  const { activeTrip } = useTrip();
  const { isOnline, downloadTripForOffline, isSavedForOffline } = useOffline();

  if (!activeTrip) {
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

  const handleDownload = async () => {
    await downloadTripForOffline(activeTrip);
    alert('✅ Trip Package saved to IndexedDB for offline access.');
  };

  const weatherData = activeTrip.weatherSummary || activeTrip.weather?.current;

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
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider ${
              activeTrip.isConfirmed 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : 'bg-forest-800 text-emerald-300'
            }`}>
              {activeTrip.isConfirmed ? '✓ CONFIRMED ACTIVE JOURNEY' : 'Live Itinerary'}
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">
              #{activeTrip.id?.slice(0, 10)}
            </span>
            <DataSourceBadge type="LIVE API DATA" source="Open-Meteo & IRCTC" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-sora font-extrabold text-white">
            {activeTrip.origin} ➔ {activeTrip.destination}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
            <span>📅 {activeTrip.totalDays || 6} Days ({activeTrip.startDate} to {activeTrip.endDate})</span>
            <span>•</span>
            <span>👥 {activeTrip.travellers || 2} Travellers</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">🌿 Style: {activeTrip.travelStyle || 'Eco'}</span>
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
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sora font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-emerald-400 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>{isSavedForOffline ? 'Cached in IndexedDB' : 'Download for Offline Mode'}</span>
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
                <span>{activeTrip.destination} Weather: {weatherData.temperatureC || 24}°C</span>
                <span className="text-[10px] text-slate-500 font-normal font-mono">({weatherData.weatherCondition || 'Clear'})</span>
              </div>
              <span className="text-[11px] text-slate-600">
                {weatherData.riskReason || 'Optimal atmospheric conditions for eco-trail excursions.'}
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
