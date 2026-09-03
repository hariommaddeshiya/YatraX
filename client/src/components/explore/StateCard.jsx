import React from 'react';
import { CheckCircle2, ChevronRight, Sparkles, MapPin } from 'lucide-react';

export const StateCard = ({ state, onClick }) => {
  const {
    id,
    name,
    code,
    capital,
    region,
    image,
    completedDestinations = 0,
    totalDestinations = 10,
    percentage = 0,
    isCompleted = false
  } = state;

  const getStatusBadge = () => {
    if (isCompleted || percentage >= 100) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold font-sora px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>COMPLETED ✓</span>
        </span>
      );
    }
    if (percentage >= 40) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold font-sora px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          <span>In Progress</span>
        </span>
      );
    }
    if (percentage > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold font-sora px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Started</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium font-sora px-2.5 py-0.5 rounded-full bg-sand-100 text-slate-500 dark:bg-white/10 dark:text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span>Not Started</span>
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="glass-card bg-white dark:bg-forest-950/70 text-slate-900 dark:text-white rounded-3xl overflow-hidden border border-sand-200 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      {/* Top Cover Image */}
      <div className="relative h-32 w-full overflow-hidden bg-sand-200 dark:bg-white/5">
        <img
          src={image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* State Code & Region Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white font-mono text-xs font-bold border border-white/20">
            {code}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-xs text-white text-[10px] font-semibold">
            {region}
          </span>
        </div>

        {/* Bottom State Name on Cover */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
          <h3 className="font-sora font-bold text-base tracking-tight truncate drop-shadow-sm">
            {name}
          </h3>
        </div>
      </div>

      {/* Body: Progress & Stats */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-200 font-semibold">
              {completedDestinations} / {totalDestinations} Destinations
            </span>
            <span className="font-mono font-bold text-forest-900 dark:text-emerald-400">
              {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-sand-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted 
                  ? 'bg-emerald-500' 
                  : percentage > 0 
                    ? 'bg-gradient-to-r from-emerald-600 to-amber-400' 
                    : 'bg-transparent'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Status Pill & Click Trigger */}
        <div className="pt-2 border-t border-sand-100 dark:border-white/10 flex items-center justify-between">
          {getStatusBadge()}

          <span className="text-xs font-sora font-bold text-forest-800 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            <span>View 10 Wonders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  );
};
