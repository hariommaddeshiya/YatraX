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
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-sand-300 shadow-xl px-1 pt-1.5 flex items-center justify-around"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      {links.map((link) => {
        const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
        const Icon = link.icon;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition-all min-w-[44px] ${
              active
                ? 'text-forest-800 font-bold bg-emerald-50'
                : link.highlight
                ? 'text-saffron-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl mb-0.5 transition-colors ${active ? 'bg-emerald-100 text-forest-800' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span>{link.name}</span>
          </Link>
        );
      })}

      {/* Emergency SOS */}
      <button
        onClick={onOpenSos}
        className="flex flex-col items-center justify-center py-1.5 px-2 text-[10px] font-bold text-red-600 active:scale-95 min-w-[44px]"
      >
        <div className="p-1.5 rounded-xl bg-red-50 text-red-600 mb-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <span>SOS</span>
      </button>
    </nav>
  );
};
