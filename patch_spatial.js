const fs = require('fs');
const path = './client/src/components/planner/PlannerForm.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace TOP_INDIAN_DESTINATIONS
content = content.replace(/export const TOP_INDIAN_DESTINATIONS = \[[\s\S]*?\];/, `export const TOP_INDIAN_DESTINATIONS = [
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
];`);

// Add haversine function
const haversine = `
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
`;

// Replace isDangerZone
const newIsDangerZone = `
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
`;

content = content.replace(/const isDangerZone = [\s\S]*?};/, haversine + newIsDangerZone);
fs.writeFileSync(path, content);
console.log('spatial patch applied');
