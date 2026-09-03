import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Calendar, 
  Compass, 
  ShieldCheck, 
  PartyPopper,
  BookmarkCheck
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const ConfirmTripBanner = () => {
  const { activeTrip, confirmTrip } = useTrip();
  const { user, isAuthenticated, saveConfirmedTrip, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(activeTrip?.isConfirmed || false);

  React.useEffect(() => {
    setConfirmed(activeTrip?.isConfirmed || false);
  }, [activeTrip?.id, activeTrip?.isConfirmed]);

  if (!activeTrip) return null;

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setConfirming(true);
    try {
      const updatedTrip = await confirmTrip(activeTrip.id);
      await saveConfirmedTrip(updatedTrip || activeTrip);
      setConfirmed(true);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6']
      });
    } catch (err) {
      console.error('Failed to confirm trip:', err);
      alert('Could not confirm trip: ' + (err.message || 'Server error'));
    } finally {
      setConfirming(false);
    }
  };

  const totalCost = activeTrip.budgetBreakdown?.totalEstimatedCostInr || activeTrip.estimatedBudgetInr || 35618;

  return (
    <div className="bg-[#051F1C] text-white rounded-4xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6 animate-fadeIn">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ready for Departure?</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold font-sora text-white leading-tight drop-shadow-sm">
            {confirmed ? '🎉 Destination Visit Confirmed!' : `Confirm ${activeTrip.destination} Visit & Add to My Trips`}
          </h3>

          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            {confirmed
              ? `Your itinerary for ${activeTrip.destination} is now active in My Trip. Your travel passport has been credited with +150 XP.`
              : `Finalize your ${activeTrip.totalDays}-day itinerary. Adds your trip to "My Trip" across all menus and syncs destination progress to the Explore India Gamification Atlas.`}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-2 font-mono font-bold">
            <span>👥 {activeTrip.travellers} Travellers</span>
            <span className="text-emerald-400">•</span>
            <span>📅 {activeTrip.totalDays} Days</span>
            <span className="text-emerald-400">•</span>
            <span className="text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Total: ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 relative z-10">
          {confirmed ? (
            <>
              <button
                onClick={() => navigate('/trip')}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sora font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Open in My Trip Section ➔</span>
              </button>

              <button
                onClick={() => navigate('/explore-india')}
                className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-sora font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Check India Map Progress</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-sora font-extrabold flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer disabled:opacity-70 group border border-emerald-300/40"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>{confirming ? 'Confirming Itinerary...' : 'Confirm Visit & Add to My Trips (+150 XP)'}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
