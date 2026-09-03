import React from 'react';
import { AchievementCard } from './AchievementCard.jsx';
import { Award, Sparkles, Trophy } from 'lucide-react';

export const AchievementsSection = ({ achievements = [] }) => {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <section className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full uppercase font-mono">
              Travel Badges & XP Milestones
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sora text-slate-900 dark:text-white mt-1">
            🏅 Travel Badges & Milestones
          </h2>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Earn badges and bonus XP as you explore sacred sanctuaries, wildlife reserves, and cultural trails.
          </p>
        </div>

        {/* Progress Counter Badge */}
        <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-4 py-2 rounded-2xl border border-sand-300 dark:border-white/10 shadow-2xs self-start sm:self-auto">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-sora font-bold text-slate-800 dark:text-white">
            {unlockedCount} / {totalCount} Unlocked
          </span>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>

    </section>
  );
};
