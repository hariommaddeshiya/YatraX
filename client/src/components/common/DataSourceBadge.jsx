import React from 'react';
import { Radio, CheckCircle, Cpu, Sparkles, Activity } from 'lucide-react';

export const DataSourceBadge = ({ type = 'LIVE API DATA', source, size = 'sm' }) => {
  const normalized = (type || '').toUpperCase();

  let colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let Icon = Radio;
  let label = 'Live API';

  if (normalized.includes('LIVE')) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse-gentle';
    Icon = Radio;
    label = 'Live API';
  } else if (normalized.includes('VERIFIED')) {
    colorClasses = 'bg-blue-50 text-blue-800 border-blue-300';
    Icon = CheckCircle;
    label = 'Verified Data';
  } else if (normalized.includes('CALCULATED')) {
    colorClasses = 'bg-purple-50 text-purple-800 border-purple-300';
    Icon = Cpu;
    label = 'Calculated Model';
  } else if (normalized.includes('PREDICTION') || normalized.includes('ESTIMATED')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    Icon = Sparkles;
    label = 'Estimated (AI)';
  } else if (normalized.includes('DEMO') || normalized.includes('DYNAMIC')) {
    colorClasses = 'bg-orange-50 text-orange-800 border-orange-300';
    Icon = Activity;
    label = 'Dynamic / Demo';
  }

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-1.5 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-xs ${sizeClasses} ${colorClasses}`} title={`Data Source: ${source || type}`}>
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
      {source && size !== 'xs' && (
        <span className="opacity-70 text-[10px] ml-0.5 font-normal">({source})</span>
      )}
    </span>
  );
};
