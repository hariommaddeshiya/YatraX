import React from 'react';
import { Lock, CheckCircle2, Sparkles, Calendar } from 'lucide-react';

export const AchievementCard = ({ achievement }) => {
  const {
    id,
    title,
    icon,
    category,
    description,
    xpBonus,
    isUnlocked,
    unlockedAt
  } = achievement;

  const formattedDate = unlockedAt 
    ? new Date(unlockedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div
      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
        isUnlocked
          ? 'bg-gradient-to-br from-amber-50/90 via-emerald-50/60 to-white dark:from-forest-950 dark:via-emerald-950/40 dark:to-slate-900 border-amber-400/60 dark:border-emerald-500/40 shadow-md hover:shadow-lg'
          : 'bg-white/60 dark:bg-white/5 border-sand-200 dark:border-white/10 opacity-75 grayscale-30'
      }`}
    >
      {/* Background glow if unlocked */}
      {isUnlocked && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />
      )}

      {/* Top Bar: Icon + Category + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
            isUnlocked
              ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 ring-2 ring-amber-300'
              : 'bg-sand-100 dark:bg-white/10 text-slate-400'
          }`}>
            {icon}
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              {category}
            </span>
            <h4 className="font-sora font-bold text-sm text-slate-900 dark:text-white leading-snug">
              {title}
            </h4>
          </div>
        </div>

        {/* Lock or Check Indicator */}
        <div className="shrink-0">
          {isUnlocked ? (
            <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" title="Achievement Unlocked!">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-sand-100 text-slate-400 dark:bg-white/10" title="Locked">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>

      {/* Bottom Bar: XP Bonus & Unlock Timestamp */}
      <div className="pt-2 border-t border-sand-200 dark:border-white/10 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 dark:text-amber-400 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>+{xpBonus} XP</span>
        </span>

        {isUnlocked && formattedDate ? (
          <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Unlocked {formattedDate}</span>
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 dark:text-slate-400">
            Locked
          </span>
        )}
      </div>

    </div>
  );
};
