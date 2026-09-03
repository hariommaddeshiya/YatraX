const fs = require('fs');
const path = './client/src/components/home/DangerZoneMap.jsx';
let content = fs.readFileSync(path, 'utf8');

const newAutoZoom = `
const AutoZoomToZones = ({ zones }) => {
  const map = useMap();
  useEffect(() => {
    if (zones && zones.length > 0) {
      try {
        const bounds = zones.map(z => [z.coordinates.lat, z.coordinates.lng]);
        if (bounds.length === 1) {
          map.flyTo(bounds[0], 12);
        } else {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      } catch (err) {
        console.error('FitBounds error:', err);
      }
    }
  }, [zones, map]);
  return null;
};
`;

content = content.replace(/const AutoZoomToZones = \(\{ zones \}\) => \{[\s\S]*?return null;\n\};/, newAutoZoom);
fs.writeFileSync(path, content);
console.log('patched zoom');
