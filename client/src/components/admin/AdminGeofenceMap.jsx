import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../utils/api.js';
import { Search, MapPin, AlertTriangle, ShieldCheck, X } from 'lucide-react';

const LocationSearch = ({ onLocationFound }) => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        map.flyTo(newCenter, 14);
        onLocationFound(newCenter);
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute top-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] bg-white p-2 rounded-xl shadow-lg border border-sand-300 flex items-center gap-2 sm:transform">
      <input 
        type="text" 
        placeholder="Search region to geofence..." 
        className="px-3 py-1.5 outline-none text-sm w-full sm:w-64 rounded-lg bg-sand-50"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
      />
      <button onClick={handleSearch} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
};

const AutoZoomToZones = ({ zones }) => {
  const map = useMap();
  useEffect(() => {
    if (zones && zones.length > 0) {
      const bounds = zones.map(z => [z.coordinates.lat, z.coordinates.lng]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [zones, map]);
  return null;
};

const MapDrawer = ({ onZoneDrawn }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [radius, setRadius] = useState(0);

  useMapEvents({
    mousedown(e) {
      setStartPoint(e.latlng);
      setRadius(0);
      e.target.dragging.disable();
    },
    mousemove(e) {
      if (startPoint) {
        setRadius(startPoint.distanceTo(e.latlng));
      }
    },
    mouseup(e) {
      if (startPoint && radius > 50) {
        onZoneDrawn({ lat: startPoint.lat, lng: startPoint.lng, radius });
      }
      setStartPoint(null);
      e.target.dragging.enable();
    }
  });

  if (!startPoint || radius <= 0) return null;

  return (
    <Circle 
      center={startPoint} 
      radius={radius} 
      pathOptions={{ color: 'red', fillColor: '#fca5a5', fillOpacity: 0.5 }} 
    />
  );
};

export const AdminGeofenceMap = ({ zones, onZoneAdded, onZoneRemoved }) => {
  const [draftZone, setDraftZone] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [riskLevel, setRiskLevel] = useState('HIGH');
  const [riskType, setRiskType] = useState('WEATHER');

  const handleSaveZone = async () => {
    if (!draftZone || !zoneName) return alert('Draw a zone and enter a name.');
    try {
      const newZone = {
        name: zoneName,
        coordinates: { lat: draftZone.lat, lng: draftZone.lng },
        radiusMeters: Math.round(draftZone.radius),
        riskLevel,
        riskType,
        nearestSafePoint: { name: 'Local Command Post', lat: draftZone.lat + 0.02, lng: draftZone.lng + 0.02 }
      };
      
      const res = await api.post('/admin/zones', newZone);
      if (res.success) {
        onZoneAdded(res.zone);
        setDraftZone(null);
        setZoneName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveZone = async (id) => {
    try {
      await api.delete(`/admin/zones/${id}`);
      onZoneRemoved(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Live Geofence & Threat Mapping
          </h3>
          <p className="text-xs text-slate-500">
            Search a location, then <strong>click and drag</strong> on the map to mark Red/Orange zones. 
            Tourists in this area will be notified instantly.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map Column */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-sand-300 isolate relative z-0 h-[300px] sm:h-[400px] lg:h-[500px]">
          <MapContainer center={[22.5, 79.0]} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <LocationSearch onLocationFound={() => {}} />
            <AutoZoomToZones zones={zones} />
            <MapDrawer onZoneDrawn={(zone) => setDraftZone(zone)} />

            {/* Render Active Zones */}
            {zones.map(z => (
              <Circle 
                key={z.id}
                center={[z.coordinates.lat, z.coordinates.lng]}
                radius={z.radiusMeters}
                pathOptions={{ 
                  color: z.riskLevel === 'CRITICAL' ? '#7f1d1d' : z.riskLevel === 'HIGH' ? '#991b1b' : '#c2410c',
                  fillColor: z.riskLevel === 'CRITICAL' ? '#ef4444' : z.riskLevel === 'HIGH' ? '#f87171' : '#fb923c',
                  fillOpacity: 0.5,
                  weight: 3
                }}
              >
                <Popup>
                  <div className="font-sans text-xs space-y-1">
                    <strong className="block text-sm">{z.name}</strong>
                    <span className="text-red-600 font-bold">{z.riskLevel} Risk</span>
                    <span> - {z.riskType}</span>
                    <button onClick={() => handleRemoveZone(z.id)} className="block mt-2 px-2 py-1 bg-red-100 text-red-700 rounded w-full hover:bg-red-200">
                      Remove Zone
                    </button>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Render Draft Zone */}
            {draftZone && (
              <Circle 
                center={[draftZone.lat, draftZone.lng]} 
                radius={draftZone.radius} 
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2, dashArray: '5, 10' }} 
              />
            )}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4 max-h-72 lg:max-h-none overflow-y-auto pr-1">
          {draftZone ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-4">
              <h4 className="font-bold text-sm text-blue-900 border-b border-blue-200 pb-2">New Zone Configuration</h4>
              <div>
                <label className="block text-[10px] uppercase font-bold text-blue-700 mb-1">Zone Name / Location</label>
                <input 
                  type="text" 
                  value={zoneName} 
                  onChange={e => setZoneName(e.target.value)} 
                  className="w-full text-xs p-2 rounded border border-blue-200 outline-none" 
                  placeholder="e.g. Munnar Landslide Area" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-blue-700 mb-1">Risk Level</label>
                  <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} className="w-full text-xs p-2 rounded border border-blue-200 outline-none">
                    <option value="CRITICAL">Critical (Red)</option>
                    <option value="HIGH">High (Red)</option>
                    <option value="MODERATE">Moderate (Orange)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-blue-700 mb-1">Risk Type</label>
                  <select value={riskType} onChange={e => setRiskType(e.target.value)} className="w-full text-xs p-2 rounded border border-blue-200 outline-none">
                    <option value="WEATHER">Weather/Disaster</option>
                    <option value="LAW_ORDER">Law & Order</option>
                    <option value="WILDLIFE">Wildlife Threat</option>
                    <option value="STRUCTURAL">Structural Collapse</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-blue-600">Radius: {(draftZone.radius / 1000).toFixed(2)} km</p>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveZone} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-xs font-bold transition">
                  Deploy Zone Alert
                </button>
                <button onClick={() => setDraftZone(null)} className="px-3 bg-white hover:bg-sand-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-sand-50 border border-sand-200 p-4 rounded-xl text-center text-slate-500 text-xs">
              <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              To create a new safety geofence, <strong>click and drag</strong> anywhere on the map to define the restricted radius.
            </div>
          )}

          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4">
            <h4 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 mb-3">Active Zones ({zones.length})</h4>
            <div className="space-y-2">
              {zones.map(z => (
                <div key={z.id} className="bg-white p-2 rounded border border-sand-200 flex justify-between items-center group">
                  <div>
                    <span className="block text-xs font-bold text-slate-800 truncate max-w-[160px]">{z.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {z.riskLevel}
                    </span>
                  </div>
                  <button onClick={() => handleRemoveZone(z.id)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
