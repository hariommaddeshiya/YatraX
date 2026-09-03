import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Map, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

export const BottomNav = ({ onOpenSos }) => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'India Map', path: '/explore-india', icon: Compass, highlight: true },
    { name: 'AI Plan', path: '/planner', icon: Sparkles },
    { name: 'My Trip', path: '/trip', icon: Map },
    { name: 'Safety', path: '/safety', icon: ShieldAlert }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand-300 shadow-lg px-2 py-1.5 flex items-center justify-around">
      {links.map((link) => {
        const active = location.pathname === link.path;
        const Icon = link.icon;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              active
                ? 'text-terracotta-700 font-bold'
                : link.highlight
                ? 'text-saffron-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full ${active ? 'bg-terracotta-100 text-terracotta-700' : ''}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span>{link.name}</span>
          </Link>
        );
      })}

      {/* Floating Emergency SOS Button on Mobile */}
      <button
        onClick={onOpenSos}
        className="flex flex-col items-center justify-center py-1 px-2 text-[10px] font-bold text-red-600 active:scale-95"
      >
        <div className="p-1 rounded-full bg-red-100 text-red-600 animate-pulse">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <span>SOS</span>
      </button>
    </nav>
  );
};
