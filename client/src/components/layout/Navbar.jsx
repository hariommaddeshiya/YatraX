import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Radio, 
  Wifi, 
  WifiOff, 
  Menu, 
  X, 
  Landmark, 
  BarChart3, 
  FileCheck2,
  Home,
  Map,
  ChevronRight,
  ChevronDown,
  PhoneCall,
  Leaf,
  ArrowUpRight,
  Trophy,
  User,
  Crown,
  LogOut,
  Settings,
  Download,
  CheckCircle2,
  HardDriveDownload,
  Database,
  Trash2,
  Loader2
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useOffline } from '../../context/OfflineContext.jsx';
import { useTrip } from '../../context/TripContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Custom India Outline / Map Icon
const IndiaOutlineIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2.5L14.5 5L13 7.5L16.5 10L14 13L16 15.5L13.5 18L12 22L10.5 18L8 15.5L10 13L7.5 10L11 7.5L9.5 5Z" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const Navbar = ({ onOpenSos }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const { 
    isOnline, 
    isRealOnline,
    isOffline,
    toggleSimulatedOffline, 
    offlinePackages, 
    downloadDestination, 
    removeDestinationPackage, 
    isDestinationDownloaded, 
    downloadStatus, 
    downloadProgress, 
    downloadError 
  } = useOffline();
  const { activeTrip, destinations } = useTrip();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [offlineMenuOpen, setOfflineMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const offlineMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (offlineMenuRef.current && !offlineMenuRef.current.contains(e.target)) {
        setOfflineMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current active destination from route or context
  const getCurrentDestination = () => {
    const searchParams = new URLSearchParams(location.search);
    const siteParam = searchParams.get('site');
    const destParam = searchParams.get('dest');

    if (siteParam) {
      const match = (destinations || []).find(d => d.id === siteParam || d.name?.toLowerCase().includes(siteParam.toLowerCase()));
      if (match) return match;
      return { id: siteParam, name: siteParam.replace(/-/g, ' ').toUpperCase() };
    }
    if (destParam) {
      const match = (destinations || []).find(d => d.name?.toLowerCase().includes(destParam.toLowerCase()));
      if (match) return match;
      return { id: destParam.toLowerCase().replace(/\s+/g, '-'), name: destParam };
    }
    if (activeTrip?.destination) {
      const match = (destinations || []).find(d => 
        d.name?.toLowerCase().includes(activeTrip.destination.toLowerCase()) || 
        activeTrip.destination.toLowerCase().includes(d.name?.toLowerCase())
      );
      if (match) return { ...match, trip: activeTrip };
      return { id: 'active-trip', name: activeTrip.destination, trip: activeTrip };
    }
    return null;
  };

  const currentDest = getCurrentDestination();
  const isCurrentDownloaded = currentDest ? isDestinationDownloaded(currentDest.id || currentDest.name) : false;
  const currentPackage = currentDest 
    ? offlinePackages.find(p => p.destinationId === currentDest.id || p.destinationName.toLowerCase() === currentDest.name?.toLowerCase()) 
    : null;

  const menuSections = [
    {
      title: 'Gamified Exploration',
      links: [
        { name: '🇮🇳 Explore India', path: '/explore-india', icon: IndiaOutlineIcon, highlight: true, desc: 'Interactive map, state progress & XP badges' },
        { name: 'Home Showcase', path: '/', icon: Home, desc: 'Overview & cultural AI showcases' },
        { name: 'AI Multi-Modal Planner', path: '/planner', icon: Sparkles, desc: 'Vande Bharat, EV cabs, hotels & budget' },
        { name: 'My Active Trip', path: '/trip', icon: Map, desc: 'Live itinerary & adaptive cost tracker' },
        { name: 'Explore Destinations', path: '/explore', icon: Compass, desc: 'Catalog & offbeat Indian sanctuaries' }
      ]
    },
    {
      title: 'Personal & Profile',
      links: [
        { name: 'My Profile & Preferences', path: '/profile', icon: User, desc: 'Home city, travel style, emergency SOS contacts' }
      ]
    },
    {
      title: '360° Cultural Heritage',
      links: [
        { name: '360° Spherical Sanctuaries', path: '/heritage', icon: Landmark, desc: 'Top 10 sanctuaries with studio audio tours' }
      ]
    },
    {
      title: 'Safety & Transparency',
      links: [
        { name: 'Live Safety Radar', path: '/safety', icon: ShieldAlert, desc: 'Geofencing, risk radar & emergency SOS' },
        { name: 'Data Accuracy & Math', path: '/data-accuracy', icon: FileCheck2, desc: 'Verified data provenance & cost math' },
        { name: 'Govt Command Center', path: '/admin/dashboard', icon: BarChart3, desc: 'Tourism monitoring & rescue coordination' }
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            
            {/* Left: Menu Drawer Toggle + Modern Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              
              {/* Slide-out Menu Trigger */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center justify-center p-1.5 sm:px-3 sm:py-2 bg-white/80 hover:bg-forest-800 text-slate-800 hover:text-white border border-sand-300 hover:border-forest-700 rounded-xl sm:rounded-2xl text-xs font-bold transition-all shadow-2xs group active:scale-95 cursor-pointer shrink-0"
                title="Open Navigation Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 text-forest-800 group-hover:text-white transition-colors" />
                <span className="hidden md:inline font-sora ml-1.5">Menu</span>
              </button>

              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 flex items-center justify-center text-white shadow-glass group-hover:scale-105 transition-transform border border-emerald-500/30 shrink-0">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <div className="flex items-baseline overflow-visible py-0.5 select-none">
                  <span className="font-sora text-lg sm:text-2xl font-black tracking-tight text-forest-950">
                    Yatra
                  </span>
                  <span className="inline-block font-sora text-xl sm:text-3xl font-black italic tracking-normal bg-gradient-to-tr from-saffron-500 via-amber-400 to-emerald-400 bg-clip-text text-transparent pl-0.5 pr-2.5 pt-1.5 pb-0.5 leading-normal overflow-visible drop-shadow-xs">
                    X
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Sleek Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-sand-100/70 p-1.5 rounded-2xl border border-sand-300/80 shadow-inner">
              
              {/* 1. Explore India (Gamified Map) */}
              <Link
                to="/explore-india"
                className={`px-3.5 py-2 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
                  isActive('/explore-india')
                    ? 'bg-forest-800 text-white shadow-md shadow-forest-900/20'
                    : 'text-slate-700 hover:text-forest-900 hover:bg-white/60'
                }`}
              >
                <Compass className={`w-4 h-4 ${isActive('/explore-india') ? 'text-amber-300' : 'text-emerald-700'}`} />
                <span className="font-bold">Explore India</span>
              </Link>

              {/* 2. AI Planner */}
              <Link
                to="/planner"
                className={`px-3.5 py-2 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
                  isActive('/planner')
                    ? 'bg-forest-800 text-white shadow-md shadow-forest-900/20'
                    : 'text-slate-600 hover:text-forest-800 hover:bg-white/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Planner</span>
              </Link>

              {/* 3. 360° Heritage */}
              <Link
                to="/heritage"
                className={`px-3.5 py-2 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all ${
                  isActive('/heritage')
                    ? 'bg-white text-forest-900 shadow-sm border border-sand-200'
                    : 'text-slate-600 hover:text-forest-800 hover:bg-white/50'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 text-terracotta-500" />
                <span>360° Heritage</span>
              </Link>

              {/* 4. My Trip */}
              <Link
                to="/trip"
                className={`px-3.5 py-2 rounded-xl text-xs font-sora font-semibold transition-all ${
                  isActive('/trip')
                    ? 'bg-white text-forest-900 shadow-sm border border-sand-200'
                    : 'text-slate-600 hover:text-forest-800 hover:bg-white/50'
                }`}
              >
                My Trip
              </Link>

            </nav>

            {/* Right: User Profile / Get Started, Offline Toggle & SOS Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Explorer User Menu or Get Started Button */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white border border-sand-300 text-slate-800 text-xs font-sora font-bold shadow-2xs transition-all cursor-pointer group shrink-0"
                  >
                    <span className="text-sm">{user?.avatar || '🇮🇳'}</span>
                    <span className="hidden sm:inline text-forest-950 font-bold">{user?.username || user?.name || 'Explorer'}</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-mono px-1.5 py-0.2 rounded-md font-bold">
                      Lvl {user?.level || 1}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
                  </button>

                  {/* Dropdown Menu with Logout & Profile */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-forest-950 rounded-2xl sm:rounded-3xl shadow-2xl border border-sand-300 dark:border-white/10 p-2 z-50 animate-scaleUp text-xs space-y-1">
                      <div className="p-3 border-b border-sand-200 dark:border-white/10">
                        <p className="font-sora font-bold text-slate-900 dark:text-white truncate">
                          {user?.name || user?.username}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span>{(user?.xp || 0).toLocaleString('en-IN')} XP Points</span>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-sand-100 dark:hover:bg-white/10 font-sora font-semibold transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>My Profile & Preferences</span>
                      </Link>

                      <Link
                        to="/trip"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-sand-100 dark:hover:bg-white/10 font-sora font-semibold transition-colors"
                      >
                        <Map className="w-4 h-4 text-terracotta-500" />
                        <span>My Confirmed Trips</span>
                      </Link>

                      <Link
                        to="/explore-india"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-sand-100 dark:hover:bg-white/10 font-sora font-semibold transition-colors"
                      >
                        <Compass className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                        <span>Explore India Passport</span>
                      </Link>

                      <div className="border-t border-sand-200 dark:border-white/10 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-sora font-bold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span>Sign Out / Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-forest-800 hover:bg-forest-900 text-white border border-emerald-600/30 text-xs font-sora font-bold transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}

              {/* Download Offline Button & Popover */}
              <div className="relative" ref={offlineMenuRef}>
                <button
                  onClick={() => setOfflineMenuOpen(prev => !prev)}
                  className={`flex items-center gap-1 p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-sora font-bold transition-all shadow-2xs cursor-pointer border active:scale-95 shrink-0 ${
                    downloadStatus === 'DOWNLOADING'
                      ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                      : isOffline
                      ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/30'
                      : isCurrentDownloaded
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-white/80 hover:bg-forest-800 hover:text-white text-slate-700 border-sand-300 hover:border-forest-700 group'
                  }`}
                  title={isCurrentDownloaded ? 'Destination downloaded and available offline' : 'Download current destination for offline use'}
                >
                  {downloadStatus === 'DOWNLOADING' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-amber-700 animate-spin shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-mono">{downloadProgress}%</span>
                    </>
                  ) : downloadStatus === 'READY' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="hidden sm:inline text-[11px]">Ready ✓</span>
                    </>
                  ) : isOffline ? (
                    <>
                      <HardDriveDownload className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="hidden sm:inline text-[11px]">Offline</span>
                    </>
                  ) : isCurrentDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="hidden sm:inline text-[11px]">Saved ✓</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-forest-700 group-hover:text-white transition-colors shrink-0" />
                      <span className="hidden sm:inline text-[11px]">Offline</span>
                    </>
                  )}
                </button>

                {/* Dropdown / Popover for Offline Management */}
                {offlineMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-84 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-sand-300 p-3 sm:p-4 z-50 animate-scaleUp text-xs space-y-3">
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-sand-200">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-sora font-bold text-slate-900">PWA Offline Storage</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-sand-100 text-slate-600">
                        {offlinePackages.length} Saved
                      </span>
                    </div>

                    {/* Mobile Quick Offline Simulation Toggle */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-sand-50 border border-sand-200 sm:hidden">
                      <div className="flex items-center gap-1.5">
                        {isOnline ? (
                          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                        )}
                        <span className="text-[11px] font-sora font-semibold text-slate-700">
                          {isOnline ? 'Online Mode' : 'Offline Mode Active'}
                        </span>
                      </div>
                      <button
                        onClick={toggleSimulatedOffline}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                          isOnline
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {isOnline ? 'Test Offline' : 'Go Online'}
                      </button>
                    </div>

                    {/* Target Destination Section */}
                    {currentDest ? (
                      <div className="bg-sand-50 rounded-2xl p-3 border border-sand-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Active Sanctuary</span>
                          {isCurrentDownloaded ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Available Offline</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                              Not Downloaded
                            </span>
                          )}
                        </div>

                        <h5 className="font-sora font-bold text-slate-900 text-sm">{currentDest.name}</h5>

                        {isCurrentDownloaded && currentPackage ? (
                          <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                            <div className="flex items-start justify-between gap-2">
                              <span>Downloaded:</span>
                              <strong className="text-slate-800 font-medium text-right text-[10px]">
                                {currentPackage.components?.join(', ') || 'Places, Safety, Trip, 360'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Approx. Size:</span>
                              <strong className="text-slate-800 font-mono">~{currentPackage.approximateSizeKB || 52} KB</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Last Updated:</span>
                              <span className="text-slate-500 font-mono">
                                {new Date(currentPackage.downloadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            <div className="pt-2">
                              <button
                                onClick={async () => {
                                  await removeDestinationPackage(currentPackage.destinationId);
                                }}
                                className="w-full py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-sora font-bold text-[11px] flex items-center justify-center gap-1.5 border border-red-200 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                <span>Remove Offline Data</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1">
                            <button
                              disabled={downloadStatus === 'DOWNLOADING'}
                              onClick={async () => {
                                await downloadDestination(currentDest, { trip: activeTrip });
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-sora font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                            >
                              {downloadStatus === 'DOWNLOADING' ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Downloading package...</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5 text-amber-300" />
                                  <span>Download for Offline Use</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-sand-50 rounded-2xl p-3 border border-sand-200 text-slate-600 space-y-2">
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Open a destination or trip first to download it for offline use.
                        </p>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Quick Downloads</span>
                          <div className="grid grid-cols-1 gap-1">
                            {(destinations || []).slice(0, 3).map((d) => (
                              <button
                                key={d.id}
                                onClick={() => downloadDestination(d, { trip: activeTrip })}
                                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-sand-200 text-[11px] font-sora font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
                              >
                                <span className="truncate">{d.name}</span>
                                <Download className="w-3 h-3 text-forest-700 shrink-0 ml-1" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* List of previously downloaded destinations */}
                    {offlinePackages.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">All Saved Offline Sanctuaries</span>
                        <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                          {offlinePackages.map((pkg) => (
                            <div
                              key={pkg.destinationId}
                              className="flex items-center justify-between p-2 rounded-xl bg-sand-50 border border-sand-200 text-[11px]"
                            >
                              <div className="truncate pr-2">
                                <p className="font-sora font-bold text-slate-800 truncate">{pkg.destinationName}</p>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {new Date(pkg.downloadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <button
                                onClick={() => removeDestinationPackage(pkg.destinationId)}
                                className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors shrink-0"
                                title="Delete offline data"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Network Toggle Button (Online / Offline Mode) - Accessible on desktop navbar and inside offline popover on mobile */}
              <button
                onClick={toggleSimulatedOffline}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border text-xs font-medium transition-all shadow-2xs items-center gap-1 shrink-0 ${
                  isOnline 
                    ? 'bg-white/70 hover:bg-sand-100 text-slate-700 border-sand-300' 
                    : 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/30'
                }`}
                title={isOnline ? 'Active Online (Click to test Offline Mode)' : 'Simulated Offline Mode Active'}
                aria-label={isOnline ? 'Simulate Offline Mode' : 'Switch to Online Mode'}
              >
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                    <span className="hidden md:inline font-bold text-[10px]">OFFLINE</span>
                  </>
                )}
              </button>

              {/* Emergency SOS Button */}
              <button
                onClick={onOpenSos}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl sm:rounded-2xl text-xs font-sora font-bold shadow-md hover:shadow-lg transition-all active:scale-95 animate-pulse shrink-0"
                title="Emergency SOS & Incident Broadcast"
                aria-label="Emergency SOS"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white shrink-0" />
                <span>SOS</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Left Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn">
          
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-[#FDFBF7] shadow-2xl border-r border-sand-300 flex flex-col justify-between z-10 animate-slideRight">
            
            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b border-sand-200 flex items-center justify-between bg-white/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-sora font-black text-base text-forest-950 flex items-center gap-0.5">
                      Yatra<span className="italic text-emerald-600">X</span> Explorer
                    </h3>
                    <p className="text-[10px] text-slate-500">Sustainable Travel & 360° Heritage</p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-sand-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-190px)]">
                {menuSections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-[11px] font-sora font-bold text-slate-400 uppercase tracking-wider px-2">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.links.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setDrawerOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all ${
                              active
                                ? 'bg-forest-800 text-white shadow-sm'
                                : 'hover:bg-sand-200/70 text-slate-800'
                            }`}
                          >
                            <div className={`p-2 rounded-xl mt-0.5 ${
                              active ? 'bg-white/10 text-white' : 'bg-white text-forest-800 border border-sand-200 shadow-2xs'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-sora font-bold text-xs">{link.name}</span>
                                {link.highlight && (
                                  <span className="text-[9px] bg-saffron-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] line-clamp-1 mt-0.5 ${
                                active ? 'text-white/80' : 'text-slate-500'
                              }`}>
                                {link.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer with Logout / Get Started */}
            <div className="p-4 border-t border-sand-200 bg-white/80 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-sora font-bold text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of YatraX</span>
                </button>
              ) : (
                <button
                  onClick={() => { setDrawerOpen(false); openAuthModal('login'); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-sora font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Get Started / Sign In</span>
                </button>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>National Helpline</span>
                <strong className="text-forest-900 font-bold">1363</strong>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
