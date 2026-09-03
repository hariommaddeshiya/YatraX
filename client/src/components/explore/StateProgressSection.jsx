import React, { useState, useMemo } from 'react';
import { StateCard } from './StateCard.jsx';
import { Search, Filter, Layers, CheckCircle2, Compass, Sparkles } from 'lucide-react';

export const StateProgressSection = ({ states = [], onSelectState }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'

  const filteredStates = useMemo(() => {
    return states.filter((state) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        state.name.toLowerCase().includes(query) ||
        state.code.toLowerCase().includes(query) ||
        state.capital?.toLowerCase().includes(query) ||
        state.region?.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Status filter match
      if (filterMode === 'COMPLETED') {
        return state.isCompleted || state.percentage >= 100;
      }
      if (filterMode === 'IN_PROGRESS') {
        return state.percentage > 0 && state.percentage < 100 && !state.isCompleted;
      }
      if (filterMode === 'NOT_STARTED') {
        return !state.percentage || state.percentage === 0;
      }
      return true;
    });
  }, [states, searchQuery, filterMode]);

  const counts = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    states.forEach(s => {
      if (s.isCompleted || s.percentage >= 100) completed++;
      else if (s.percentage > 0) inProgress++;
      else notStarted++;
    });

    return { total: states.length, completed, inProgress, notStarted };
  }, [states]);

  return (
    <section className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-emerald-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full uppercase font-mono">
              State Mastery Catalog
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sora text-slate-900 dark:text-white mt-1">
            🇮🇳 State Exploration Progress
          </h2>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Track individual progress across 28 States & 8 Union Territories of India.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state or capital..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-sand-300 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterMode('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-semibold transition-all ${
            filterMode === 'ALL'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-sand-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-sand-200'
          }`}
        >
          All States ({counts.total})
        </button>

        <button
          onClick={() => setFilterMode('IN_PROGRESS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
            filterMode === 'IN_PROGRESS'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'bg-sand-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-sand-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span>In Progress ({counts.inProgress})</span>
        </button>

        <button
          onClick={() => setFilterMode('COMPLETED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
            filterMode === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-sand-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-sand-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Completed ✓ ({counts.completed})</span>
        </button>

        <button
          onClick={() => setFilterMode('NOT_STARTED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
            filterMode === 'NOT_STARTED'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-sand-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-sand-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>Not Started ({counts.notStarted})</span>
        </button>
      </div>

      {/* Grid of State Cards */}
      {filteredStates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStates.map((state) => (
            <StateCard
              key={state.id}
              state={state}
              onClick={() => onSelectState && onSelectState(state)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-3xl border border-sand-200 dark:border-white/10 space-y-3">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-sora font-bold text-slate-700 dark:text-slate-200">
            No States Match Filter
          </h4>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or selecting a different status filter tab.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setFilterMode('ALL'); }}
            className="px-4 py-1.5 rounded-xl bg-forest-800 text-white text-xs font-sora font-bold mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
};
