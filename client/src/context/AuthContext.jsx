import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('safarai_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('safarai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Configure global Axios authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('safarai_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('safarai_token');
      localStorage.removeItem('safarai_user');
    }
  }, [token]);

  // Sync / Verify Current User on Boot
  const fetchCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    // If offline, preserve cached user from localStorage
    if (!navigator.onLine) {
      const cached = localStorage.getItem('safarai_user');
      if (cached) {
        try { setUser(JSON.parse(cached)); } catch(e) {}
      }
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/auth/me`);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('safarai_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      // Only clear token if server explicitly rejected with 401 or 403
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.warn('Auth token rejected by server:', err.message);
        setToken(null);
        setUser(null);
      } else {
        // Network error or offline: keep user logged in with local profile
        console.log('[Auth] Preserving user profile in offline mode');
        const cached = localStorage.getItem('safarai_user');
        if (cached) {
          try { setUser(JSON.parse(cached)); } catch(e) {}
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('safarai_token', res.data.token);
      localStorage.setItem('safarai_user', JSON.stringify(res.data.user));
      setAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler
  const register = async (username, email, password) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { username, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('safarai_token', res.data.token);
      localStorage.setItem('safarai_user', JSON.stringify(res.data.user));
      setAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('safarai_token');
    localStorage.removeItem('safarai_user');
  };

  // Complete a destination through verified backend anti-cheat logic
  const completeDestination = async (destinationId) => {
    if (!token || !user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      throw new Error('Please login to track and save your exploration progress.');
    }

    const res = await axios.post(`${API_BASE}/explore/destination/${destinationId}/complete`);
    if (res.data.success) {
      // Refresh user profile with new XP & achievements
      await fetchCurrentUser();
      return res.data;
    }
    throw new Error(res.data.message || 'Failed to complete destination.');
  };

  // Update profile details and preferences
  const updateProfile = async (profileData) => {
    if (!token) throw new Error('Not authenticated');
    const res = await axios.put(`${API_BASE}/auth/profile`, profileData);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('safarai_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Failed to update profile');
  };

  // Save confirmed trip to user profile & award XP
  const saveConfirmedTrip = async (trip) => {
    if (!token) return null;
    try {
      const res = await axios.post(`${API_BASE}/auth/save-trip`, { trip });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('safarai_user', JSON.stringify(res.data.user));
        return res.data;
      }
    } catch (err) {
      console.warn('Could not sync trip to user profile:', err.message);
    }
    return null;
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        fetchCurrentUser,
        updateProfile,
        saveConfirmedTrip,
        completeDestination,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
