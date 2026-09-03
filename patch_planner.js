const fs = require('fs');
const path = './client/src/components/planner/PlannerForm.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add imports
if (!content.includes('import api from')) {
    content = content.replace("import { useTrip }", "import api from '../../utils/api.js';\nimport { useTrip }");
}
if (!content.includes('import { Link } from')) {
    content = content.replace("import { useSearchParams } from 'react-router-dom';", "import { useSearchParams, Link } from 'react-router-dom';");
}
if (!content.includes('AlertTriangle')) {
    content = content.replace("Sparkles,", "Sparkles,\n  AlertTriangle,");
}

// Add state for zones
if (!content.includes('const [activeZones, setActiveZones]')) {
    content = content.replace('const [searchParams] = useSearchParams();', 
`const [searchParams] = useSearchParams();
  const [activeZones, setActiveZones] = useState([]);
  useEffect(() => {
    api.get('/admin/zones').then(res => {
      if(res.success) setActiveZones(res.zones || []);
    }).catch(console.error);
  }, []);

  const isDangerZone = (destName) => {
    if (!destName) return false;
    return activeZones.some(z => 
      destName.toLowerCase().includes(z.name.toLowerCase()) || 
      z.name.toLowerCase().includes(destName.toLowerCase())
    );
  };
`);
}

// Add warning UI
const warningUI = `
          {isDangerZone(formData.destination) && (
            <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-xl flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Currently danger zone by government</span>
              </div>
              <Link to="/#danger-map" className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg text-center cursor-pointer transition-colors w-max">
                View on Map
              </Link>
            </div>
          )}
`;
if (!content.includes('Currently danger zone')) {
    content = content.replace('</select>\n        </div>', `</select>\n${warningUI}        </div>`);
}

fs.writeFileSync(path, content);
console.log('patched');
