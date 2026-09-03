import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext.jsx';
import { Map, MapPin, Calendar, IndianRupee, ArrowRight, Compass, Trash2 } from 'lucide-react';

export const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const { setActiveTrip } = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const rawConfirmed = localStorage.getItem('yatrax_confirmed_trips');
      if (rawConfirmed) {
        const list = JSON.parse(rawConfirmed);
        setTrips(list || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalSpent = trips.reduce((acc, trip) => {
    const cost = trip.budgetBreakdown?.estimatedTotalCost || 0;
    return acc + cost;
  }, 0);

  
  const handleDeleteTrip = (e, tripId) => {
    e.stopPropagation();
    const newTrips = trips.filter(t => t.id !== tripId);
    setTrips(newTrips);
    localStorage.setItem('yatrax_confirmed_trips', JSON.stringify(newTrips));
  };

  const handleOpenTrip = (trip) => {
    setActiveTrip(trip);
    navigate('/trip/detail');
  };

  if (trips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-sora font-bold text-slate-800">No Trips Planned Yet</h2>
        <p className="text-xs text-slate-500">Configure a personalized itinerary using the AI Multi-Modal Planner.</p>
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-6 py-3 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer"
        >
          <span>Open AI Trip Planner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Total Budget */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-950 to-slate-900 rounded-4xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-emerald-600/30 text-emerald-300 px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider border border-emerald-500/30">
              My Portfolio
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sora font-extrabold text-white">
            Confirmed Journeys
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Manage your multiple sustainable destinations across India.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md min-w-[200px]">
          <p className="text-xs text-emerald-300 font-mono font-bold mb-1 uppercase tracking-wider">Total Investment</p>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-amber-400" />
            <span className="text-3xl font-sora font-black text-white">
              {totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Trip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip, idx) => (
          <div 
            key={trip.id || idx}
            onClick={() => handleOpenTrip(trip)}
            className="glass-card bg-white rounded-3xl p-5 border border-sand-300 shadow-warm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-sand-100 text-slate-500 font-mono font-bold px-2 py-1 rounded-lg border border-sand-200">
                  #{trip.id?.slice(0,8) || 'TRIP'}
                </span>
                <button 
                  onClick={(e) => handleDeleteTrip(e, trip.id)}
                  className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                  title="Delete Trip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <Map className="w-3 h-3" />
                  {trip.totalDays} Days
                </span>
              </div>
              
              <h3 className="font-sora text-xl font-bold text-forest-950 flex flex-col">
                <span className="text-xs text-slate-500 font-normal mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-terracotta-500" />
                  {trip.origin}
                </span>
                <span>{trip.destination}</span>
              </h3>
            </div>

            <div className="pt-4 border-t border-sand-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-forest-800">
                  <IndianRupee className="w-4 h-4" />
                  <span>{trip.budgetBreakdown?.estimatedTotalCost?.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="w-full py-2.5 rounded-xl bg-sand-100 group-hover:bg-forest-800 group-hover:text-white text-forest-900 text-[11px] font-sora font-bold text-center transition-colors flex items-center justify-center gap-2">
                <span>View Full Itinerary</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}

        {/* Add New Destination Card */}
        <Link 
          to="/planner"
          className="rounded-3xl p-5 border-2 border-dashed border-sand-300 bg-sand-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center min-h-[220px]"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-sand-200 text-emerald-600">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-sora font-bold text-slate-800 text-sm">Add New Destination</h4>
            <p className="text-xs text-slate-500 mt-1">Plan another multi-modal journey</p>
          </div>
        </Link>
      </div>

    </div>
  );
};
