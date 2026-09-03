import React, { useState } from 'react';
import { 
  Sliders, 
  Building2, 
  CloudRain, 
  Users, 
  ShieldAlert, 
  WifiOff, 
  RotateCcw, 
  Sparkles,
  ChevronUp,
  ChevronDown,
  Play
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.jsx';
import { useOffline } from '../../context/OfflineContext.jsx';

export const DemoControlBar = () => {
  const { triggerSimulation, activeSimulation } = useTrip();
  const { toggleSimulatedOffline, isSimulatedOffline } = useOffline();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleTrigger = async (type) => {
    setLoadingAction(type);
    try {
      if (type === 'INTERNET_LOSS') {
        toggleSimulatedOffline();
      }
      await triggerSimulation(type);
    } catch (err) {
      console.error('Trigger failed:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const demoScenarios = [
    {
      id: 'HOTEL_PRICE',
      label: '1. Hotel Price Spike',
      sub: '₹4,000 → ₹5,200 (Auto-rebudgets to Hotel B ₹3,900)',
      icon: Building2,
      color: 'hover:bg-amber-600'
    },
    {
      id: 'WEATHER_RAIN',
      label: '2. Heavy Rain Alert',
      sub: 'Waterfall Trek → Don Bosco Museum',
      icon: CloudRain,
      color: 'hover:bg-blue-600'
    },
    {
      id: 'CROWD_SURGE',
      label: '3. Crowd Surge',
      sub: '65% → 92% (Shifts to 07:00 AM Slot)',
      icon: Users,
      color: 'hover:bg-purple-600'
    },
    {
      id: 'RISK_ZONE',
      label: '4. Hazard Geofence Breach',
      sub: 'Tourist in Hazard Zone → Command Alert',
      icon: ShieldAlert,
      color: 'hover:bg-red-600'
    },
    {
      id: 'INTERNET_LOSS',
      label: '5. Offline Loss / PWA',
      sub: isSimulatedOffline ? 'Restore Network' : 'Drop Connection → IndexedDB',
      icon: WifiOff,
      color: 'hover:bg-slate-700'
    }
  ];

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-40 max-w-sm sm:max-w-xl">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Toggle Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 bg-terracotta-600 rounded-md text-white">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-xs flex items-center gap-1.5 text-saffron-300">
                <span>SIH Demo Simulator Panel</span>
                <span className="text-[9px] bg-terracotta-800 text-terracotta-200 px-1.5 py-0.2 rounded font-mono">Live</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] hidden sm:inline">
              {isExpanded ? 'Click to collapse' : 'Click to trigger 5 SIH scenarios'}
            </span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>

        {/* Expanded Controls Grid */}
        {isExpanded && (
          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/80">
            <div className="text-[11px] text-slate-400">
              One-click simulation buttons for judge demonstrations. Triggers real-time adaptive engine events across client & backend.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoScenarios.map((sc) => {
                const Icon = sc.icon;
                const isLoading = loadingAction === sc.id;
                const isCurrentActive = activeSimulation === sc.id;

                return (
                  <button
                    key={sc.id}
                    onClick={() => handleTrigger(sc.id)}
                    disabled={isLoading}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                      isCurrentActive 
                        ? 'bg-terracotta-900/90 border-terracotta-500 text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className="p-1.5 bg-slate-800 rounded-lg text-saffron-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold leading-tight">{sc.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{sc.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset Button */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">Environment State:</span>
              <button
                onClick={() => handleTrigger('RESET')}
                disabled={loadingAction === 'RESET'}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-saffron-400" />
                <span>Reset Demo to Baseline</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
