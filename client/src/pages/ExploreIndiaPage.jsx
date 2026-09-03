import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrip } from '../context/TripContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { ExplorerDashboard } from '../components/explore/ExplorerDashboard.jsx';
import { IndiaInteractiveMap } from '../components/explore/IndiaInteractiveMap.jsx';
import { StateDetailModal } from '../components/explore/StateDetailModal.jsx';
import { StateProgressSection } from '../components/explore/StateProgressSection.jsx';
import { AchievementsSection } from '../components/explore/AchievementsSection.jsx';
import { AuthModal } from '../components/auth/AuthModal.jsx';
import { indiaStatesData } from '../data/indiaStatesData.js';
import { Loader2, Sparkles, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

// Helper to map confirmed trip destination name to master catalog destination IDs
const resolveDestinationIdFromName = (destName) => {
  const norm = (destName || '').toLowerCase().trim();
  if (norm.includes('taj') || norm.includes('agra')) return 'taj-mahal';
  if (norm.includes('varanasi') || norm.includes('kashi')) return 'varanasi-ghats';
  if (norm.includes('hampi')) return 'hampi-vijayanagara';
  if (norm.includes('golden') || norm.includes('amritsar')) return 'golden-temple';
  if (norm.includes('konark') || norm.includes('puri')) return 'konark-sun-temple';
  if (norm.includes('meenakshi') || norm.includes('madurai')) return 'meenakshi-temple';
  if (norm.includes('jaisalmer')) return 'jaisalmer-fort';
  if (norm.includes('alleppey') || norm.includes('kerala')) return 'alleppey-backwaters';
  if (norm.includes('ajanta') || norm.includes('ellora')) return 'ajanta-ellora';
  if (norm.includes('meghalaya') || norm.includes('nongriat')) return 'nongriat-root-bridges';
  if (norm.includes('cherrapunji')) return 'cherrapunji-falls';
  if (norm.includes('shillong')) return 'shillong-peak';
  if (norm.includes('jaipur') || norm.includes('hawa')) return 'hawa-mahal';
  if (norm.includes('udaipur')) return 'udaipur-lake-palace';
  if (norm.includes('goa')) return 'dudhsagar-falls';
  if (norm.includes('delhi')) return 'qutub-minar';
  if (norm.includes('ayodhya')) return 'ayodhya-ram-mandir';
  return null;
};

export const ExploreIndiaPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { activeTrip } = useTrip();
  const { socket } = useSocket();
  
  // Initialize with master catalog + merge user explored destinations + confirmed trips immediately
  const initialMergedStates = useMemo(() => {
    const exploredSet = new Set((user?.exploredDestinations || []).map(d => d.destinationId));

    // Also read confirmed trips from localStorage
    try {
      const rawConfirmed = localStorage.getItem('yatrax_confirmed_trips');
      if (rawConfirmed) {
        const confirmedList = JSON.parse(rawConfirmed);
        confirmedList.forEach(t => {
          const matchId = resolveDestinationIdFromName(t.destination);
          if (matchId) exploredSet.add(matchId);
        });
      }
      const rawExplored = localStorage.getItem('yatrax_explored_destinations');
      if (rawExplored) {
        const list = JSON.parse(rawExplored);
        list.forEach(d => {
          if (d.destinationId) exploredSet.add(d.destinationId);
        });
      }
    } catch (e) {}

    // Check activeTrip if confirmed
    if (activeTrip?.isConfirmed && activeTrip.destination) {
      const matchId = resolveDestinationIdFromName(activeTrip.destination);
      if (matchId) exploredSet.add(matchId);
    }

    return indiaStatesData.map(state => {
      const completed = state.destinations.filter(d => exploredSet.has(d.id)).length;
      const total = state.destinations.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...state,
        completedDestinations: completed,
        totalDestinations: total,
        percentage,
        isCompleted: completed === total && total > 0,
        destinations: state.destinations.map(d => ({
          ...d,
          isCompleted: exploredSet.has(d.id)
        }))
      };
    });
  }, [user, activeTrip]);

  const [states, setStates] = useState(initialMergedStates);
  const [stats, setStats] = useState(() => {
    const totalDest = 292;
    let count = user?.exploredDestinations?.length || 0;
    try {
      const rawExplored = localStorage.getItem('yatrax_explored_destinations');
      if (rawExplored) {
        const list = JSON.parse(rawExplored);
        count = Math.max(count, list.length);
      }
    } catch (e) {}

    return {
      totalDestinations: totalDest,
      exploredCount: count,
      overallPercentage: Math.round((count / totalDest) * 100),
      statesCompletedCount: 0,
      totalStates: 36,
      totalXP: (user?.xp || 0) + (count * 150),
      level: user?.level || 1
    };
  });
  
  const [achievements, setAchievements] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sync state whenever user object or activeTrip changes
  useEffect(() => {
    setStates(initialMergedStates);
    const totalCompleted = initialMergedStates.reduce((acc, s) => acc + (s.completedDestinations || 0), 0);
    setStats(prev => ({
      ...prev,
      exploredCount: totalCompleted,
      overallPercentage: Math.round((totalCompleted / 292) * 100),
      totalXP: (user?.xp || 0) + (totalCompleted * 150)
    }));
  }, [user, activeTrip, initialMergedStates]);

  // Fetch verified backend gamification data
  const loadExploreData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [statesRes, progressRes, achievementsRes] = await Promise.all([
        axios.get('/api/explore/states').catch(() => ({ data: null })),
        axios.get('/api/explore/progress').catch(() => ({ data: null })),
        axios.get('/api/explore/achievements').catch(() => ({ data: null }))
      ]);

      if (statesRes.data?.success && statesRes.data.states) {
        // Merge with local confirmed trip state
        setStates(prevStates => {
          const backendStates = statesRes.data.states;
          return backendStates.map(bs => {
            const localS = initialMergedStates.find(s => s.id === bs.id);
            const maxCompleted = Math.max(bs.completedDestinations || 0, localS?.completedDestinations || 0);
            return {
              ...bs,
              completedDestinations: maxCompleted,
              percentage: Math.round((maxCompleted / (bs.totalDestinations || 10)) * 100),
              isCompleted: maxCompleted >= (bs.totalDestinations || 10)
            };
          });
        });
        
        // If modal is currently open, refresh selectedState data
        if (selectedState) {
          const updated = statesRes.data.states.find(s => s.id === selectedState.id);
          if (updated) setSelectedState(updated);
        }
      }

      if (progressRes.data?.success && progressRes.data.stats) {
        setStats(progressRes.data.stats);
      }

      if (achievementsRes.data?.success && achievementsRes.data.achievements) {
        setAchievements(achievementsRes.data.achievements);
      }
    } catch (err) {
      console.warn('Live explore fetch caught error, using cached merged dataset:', err.message);
    } finally {
      setRefreshing(false);
    }
  }, [initialMergedStates, selectedState]);

  useEffect(() => {
    loadExploreData();
  }, [user]);

  // Socket listener to auto-refresh map when a trip is confirmed
  useEffect(() => {
    if (!socket) return;
    const handleTripConfirmed = () => {
      loadExploreData();
    };

    socket.on('TRIP_CONFIRMED', handleTripConfirmed);
    socket.on('EXPLORE_PROGRESS_UPDATED', handleTripConfirmed);

    return () => {
      socket.off('TRIP_CONFIRMED', handleTripConfirmed);
      socket.off('EXPLORE_PROGRESS_UPDATED', handleTripConfirmed);
    };
  }, [socket, loadExploreData]);

  const handleSelectState = (stateObj) => {
    const latest = states.find(s => s.id === stateObj.id) || stateObj;
    setSelectedState(latest);
    setDetailModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn">
      
      {/* 1. Gamified Explorer Dashboard Banner */}
      <ExplorerDashboard stats={stats} />

      {/* 2. Real Interactive Geographic Map of India with Live Destination Pins */}
      <IndiaInteractiveMap 
        statesData={states} 
        onSelectState={handleSelectState} 
      />

      {/* 3. State Progress Grid with Filter & Search */}
      <StateProgressSection 
        states={states} 
        onSelectState={handleSelectState} 
      />

      {/* 4. Achievements Section */}
      <AchievementsSection 
        achievements={achievements} 
      />

      {/* State Detail Inspection Modal */}
      <StateDetailModal
        state={selectedState}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onDestinationExplored={loadExploreData}
      />

    </div>
  );
};
