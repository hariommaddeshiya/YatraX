const fs = require('fs');
const path = './client/src/context/TripContext.jsx';
let content = fs.readFileSync(path, 'utf8');

// Revert the bad change
content = content.replace("const [activeTrip,\n      setActiveTrip, setActiveTrip] = useState(null);", "const [activeTrip, setActiveTrip] = useState(null);");

// Add setActiveTrip to Provider value
if (!content.includes('setActiveTrip,\n      destinations')) {
  content = content.replace("value={{\n      activeTrip,\n      destinations,", "value={{\n      activeTrip,\n      setActiveTrip,\n      destinations,");
}

fs.writeFileSync(path, content);
console.log('fixed');
