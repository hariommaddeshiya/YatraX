import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sliders, 
  Building2, 
  CloudRain, 
  Users, 
  ShieldAlert, 
  WifiOff, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Play,
  Layers,
  FileCheck2,
  Landmark
} from 'lucide-react';
import { useTrip } from '../context/TripContext.jsx';
import { useOffline } from '../context/OfflineContext.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const AdminDemoPage = () => {
  const { triggerSimulation, activeSimulation, activeTrip } = useTrip();
  const { toggleSimulatedOffline, isSimulatedOffline } = useOffline();
  const [activeStep, setActiveStep] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleSimulate = async (stepNumber, type) => {
    setActiveStep(stepNumber);
    setLoadingAction(type);
    try {
      if (type === 'INTERNET_LOSS') {
        toggleSimulatedOffline();
      }
      await triggerSimulation(type);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const steps = [
    {
      step: 1,
      id: 'HOTEL_PRICE',
      title: '🏨 Scenario 1: Hotel Price Surge & Auto-Rebudgeting',
      trigger: 'Hotel rate jumps from ₹4,000 to ₹5,200/night',
      outcome: 'Budget exceeded by ₹1,200 ➔ Auto-finds Hotel B (₹3,900/night, rating 4.6) ➔ Restores total planned cost to ₹39,900.',
      icon: Building2,
      color: 'border-amber-400 bg-amber-50/50'
    },
    {
      step: 2,
      id: 'WEATHER_RAIN',
      title: '🌧️ Scenario 2: Torrential Weather & Indoor Cultural Swap',
      trigger: 'Open-Meteo precipitation alert (18.5 mm/hr rain) at Nohkalikai Gorge',
      outcome: 'Outdoor Waterfall Trek automatically swapped for 7-story Don Bosco Museum of Indigenous Cultures.',
      icon: CloudRain,
      color: 'border-blue-400 bg-blue-50/50'
    },
    {
      step: 3,
      id: 'CROWD_SURGE',
      title: '👥 Scenario 3: Crowd Surge & Time Slot Optimization',
      trigger: 'Crowd model detects 92% peak surge at Living Root Bridge at 02:30 PM',
      outcome: 'Itinerary automatically shifts visit to 07:00 AM tranquil morning slot (22% crowd) to bypass queue delays.',
      icon: Users,
      color: 'border-purple-400 bg-purple-50/50'
    },
    {
      step: 4,
      id: 'RISK_ZONE',
      title: '🚨 Scenario 4: Hazard Geofence Breach & Rescue Dispatch',
      trigger: 'Tourist enters marked high-risk flood & landslide hazard perimeter',
      outcome: 'Safety score drops, emergency evacuation directions to safe shelter assigned, and Government Command Center alerts rescue team.',
      icon: ShieldAlert,
      color: 'border-red-400 bg-red-50/50'
    },
    {
      step: 5,
      id: 'INTERNET_LOSS',
      title: '📶 Scenario 5: Cellular Data Disconnect & Offline PWA Sync',
      trigger: isSimulatedOffline ? 'Restore live cellular connection' : 'Disconnect network in remote mountain valley',
      outcome: 'Itinerary, tickets, hotel vouchers, and emergency telephone directory remain accessible via IndexedDB.',
      icon: WifiOff,
      color: 'border-slate-400 bg-slate-50/50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-terracotta-100 text-terracotta-800 px-3.5 py-1 rounded-full text-xs font-bold font-cinzel border border-terracotta-300">
          <Sliders className="w-3.5 h-3.5 text-terracotta-700" />
          <span>SMART INDIA HACKATHON 2026 EVALUATION SUITE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 font-serif">
          SIH 5-Minute Demonstration Control Panel
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Execute the 5 core adaptive intelligence scenarios live with instant bidirectional Socket.IO updates across all components.
        </p>
      </div>

      {/* Demo Journey Steps Grid */}
      <div className="space-y-4">
        {steps.map((item) => {
          const Icon = item.icon;
          const isLoading = loadingAction === item.id;
          const isTriggered = activeStep === item.step || activeSimulation === item.id;

          return (
            <div
              key={item.step}
              className={`p-6 rounded-3xl border-2 transition-all shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                isTriggered ? `${item.color} ring-2 ring-terracotta-500/20` : 'bg-white border-sand-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-terracotta-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  {item.step}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-500">
                    <strong>Trigger Condition:</strong> {item.trigger}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 pt-1">
                    <strong>System Response:</strong> {item.outcome}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleSimulate(item.step, item.id)}
                  disabled={isLoading}
                  className="px-5 py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-800 hover:from-terracotta-700 hover:to-terracotta-900 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 text-saffron-300" />
                  <span>{isLoading ? 'Triggering Event...' : 'Trigger Simulation'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Reset Bar & Additional Links */}
      <div className="bg-sand-100 p-6 rounded-3xl border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-800">Ready to Reset for Next Evaluation Round?</h4>
          <p className="text-xs text-slate-500">Reverts all adapted activities, budget items, and safety states back to baseline.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSimulate(0, 'RESET')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-saffron-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Judge Walkthrough Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/trip"
          className="p-5 rounded-2xl bg-white border border-sand-300 shadow-xs hover:border-terracotta-500 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">View Live Itinerary</span>
            <div className="font-serif font-bold text-slate-900 text-sm">Active Trip & Budget</div>
          </div>
          <ArrowRight className="w-4 h-4 text-terracotta-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/heritage"
          className="p-5 rounded-2xl bg-white border border-sand-300 shadow-xs hover:border-terracotta-500 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Experience 360° Portal</span>
            <div className="font-serif font-bold text-slate-900 text-sm">Three.js WebGL Viewer</div>
          </div>
          <Landmark className="w-4 h-4 text-saffron-600 group-hover:scale-110 transition-transform" />
        </Link>

        <Link
          to="/data-accuracy"
          className="p-5 rounded-2xl bg-white border border-sand-300 shadow-xs hover:border-terracotta-500 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Inspect Data Sources</span>
            <div className="font-serif font-bold text-slate-900 text-sm">Data Accuracy Matrix</div>
          </div>
          <FileCheck2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
        </Link>
      </div>

    </div>
  );
};
