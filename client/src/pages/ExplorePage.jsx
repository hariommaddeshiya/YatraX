import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Search, 
  Filter, 
  Leaf, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  TreePine,
  Layers,
  ArrowUpRight,
  Footprints,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { useTrip } from '../context/TripContext.jsx';
import { ScoreBadge } from '../components/common/ScoreBadge.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const ExplorePage = () => {
  const { destinations } = useTrip();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [onlyOffbeat, setOnlyOffbeat] = useState(searchParams.get('offbeat') === 'true');

  const regions = ['All', 'North', 'South', 'East', 'West', 'Northeast'];
  const categories = ['All', 'Heritage', 'Spiritual', 'Featured', 'Offbeat'];

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80';

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dest.culturalDescription?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
      const matchesCategory = selectedCategory === 'All' || dest.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesOffbeat = !onlyOffbeat || dest.isOffbeat;

      return matchesSearch && matchesRegion && matchesCategory && matchesOffbeat;
    });
  }, [destinations, searchQuery, selectedRegion, selectedCategory, onlyOffbeat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-forest-800 text-xs font-sora font-bold border border-emerald-500/20 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-forest-700" />
          <span>TOP 10 INDIAN HERITAGE & ECO-SANCTUARIES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 font-sora tracking-tight">
          Explore Certified Indian Sanctuaries
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Discover 500-year-old bio-engineered living root bridges, ancient monolithic rock caves, solar houseboats, and UNESCO heritage wonders.
        </p>
      </div>

      {/* Filter & Search Console */}
      <div className="glass-card rounded-4xl p-5 sm:p-6 shadow-glass border border-white/80 space-y-4">
        
        {/* Search Input Well */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by state, monument name, living root bridges, rock-cut caves, ghats..."
            className="w-full pl-11 pr-4 py-3 bg-white/90 border border-sand-300 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          {/* Regions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-sora font-bold text-slate-400 mr-1 uppercase">Region:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-white/70 text-slate-700 hover:bg-white border border-sand-300'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-sora font-bold text-slate-400 mr-1 uppercase">Type:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-white/70 text-slate-700 hover:bg-white border border-sand-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Offbeat Only Toggle */}
          <button
            onClick={() => setOnlyOffbeat(!onlyOffbeat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
              onlyOffbeat
                ? 'bg-terracotta-500 text-white shadow-xs'
                : 'bg-white/70 text-slate-700 hover:bg-white border border-sand-300'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Offbeat Only</span>
          </button>
        </div>

      </div>

      {/* Destinations Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="glass-card glass-card-hover rounded-4xl overflow-hidden border border-white/80 shadow-glass flex flex-col justify-between group"
          >
            <div className="relative h-60 overflow-hidden bg-slate-900">
              <img
                src={dest.image || FALLBACK_IMAGE}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-forest-950/90 text-emerald-300 font-mono font-bold px-2.5 py-1 rounded-full backdrop-blur-xs border border-emerald-500/30">
                  Eco Score {dest.ecoScore}
                </span>
                {dest.isOffbeat && (
                  <span className="text-[10px] bg-terracotta-600 text-white font-sora font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Offbeat
                  </span>
                )}
                <span className="text-[10px] bg-sand-200 text-slate-800 font-bold px-2.5 py-1 rounded-full font-mono">
                  {dest.region}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-sora font-bold text-lg leading-tight group-hover:text-saffron-200 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                  <span>{dest.state} • {dest.category || 'Sanctuary'}</span>
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {dest.culturalDescription}
                </p>

                {/* Tags */}
                {dest.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {dest.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-sand-100 text-slate-700 px-2 py-0.5 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: Launch 360 VR & Plan Trip */}
              <div className="pt-3 border-t border-sand-200 grid grid-cols-2 gap-2">
                <Link
                  to={`/heritage?site=${dest.id}`}
                  className="py-2.5 px-3 rounded-xl text-xs font-sora font-bold bg-sand-100 hover:bg-forest-800 hover:text-white text-forest-800 transition-all flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Footprints className="w-3.5 h-3.5 text-saffron-500" />
                  <span>360° VR View</span>
                </Link>

                <Link
                  to={`/planner?dest=${encodeURIComponent(dest.name)}`}
                  className="py-2.5 px-3 rounded-xl text-xs font-sora font-bold bg-forest-800 hover:bg-forest-900 text-white transition-all flex items-center justify-center gap-1 shadow-2xs"
                >
                  <span>Plan AI Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
