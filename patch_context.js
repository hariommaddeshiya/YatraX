const fs = require('fs');
const path = './client/src/context/TripContext.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('setActiveTrip,')) {
    content = content.replace("activeTrip,", "activeTrip,\n      setActiveTrip,");
    fs.writeFileSync(path, content);
    console.log('patched');
} else {
    console.log('already patched');
}
