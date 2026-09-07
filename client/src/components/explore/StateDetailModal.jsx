import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Compass, 
  MapPin, 
  ArrowRight, 
  ExternalLink,
  Award,
  Landmark,
  Leaf,
  Mountain,
  Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import confetti from 'canvas-confetti';

export const StateDetailModal = ({ state, isOpen, onClose, onStateUpdated }) => {
  const { user, completeDestination, openAuthModal } = useAuth();
  const [completingId, setCompletingId] = useState(null);
  const [floatingXp, setFloatingXp] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !state) return null;

  const {
    id,
    name,
    capital,
    region,
    description,
    image,
    destinations = [],
    completedDestinations = 0,
    totalDestinations = 10,
    percentage = 0,
    isCompleted = false
  } = state;

  const handleMarkVisited = async (dest) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setCompletingId(dest.id);
    setErrorMsg(null);

    try {
      const result = await completeDestination(dest.id);
      
      // Update local destination state immediately
      dest.isCompleted = true;

      // Trigger floating XP effect
      setFloatingXp({
        id: dest.id,
        amount: result.xpEarned || dest.xp || 100
      });

      setTimeout(() => setFloatingXp(null), 1800);

      // Trigger Confetti if state mastered or new achievements unlocked
      if (result.stateMasteryBonusAwarded || result.state?.isCompleted || (result.newAchievements && result.newAchievements.length > 0)) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899']
        });
      }

      if (onStateUpdated) {
        onStateUpdated();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete destination.');
    } finally {
      setCompletingId(null);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Heritage': return Landmark;
      case 'Nature': return Leaf;
      case 'Adventure': return Mountain;
      case 'Food': return Utensils;
      default: return Compass;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-forest-950 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-sand-300 dark:border-emerald-500/20 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with State Cover Image */}
        <div className="relative h-44 sm:h-52 w-full shrink-0 overflow-hidden">
          <img 
            src={image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all shadow-md z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* State Title & Region Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-10 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider">
                  {region} India
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Capital: {capital}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sora tracking-tight">
                {name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl shadow-sm ${
                isCompleted 
                  ? 'bg-emerald-500 text-white' 
                  : percentage > 0 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-white/20 text-white'
              }`}>
                {isCompleted ? '✓ COMPLETED' : `${percentage}% EXPLORED`}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Progress Overview & Description */}
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>

            {/* Progress Bar Display */}
            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-black/30 border border-sand-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-sora font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  State Exploration Progress
                </span>
                <span className="font-mono text-forest-800 dark:text-emerald-400">
                  {completedDestinations} / {totalDestinations} Destinations ({percentage}%)
                </span>
              </div>

              <div className="w-full h-3 bg-sand-200 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Complete all 10 to master {name}</span>
                <strong className="text-amber-600 dark:text-amber-400">+500 XP State Mastery Bonus</strong>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Destinations Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-sora font-bold text-sm text-forest-950 dark:text-white flex items-center gap-2">
                <span>10 Curated Wonders of {name}</span>
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Click to Mark Explored
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {destinations.map((dest, idx) => {
                const Icon = getCategoryIcon(dest.category);
                const isVisited = dest.isCompleted;
                const isCurrentCompleting = completingId === dest.id;
                const showFloat = floatingXp?.id === dest.id;

                return (
                  <div
                    key={dest.id}
                    className={`p-3.5 rounded-2xl border transition-all relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isVisited
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/50 shadow-xs'
                        : 'bg-white dark:bg-white/5 border-sand-200 dark:border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    {/* Floating XP Animation Badge */}
                    {showFloat && (
                      <div className="absolute -top-3 right-8 bg-amber-400 text-slate-950 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full shadow-lg animate-bounce z-20">
                        +{floatingXp.amount} XP!
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isVisited 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-sand-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-sora font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {idx + 1}. {dest.name}
                          </span>
                          {dest.isOffbeat && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              Offbeat Gem
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {dest.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        to={`/heritage?site=${dest.id}`}
                        onClick={onClose}
                        className="px-2.5 py-1.5 rounded-xl border border-sand-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-forest-800 hover:text-white dark:hover:bg-emerald-600 text-xs font-sora font-semibold flex items-center gap-1 transition-all"
                        title={`Open 360° Photosphere View for ${dest.name}`}
                      >
                        <Compass className="w-3.5 h-3.5 text-saffron-500" />
                        <span>360° VR</span>
                      </Link>

                      {isVisited ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-sora">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Visited (+{dest.xp} XP)</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMarkVisited(dest)}
                          disabled={isCurrentCompleting}
                          className="px-3.5 py-1.5 bg-forest-800 hover:bg-forest-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl text-xs font-sora font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isCurrentCompleting ? 'Verifying...' : `Mark Explored (+${dest.xp} XP)`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sticky Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-sand-200 dark:border-white/10 bg-sand-50/80 dark:bg-forest-950/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to={`/explore?state=${id}`}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-sora font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <span>Explore Destinations Catalog</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>

          <Link
            to={`/heritage`}
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-sand-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white/50 text-xs font-sora font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-terracotta-500" />
            <span>Open 360° VR Atlas</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
