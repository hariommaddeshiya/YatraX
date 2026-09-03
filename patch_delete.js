const fs = require('fs');
const path = './client/src/pages/MyTripsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

if(!content.includes('Trash2')) {
  content = content.replace("ArrowRight, Compass } from 'lucide-react';", "ArrowRight, Compass, Trash2 } from 'lucide-react';");
}

const deleteFn = `
  const handleDeleteTrip = (e, tripId) => {
    e.stopPropagation();
    const newTrips = trips.filter(t => t.id !== tripId);
    setTrips(newTrips);
    localStorage.setItem('yatrax_confirmed_trips', JSON.stringify(newTrips));
  };
`;

if(!content.includes('handleDeleteTrip')) {
  content = content.replace("const handleOpenTrip = (trip) => {", deleteFn + "\n  const handleOpenTrip = (trip) => {");
}

const deleteButton = `
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
`;

content = content.replace(/<span className="text-\[10px\] bg-sand-100 text-slate-500 font-mono font-bold px-2 py-1 rounded-lg border border-sand-200">\s*#{trip.id\?\.slice\(0,8\) \|\| 'TRIP'}\s*<\/span>/, deleteButton);

fs.writeFileSync(path, content);
console.log('patched delete');
