const fs = require('fs');

const files = [
  './client/src/components/home/DangerZoneMap.jsx',
  './client/src/components/safety/GeofenceMap.jsx',
  './client/src/components/admin/AdminGeofenceMap.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add isolate to force a new stacking context on the map container
    if (content.includes('border-sand-300 z-0')) {
        content = content.replace('border-sand-300 z-0', 'border-sand-300 isolate relative z-0');
    }
    
    // For Admin and Safety Maps
    if (content.includes('overflow-hidden relative"')) {
        content = content.replace('overflow-hidden relative"', 'overflow-hidden relative isolate z-0"');
    }

    fs.writeFileSync(file, content);
  }
});
console.log('fixed z-index');
