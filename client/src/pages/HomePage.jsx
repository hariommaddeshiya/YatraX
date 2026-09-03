import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Landmark, 
  Utensils, 
  Award, 
  HeartHandshake, 
  Train, 
  Car, 
  Plane, 
  Home, 
  CheckCircle2, 
  TrendingDown, 
  Activity, 
  Layers, 
  Zap, 
  Globe2, 
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Footprints
} from 'lucide-react';
import { useTrip } from '../context/TripContext.jsx';
import { ScoreBadge } from '../components/common/ScoreBadge.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';
import { DangerZoneMap } from '../components/home/DangerZoneMap.jsx';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('dest');
  
  const { destinations } = useTrip();
  const [quickOrigin, setQuickOrigin] = useState('Delhi');
  const [quickDestination, setQuickDestination] = useState(destParam || '');

  // Handle auto-scrolling if there is a hash
  useEffect(() => {
    if (window.location.hash === '#danger-map') {
      setTimeout(() => {
        const el = document.getElementById('danger-map');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);
  const [quickTransport, setQuickTransport] = useState('Train');

  const offbeatGems = [
    { id: 'meghalaya', name: 'Mawlynnong & Living Roots', state: 'Meghalaya', ecoScore: 98, highlight: 'Asia’s Cleanest Eco-Village with 500-yr Bio-Engineered Living Root Bridges', tag: 'Eco Pioneer', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },
    { id: 'varanasi', name: 'Varanasi Sacred Ghats', state: 'Uttar Pradesh', ecoScore: 92, highlight: 'Ancient Vedic Chanting, Dawn Solar Boats & 84 Historic Stone Ghats', tag: 'Spiritual Heart', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80' },
    { id: 'hampi', name: 'Hampi Vijayanagara', state: 'Karnataka', ecoScore: 95, highlight: 'Monolithic Stone Chariots, 56 Musical Granite Pillars & Coracle Boats', tag: 'UNESCO Legend', image: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=800&q=80' },
    { id: 'kerala', name: 'Alleppey & Vembanad Lake', state: 'Kerala', ecoScore: 96, highlight: 'Solar Wooden Houseboats, Palm Canals & Below-Sea-Level Eco-Farms', tag: 'God’s Own Country', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleQuickPlan = (e) => {
    e.preventDefault();
    navigate(`/planner?origin=${encodeURIComponent(quickOrigin)}&dest=${encodeURIComponent(quickDestination)}&transport=${encodeURIComponent(quickTransport)}`);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-eco-mesh">
      
      {/* -------------------------------------------------------------
          1. COMPACT ABOVE-THE-FOLD HERO SECTION WITH SEARCH CONSOLE
         ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="glass-card rounded-5xl p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-white/80 shadow-glass space-y-6">
          
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Headline & Quick Intro (Compact and visible on first view) */}
          <div className="max-w-4xl space-y-2 relative z-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 font-sora leading-tight tracking-tight">
              Explore India with{' '}
              <span className="inline-flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-forest-800 via-emerald-600 to-terracotta-500">
                Yatra<span className="italic font-black text-amber-500">X</span>&nbsp;&nbsp;Multi-Modal AI
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Multi-modal routes, transparent budgets, live weather & crowd alerts, and Top 10 interactive 360° virtual reality sanctuaries across India.
            </p>
          </div>

          {/* Full-Width Interactive Quick Search Console (Immediately Above the Fold) */}
          <form onSubmit={handleQuickPlan} className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-4xl border border-sand-300 shadow-md space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Origin Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-sora font-bold text-slate-700 block px-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest-700" />
                  <span>From (Origin City)</span>
                </label>
                <input
                  type="text"
                  value={quickOrigin}
                  onChange={(e) => setQuickOrigin(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Kolkata, Bengaluru"
                  className="w-full px-4 py-3 bg-sand-50 rounded-2xl text-xs font-semibold text-slate-800 border border-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-2xs"
                  required
                />
              </div>

              {/* Destination Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-sora font-bold text-slate-700 block px-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-forest-700" />
                  <span>To (Top 10 Sanctuaries)</span>
                </label>
                <select
                  value={quickDestination}
                  onChange={(e) => setQuickDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-sand-50 rounded-2xl text-xs font-semibold text-slate-800 border border-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-2xs cursor-pointer"
                  required
                >
                  <option value="" disabled>Select a destination...</option>
                  <option value="Taj Mahal">1. Taj Mahal (Agra, Uttar Pradesh)</option>
                  <option value="Varanasi">2. Varanasi (Ghats & Kashi Vishwanath)</option>
                  <option value="Hampi">3. Hampi (Vijayanagara Granite Ruins)</option>
                  <option value="Golden Temple">4. Golden Temple (Amritsar, Punjab)</option>
                  <option value="Konark">5. Konark Sun Temple (Puri, Odisha)</option>
                  <option value="Meenakshi Amman">6. Meenakshi Amman Temple (Madurai)</option>
                  <option value="Jaisalmer">7. Jaisalmer (Living Golden Fort)</option>
                  <option value="Alleppey">8. Alleppey (Kerala Backwaters)</option>
                  <option value="Ajanta & Ellora">9. Ajanta & Ellora (Kailash Monolith)</option>
                  <option value="Meghalaya">10. Meghalaya (Nongriat Living Roots)</option>
                </select>
              </div>

              {/* Travel Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-sora font-bold text-slate-700 block px-1 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-forest-700" />
                  <span>Travel Style</span>
                </label>
                <select
                  className="w-full px-4 py-3 bg-sand-50 rounded-2xl text-xs font-semibold text-slate-800 border border-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-2xs cursor-pointer"
                >
                  <option>Eco-Friendly & Homestays</option>
                  <option>Cultural & Heritage</option>
                  <option>Spiritual Pilgrimage</option>
                  <option>Adventure & Nature</option>
                </select>
              </div>

              {/* Multi-Modal Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-sora font-bold text-slate-700 block px-1 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-forest-700" />
                  <span>Primary Transit Mode</span>
                </label>
                <select
                  value={quickTransport}
                  onChange={(e) => setQuickTransport(e.target.value)}
                  className="w-full px-4 py-3 bg-sand-50 rounded-2xl text-xs font-semibold text-slate-800 border border-sand-200 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-2xs cursor-pointer"
                >
                  <option value="Train">Vande Bharat / Express Train</option>
                  <option value="Flight">Flight + Regional Hybrid</option>
                  <option value="Road">Eco Road Transit / EV</option>
                </select>
              </div>

            </div>

            {/* Launch Button & Secondary Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-sand-200">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Real-time weather, crowd & dynamic carbon calculation ready</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/heritage"
                  className="px-5 py-3 rounded-2xl text-xs font-sora font-bold bg-sand-100 hover:bg-sand-200 text-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Footprints className="w-4 h-4 text-forest-800" />
                  <span>360° VR Portal (Top 10)</span>
                </Link>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs font-sora font-bold bg-forest-800 hover:bg-forest-900 text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-saffron-300" />
                  <span>Launch AI Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

        </div>
      </section>

      {/* -------------------------------------------------------------
          2. DANGER ZONE MAP
         ------------------------------------------------------------- */}
      <section id="danger-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DangerZoneMap destinationQuery={quickDestination} />
      </section>

      {/* -------------------------------------------------------------
          3. FEATURED DESTINATIONS PREVIEW
         ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 font-sora">
              Curated Indian Sanctuaries
            </h2>
            <p className="text-xs text-slate-600">
              Explore Top 10 sustainable and cultural hubs verified by YatraX intelligence.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-sora font-bold text-forest-800 hover:text-forest-950 transition-colors"
          >
            <span>Explore All 10 Sanctuaries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offbeatGems.map((gem) => (
            <div
              key={gem.id}
              onClick={() => navigate(`/planner?dest=${encodeURIComponent(gem.name)}`)}
              className="glass-card glass-card-hover rounded-4xl overflow-hidden border border-white/80 shadow-glass cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={gem.image}
                  alt={gem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold bg-forest-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Eco Score {gem.ecoScore}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-sora font-bold text-sm">{gem.name}</h4>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-terracotta-400" />
                    <span>{gem.state}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {gem.highlight}
                </p>

                <div className="pt-2 border-t border-sand-200 flex items-center justify-between text-xs font-sora font-bold text-forest-800">
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
