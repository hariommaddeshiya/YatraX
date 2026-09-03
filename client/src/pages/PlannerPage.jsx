import React, { useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Leaf, 
  IndianRupee,
  Share2,
  CloudSun
} from 'lucide-react';
import { useTrip } from '../context/TripContext.jsx';
import { useOffline } from '../context/OfflineContext.jsx';
import { PlannerForm } from '../components/planner/PlannerForm.jsx';
import { TransportSelector } from '../components/planner/TransportSelector.jsx';
import { BudgetDashboard } from '../components/planner/BudgetDashboard.jsx';
import { ItineraryTimeline } from '../components/planner/ItineraryTimeline.jsx';
import { ConfirmTripBanner } from '../components/planner/ConfirmTripBanner.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const PlannerPage = () => {
  const { activeTrip } = useTrip();
  const { downloadTripForOffline, isSavedForOffline } = useOffline();
  const resultsRef = useRef(null);

  const handleGenerated = (trip) => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadOffline = async () => {
    if (activeTrip) {
      await downloadTripForOffline(activeTrip);
      alert('✅ Trip Package downloaded successfully! All itinerary items, emergency contacts & routes are now available offline via IndexedDB.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-forest-800 text-xs font-sora font-bold border border-emerald-500/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          <span>AI MULTI-MODAL LOGISTICS & ADAPTIVE PLANNER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 font-sora tracking-tight">
          Plan Your Sustainable Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Compare multi-modal routes, compute transparent itemized budgets, and experience real-time adaptive rerouting when weather or prices shift.
        </p>
      </div>

      {/* 1. Planner Input Form */}
      <PlannerForm onGenerated={handleGenerated} />

      {/* 2. Generated Results View */}
      {activeTrip && (
        <div ref={resultsRef} className="space-y-10 pt-4 animate-fadeIn">
          
          {/* Trip Summary Top Banner */}
          <div className="glass-card rounded-4xl p-6 sm:p-8 text-forest-950 shadow-glass border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-forest-800 text-white px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider">
                  Active Smart Itinerary
                </span>
                <span className="text-xs text-forest-700 font-mono font-bold">
                  ID: #{activeTrip.id?.slice(0, 12)}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-sora font-bold text-forest-950">
                {activeTrip.origin} ➔ {activeTrip.destination}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                <span>📅 {activeTrip.totalDays} Days ({activeTrip.startDate} to {activeTrip.endDate})</span>
                <span>•</span>
                <span>👥 {activeTrip.travellers} Travellers</span>
                <span>•</span>
                <span>🌿 Style: {activeTrip.travelStyle}</span>
              </div>
            </div>

            {/* Offline Download CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
              <button
                onClick={handleDownloadOffline}
                className="w-full sm:w-auto px-5 py-3 bg-forest-800 hover:bg-forest-900 text-white text-xs font-sora font-bold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-300" />
                <span>{isSavedForOffline ? 'Cached for Offline Use' : 'Download Trip for Offline Use'}</span>
              </button>
            </div>
          </div>

          {/* 3. Multi-Modal Transport Comparison */}
          <TransportSelector />

          {/* 4. Complete Dynamic Trip Cost Dashboard */}
          <BudgetDashboard />

          {/* 5. Adaptive Daily Itinerary Timeline */}
          <ItineraryTimeline />

          {/* 6. Confirm Destination Visit & Add to My Trips */}
          <ConfirmTripBanner />

        </div>
      )}

    </div>
  );
};
