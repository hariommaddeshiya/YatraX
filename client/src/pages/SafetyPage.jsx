import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Hospital, 
  Radio, 
  ShieldCheck, 
  AlertTriangle,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { LiveSafetyRadar } from '../components/safety/LiveSafetyRadar.jsx';
import { GeofenceMap } from '../components/safety/GeofenceMap.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const SafetyPage = ({ onOpenSos }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-900 px-3.5 py-1 rounded-full text-xs font-bold font-cinzel border border-red-300">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>TOURIST SAFETY & REAL-TIME GEOFENCING RADAR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 font-serif">
          Tourist Safety, Risk Zones & Emergency Evacuation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Continuous GPS geofence monitoring, distance to NABH accredited trauma centres, and direct link to Tourist Police.
        </p>
      </div>

      {/* 1. Live Safety Radar Telemetry */}
      <LiveSafetyRadar />

      {/* 2. Interactive Geofence & Emergency POIs Map */}
      <GeofenceMap />

      {/* 3. Emergency SOS Banner Callout */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-red-400">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-950/80 text-red-200 px-2 py-0.5 rounded font-mono font-bold uppercase">
              Priority Distress Transmitter
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold">
            Need Immediate Emergency Rescue or Medical Evacuation?
          </h3>
          <p className="text-xs text-red-100 leading-relaxed">
            Activating the distress beacon immediately transmits your live GPS coordinates, battery level, and identity to the nearest State Tourist Police unit and Trauma Dispatch.
          </p>
        </div>

        <button
          onClick={onOpenSos}
          className="px-8 py-4 bg-white hover:bg-red-50 text-red-700 font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 border-2 border-white animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>ACTIVATE DISTRESS BEACON (SOS)</span>
        </button>
      </div>

      {/* 4. Verified 24x7 Helplines Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-800">
              National & Regional Emergency Directory
            </h3>
            <p className="text-xs text-slate-500">Cached in local storage — accessible even during full offline mode.</p>
          </div>
          <DataSourceBadge type="VERIFIED DATA" source="Ministry of Home Affairs & Tourism" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50/60 space-y-1">
            <span className="text-[10px] font-bold text-red-700 uppercase">National All-in-One Emergency</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">112</div>
            <p className="text-[11px] text-slate-600">Unified Police, Fire & Medical dispatch across India.</p>
          </div>

          <div className="p-4 rounded-2xl border border-saffron-200 bg-saffron-50/60 space-y-1">
            <span className="text-[10px] font-bold text-saffron-800 uppercase">Incredible India Helpline</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">1363</div>
            <p className="text-[11px] text-slate-600">24x7 Multi-lingual Tourist Guide & Safety Assistance.</p>
          </div>

          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-800 uppercase">Ambulance & Trauma</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">108</div>
            <p className="text-[11px] text-slate-600">Rapid emergency medical response & oxygen transport.</p>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 bg-eco-50/60 space-y-1">
            <span className="text-[10px] font-bold text-eco-800 uppercase">Disaster Management (NDRF)</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">1078</div>
            <p className="text-[11px] text-slate-600">Landslide, flash-flood & avalanche rescue division.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
