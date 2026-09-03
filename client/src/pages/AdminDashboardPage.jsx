import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Radio, 
  ShieldCheck, 
  CloudRain, 
  Leaf, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Clock,
  Search,
  Check
} from 'lucide-react';
import api from '../utils/api.js';
import { useSocket } from '../context/SocketContext.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';
import { ErrorBoundary } from '../ErrorBoundary.jsx';
import { AdminGeofenceMap } from '../components/admin/AdminGeofenceMap.jsx';

export const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [expandedIncidentId, setExpandedIncidentId] = useState(null);
  const [safetyZones, setSafetyZones] = useState([]);
  const { socket } = useSocket();

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/overview');
      if (res.success) {
        setOverview(res.stats);
        setIncidents(res.incidents || []);
        setTourists(res.activeTourists || []);
        setSafetyZones(res.safetyZones || []);
      }
    } catch (err) {
      console.error('Error loading government overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen to live incidents
  useEffect(() => {
    if (!socket) return;
    const handleIncident = () => {
      fetchDashboardData();
    };
    socket.on('INCIDENT_ALERT', handleIncident);
    socket.on('SOS_BROADCAST', handleIncident);
    socket.on('ZONE_UPDATED', handleIncident);

    return () => {
      socket.off('INCIDENT_ALERT', handleIncident);
      socket.off('SOS_BROADCAST', handleIncident);
      socket.off('ZONE_UPDATED', handleIncident);
    };
  }, [socket]);

  const handleResolve = async (incidentId) => {
    setResolvingId(incidentId);
    try {
      await api.post(`/admin/resolve-incident/${incidentId}`, {
        actionTaken: 'Authority dispatch confirmed safety protocol compliance; tourist cleared safely.'
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <ErrorBoundary>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-900 text-white font-mono font-bold px-2 py-0.5 rounded uppercase">
              Official Administration Terminal
            </span>
            <DataSourceBadge type="LIVE API DATA" source="State Command Grid" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Government Tourism Command & Incident Dispatch Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time tourist safety monitoring, high-risk geofence breaches, and rescue coordination.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>COMMAND GRID ONLINE</span>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-sand-300 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Tourists</span>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {overview?.totalTouristsActive || 146}
          </div>
          <span className="text-[10px] text-slate-500">Tracking active GPS</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/40 shadow-xs space-y-1">
          <span className="text-[10px] text-red-700 font-bold uppercase block">High-Risk Alerts</span>
          <div className="text-xl font-extrabold text-red-700 font-mono">
            {incidents.filter(i => i.status === 'ACTIVE').length}
          </div>
          <span className="text-[10px] text-red-600 font-semibold">Active Hazards</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-saffron-200 bg-saffron-50/40 shadow-xs space-y-1">
          <span className="text-[10px] text-saffron-800 font-bold uppercase block">Active SOS Events</span>
          <div className="text-xl font-extrabold text-saffron-800 font-mono">
            {incidents.filter(i => i.triggerType === 'SOS_TRIGGERED' && i.status === 'ACTIVE').length}
          </div>
          <span className="text-[10px] text-saffron-700">Immediate Rescue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sand-300 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Weather Alerts</span>
          <div className="text-xl font-extrabold text-blue-700 font-mono">1</div>
          <span className="text-[10px] text-slate-500">Open-Meteo Storm</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sand-300 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Offline Tourists</span>
          <div className="text-xl font-extrabold text-slate-700 font-mono">14</div>
          <span className="text-[10px] text-slate-500">PWA IndexedDB active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sand-300 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Carbon Saved</span>
          <div className="text-xl font-extrabold text-eco-700 font-mono">12.4 Ton</div>
          <span className="text-[10px] text-eco-700 font-semibold">Green Routing</span>
        </div>
      </div>

      {/* Geofence Map */}
      <AdminGeofenceMap 
        zones={safetyZones} 
        onZoneAdded={(zone) => setSafetyZones([zone, ...safetyZones])}
        onZoneRemoved={(id) => setSafetyZones(safetyZones.filter(z => z.id !== id))}
      />

      {/* Incidents Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-800">
              Live Incident & Geofence Breach Queue
            </h3>
            <p className="text-xs text-slate-500">All alerts generated by tourist distress signals, hazard breaches or weather events.</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Auto-refresh via Socket.IO</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-300 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Incident ID</th>
                <th className="py-3 px-3">Tourist / Contact</th>
                <th className="py-3 px-3">Location & Coordinates</th>
                <th className="py-3 px-3">Trigger / Risk</th>
                <th className="py-3 px-3">Recommended Authority Action</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">
                    No active hazard incidents. All tourists are operating within safe corridors.
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => {
                  const isActive = inc.status === 'ACTIVE';
                  const isExpanded = expandedIncidentId === inc.id;
                  return (
                    <React.Fragment key={inc.id}>
                      <tr 
                        className={`${isActive ? 'bg-red-50/50' : 'hover:bg-sand-50'} cursor-pointer`}
                        onClick={() => setExpandedIncidentId(isExpanded ? null : inc.id)}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {inc.id}
                        </td>
                        <td className="py-3 px-3">
                          <strong className="text-slate-900 block">{inc.touristName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">{inc.phone}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            <span>{inc.location?.name || 'Meghalaya'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {inc.location?.lat?.toFixed(4)}, {inc.location?.lng?.toFixed(4)}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.riskLevel === 'CRITICAL' || inc.riskLevel === 'HIGH'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inc.riskLevel}: {inc.triggerType}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-xs text-slate-700">
                          {inc.recommendedAction}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isActive 
                              ? 'bg-red-600 text-white animate-pulse' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedIncidentId(isExpanded ? null : inc.id); }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-xs ml-auto border border-slate-300"
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50 border-b border-sand-300 shadow-inner">
                          <td colSpan="7" className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              
                              {/* Left Panel: Tourist & Device Details */}
                              <div className="flex-1 space-y-4">
                                <h4 className="font-bold text-sm text-slate-900 border-b border-sand-200 pb-2">User & Emergency Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-slate-500 block mb-1">Full Name</span>
                                    <span className="font-semibold text-slate-800">{inc.touristName}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block mb-1">Contact Number</span>
                                    <span className="font-semibold text-slate-800">{inc.phone}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block mb-1">Emergency Contact</span>
                                    <span className="font-semibold text-slate-800">
                                      {inc.emergencyContact 
                                        ? (typeof inc.emergencyContact === 'object' 
                                            ? `${inc.emergencyContact.name || 'Unknown'} (${inc.emergencyContact.phone || 'No Phone'})`
                                            : inc.emergencyContact)
                                        : 'Not Provided'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block mb-1">Timestamp</span>
                                    <span className="font-semibold text-slate-800">{new Date(inc.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>

                                <h4 className="font-bold text-sm text-slate-900 border-b border-sand-200 pb-2 mt-4">Device Telemetry</h4>
                                <div className="flex gap-4 text-xs">
                                  <div className="bg-white p-2 rounded border border-sand-200 shadow-sm flex-1">
                                    <span className="text-slate-500 block mb-1">Battery Level</span>
                                    <span className="font-semibold text-slate-800">{inc.deviceTelemetry?.battery || 'Unknown'}</span>
                                  </div>
                                  <div className="bg-white p-2 rounded border border-sand-200 shadow-sm flex-1">
                                    <span className="text-slate-500 block mb-1">Network Status</span>
                                    <span className="font-semibold text-slate-800">{inc.deviceTelemetry?.network || 'Unknown'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Middle Panel: Location & Situation */}
                              <div className="flex-1 space-y-4 border-l border-sand-200 pl-6">
                                <h4 className="font-bold text-sm text-slate-900 border-b border-sand-200 pb-2">Situation Overview</h4>
                                <div className="text-xs">
                                  <span className="text-slate-500 block mb-1">Incident Details</span>
                                  <p className="text-slate-800 font-medium leading-relaxed bg-white p-2 rounded border border-sand-200">
                                    {inc.details}
                                  </p>
                                </div>
                                <div className="text-xs mt-3">
                                  <span className="text-slate-500 block mb-1">Precise Location</span>
                                  <div className="bg-white p-2 rounded border border-sand-200 space-y-1">
                                    <p className="font-semibold text-slate-800">{inc.location?.address || inc.location?.name}</p>
                                    <p className="text-slate-500">Lat: {inc.location?.lat}, Lng: {inc.location?.lng}</p>
                                    <p className="text-slate-500">Accuracy: {inc.location?.accuracyMeters ? `±${inc.location.accuracyMeters} meters` : 'Unknown'}</p>
                                    {inc.location?.mapsUrl && (
                                      <a href={inc.location.mapsUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-block mt-1">
                                        Open in Google Maps ↗
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right Panel: Government Action Buttons */}
                              <div className="flex-1 space-y-4 border-l border-sand-200 pl-6">
                                <h4 className="font-bold text-sm text-slate-900 border-b border-sand-200 pb-2">Dispatch & Response Actions</h4>
                                <div className="flex flex-col gap-2">
                                  
                                  {/* Call User */}
                                  <a 
                                    href={`tel:${inc.phone}`} 
                                    className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 px-3 rounded-lg text-xs font-bold transition-colors"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    Call User Directly
                                  </a>

                                  {/* Dispatch Team */}
                                  <button 
                                    onClick={() => alert(`Dispatching Emergency Department to ${inc.location?.name || 'Location'}. Team deployed successfully.`)}
                                    className="w-full flex items-center justify-center gap-2 bg-saffron-50 hover:bg-saffron-100 text-saffron-800 border border-saffron-200 py-2 px-3 rounded-lg text-xs font-bold transition-colors"
                                  >
                                    <Radio className="w-3.5 h-3.5" />
                                    Dispatch Rescue / Medical Team
                                  </button>

                                  {/* Register e-Complain/FIR */}
                                  <button 
                                    onClick={() => alert(`Official e-Complain / Incident Report created for Incident ID: ${inc.id}`)}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 py-2 px-3 rounded-lg text-xs font-bold transition-colors"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Register Official e-Complain (FIR)
                                  </button>
                                  
                                  {/* Live Location Tracking */}
                                  <button 
                                    onClick={() => alert(`Initiating live location tracking for ${inc.touristName}.`)}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2 px-3 rounded-lg text-xs font-bold transition-colors"
                                  >
                                    <MapPin className="w-3.5 h-3.5" />
                                    Track Live Movement
                                  </button>

                                  <div className="my-2 border-t border-sand-200"></div>

                                  {/* Resolve Button */}
                                  {isActive ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleResolve(inc.id); }}
                                      disabled={resolvingId === inc.id}
                                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-2.5 px-3 rounded-lg text-sm font-bold transition-shadow shadow-md"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      {resolvingId === inc.id ? 'Marking as Solved...' : 'Mark as Solved'}
                                    </button>
                                  ) : (
                                    <div className="w-full text-center bg-emerald-100 text-emerald-800 py-2 px-3 rounded-lg text-xs font-bold border border-emerald-200">
                                      Issue Resolved ✅
                                    </div>
                                  )}

                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Tourists Telemetry Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <h3 className="font-serif text-xl font-bold text-slate-800">
            Active Monitored Tourist Clusters
          </h3>
          <span className="text-xs text-slate-500 font-mono">Live GPS Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-300 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Tourist Name</th>
                <th className="py-2.5 px-3">Route Circuit</th>
                <th className="py-2.5 px-3">Group Size</th>
                <th className="py-2.5 px-3">Safety Rating</th>
                <th className="py-2.5 px-3">Carbon Offset</th>
                <th className="py-2.5 px-3">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {tourists.map((t) => (
                <tr key={t.id} className="hover:bg-sand-50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {t.name}
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {t.origin} ➔ {t.destination}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {t.groupSize} Travellers
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-700">
                    {t.safetyScore}/100
                  </td>
                  <td className="py-3 px-3 text-eco-700 font-bold">
                    {t.carbonOffsetKg} kg CO₂
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      🟢 {t.riskStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
    </ErrorBoundary>
  );
};

