import React from 'react';
import { Sparkles, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

export const StateTooltip = ({ state, position }) => {
  if (!state || !position) return null;

  const { name, capital, completedDestinations = 0, totalDestinations = 10, percentage = 0, isCompleted } = state;
  const potentialXp = totalDestinations * 125;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-75 ease-out"
      style={{
        left: `${position.x + 16}px`,
        top: `${position.y - 40}px`
      }}
    >
      <div className="glass-card bg-forest-950/95 text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md min-w-[210px] space-y-2 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold font-sora text-white">{name}</span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
            isCompleted 
              ? 'bg-emerald-500 text-white' 
              : percentage > 0 
                ? 'bg-amber-400 text-slate-950' 
                : 'bg-white/10 text-slate-300'
          }`}>
            {isCompleted ? '✓ COMPLETED' : percentage > 0 ? `${percentage}%` : 'LOCKED'}
          </span>
        </div>

        {/* Metrics */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Destinations:</span>
            <strong className="font-mono text-emerald-400 font-bold">
              {completedDestinations} / {totalDestinations}
            </strong>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Explored:</span>
            <span className="font-bold text-white font-mono">{percentage}%</span>
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-white/10">
            <span className="text-[11px] text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Available XP:</span>
            </span>
            <strong className="font-mono text-amber-400 text-xs">+{potentialXp} XP</strong>
          </div>
        </div>

        {/* Progress Mini Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-[10px] text-emerald-300/80 font-mono text-center pt-0.5">
          Click to view 10 sacred destinations ➔
        </p>
      </div>
    </div>
  );
};
