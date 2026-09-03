import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles,
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Compass, 
  TreePine, 
  Palmtree, 
  Mountain, 
  Landmark, 
  Utensils, 
  Waves, 
  ArrowRight, 
  ShieldCheck, 
  Leaf,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import api from '../../utils/api.js';
import { useTrip } from '../../context/TripContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import confetti from 'canvas-confetti';

export const TOP_INDIAN_DESTINATIONS = [
  { value: 'Taj Mahal', label: '1. Taj Mahal & Agra Fort (Uttar Pradesh)', state: 'Uttar Pradesh', lat: 27.1751, lng: 78.0421 },
  { value: 'Varanasi', label: '2. Varanasi Sacred Ghats & Kashi (Uttar Pradesh)', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { value: 'Hampi', label: '3. Hampi Vijayanagara Ruins (Karnataka)', state: 'Karnataka', lat: 15.3350, lng: 76.4600 },
  { value: 'Golden Temple', label: '4. Golden Temple (Amritsar, Punjab)', state: 'Punjab', lat: 31.6200, lng: 74.8765 },
  { value: 'Konark', label: '5. Konark Sun Temple & Chandrabhaga (Odisha)', state: 'Odisha', lat: 19.8876, lng: 86.0945 },
  { value: 'Meenakshi', label: '6. Meenakshi Amman Temple (Madurai, Tamil Nadu)', state: 'Tamil Nadu', lat: 9.9195, lng: 78.1193 },
  { value: 'Jaisalmer', label: '7. Jaisalmer Living Fort & Thar Desert (Rajasthan)', state: 'Rajasthan', lat: 26.9157, lng: 70.9083 },
  { value: 'Alleppey', label: '8. Alleppey & Vembanad Backwaters (Kerala)', state: 'Kerala', lat: 9.4981, lng: 76.3388 },
  { value: 'Ajanta', label: '9. Ajanta & Ellora Caves (Maharashtra)', state: 'Maharashtra', lat: 20.5519, lng: 75.7033 },
  { value: 'Meghalaya', label: '10. Mawlynnong & Nongriat Living Roots (Meghalaya)', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 }
];

export const PlannerForm = ({ onGenerated }) => {
  const { generateTrip, generating } = useTrip();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeZones, setActiveZones] = useState([]);
  useEffect(() => {
    api.get('/admin/zones').then(res => {
      if(res.success) setActiveZones(res.zones || []);
    }).catch(console.error);
  }, []);

  
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  var R = 6371e3;
  var dLat = (lat2-lat1) * (Math.PI/180);
  var dLon = (lon2-lon1) * (Math.PI/180); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

  const isDangerZone = (destValue) => {
    if (!destValue) return false;
    const destObj = TOP_INDIAN_DESTINATIONS.find(d => d.value === destValue);
    
    const stringMatch = activeZones.some(z => 
      destValue.toLowerCase().includes(z.name.toLowerCase()) || 
      z.name.toLowerCase().includes(destValue.toLowerCase()) ||
      (destObj && (destObj.label.toLowerCase().includes(z.name.toLowerCase()) || z.name.toLowerCase().includes(destObj.label.toLowerCase())))
    );

    if (stringMatch) return true;
    
    if (destObj && destObj.lat && destObj.lng) {
      return activeZones.some(z => {
        const dist = getDistanceFromLatLonInM(destObj.lat, destObj.lng, z.coordinates.lat, z.coordinates.lng);
        return dist <= z.radiusMeters;
      });
    }

    return false;
  };


  const initialGeneratedRef = useRef(false);

  const queryOrigin = searchParams.get('origin');
  const queryDest = searchParams.get('dest') || searchParams.get('destination');
  const queryTransport = searchParams.get('transport');

  const [formData, setFormData] = useState({
    origin: queryOrigin || user?.homeCity || 'Delhi',
    destination: queryDest || 'Taj Mahal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    travellers: 2,
    budget: 40000,
    travelStyle: user?.travelStyle?.includes('Eco') ? 'Eco' : user?.travelStyle?.includes('Cultural') ? 'Cultural' : 'Eco',
    preferredTransport: queryTransport || 'Train',
    interests: ['Waterfalls', 'Mountains', 'Heritage', 'Villages']
  });

  // Sync user home city if available
  useEffect(() => {
    if (user?.homeCity && !queryOrigin) {
      setFormData(prev => ({ ...prev, origin: user.homeCity }));
    }
  }, [user]);

  useEffect(() => {
    if (queryOrigin || queryDest || queryTransport) {
      const targetOrigin = queryOrigin || user?.homeCity || 'Delhi';
      const targetDest = queryDest || 'Taj Mahal';
      const targetTransport = queryTransport || 'Train';

      setFormData(prev => ({
        ...prev,
        origin: targetOrigin,
        destination: targetDest,
        preferredTransport: targetTransport
      }));
    }
  }, [queryOrigin, queryDest, queryTransport, user?.homeCity]);

  const travelStyles = [
    { id: 'Eco', label: 'Eco-Friendly', icon: Leaf, desc: 'Homestays, carbon-neutral routes & organic food' },
    { id: 'Adventure', label: 'Adventure', icon: Mountain, desc: 'Rainforest treks, living root bridges, caving' },
    { id: 'Cultural', label: 'Cultural & Heritage', icon: Landmark, desc: 'Tribal folklore, indigenous museums, crafts' },
    { id: 'Budget', label: 'Budget Conscious', icon: IndianRupee, desc: 'Scenic trains, hostels & local shared transit' },
    { id: 'Luxury', label: 'Luxury Eco-Resort', icon: Sparkles, desc: 'High-end bio-villas, private electric transfers' },
    { id: 'Family', label: 'Family & Leisure', icon: Users, desc: 'Safe trails, comfortable stays & guided tours' }
  ];

  const interestOptions = [
    { id: 'Waterfalls', label: 'Waterfalls & Plunges', icon: Waves },
    { id: 'Mountains', label: 'Misty Mountains', icon: Mountain },
    { id: 'Villages', label: 'Offbeat Tribal Villages', icon: TreePine },
    { id: 'Heritage', label: 'UNESCO & Sacred Heritage', icon: Landmark },
    { id: 'Food', label: 'Indigenous Food & Teas', icon: Utensils },
    { id: 'Low-crowd places', label: 'Zero-Crowd Hidden Spots', icon: Compass }
  ];

  const handleInterestToggle = (id) => {
    setFormData(prev => {
      const exists = prev.interests.includes(id);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(item => item !== id) : [...prev.interests, id]
      };
    });
  };

  const handleQuickDestinationSelect = (destVal) => {
    const updated = { ...formData, destination: destVal };
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trip = await generateTrip(formData);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#064E3B', '#10B981', '#F59E0B', '#E2725B']
      });
      if (onGenerated) onGenerated(trip);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card bg-white rounded-4xl p-6 sm:p-8 shadow-glass border border-sand-300 space-y-6 text-slate-900">
      
      {/* Form Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-200">
        <div>
          <h2 className="font-sora text-xl sm:text-2xl font-extrabold text-slate-900">
            Configure Your Journey
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
            Real-time multi-modal logistics, open weather sync & deterministic budget computation across Incredible India.
          </p>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {['Taj Mahal', 'Varanasi', 'Hampi', 'Golden Temple', 'Meghalaya'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleQuickDestinationSelect(preset)}
              className={`px-3 py-1 rounded-xl text-[11px] font-sora font-bold transition-all cursor-pointer ${
                formData.destination.toLowerCase().includes(preset.toLowerCase())
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'bg-sand-100 hover:bg-sand-200 text-slate-700 border border-sand-300'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Origin City */}
        <div className="space-y-1.5">
          <label className="text-xs font-sora font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>From (Origin City)</span>
          </label>
          <input
            type="text"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            placeholder="e.g. Delhi, Mumbai, Bengaluru, Kolkata, Chennai"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            required
          />
        </div>

        {/* Destination Dropdown / Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-sora font-bold text-slate-800 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>To (Destination Sanctuary or City)</span>
          </label>
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
            required
          >
            {TOP_INDIAN_DESTINATIONS.map((dest) => (
              <option key={dest.value} value={dest.value}>
                {dest.label}
              </option>
            ))}
          </select>

          {isDangerZone(formData.destination) && (
            <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-xl flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Currently danger zone by government</span>
              </div>
              <Link to={`/?dest=${encodeURIComponent(formData.destination)}#danger-map`} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg text-center cursor-pointer transition-colors w-max">
                View on Map
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Dates, Travellers & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-sora font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Start Date</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-sora font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>End Date</span>
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-sora font-bold text-slate-800 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Travellers</span>
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.travellers}
            onChange={(e) => setFormData({ ...formData, travellers: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-sora font-bold text-slate-800 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
            <span>Target Budget (INR)</span>
          </label>
          <input
            type="number"
            step="500"
            min="2000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            placeholder="e.g. 10000, 25000"
            required
          />
        </div>
      </div>

      {/* Row 3: Travel Style Selection */}
      <div className="space-y-2">
        <label className="text-xs font-sora font-bold text-slate-800 block">
          Choose Travel Style & Sustainability Priority
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {travelStyles.map((style) => {
            const Icon = style.icon;
            const isSelected = formData.travelStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setFormData({ ...formData, travelStyle: style.id })}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div>
                  <div className={`font-sora font-bold text-xs ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {style.label}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    {style.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={generating}
          className="w-full py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-sora font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer disabled:opacity-70 group"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              <span>Computing Multi-Modal Routes & Budget for {formData.destination}...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Generate Dynamic Itinerary for {formData.destination} ➔</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
