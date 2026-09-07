import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Landmark, 
  Sparkles, 
  Compass, 
  MapPin, 
  Volume2, 
  Layers, 
  Award, 
  ArrowRight, 
  Eye, 
  Search, 
  Filter, 
  Footprints,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import api from '../utils/api.js';
import { PanoramaViewer } from '../components/heritage/PanoramaViewer.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';
import { 
  getAll360Destinations, 
  get360DestinationById, 
  TOP_10_CURATED_SANCTUARIES 
} from '../utils/heritageCatalog.js';

export const HeritagePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSiteId = searchParams.get('site');

  const allDestinations = useMemo(() => getAll360Destinations(), []);

  const [selectedSite, setSelectedSite] = useState(() => {
    return get360DestinationById(requestedSiteId);
  });

  const [viewScope, setViewScope] = useState(() => {
    if (requestedSiteId && !TOP_10_CURATED_SANCTUARIES.some(s => s.id === requestedSiteId)) {
      return 'ALL';
    }
    return 'TOP10';
  });

  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const regions = [
    { id: 'ALL', name: 'All India' },
    { id: 'North', name: 'North India' },
    { id: 'South', name: 'South India' },
    { id: 'East', name: 'East India' },
    { id: 'West', name: 'West India' },
    { id: 'Northeast', name: 'Northeast' }
  ];

  const categories = ['ALL', 'Heritage', 'Spiritual', 'Nature', 'Culture', 'Offbeat'];

  // Handle URL query parameter changes
  useEffect(() => {
    if (requestedSiteId) {
      const matched = get360DestinationById(requestedSiteId);
      if (matched) {
        setSelectedSite(matched);
        if (!TOP_10_CURATED_SANCTUARIES.some(s => s.id === matched.id)) {
          setViewScope('ALL');
        }
      }
    }
  }, [requestedSiteId]);

  // Try fetching any dynamic updates from backend, otherwise use cached catalog
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await api.get('/heritage');
        if (res.success && res.sites?.length > 0 && requestedSiteId) {
          const matched = res.sites.find(s => s.id === requestedSiteId || s.name.toLowerCase().includes(requestedSiteId.toLowerCase()));
          if (matched) setSelectedSite(matched);
        }
      } catch (err) {
        // Master catalog handles all destinations offline and online
      }
    };

    fetchSites();
  }, [requestedSiteId]);

  const filteredSites = useMemo(() => {
    const baseList = viewScope === 'TOP10' ? TOP_10_CURATED_SANCTUARIES : allDestinations;

    return baseList.filter(site => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        site.name.toLowerCase().includes(q) ||
        (site.location && site.location.toLowerCase().includes(q)) ||
        (site.state && site.state.toLowerCase().includes(q)) ||
        (site.historicalSummary && site.historicalSummary.toLowerCase().includes(q));
      
      if (!matchesSearch) return false;

      // Region Filter
      if (selectedRegion !== 'ALL') {
        if (selectedRegion === 'North') {
          if (!['Uttar Pradesh', 'Punjab', 'Uttarakhand', 'Jammu & Kashmir', 'Delhi', 'Ladakh', 'Himachal Pradesh', 'Haryana', 'Chandigarh'].includes(site.state)) return false;
        } else if (selectedRegion === 'South') {
          if (!['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry', 'Lakshadweep'].includes(site.state)) return false;
        } else if (selectedRegion === 'East') {
          if (!['Odisha', 'West Bengal', 'Bihar', 'Jharkhand', 'Andaman and Nicobar Islands'].includes(site.state)) return false;
        } else if (selectedRegion === 'West') {
          if (!['Maharashtra', 'Rajasthan', 'Goa', 'Gujarat', 'Dadra and Nagar Haveli and Daman and Diu'].includes(site.state)) return false;
        } else if (selectedRegion === 'Northeast') {
          if (!['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Sikkim', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'].includes(site.state)) return false;
        }
      }

      // Category Filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'Offbeat') {
          if (!site.isOffbeat) return false;
        } else if (site.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [viewScope, allDestinations, searchQuery, selectedRegion, selectedCategory]);

  const handleSelectSite = (site) => {
    setSelectedSite(site);
    setSearchParams({ site: site.id });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-saffron-100 text-saffron-900 px-3.5 py-1 rounded-full text-xs font-bold font-cinzel border border-saffron-300 shadow-xs">
          <Landmark className="w-3.5 h-3.5 text-saffron-700" />
          <span>YATRAX 360° SPHERICAL VIRTUAL REALITY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sora tracking-tight">
          Indian Sanctuaries in 360° VR
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Interactive ground walkaround virtual reality, studio audio narration, and Archaeological Survey of India historical provenance for all 292 destinations across India.
        </p>
      </div>

      {/* Quick Jump Destination Dropdown */}
      <div className="max-w-2xl mx-auto flex items-center gap-3 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-sand-300 shadow-sm">
        <Compass className="w-5 h-5 text-forest-700 shrink-0 ml-2" />
        <span className="text-xs font-sora font-bold text-slate-700 shrink-0 hidden sm:inline">
          Jump to 360° Destination:
        </span>
        <select
          value={selectedSite?.id || ''}
          onChange={(e) => {
            const target = allDestinations.find(s => s.id === e.target.value);
            if (target) handleSelectSite(target);
          }}
          aria-label="Jump to 360° Destination"
          className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-xs font-sora font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 cursor-pointer"
        >
          <optgroup label="🌟 Featured Top 10 Wonders">
            {TOP_10_CURATED_SANCTUARIES.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.state})
              </option>
            ))}
          </optgroup>
          <optgroup label="🏛 All Indian Destinations (36 States & UTs)">
            {allDestinations.filter(d => !TOP_10_CURATED_SANCTUARIES.some(top => top.id === d.id)).map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.state})
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* 360 Panorama Viewer */}
      {selectedSite && (
        <div className="space-y-4">
          <PanoramaViewer site={selectedSite} />
          
          {/* Active Site Deep-Dive Card */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-warm border border-sand-300 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-terracotta-100 text-terracotta-800 font-bold px-2 py-0.5 rounded font-mono">
                  {selectedSite.era}
                </span>
                {selectedSite.unescoHeritage && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    UNESCO World Heritage
                  </span>
                )}
                <span className="text-[10px] bg-sand-200 text-slate-700 font-bold px-2 py-0.5 rounded font-mono">
                  {selectedSite.state} • {selectedSite.region || 'India'}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded font-mono">
                  Category: {selectedSite.category || 'Heritage'}
                </span>
              </div>
              
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {selectedSite.name} ({selectedSite.location}, {selectedSite.state})
              </h2>
              
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedSite.historicalSummary}
              </p>
              
              <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-xs text-slate-800 space-y-1">
                <strong>Architectural Style & Cultural Provenance:</strong>
                <p className="text-slate-600 text-[11px]">
                  {selectedSite.culturalImportance} ({selectedSite.architectureStyle})
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-sand-100 p-5 rounded-3xl border border-sand-200 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Sanctuary Intelligence
                </span>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">State:</span>
                    <strong className="text-slate-900">{selectedSite.state}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Protection:</span>
                    <strong className="text-emerald-700 font-medium">ASI & State Protected Monument</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Audio Guide:</span>
                    <strong className="text-amber-800 font-mono">Studio Narration Active</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Viewpoints:</span>
                    <strong className="text-forest-700 font-mono">
                      {(selectedSite.walkaroundNodes?.length || 2)} 360° Vantage Points
                    </strong>
                  </div>
                </div>
              </div>

              <Link
                to={`/planner?dest=${encodeURIComponent(selectedSite.name.split('&')[0].trim())}`}
                className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl text-xs font-sora font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
              >
                <span>Plan Journey to {selectedSite.name.split('&')[0].trim()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sanctuary Filter & Gallery Grid */}
      <div className="space-y-6">
        
        {/* Scope Tabs (Top 10 vs All 292 Destinations) */}
        <div className="flex items-center gap-2 border-b border-sand-300 pb-3">
          <button
            onClick={() => setViewScope('TOP10')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition-all cursor-pointer ${
              viewScope === 'TOP10'
                ? 'bg-forest-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-sand-100 border border-sand-300'
            }`}
          >
            🌟 Top 10 Curated Sanctuaries
          </button>

          <button
            onClick={() => setViewScope('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition-all cursor-pointer ${
              viewScope === 'ALL'
                ? 'bg-forest-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-sand-100 border border-sand-300'
            }`}
          >
            🏛 All Indian Destinations ({allDestinations.length})
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold transition-all cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-sand-100 border border-sand-300'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search monuments, temples, states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-xs"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-sora font-bold text-slate-400 uppercase mr-1">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-sora font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-sand-200'
              }`}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 font-mono ml-auto">
            Showing {filteredSites.length} of {viewScope === 'TOP10' ? TOP_10_CURATED_SANCTUARIES.length : allDestinations.length}
          </span>
        </div>

        {/* Sanctuary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSites.map((site) => {
            const isSelected = selectedSite?.id === site.id;
            return (
              <div
                key={site.id}
                onClick={() => handleSelectSite(site)}
                className={`group bg-white rounded-3xl overflow-hidden border transition-all cursor-pointer shadow-warm flex flex-col ${
                  isSelected 
                    ? 'border-forest-600 ring-3 ring-forest-600/20 shadow-xl' 
                    : 'border-sand-300 hover:border-forest-400 hover:shadow-lg'
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-forest-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
                      {site.region || 'India'}
                    </span>
                    {site.unescoHeritage && (
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                        UNESCO
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-serif font-bold text-sm leading-tight text-white drop-shadow-md">
                      {site.name}
                    </h4>
                    <span className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-saffron-400 shrink-0" />
                      <span>{site.location}, {site.state}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {site.historicalSummary}
                  </p>

                  <div className="pt-2 border-t border-sand-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-terracotta-800 font-bold">
                      {site.category || 'Heritage'}
                    </span>
                    <span className="font-sora font-bold text-forest-700 group-hover:text-forest-900 flex items-center gap-1 text-[11px]">
                      <span>Enter 360° VR</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-sand-300 p-8 space-y-3">
            <Compass className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
            <p className="text-sm font-sora font-bold text-slate-700">
              No destinations match your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('ALL');
                setSelectedCategory('ALL');
                setViewScope('ALL');
              }}
              className="px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-sora font-bold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
