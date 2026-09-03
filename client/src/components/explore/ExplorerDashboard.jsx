import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Sparkles, 
  MapPin, 
  Award, 
  Compass, 
  Flame, 
  ShieldCheck, 
  User, 
  ArrowRight,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const ExplorerDashboard = ({ stats = {} }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const {
    totalDestinations = 280,
    exploredCount = 0,
    overallPercentage = 0,
    statesCompletedCount = 0,
    totalStates = 36,
    totalXP = 0,
    level = 1,
    achievementsUnlockedCount = 0
  } = stats;

  // SVG Radial Progress math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="glass-card rounded-4xl p-6 sm:p-8 border border-white/80 dark:border-emerald-500/20 shadow-glass space-y-6 relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200 dark:border-white/10 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 dark:bg-emerald-950/60 text-forest-900 dark:text-emerald-300 text-xs font-sora font-bold border border-forest-200 dark:border-emerald-800">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>GAMIFIED BHARAT EXPEDITION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sora text-slate-900 dark:text-white tracking-tight">
            🏆 India Explorer Progress
          </h1>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Discover India. Complete sacred and ecological experiences. Become an India Master Voyager.
          </p>
        </div>

        {/* User Profile Pill or Auth Call-To-Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 bg-sand-100 dark:bg-white/10 p-2 sm:px-4 sm:py-2 rounded-2xl border border-sand-300 dark:border-white/10 shadow-2xs hover:bg-white transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                  {user?.avatar || '🇮🇳'}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-sora text-slate-900 dark:text-white">
                      {user?.username || user?.name || 'Explorer'}
                    </span>
                    <span className="text-[10px] font-mono bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                      Lvl {level}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {totalXP.toLocaleString('en-IN')} XP
                  </div>
                </div>
              </Link>

              <button
                onClick={logout}
                className="p-2.5 rounded-2xl bg-sand-100 dark:bg-white/10 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-sand-300 dark:border-white/10 transition-colors cursor-pointer text-xs font-bold"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-5 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-sora font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-center">
        
        {/* Left: Radial Progress Ring for Overall India Explored */}
        <div className="md:col-span-4 bg-gradient-to-br from-emerald-50/70 via-sand-50 to-white dark:from-forest-950 dark:to-slate-900 p-6 rounded-3xl border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-4 shadow-glass">
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              {/* Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-sand-200 dark:text-white/10 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Value Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black font-mono text-forest-950 dark:text-white leading-none">
                {overallPercentage}%
              </span>
              <span className="text-[10px] font-sora font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Explored
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-sora font-bold text-sm text-forest-950 dark:text-white">
              {exploredCount} / {totalDestinations} Destinations
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {overallPercentage}% of Incredible India discovered
            </p>
          </div>

        </div>

        {/* Right: 4 Stat Cards */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total XP */}
          <div className="bg-white/80 dark:bg-white/5 p-4 rounded-3xl border border-sand-200 dark:border-white/10 shadow-2xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sora font-semibold">Total XP</span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-forest-950 dark:text-white">
                {totalXP.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                Verified Points
              </span>
            </div>
          </div>

          {/* Card 2: Level */}
          <div className="bg-white/80 dark:bg-white/5 p-4 rounded-3xl border border-sand-200 dark:border-white/10 shadow-2xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sora font-semibold">Explorer Level</span>
              <div className="p-2 rounded-xl bg-forest-100 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400">
                <Crown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-sora text-forest-950 dark:text-white">
                Level {level}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {level >= 7 ? 'Master Voyager' : 'Active Wanderer'}
              </span>
            </div>
          </div>

          {/* Card 3: States Completed */}
          <div className="bg-white/80 dark:bg-white/5 p-4 rounded-3xl border border-sand-200 dark:border-white/10 shadow-2xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sora font-semibold">States Mastered</span>
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-forest-950 dark:text-white">
                {statesCompletedCount} / {totalStates}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                100% Explored
              </span>
            </div>
          </div>

          {/* Card 4: Visited Sites */}
          <div className="bg-white/80 dark:bg-white/5 p-4 rounded-3xl border border-sand-200 dark:border-white/10 shadow-2xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sora font-semibold">Sites Explored</span>
              <div className="p-2 rounded-xl bg-terracotta-100 dark:bg-rose-950/60 text-terracotta-700 dark:text-rose-400">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-forest-950 dark:text-white">
                {exploredCount}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Sacred & Eco Wonders
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Guest Prompt Notice if not logged in */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Guest Exploration Mode:</strong> Log in to record visited sanctuaries, earn verified XP, and level up your traveler passport.
            </span>
          </div>

          <button
            onClick={() => openAuthModal('login')}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-sora font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer shadow-sm"
          >
            Get Started
          </button>
        </div>
      )}

    </div>
  );
};
