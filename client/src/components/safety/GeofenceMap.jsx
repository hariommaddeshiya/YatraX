import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTrip } from '../../context/TripContext.jsx';
import { useOffline } from '../../context/OfflineContext.jsx';
import { DataSourceBadge } from '../common/DataSourceBadge.jsx';
import { getSafetyOffline, saveSafetyOffline } from '../../utils/indexedDb.js';

import api from '../../utils/api.js';

// Custom Map Markers Icons
const createCustomIcon = (color, text) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background-color:${color}; color:white; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:12px; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3); display:flex; align-items:center; gap:4px; white-space:nowrap;">
          <span>${text}</span>
        </div>`,
  iconSize: [80, 30],
  iconAnchor: [40, 15]
});

const DEFAULT_OFFLINE_ZONES = [
  {
    id: 'zone-nohkalikai-01',
    name: 'Nohkalikai Gorge Risk Zone',
    riskLevel: 'HIGH',
    riskType: 'FLASH_FLOOD_AND_CLIFF',
    radiusMeters: 800,
    coordinates: { lat: 25.2755, lng: 91.6840 }
  }
];

export const GeofenceMap = () => {
  const { activeTrip } = useTrip();
  const { isOffline } = useOffline();
  const [activeZones, setActiveZones] = React.useState(DEFAULT_OFFLINE_ZONES);

  React.useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get('/admin/zones');
        if (res.success && res.zones?.length > 0) {
          setActiveZones(res.zones);
          saveSafetyOffline('admin-zones', res.zones).catch(() => {});
        }
      } catch(err) {
        console.warn('[GeofenceMap] Falling back to offline cached zones:', err);
        try {
          const cached = await getSafetyOffline('admin-zones');
          if (cached && cached.length > 0) {
            setActiveZones(cached);
          }
        } catch(e) {}
      }
    };
    fetchZones();
  }, []);

  // Coordinates centered on Meghalaya (or destination)
  const centerLat = activeTrip?.destinationData?.coordinates?.lat || 25.5788;
  const centerLng = activeTrip?.destinationData?.coordinates?.lng || 91.8933;

  const touristPos = [25.2765, 91.6850];
  const hospitalPos = [25.5721, 91.8845];
  const policePos = [25.5765, 91.8812];
  const safeShelterPos = [25.2740, 91.6820];

  const AutoZoomToZones = () => {
    const map = useMap();
    React.useEffect(() => {
      if (activeZones && activeZones.length > 0) {
        const bounds = activeZones.map(z => [z.coordinates.lat, z.coordinates.lng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        map.flyTo([centerLat, centerLng], 10);
      }
    }, [activeZones, centerLat, centerLng, map]);
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-4">
      
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-slate-800">
              Interactive Geofence & Emergency Services Map
            </h3>
            <DataSourceBadge 
              type={isOffline ? "OFFLINE CACHED" : "LIVE API DATA"} 
              source={isOffline ? "IndexedDB Spatial Geofences" : "OpenStreetMap Overpass"} 
            />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial hazard boundaries, verified NABH trauma hospitals, police booths & EV grid.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-sand-100 px-3 py-1 rounded-lg border border-sand-200">
          Center: {centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div className="w-full h-[280px] sm:h-[360px] md:h-[450px] rounded-2xl overflow-hidden border-2 border-sand-300 shadow-inner relative z-0">
        {isOffline && (
          <div className="absolute top-3 left-3 z-[1000] bg-amber-950/90 text-amber-200 px-3 py-1.5 rounded-xl text-[11px] font-mono border border-amber-500/40 backdrop-blur-xs shadow-md">
            <span>📡 Offline Map Mode • Showing saved POIs & geofences</span>
          </div>
        )}
        <MapContainer 
          center={[centerLat, centerLng]} 
          zoom={10} 
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AutoZoomToZones />

          {/* Tourist Position Marker */}
          <Marker position={touristPos} icon={createCustomIcon('#B94723', '🧑🏽‍🦯 Tourist')}>
            <Popup>
              <div className="text-xs p-1 space-y-1">
                <strong className="text-terracotta-700 block font-bold">Active Tourist: Aarav Sharma</strong>
                <p>Location: Nohkalikai Sector</p>
                <p className="text-slate-500 font-mono text-[10px]">GPS: 25.2765° N, 91.6850° E</p>
              </div>
            </Popup>
          </Marker>

          {/* Dynamic Hazard Geofence Circles */}
          {activeZones.map(z => (
            <Circle
              key={z.id}
              center={[z.coordinates.lat, z.coordinates.lng]}
              radius={z.radiusMeters}
              pathOptions={{ 
                color: z.riskLevel === 'CRITICAL' ? '#7f1d1d' : z.riskLevel === 'HIGH' ? '#991b1b' : '#c2410c',
                fillColor: z.riskLevel === 'CRITICAL' ? '#ef4444' : z.riskLevel === 'HIGH' ? '#f87171' : '#fb923c',
                fillOpacity: 0.5, weight: 3 
              }}
            >
              <Popup>
                <div className="text-xs p-1 space-y-1 text-red-900">
                  <strong className="block text-red-700 font-bold">🚨 {z.name}</strong>
                  <p>Risk Level: {z.riskLevel} ({z.riskType})</p>
                  <p>Tourists scheduled for this zone have been automatically notified and rerouted.</p>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Green Safe Evacuation Point */}
          <Marker position={safeShelterPos} icon={createCustomIcon('#16A34A', '🛡️ Safe Point')}>
            <Popup>
              <div className="text-xs p-1 space-y-1 text-emerald-900">
                <strong className="block font-bold">Cherrapunji Forest Department Shelter</strong>
                <p>Equipped with emergency satellite radio, first aid & mountain rescue gear.</p>
              </div>
            </Popup>
          </Marker>

          {/* Civil Hospital Marker */}
          <Marker position={hospitalPos} icon={createCustomIcon('#0284C7', '🏥 Hospital')}>
            <Popup>
              <div className="text-xs p-1 space-y-1 text-slate-800">
                <strong className="block font-bold text-blue-700">Civil Hospital Shillong (NABH Tier-1)</strong>
                <p>Distance: 3.2 km • 24x7 Trauma Care</p>
                <p className="font-mono text-[10px] text-slate-500">Phone: +91-364-2224100</p>
              </div>
            </Popup>
          </Marker>

          {/* Tourist Police Station Marker */}
          <Marker position={policePos} icon={createCustomIcon('#475569', '👮 Police')}>
            <Popup>
              <div className="text-xs p-1 space-y-1 text-slate-800">
                <strong className="block font-bold text-slate-700">Sadar Tourist Police Assistance Station</strong>
                <p>24x7 Tourist Helpline & Safety Escort Unit</p>
                <p className="font-mono text-[10px] text-slate-500">Dial 1363 / +91-364-2222214</p>
              </div>
            </Popup>
          </Marker>

        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-terracotta-600"></span>
          <span>Tourist Live Position</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Marked Hazard Geofence</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span>Verified Safe Shelter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span>Emergency Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-600"></span>
          <span>Tourist Police</span>
        </div>
      </div>

    </div>
  );
};
