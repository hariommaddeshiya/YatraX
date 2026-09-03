import React from 'react';
import { Leaf, ShieldCheck, Zap } from 'lucide-react';

export const ScoreBadge = ({ score = 90, type = 'eco', showLabel = true, size = 'md' }) => {
  const isEco = type === 'eco';
  const Icon = isEco ? Leaf : ShieldCheck;
  
  let bgGradient = isEco 
    ? 'from-emerald-700 to-teal-800 text-white' 
    : 'from-blue-700 to-indigo-800 text-white';
  
  if (score < 60) {
    bgGradient = 'from-amber-600 to-red-600 text-white';
  }

  const label = isEco ? 'Eco Score' : 'Safety Score';

  return (
    <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
      <div className={`flex items-center justify-center rounded-md p-1 bg-gradient-to-br ${bgGradient}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex flex-col leading-none">
        {showLabel && (
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
        )}
        <span className="text-xs font-bold text-slate-800">{score}/100</span>
      </div>
    </div>
  );
};
