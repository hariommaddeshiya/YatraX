import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Leaf, 
  CloudRain, 
  Sun, 
  Users, 
  Building2, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  TreePine,
  Waves,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.jsx';
import { DataSourceBadge } from '../common/DataSourceBadge.jsx';

export const ItineraryTimeline = () => {
  const { activeTrip } = useTrip();

  if (!activeTrip || !activeTrip.itinerary || !Array.isArray(activeTrip.itinerary)) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sora text-xl font-bold text-slate-900">
              Live Adaptive Itinerary Timeline
            </h3>
            <span className="text-xs bg-eco-100 text-eco-800 font-bold px-2 py-0.5 rounded-full border border-eco-200">
              {activeTrip.totalDays || 6} Days Structured Schedule
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-adjusts to Open-Meteo weather risks, crowd footfalls, and budget triggers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <DataSourceBadge type="LIVE API DATA" source="Open-Meteo & Crowd Engine" />
        </div>
      </div>

      {/* Days Timeline */}
      <div className="space-y-6">
        {activeTrip.itinerary.map((day) => (
          <div 
            key={day.day} 
            className="p-5 sm:p-6 rounded-2xl bg-sand-50/60 border border-sand-300 space-y-4 hover:bg-sand-50 transition-colors"
          >
            {/* Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-sora font-bold text-base flex items-center justify-center shadow-xs">
                  D{day.day}
                </div>
                <div>
                  <h4 className="font-sora font-bold text-slate-900 text-base">
                    Day {day.day}: {day.theme}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="font-mono">{day.date}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{activeTrip.destination}</span>
                  </div>
                </div>
              </div>

              {/* Day Weather Indicator */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-sand-300 text-xs text-slate-700 shadow-2xs">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-semibold font-mono">
                  {day.weather?.tempC || 24}°C • {day.weather?.condition || 'Optimal'}
                </span>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-emerald-300">
              {(day.activities || []).map((act) => {
                const isReplaced = act.isReplaced;
                const isWeatherRisk = act.weatherRisk === 'HIGH';
                const isCrowdSurge = (act.crowdPercentage || 0) > 80;
                const cost = Number(act.estimatedCostInr || 0);

                return (
                  <div 
                    key={act.id || act.title} 
                    className={`p-4 rounded-xl border transition-all ${
                      isReplaced
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                        : isWeatherRisk
                        ? 'bg-red-50/70 border-red-300'
                        : 'bg-white border-sand-200 shadow-2xs'
                    }`}
                  >
                    {/* Activity Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-sand-100 px-2 py-0.5 rounded border border-sand-200">
                            {act.time || '10:00 AM'}
                          </span>
                          <h5 className="font-bold text-sm text-slate-900">
                            {act.title}
                          </h5>
                          {isReplaced && (
                            <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                              ✨ Weather-Adapted Alternative
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      {/* Right Meta (Price & Carbon) */}
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-xs text-slate-900">
                          {cost > 0 ? `₹${cost.toLocaleString('en-IN')}` : 'Included'}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-0.5">
                          <Leaf className="w-3 h-3" />
                          <span>{act.carbonKg || 0.4} kg CO₂</span>
                        </div>
                      </div>
                    </div>

                    {/* Replacement Explanation Callout */}
                    {isReplaced && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-200 text-[11px] text-emerald-900 font-medium">
                        <strong>Reason:</strong> {act.replacementReason}
                      </div>
                    )}

                    {/* Activity Telemetry Chips */}
                    <div className="mt-3 pt-2.5 border-t border-sand-100 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${act.isOutdoor ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                        {act.isOutdoor ? '🌿 Outdoor Trail' : '🏛️ Indoor Cultural Site'}
                      </span>

                      {/* Crowd Tag */}
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        isCrowdSurge 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-sand-100 text-slate-700 border border-sand-300'
                      }`}>
                        👥 Crowd: {act.crowdPercentage || 25}% ({act.crowdForecast || 'Normal'})
                      </span>

                      {/* Weather Risk Tag */}
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        act.weatherRisk === 'HIGH' 
                          ? 'bg-red-100 text-red-800 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        🌧️ Risk: {act.weatherRisk || 'LOW'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Night Stay / Accommodation Card */}
            {day.stay && (
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                day.stay.isSubstituted 
                  ? 'bg-amber-50/80 border-amber-300' 
                  : 'bg-white border-sand-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sand-100 rounded-lg text-emerald-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Overnight Stay: {day.stay.name || 'Verified Eco-Stay'}</span>
                      {day.stay.ecoCertified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          Eco-Certified
                        </span>
                      )}
                      {day.stay.isSubstituted && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                          Auto-Rebudgeted
                        </span>
                      )}
                    </div>
                    {day.stay.substitutionReason && (
                      <span className="text-[10px] text-amber-800">{day.stay.substitutionReason}</span>
                    )}
                  </div>
                </div>

                <div className="font-mono font-bold text-slate-800 shrink-0">
                  ₹{Number(day.stay.pricePerNightInr || day.stay.pricePerNight || day.stay.costPerNightInr || 2500).toLocaleString('en-IN')} / night
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
