import React from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  CloudRain, 
  Building2, 
  Users, 
  ShieldAlert,
  WifiOff
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useNavigate } from 'react-router-dom';

export const AdaptationToast = () => {
  const { latestAdaptation, dismissAdaptation } = useSocket();
  const navigate = useNavigate();

  if (!latestAdaptation) return null;

  const getTriggerIcon = (type) => {
    switch (type) {
      case 'HOTEL_PRICE_SPIKE': return Building2;
      case 'WEATHER_ALERT': return CloudRain;
      case 'CROWD_SURGE': return Users;
      case 'SAFETY_GEOFENCE': return ShieldAlert;
      case 'NETWORK_LOSS': return WifiOff;
      default: return Sparkles;
    }
  };

  const Icon = getTriggerIcon(latestAdaptation.triggerType);

  const handleInspect = () => {
    dismissAdaptation();
    if (latestAdaptation.triggerType === 'SAFETY_GEOFENCE') {
      navigate('/safety');
    } else {
      navigate('/trip');
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-terracotta-500 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-terracotta-600 to-terracotta-800 text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Icon className="w-5 h-5 text-saffron-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider bg-terracotta-900/60 px-1.5 py-0.5 rounded font-bold uppercase">
                Adaptive Engine Real-Time Event
              </span>
              <h4 className="font-bold text-sm leading-tight mt-0.5">
                {latestAdaptation.title || 'Itinerary Auto-Adapted'}
              </h4>
            </div>
          </div>
          <button
            onClick={dismissAdaptation}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Content */}
        <div className="p-4 space-y-3 text-xs">
          <p className="text-slate-700 leading-relaxed font-medium">
            {latestAdaptation.message}
          </p>

          {/* Diff Box */}
          <div className="bg-sand-100 p-3 rounded-xl border border-sand-300 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Automated Resolution:</span>
              <span className="text-emerald-700 bg-eco-100 font-bold px-2 py-0.5 rounded text-[10px]">
                Applied Instantly
              </span>
            </div>
            <div className="text-slate-800 text-xs font-semibold">
              {latestAdaptation.actionTaken}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={dismissAdaptation}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Dismiss
            </button>
            <button
              onClick={handleInspect}
              className="px-4 py-1.5 rounded-lg bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <span>View Updated Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
