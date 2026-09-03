import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Crown, 
  Calendar, 
  ArrowRight,
  Trophy,
  Leaf,
  Utensils,
  Map,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    homeCity: 'New Delhi',
    travelStyle: 'Eco-Conscious',
    dietaryPreference: 'Vegetarian',
    emergencyContact: {
      name: '',
      phone: '',
      relation: 'Family'
    }
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        homeCity: user.homeCity || 'New Delhi',
        travelStyle: user.travelStyle || 'Eco-Conscious',
        dietaryPreference: user.dietaryPreference || 'Vegetarian',
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || '',
          relation: user.emergencyContact?.relation || 'Family'
        }
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold font-sora text-slate-900">
          Explorer Account & Preferences
        </h2>
        <p className="text-sm font-medium text-slate-700 max-w-md mx-auto">
          Please sign in to access your personal travel passport, configure your home city, emergency contacts, and view your confirmed trips.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-forest-800 hover:bg-forest-900 text-white rounded-2xl text-xs font-sora font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          Get Started / Sign In
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency_')) {
      const field = name.replace('emergency_', '');
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateProfile(formData);
      setSuccessMsg('Profile and travel preferences saved successfully!');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalXP = user?.xp || 0;
  const level = user?.level || 1;
  const savedTrips = user?.savedTrips || [];
  const achievements = user?.achievements || [];
  const exploredDestinations = user?.exploredDestinations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* 1. Profile Hero Card */}
      <div className="bg-[#051F1C] text-white rounded-4xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-emerald-300 shrink-0 font-bold">
            {user?.avatar || '🇮🇳'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-sora text-white drop-shadow-sm">
                {user?.name || user?.username || 'Explorer'}
              </h1>
              <span className="text-xs bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                Level {level}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 font-mono">
              {user?.email} • Verified Bharat Voyager
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-300 pt-1 font-bold">
              <span>🏆 {totalXP.toLocaleString('en-IN')} Total Verified XP</span>
              <span className="text-emerald-500">•</span>
              <span>📍 {exploredDestinations.length} Sanctuaries Explored</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Explore India & Logout */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/explore-india"
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sora font-extrabold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>View India Map Progress</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white border border-red-400/60 text-xs font-sora font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

      {/* 2. Main Profile Layout: Form + Confirmed Trips & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personal Preferences & Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card bg-white dark:bg-[#0A1918] rounded-4xl p-6 sm:p-8 border border-sand-300 dark:border-emerald-500/20 shadow-glass space-y-6">
            
            <div className="border-b border-sand-200 dark:border-white/10 pb-4">
              <h3 className="text-lg sm:text-xl font-extrabold font-sora text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Traveler Profile & Travel Settings</span>
              </h3>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                These preferences automatically configure smart routes, default origin cities, and SOS contacts.
              </p>
            </div>

            {/* Notifications */}
            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-sora font-bold text-slate-900 dark:text-slate-100 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Hariom Sharma"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sora font-bold text-slate-900 dark:text-slate-100 block">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Hariom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-sora font-bold text-slate-900 dark:text-slate-100 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sora font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                    <span>Home Origin City</span>
                  </label>
                  <input
                    type="text"
                    name="homeCity"
                    value={formData.homeCity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-sora font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preferred Travel Style</span>
                  </label>
                  <select
                    name="travelStyle"
                    value={formData.travelStyle}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Eco-Conscious">🌿 Eco-Conscious & Sustainable</option>
                    <option value="Cultural Heritage">🏛️ Cultural & Ancient Heritage</option>
                    <option value="Mountain Adventure">🏔️ Mountain Treks & Adventure</option>
                    <option value="Budget Voyager">💰 Budget Voyager</option>
                    <option value="Luxury Wellness">✨ Luxury & Wellness Retreat</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-sora font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dietary Preference</span>
                  </label>
                  <select
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Vegetarian">Pure Vegetarian</option>
                    <option value="Jain">Jain Friendly</option>
                    <option value="Vegan">Plant-Based / Vegan</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact Sub-Section */}
              <div className="pt-3 border-t border-sand-200 dark:border-white/10 space-y-3">
                <h4 className="font-sora font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Emergency SOS Broadcast Contact</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-sora font-bold text-slate-800 dark:text-slate-200">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergency_name"
                      value={formData.emergencyContact.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      placeholder="e.g. Ramesh Sharma"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sora font-bold text-slate-800 dark:text-slate-200">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      placeholder="+91 9988776655"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full mt-4 py-3 px-6 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-sora font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile & Settings'}</span>
              </button>

            </form>

          </div>
        </div>

        {/* Right Column: Confirmed Trips & Badges */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Confirmed Trips Card */}
          <div className="glass-card bg-white dark:bg-[#0A1918] rounded-4xl p-6 sm:p-7 border border-sand-300 dark:border-emerald-500/20 shadow-glass space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 dark:border-white/10 pb-3">
              <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Map className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                <span>My Confirmed Trips ({savedTrips.length})</span>
              </h3>
              <Link to="/trip" className="text-xs font-sora font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View Active
              </Link>
            </div>

            {savedTrips.length > 0 ? (
              <div className="space-y-3">
                {savedTrips.map((st, idx) => (
                  <div
                    key={st.tripId || idx}
                    className="p-3.5 rounded-2xl border border-sand-200 dark:border-white/10 bg-sand-50/70 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-sora font-bold text-slate-900 dark:text-white text-sm">
                          {st.origin} ➔ {st.destination}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
                        <span>📅 {st.totalDays || 5} Days</span>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">₹{st.totalCostInr?.toLocaleString('en-IN') || '0'}</span>
                      </div>
                    </div>

                    <Link
                      to="/trip"
                      className="px-3 py-1.5 rounded-xl bg-forest-800 text-white font-sora font-bold text-[11px] flex items-center gap-1 hover:bg-forest-900 shadow-xs"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center space-y-2 rounded-2xl bg-sand-50/60 dark:bg-white/5 border border-dashed border-sand-300 dark:border-white/10">
                <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">No confirmed trips saved yet.</p>
                <Link
                  to="/planner"
                  className="inline-block px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-sora font-bold mt-1 shadow-xs"
                >
                  Plan & Confirm Trip →
                </Link>
              </div>
            )}
          </div>

          {/* Unlocked Badges & Achievements */}
          <div className="glass-card bg-white dark:bg-[#0A1918] rounded-4xl p-6 sm:p-7 border border-sand-300 dark:border-emerald-500/20 shadow-glass space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 dark:border-white/10 pb-3">
              <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Unlocked Badges ({achievements.length})</span>
              </h3>
              <Link to="/explore-india" className="text-xs font-sora font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                All Badges
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.achievementId || ach.id}
                  className="p-3 rounded-2xl bg-gradient-to-br from-amber-50/80 to-sand-50 dark:from-white/5 dark:to-emerald-950/20 border border-amber-300/40 dark:border-white/10 flex items-center gap-2.5"
                >
                  <span className="text-xl">{ach.icon || '🏅'}</span>
                  <div className="space-y-0.5 min-w-0">
                    <h5 className="font-sora font-bold text-[11px] text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </h5>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold block">
                      +{ach.xpBonus || 100} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
