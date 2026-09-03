import React, { useState, useEffect, useMemo, Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Layers, 
  Search, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Satellite, 
  ChevronRight, 
  RotateCcw
} from 'lucide-react';

// Fix Leaflet default icon issues in Vite/Webpack bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// React Error Boundary to guarantee 100% crash protection
export class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.warn('Map Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-[#061816] rounded-3xl border border-emerald-500/40 text-white space-y-4">
          <Compass className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
          <h4 className="text-lg font-bold font-sora text-white">Bharat Interactive Atlas</h4>
          <p className="text-sm text-slate-200 max-w-md mx-auto">
            Reloading the real interactive map view.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sora font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Reload Live Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// User-provided Carto API Key
const CARTO_API_KEY = 'cb1_2uue_1_f47758202b64f1105b7247ab';

// Accurate Non-Overlapping Geographic Coordinates for all 36 Indian States & Union Territories
export const REAL_INDIA_STATES_COORDS = {
  'ladakh': { lat: 34.2000, lng: 77.6000, code: 'LA', zoom: 7 },
  'jammu-kashmir': { lat: 33.7000, lng: 75.3000, code: 'JK', zoom: 7 },
  'himachal-pradesh': { lat: 31.8000, lng: 77.2000, code: 'HP', zoom: 7 },
  'punjab': { lat: 30.9000, lng: 75.3000, code: 'PB', zoom: 7 },
  'uttarakhand': { lat: 30.1500, lng: 79.2000, code: 'UK', zoom: 7 },
  'haryana': { lat: 29.2000, lng: 76.1000, code: 'HR', zoom: 7 },
  'delhi': { lat: 28.6139, lng: 77.2090, code: 'DL', zoom: 9 },
  'rajasthan': { lat: 26.8000, lng: 73.8000, code: 'RJ', zoom: 6 },
  'uttar-pradesh': { lat: 26.8467, lng: 80.9462, code: 'UP', zoom: 6 },
  'bihar': { lat: 25.4000, lng: 85.5000, code: 'BR', zoom: 7 },
  'sikkim': { lat: 27.5330, lng: 88.5122, code: 'SK', zoom: 8 },
  'west-bengal': { lat: 23.3000, lng: 87.8550, code: 'WB', zoom: 6 },
  'jharkhand': { lat: 23.6102, lng: 85.2799, code: 'JH', zoom: 7 },
  'odisha': { lat: 20.6000, lng: 84.8000, code: 'OD', zoom: 6 },
  'chhattisgarh': { lat: 21.2787, lng: 81.8661, code: 'CG', zoom: 6 },
  'madhya-pradesh': { lat: 23.2000, lng: 77.8000, code: 'MP', zoom: 6 },
  'gujarat': { lat: 22.4000, lng: 71.4000, code: 'GJ', zoom: 6 },
  'maharashtra': { lat: 19.5000, lng: 75.8000, code: 'MH', zoom: 6 },
  'goa': { lat: 15.3500, lng: 74.0500, code: 'GA', zoom: 9 },
  'karnataka': { lat: 14.8000, lng: 75.8000, code: 'KA', zoom: 6 },
  'telangana': { lat: 17.9000, lng: 79.1000, code: 'TS', zoom: 7 },
  'andhra-pradesh': { lat: 15.6000, lng: 79.8000, code: 'AP', zoom: 6 },
  'tamil-nadu': { lat: 11.0000, lng: 78.5000, code: 'TN', zoom: 6 },
  'kerala': { lat: 10.4000, lng: 76.4000, code: 'KL', zoom: 7 },
  'assam': { lat: 26.2006, lng: 92.9376, code: 'AS', zoom: 7 },
  'arunachal-pradesh': { lat: 28.2180, lng: 94.7278, code: 'AR', zoom: 7 },
  'meghalaya': { lat: 25.4670, lng: 91.3662, code: 'ML', zoom: 8 },
  'nagaland': { lat: 26.1584, lng: 94.5624, code: 'NL', zoom: 8 },
  'manipur': { lat: 24.6637, lng: 93.9063, code: 'MN', zoom: 8 },
  'mizoram': { lat: 23.1645, lng: 92.9376, code: 'MZ', zoom: 8 },
  'tripura': { lat: 23.8000, lng: 91.8000, code: 'TR', zoom: 8 },
  'andaman-nicobar': { lat: 11.7401, lng: 92.6586, code: 'AN', zoom: 7 },
  'lakshadweep': { lat: 10.5667, lng: 72.6417, code: 'LD', zoom: 8 },
  'puducherry': { lat: 11.9300, lng: 79.8300, code: 'PY', zoom: 9 },
  'chandigarh-ut': { lat: 30.7333, lng: 76.7794, code: 'CH', zoom: 9 },
  'dadra-nagar-haveli-daman-diu': { lat: 20.3000, lng: 72.9000, code: 'DN', zoom: 8 }
};

// Regional Centers for smooth panning
const REGION_BOUNDS = {
  'ALL': { center: [22.5937, 79.9629], zoom: 5 },
  'North': { center: [31.5, 76.5], zoom: 6 },
  'South': { center: [13.0, 77.5], zoom: 6 },
  'West': { center: [22.5, 73.0], zoom: 6 },
  'East': { center: [23.5, 86.5], zoom: 6 },
  'Central': { center: [22.5, 80.0], zoom: 6 },
  'Northeast': { center: [26.0, 93.0], zoom: 6 }
};

// Helper component to control Leaflet viewport animations
const MapViewController = ({ targetCenter, targetZoom }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCenter && targetZoom && map) {
      try {
        map.flyTo(targetCenter, targetZoom, {
          duration: 1.2,
          easeLinearity: 0.25
        });
      } catch (err) {
        console.warn('Map flyTo error:', err);
      }
    }
  }, [targetCenter, targetZoom, map]);
  return null;
};

export const IndiaInteractiveMap = ({ statesData = [], onSelectState }) => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [mapTheme, setMapTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetView, setTargetView] = useState(REGION_BOUNDS['ALL']);

  // Map state metadata by ID
  const dataLookup = useMemo(() => {
    const map = new Map();
    (statesData || []).forEach(s => {
      if (s && s.id) map.set(s.id, s);
    });
    return map;
  }, [statesData]);

  // Carto Tile layers configured with User's Carto API key
  const tileLayers = {
    dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${CARTO_API_KEY}`,
    voyager: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${CARTO_API_KEY}`,
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const handleRegionChange = (regId) => {
    setSelectedRegion(regId);
    if (REGION_BOUNDS[regId]) {
      setTargetView(REGION_BOUNDS[regId]);
    }
  };

  const handleStateClick = (stateData) => {
    if (!stateData) return;
    const coord = REAL_INDIA_STATES_COORDS[stateData.id];
    if (coord) {
      setTargetView({ center: [coord.lat, coord.lng], zoom: coord.zoom || 7 });
    }
    if (onSelectState) {
      onSelectState(stateData);
    }
  };

  const handleSelectStateSearch = (e) => {
    const stateId = e.target.value;
    setSearchQuery(stateId);
    if (stateId && REAL_INDIA_STATES_COORDS[stateId]) {
      const coord = REAL_INDIA_STATES_COORDS[stateId];
      setTargetView({ center: [coord.lat, coord.lng], zoom: coord.zoom || 7 });
      const stateObj = dataLookup.get(stateId);
      if (stateObj && onSelectState) {
        onSelectState(stateObj);
      }
    }
  };

  // Compact Non-Overlapping State Marker (e.g. "UP • 2/10" or "✓ UP • 10/10")
  const createStateHubIcon = (meta, completed = 0, total = 10, isCompleted = false) => {
    const isMastered = isCompleted || completed >= total;
    const isProgress = completed > 0 && !isMastered;

    const bgClass = isMastered
      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
      : isProgress
      ? 'bg-amber-600 text-white ring-2 ring-amber-300 shadow-md'
      : 'bg-slate-900/95 text-slate-100 border border-slate-700 shadow-sm';

    const pulse = isMastered
      ? `<span class="absolute -inset-1 rounded-full bg-emerald-400 opacity-60 animate-ping"></span>`
      : isProgress
      ? `<span class="absolute -inset-0.5 rounded-full bg-amber-400 opacity-40 animate-pulse"></span>`
      : '';

    const label = isMastered
      ? `✓ ${meta.code} • ${completed}/${total}`
      : `${meta.code} • ${completed}/${total}`;

    return L.divIcon({
      className: 'custom-state-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${pulse}
          <div class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${bgClass} transition-transform transform group-hover:scale-120 duration-150 flex items-center gap-1 whitespace-nowrap">
            <span>${label}</span>
          </div>
        </div>
      `,
      iconSize: [60, 22],
      iconAnchor: [30, 11]
    });
  };

  return (
    <MapErrorBoundary>
      <div className="bg-[#051F1C] text-white rounded-4xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-5">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* High-Contrast Professional Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>Interactive Tourism Progress Atlas</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sora text-white tracking-tight">
              Real Interactive Map of India
            </h3>
            
            <p className="text-sm font-medium text-slate-100 max-w-2xl leading-relaxed">
              Track your state-by-state journey across India. Click any state marker on the map to inspect its 10 heritage wonders and record visited sanctuaries.
            </p>
          </div>

          {/* Action Controls & Search */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Map Layer Theme Switcher */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-700 shadow-inner">
              <button
                onClick={() => setMapTheme('dark')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapTheme === 'dark'
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Dark Terrain View"
              >
                <Moon className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dark</span>
              </button>
              
              <button
                onClick={() => setMapTheme('voyager')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapTheme === 'voyager'
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Voyager Atlas View"
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Voyager</span>
              </button>
              
              <button
                onClick={() => setMapTheme('satellite')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapTheme === 'satellite'
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Satellite Imagery"
              >
                <Satellite className="w-3.5 h-3.5 text-sky-300" />
                <span>Satellite</span>
              </button>
            </div>

            {/* Quick State Select Jump */}
            <div className="relative">
              <select
                value={searchQuery}
                onChange={handleSelectStateSearch}
                className="bg-slate-900 border border-slate-700 text-white rounded-2xl px-3.5 py-2 text-xs font-sora font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-sm"
              >
                <option value="" className="bg-slate-900 text-white">Jump to State...</option>
                {Object.entries(REAL_INDIA_STATES_COORDS).map(([id, meta]) => {
                  const s = dataLookup.get(id);
                  const completed = s?.completedDestinations || 0;
                  const isDone = s?.isCompleted || completed >= 10;
                  return (
                    <option key={id} value={id} className="bg-slate-900 text-white">
                      {s ? s.name : meta.code} ({completed}/10) {isDone ? '✓' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-emerald-500/10 relative z-10">
          {[
            { id: 'ALL', label: '🇮🇳 All India (36)' },
            { id: 'North', label: '🏔️ North' },
            { id: 'South', label: '🌴 South' },
            { id: 'West', label: '🏜️ West' },
            { id: 'East', label: '🛕 East' },
            { id: 'Central', label: '🐅 Central' },
            { id: 'Northeast', label: '🌿 Northeast' }
          ].map((reg) => (
            <button
              key={reg.id}
              onClick={() => handleRegionChange(reg.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-semibold transition-all cursor-pointer ${
                selectedRegion === reg.id
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400 font-bold'
                  : 'bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Real Geographic Map Display */}
        <div 
          className="relative w-full rounded-3xl overflow-hidden border border-emerald-500/30 shadow-inner z-0"
          style={{ height: '620px', minHeight: '620px' }}
        >
          <MapContainer
            key={mapTheme}
            center={REGION_BOUNDS['ALL'].center}
            zoom={REGION_BOUNDS['ALL'].zoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            {/* Viewport flight animator */}
            <MapViewController 
              targetCenter={targetView.center} 
              targetZoom={targetView.zoom} 
            />

            {/* Base Tile Layer with Carto API Key */}
            <TileLayer 
              url={tileLayers[mapTheme]} 
              attribution=""
            />

            {/* Render 36 State Hubs with Completed / Total (e.g. "UP • 2/10") */}
            {Object.entries(REAL_INDIA_STATES_COORDS).map(([stateId, meta]) => {
              const data = dataLookup.get(stateId) || {
                id: stateId,
                name: stateId,
                completedDestinations: 0,
                totalDestinations: 10,
                percentage: 0,
                isCompleted: false,
                region: 'North',
                code: meta.code
              };

              const isMastered = data.isCompleted || (data.completedDestinations >= (data.totalDestinations || 10));
              const isDimmed = selectedRegion !== 'ALL' && data.region !== selectedRegion;

              if (isDimmed) return null;

              const completed = data.completedDestinations || 0;
              const total = data.totalDestinations || 10;

              return (
                <React.Fragment key={stateId}>
                  {/* Subtle Geographic State Pulse Circle */}
                  <Circle
                    center={[meta.lat, meta.lng]}
                    radius={isMastered ? 55000 : completed > 0 ? 40000 : 25000}
                    pathOptions={{
                      fillColor: isMastered ? '#10B981' : completed > 0 ? '#F59E0B' : '#3B82F6',
                      fillOpacity: isMastered ? 0.4 : completed > 0 ? 0.25 : 0.1,
                      color: isMastered ? '#34D399' : completed > 0 ? '#FBBF24' : 'rgba(255, 255, 255, 0.3)',
                      weight: isMastered ? 2 : 1
                    }}
                    eventHandlers={{
                      click: () => handleStateClick(data)
                    }}
                  />

                  {/* Compact Non-Overlapping State Hub Tag */}
                  <Marker
                    position={[meta.lat, meta.lng]}
                    icon={createStateHubIcon(meta, completed, total, data.isCompleted)}
                    eventHandlers={{
                      click: () => handleStateClick(data)
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-4 bg-slate-900 text-white rounded-2xl min-w-[230px] space-y-2.5 border border-emerald-500/40 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                          <h4 className="font-extrabold font-sora text-white text-sm">
                            {data.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                            {data.region}
                          </span>
                        </div>

                        <div className="text-xs space-y-1.5 text-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Exploration Status:</span>
                            <strong className="font-mono text-emerald-400 font-bold text-sm">
                              {completed} / {total} ({data.percentage || Math.round((completed / total) * 100)}%)
                            </strong>
                          </div>
                          <div className="flex justify-between text-amber-300 font-medium text-[11px]">
                            <span>Mastery Reward:</span>
                            <span>+500 XP Bonus</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStateClick(data)}
                          className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-sora font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <span>Inspect 10 Wonders</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}

          </MapContainer>

          {/* Minimalist Map Legend */}
          <div className="absolute bottom-4 left-4 z-400 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs text-white space-y-1.5 shadow-2xl">
            <div className="flex items-center justify-between gap-4 font-bold font-sora text-emerald-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>State Progress Index:</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-200 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></span>
                <span>Not Started (0/10)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>In Progress (1-9/10)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <span className="text-emerald-300 font-bold">Mastered (10/10 ✓)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </MapErrorBoundary>
  );
};
