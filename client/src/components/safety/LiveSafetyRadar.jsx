import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CloudSun, 
  Users, 
  Wifi, 
  WifiOff, 
  Hospital, 
  Navigation, 
  Radio, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import api from '../../utils/api.js';
import { useTrip } from '../../context/TripContext.jsx';
import { DataSourceBadge } from '../common/DataSourceBadge.jsx';

export const LiveSafetyRadar = () => {
  const { activeTrip } = useTrip();
  const [safetyData, setSafetyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafetyScore = async () => {
      try {
        const isGeofenced = activeTrip?.safetyScore < 80;
        const res = await api.get('/safety/score', {
          params: {
            weatherRisk: activeTrip?.weatherSummary?.riskLevel || 'LOW',
            crowdSurge: 'LOW',
            isGeofenced: isGeofenced ? 'true' : 'false',
            networkAvailable: 'true',
            distanceKm: 3.2
          }
        });
        if (res.success) {
          setSafetyData(res);
        }
      } catch (err) {
        console.error('Error fetching safety data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyScore();
  }, [activeTrip]);

  const score = activeTrip?.safetyScore || safetyData?.safetyScore || 91;
  const isHazardBreached = score < 80;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-slate-800">
              Live Tourist Safety & Risk Radar
            </h3>
            <DataSourceBadge type="LIVE API DATA" source="GPS & Sensor Grid" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geofence perimeter monitoring, distance to NABH medical facilities & emergency response.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Safety Index</span>
            <div className={`font-mono font-extrabold text-lg px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
              score >= 90 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
              score >= 75 ? 'bg-amber-50 text-amber-800 border-amber-300' :
              'bg-red-50 text-red-800 border-red-400 animate-pulse'
            }`}>
              <ShieldCheck className="w-5 h-5" />
              <span>{score}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Risk Geofence Breach Alert (Triggered in Demo Scenario 4) */}
      {isHazardBreached && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 space-y-3 animate-pulse-gentle">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-xl text-red-700 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono bg-red-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                GEOFENCE HAZARD ALERT
              </span>
              <h4 className="font-bold text-sm text-red-900">
                🚨 HIGH-RISK ZONE BREACH: You have entered a marked risk perimeter!
              </h4>
              <p className="text-xs text-red-800 leading-relaxed">
                Nohkalikai Downstream Gorge High-Swell Zone. Severe flash-flood and slippery scree slope hazard detected.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-red-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Recommended Action:</span>
              <span className="text-emerald-700 bg-eco-100 font-bold px-2 py-0.5 rounded text-[10px]">
                Safe Route Calculated
              </span>
            </div>
            <p className="text-slate-700">
              Move immediately toward <strong>Cherrapunji Forest Department Facilitation Shelter</strong> (450m Northeast). Stay on marked eco-trail corridor.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600">
              <span>🏥 Nearest Hospital: <strong>Civil Hospital Shillong (3.2 km)</strong></span>
              <span>👮 Tourist Police Helpline: <strong>1363</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 6-Grid Telemetry Sensors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Weather Risk</span>
            <CloudSun className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bold text-sm text-slate-900">
            {activeTrip?.weatherSummary?.riskLevel === 'HIGH' ? '🔴 High Storm' : '🟢 Optimal Weather'}
          </div>
          <span className="text-[10px] text-slate-500">{activeTrip?.weatherSummary?.weatherCondition || 'Clear Skies'}</span>
        </div>

        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Road Conditions</span>
            <Navigation className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bold text-sm text-slate-900">🟢 Clear & Open</div>
          <span className="text-[10px] text-slate-500">NH-106 Corridor Normal</span>
        </div>

        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Crowd Density</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-bold text-sm text-slate-900">
            {activeTrip?.itinerary?.[1]?.activities?.[1]?.crowdPercentage > 80 ? '🟡 High Surge' : '🟢 Normal Density'}
          </div>
          <span className="text-[10px] text-slate-500">Peak hours bypassed</span>
        </div>

        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Geofence Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`font-bold text-sm ${isHazardBreached ? 'text-red-700' : 'text-slate-900'}`}>
            {isHazardBreached ? '🔴 In Hazard Zone' : '🟢 Safe Corridor'}
          </div>
          <span className="text-[10px] text-slate-500">Perimeter checked</span>
        </div>

        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Cellular Network</span>
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bold text-sm text-slate-900">🟢 5G / 4G Active</div>
          <span className="text-[10px] text-slate-500">IndexedDB Cached</span>
        </div>

        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Emergency Proximity</span>
            <Hospital className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bold text-sm text-slate-900">🟢 3.2 km Hospital</div>
          <span className="text-[10px] text-slate-500">Civil Hospital NABH</span>
        </div>
      </div>

    </div>
  );
};
