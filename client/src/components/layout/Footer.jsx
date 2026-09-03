import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Footprints, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-white/10 mt-16 text-xs font-sora">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-forest-800 border border-emerald-500/30 flex items-center justify-center text-white font-bold">
            <Compass className="w-4 h-4 text-saffron-400" />
          </div>
          <div>
            <div className="flex items-center gap-0.5 leading-none">
              <span className="text-white font-black text-base tracking-tight">
                Yatra
              </span>
              <span className="font-black italic text-lg bg-gradient-to-tr from-saffron-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent transform -skew-x-6">
                X
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
              Multi-Modal Travel & 360° Sacred Sanctuaries
            </span>
          </div>
        </div>

        {/* Minimalist Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs font-semibold text-slate-300">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/planner" className="hover:text-emerald-400 transition-colors">AI Planner</Link>
          <Link to="/heritage" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5 text-saffron-400" />
            <span>360° VR (Top 10)</span>
          </Link>
          <Link to="/explore" className="hover:text-emerald-400 transition-colors">Explore Sanctuaries</Link>
          <Link to="/safety" className="hover:text-emerald-400 transition-colors">Safety Radar</Link>
          <Link to="/data-accuracy" className="hover:text-emerald-400 transition-colors">Data Math</Link>
        </div>

        {/* Helpline & Copyright */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <span>Tourist Helpline: <strong className="text-white">1363</strong></span>
          <span className="text-slate-600">•</span>
          <span>© 2026 YatraX</span>
        </div>

      </div>
    </footer>
  );
};
