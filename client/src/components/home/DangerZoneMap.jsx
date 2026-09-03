import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert } from 'lucide-react';
import api from '../../utils/api.js';

const MapController = ({ destinationQuery }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!destinationQuery) return;
    
    const searchLocation = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationQuery)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.flyTo([parseFloat(lat), parseFloat(lon)], 14);
        }
      } catch (err) {
        console.error("Geocoding error", err);
      }
    };
    
    // Add a small delay to avoid spamming the API on every keystroke
    const timeout = setTimeout(() => {
      searchLocation();
    }, 800);
    
    return () => clearTimeout(timeout);
  }, [destinationQuery, map]);

  return null;
};


const AutoZoomToZones = ({ zones }) => {
  const map = useMap();
  useEffect(() => {
    if (zones && zones.length > 0) {
      try {
        const bounds = zones.map(z => [z.coordinates.lat, z.coordinates.lng]);
        if (bounds.length === 1) {
          map.flyTo(bounds[0], 12);
        } else {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      } catch (err) {
        console.error('FitBounds error:', err);
      }
    }
  }, [zones, map]);
  return null;
};


export const DangerZoneMap = ({ destinationQuery }) => {
  const [activeZones, setActiveZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get('/admin/zones');
        if (res?.success) {
          setActiveZones(res.zones || []);
        }
      } catch(err) {
        console.error(err);
      }
    };
    fetchZones();
  }, []);

  return (
    <div className="w-full bg-white rounded-4xl p-6 border border-sand-300 shadow-glass space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-red-600" />
        <h3 className="font-sora text-lg font-bold text-forest-950">Live Government Danger Zones</h3>
      </div>
      <p className="text-xs text-slate-600">
        This map displays live hazard zones defined by the government. The map automatically centers on your selected destination.
      </p>
      
      <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-sand-300 isolate relative z-0">
        <MapContainer center={[22.5, 79.0]} zoom={4} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {!destinationQuery && <AutoZoomToZones zones={activeZones} />}
          <MapController destinationQuery={destinationQuery} />

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
                  <p>Travel restricted by Govt. Tourism Command.</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
