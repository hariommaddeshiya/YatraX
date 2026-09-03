import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import confetti from 'canvas-confetti';

export const AuthModal = () => {
  const { authModalOpen, authModalMode, closeAuthModal, setAuthModalMode, login, register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!authModalOpen) return null;

  const isRegister = authModalMode === 'register';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        if (!formData.username.trim()) {
          throw new Error('Please enter a username.');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await register(formData.username, formData.email, formData.password);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899']
        });
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md glass-card bg-white/95 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative ambient gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-saffron-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-forest-800 text-xs font-bold font-sora">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>YatraX Tourism Passport</span>
          </div>
          <h2 className="text-2xl font-bold font-sora text-forest-950">
            {isRegister ? 'Join Explore India' : 'Welcome Back, Explorer'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isRegister
              ? 'Track your visited Indian monuments, earn XP, and level up your traveler passport.'
              : 'Sign in to access your personal India exploration map and unlocked achievements.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-sand-100/90 p-1 rounded-2xl mb-6 border border-sand-300">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-sora font-bold rounded-xl transition-all ${
              !isRegister
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-sora font-bold rounded-xl transition-all ${
              isRegister
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2 animate-shake">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-sora font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-forest-700" />
                <span>Explorer Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. Hariom"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all shadow-inner"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-sora font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-forest-700" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. explorer@yatrx.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-sora font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-forest-700" />
              <span>Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all shadow-inner"
            />
            {isRegister && (
              <span className="text-[10px] text-slate-400">At least 6 characters</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-sora font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Explorer Passport' : 'Sign In to Explorer'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Note */}
        <div className="mt-6 pt-4 border-t border-sand-200 text-center">
          <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted with Passport.js & bcrypt hashing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
