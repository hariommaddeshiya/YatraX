import React from 'react';
import { 
  Train, 
  Plane, 
  Bus, 
  Car, 
  Zap, 
  ShieldCheck, 
  Leaf, 
  Clock, 
  IndianRupee, 
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.jsx';
import { DataSourceBadge } from '../common/DataSourceBadge.jsx';

export const TransportSelector = () => {
  const { activeTrip, changeTransportMode } = useTrip();

  if (!activeTrip || !activeTrip.transportOptions || !Array.isArray(activeTrip.transportOptions)) return null;

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Train': return Train;
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'EV': return Zap;
      case 'Taxi': return Car;
      default: return Car;
    }
  };

  const selectedMode = activeTrip.selectedTransport?.mode || 'Train';
  const otherExpensesTotal = (Number(activeTrip.budgetBreakdown?.hotelCost) || 0) + 
                             (Number(activeTrip.budgetBreakdown?.foodCost) || 0) + 
                             (Number(activeTrip.budgetBreakdown?.sightseeingCost) || Number(activeTrip.budgetBreakdown?.ticketsCost) || 0) + 
                             (Number(activeTrip.budgetBreakdown?.localTransitCost) || Number(activeTrip.budgetBreakdown?.localTravelCost) || 0) + 
                             (Number(activeTrip.budgetBreakdown?.bufferCost) || 0);

  const budgetCeiling = Number(activeTrip.userBudget || activeTrip.budgetLimit || activeTrip.budgetBreakdown?.budgetLimit || 40000);

  return (
    <div className="glass-card bg-white rounded-4xl p-6 sm:p-8 border border-sand-300 shadow-glass space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-forest-100 text-forest-800 font-bold px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider">
              Multi-Modal Matrix
            </span>
            <DataSourceBadge type="CALCULATED DATA" source="Distance & Tariff Grid" />
          </div>
          <h3 className="font-sora text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Compare Transport Modes & Carbon Footprint
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any mode. The <strong>entire trip budget and eco score recalculate in real-time</strong>.
          </p>
        </div>

        <div className="text-xs text-slate-700 bg-sand-100 px-3.5 py-2 rounded-2xl border border-sand-300 font-mono shadow-2xs self-start sm:self-auto">
          Route: <strong className="text-forest-900">{activeTrip.origin}</strong> ➔ <strong className="text-forest-900">{activeTrip.destination}</strong> ({activeTrip.travellers || 2} Travellers)
        </div>
      </div>

      {/* Transport Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTrip.transportOptions.map((opt) => {
          const Icon = getModeIcon(opt.mode);
          const isSelected = selectedMode.toLowerCase() === (opt.mode || '').toLowerCase();
          const optionCost = Number(opt.totalCostInr || opt.costInr || 0);
          const projectedTripTotal = optionCost + otherExpensesTotal;
          const isOverLimit = projectedTripTotal > budgetCeiling;
          const duration = opt.travelTimeHours || opt.durationHours || 12;

          return (
            <div
              key={opt.mode}
              onClick={() => changeTransportMode(opt.mode)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-forest-700 bg-forest-50/80 shadow-md ring-2 ring-forest-600/20'
                  : 'border-sand-300 bg-white hover:bg-sand-50/50 hover:border-forest-300 shadow-2xs'
              }`}
            >
              <div>
                {/* Badge & Recommended Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-forest-800 text-white' : 'bg-sand-100 text-slate-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sora font-bold text-sm text-slate-900">{opt.mode}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{opt.badge}</span>
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold px-2 py-0.5 rounded-xl bg-white border border-sand-200 text-slate-800 shadow-2xs">
                      Score: <span className="text-forest-700 font-extrabold">{opt.overallScore || 85}</span>/100
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-sand-50/80 p-3 rounded-2xl border border-sand-200">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-medium block">Duration</span>
                    <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {duration} hrs
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-medium block">Carbon / Person</span>
                    <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      {opt.co2Kg || opt.carbonKg || 18} kg CO₂
                    </span>
                  </div>
                </div>

                {/* Fare & Total Impact */}
                <div className="space-y-1.5 pt-2 border-t border-sand-200">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Mode Fare:</span>
                    <span className="font-mono font-extrabold text-base text-slate-900">
                      ₹{optionCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-[11px] bg-sand-100/70 px-2.5 py-1.5 rounded-xl">
                    <span className="text-slate-600 font-medium">Projected Trip Total:</span>
                    <strong className={`font-mono ${isOverLimit ? 'text-red-700' : 'text-forest-800'}`}>
                      ₹{Math.round(projectedTripTotal).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Selection Status */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                <span className={`text-[11px] font-sora font-bold flex items-center gap-1 ${isSelected ? 'text-forest-800' : 'text-slate-400'}`}>
                  {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" /> : <div className="w-3.5 h-3.5 rounded-full border border-sand-400"></div>}
                  {isSelected ? 'Active Selection' : 'Select Mode'}
                </span>

                {(opt.overallScore || 0) >= 90 && (
                  <span className="text-[9px] bg-emerald-100 text-forest-800 font-bold px-2 py-0.5 rounded-md uppercase font-mono">
                    Green Pick
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
