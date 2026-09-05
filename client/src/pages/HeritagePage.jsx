import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Landmark, 
  Sparkles, 
  Compass, 
  MapPin, 
  Volume2, 
  Layers, 
  Award, 
  ArrowRight, 
  Eye, 
  Search, 
  Filter, 
  Footprints 
} from 'lucide-react';
import api from '../utils/api.js';
import { PanoramaViewer } from '../components/heritage/PanoramaViewer.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

// 10 Master Sanctuaries of India for Instant Zero-Delay Rendering
const DEFAULT_10_HERITAGE_SITES = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal & Agra Fort',
    location: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    unescoHeritage: true,
    era: '1632 - 1653 CE',
    historicalSummary: 'Universal monument of love built from translucent white Makrana marble with Pietra Dura gemstone inlay, set amidst Persian Charbagh gardens along the Yamuna river.',
    culturalImportance: 'UNESCO World Heritage Wonder of the World and pinnacle of Mughal classical symmetry.',
    architectureStyle: 'Indo-Islamic White Makrana Marble Architecture',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Experience the acoustic echo under the 73-meter central dome and the intricate jade, jasper, and lapis lazuli inlays.'
  },
  {
    id: 'varanasi-ghats',
    name: 'Varanasi Ghats & Kashi Vishwanath',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    unescoHeritage: true,
    era: '11th Century BCE - Present',
    historicalSummary: 'Ancient sacred city of light along the holy Ganga with 84 historic stone ghats, evening Maha Ganga Aarti, classical music gharanas, and handloom silk weavers.',
    culturalImportance: 'Spiritual epicenter of Indian civilization and sacred liberation tirtha.',
    architectureStyle: 'Ancient Stepped Stone Riverfront Ghat Architecture',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Listen to the evening Vedic chants, resonant conch shells, and rhythmic brass lamp aartis at Dashashwamedh Ghat.'
  },
  {
    id: 'hampi-vijayanagara',
    name: 'Hampi Vijayanagara Ruins',
    location: 'Ballari',
    state: 'Karnataka',
    region: 'South',
    unescoHeritage: true,
    era: '1336 - 1565 CE',
    historicalSummary: 'Spectacular ruins of the medieval Vijayanagara Empire with monolithic stone chariots, 56 musical granite pillars, and ancient boulder-strewn hill horizons.',
    culturalImportance: 'UNESCO World Heritage site representing the zenith of South Indian empire architecture.',
    architectureStyle: 'Dravidian Granite Monolithic Sculpture',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Hear the unique resonant frequencies of the 56 monolithic musical pillars at the Vittala Temple complex.'
  },
  {
    id: 'golden-temple',
    name: 'Golden Temple (Harmandir Sahib)',
    location: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    unescoHeritage: true,
    era: '1577 - 1604 CE',
    historicalSummary: 'The holiest shrine of Sikhism clad in 500 kg of pure gold foil, resting at the center of the holy Amrit Sarovar lake and offering free communal meals (langar) to all.',
    culturalImportance: 'Universal sanctuary of equality, selfless service, and spiritual harmony.',
    architectureStyle: 'Sikh-Rajput Gilded Marble & Gold Foil Architecture',
    image: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Immerse in the 24x7 live Gurbani kirtan echoing across the serene waters of the sacred Amrit Sarovar.'
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    location: 'Puri',
    state: 'Odisha',
    region: 'East',
    unescoHeritage: true,
    era: '1250 CE',
    historicalSummary: 'Colossal 13th-century temple carved as a giant 24-wheeled chariot of Surya the Sun God, pulled by 7 sculpted horses along the Bay of Bengal coast.',
    culturalImportance: 'UNESCO World Heritage masterpiece of Kalinga stone engineering and astronomical alignment.',
    architectureStyle: 'Kalinga Chlorite & Khondalite Stone Carving',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Explore the sundial shadow calculations carved into each 10-foot stone wheel.'
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Sundareswarar Temple',
    location: 'Madurai',
    state: 'Tamil Nadu',
    region: 'South',
    unescoHeritage: true,
    era: '6th Century CE - 16th Century',
    historicalSummary: 'Historic Dravidian temple complex featuring 14 towering polychrome gopurams encrusted with 33,000 mythological stucco figures and the Hall of 1000 Pillars.',
    culturalImportance: 'Living heart of classical Tamil art, Carnatic music, and temple architecture.',
    architectureStyle: 'Dravidian Stucco Polychrome Gopuram Architecture',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Walk through the whispering corridors of the Thousand Pillar Hall and the sacred Golden Lotus Tank.'
  },
  {
    id: 'jaisalmer-fort',
    name: 'Jaisalmer Living Fort (Sonar Qila)',
    location: 'Jaisalmer',
    state: 'Rajasthan',
    region: 'West',
    unescoHeritage: true,
    era: '1156 CE',
    historicalSummary: 'The world’s largest living fort, built from golden yellow sandstone atop Trikuta Hill in the Thar Desert, housing 4,000 residents, havelis, and Jain temples.',
    culturalImportance: 'UNESCO Hill Fort of Rajasthan preserving ancient Silk Route merchant trade heritage.',
    architectureStyle: 'Rajput Yellow Sandstone Jali & Bastion Architecture',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Listen to the desert Kalbelia folk melodies and the history of the 99 fortified bastions.'
  },
  {
    id: 'alleppey-backwaters',
    name: 'Alleppey Backwaters & Vembanad',
    location: 'Alappuzha',
    state: 'Kerala',
    region: 'South',
    unescoHeritage: true,
    era: 'Traditional Maritime Heritage',
    historicalSummary: 'Labyrinth of emerald canals, lagoons, and palm-fringed waterways explored aboard handcrafted eco-friendly wooden houseboats (Kettuvallams).',
    culturalImportance: 'Venice of the East celebrated for community-led eco-tourism and paddy canal farming.',
    architectureStyle: 'Indigenous Anjili Wood & Coir Houseboat Craftsmanship',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Experience the tranquil sounds of gentle ripples, coconut palm rustles, and local coir craftsmen along the waterways.'
  },
  {
    id: 'ajanta-ellora',
    name: 'Ajanta & Ellora Rock-Cut Caves',
    location: 'Aurangabad',
    state: 'Maharashtra',
    region: 'West',
    unescoHeritage: true,
    era: '600 - 1000 CE',
    historicalSummary: 'Ancient monolithic cave temples carved from sheer basalt cliffs, featuring the Kailash Cave 16 monolith excavated top-down and ancient Buddhist fresco paintings.',
    culturalImportance: 'UNESCO World Heritage site showcasing the pinnacle of ancient Indian rock excavation.',
    architectureStyle: 'Monolithic Basalt Rock-Cut Architecture',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Learn how 200,000 tonnes of basalt rock were excavated by hand over 100 years to create the single-stone Kailash temple.'
  },
  {
    id: 'nongriat-bridges',
    name: 'Mawlynnong & Nongriat Root Bridges',
    location: 'Cherrapunji',
    state: 'Meghalaya',
    region: 'Northeast',
    unescoHeritage: true,
    era: '500-Year Living Bio-Engineering',
    historicalSummary: 'Centuries-old living bio-engineered bridges grown from Ficus elastica tree roots across rainforest mountain torrents, natural turquoise pools, and clean Khasi villages.',
    culturalImportance: 'World-renowned indigenous bio-engineering and community forest conservation.',
    architectureStyle: 'Living Root Lattice Bio-Architecture',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    audioTourSummary: 'Discover how Khasi tribal elders guide living aerial tree roots over 15 years to bridge mountain torrents.'
  }
];

export const HeritagePage = () => {
  const [searchParams] = useSearchParams();
  const requestedSiteId = searchParams.get('site');

  const [heritageSites, setHeritageSites] = useState(DEFAULT_10_HERITAGE_SITES);
  const [selectedSite, setSelectedSite] = useState(() => {
    if (requestedSiteId) {
      return DEFAULT_10_HERITAGE_SITES.find(s => s.id === requestedSiteId || s.name.toLowerCase().includes(requestedSiteId.toLowerCase())) || DEFAULT_10_HERITAGE_SITES[0];
    }
    return DEFAULT_10_HERITAGE_SITES[0];
  });
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const regions = [
    { id: 'ALL', name: 'All 10 Sanctuaries' },
    { id: 'North', name: 'North India' },
    { id: 'South', name: 'South India' },
    { id: 'East', name: 'East India' },
    { id: 'West', name: 'West India' },
    { id: 'Northeast', name: 'Northeast' }
  ];

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await api.get('/heritage');
        if (res.success && res.sites?.length > 0) {
          setHeritageSites(res.sites);
          if (requestedSiteId) {
            const matched = res.sites.find(s => s.id === requestedSiteId || s.name.toLowerCase().includes(requestedSiteId.toLowerCase()));
            setSelectedSite(matched || res.sites[0]);
          }
        }
      } catch (err) {
        console.warn('Backend heritage fetch fell back to master catalog:', err.message);
        if (requestedSiteId) {
          const matched = DEFAULT_10_HERITAGE_SITES.find(s => s.id === requestedSiteId || s.name.toLowerCase().includes(requestedSiteId.toLowerCase()));
          if (matched) setSelectedSite(matched);
        }
      }
    };

    fetchSites();
  }, [requestedSiteId]);

  // Handle URL query parameter changes
  useEffect(() => {
    if (requestedSiteId) {
      const matched = heritageSites.find(s => s.id === requestedSiteId || s.name.toLowerCase().includes(requestedSiteId.toLowerCase()));
      if (matched) setSelectedSite(matched);
    }
  }, [requestedSiteId, heritageSites]);

  const filteredSites = heritageSites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (site.location && site.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (site.state && site.state.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (selectedRegion === 'ALL') return true;

    if (selectedRegion === 'North') {
      return ['Uttar Pradesh', 'Punjab', 'Uttarakhand', 'Jammu & Kashmir', 'Delhi', 'Ladakh', 'Himachal Pradesh'].includes(site.state);
    }
    if (selectedRegion === 'South') {
      return ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana'].includes(site.state);
    }
    if (selectedRegion === 'East') {
      return ['Odisha', 'West Bengal', 'Bihar', 'Jharkhand'].includes(site.state);
    }
    if (selectedRegion === 'West') {
      return ['Maharashtra', 'Rajasthan', 'Goa', 'Gujarat'].includes(site.state);
    }
    if (selectedRegion === 'Northeast') {
      return ['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Sikkim', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'].includes(site.state);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-saffron-100 text-saffron-900 px-3.5 py-1 rounded-full text-xs font-bold font-cinzel border border-saffron-300">
          <Landmark className="w-3.5 h-3.5 text-saffron-700" />
          <span>YATRAX 360° SPHERICAL VIRTUAL REALITY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sora tracking-tight">
          Top 10 Indian Sacred Sanctuaries in 360°
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Interactive ground walkaround virtual reality, studio audio narration, and Archaeological Survey of India historical provenance.
        </p>
      </div>

      {/* 360 Panorama Viewer */}
      {selectedSite && (
        <div className="space-y-4">
          <PanoramaViewer site={selectedSite} />
          
          {/* Active Site Deep-Dive Card */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-warm border border-sand-300 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-terracotta-100 text-terracotta-800 font-bold px-2 py-0.5 rounded font-mono">
                  {selectedSite.era}
                </span>
                {selectedSite.unescoHeritage && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    UNESCO World Heritage
                  </span>
                )}
                <span className="text-[10px] bg-sand-200 text-slate-700 font-bold px-2 py-0.5 rounded font-mono">
                  {selectedSite.region || 'India'}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {selectedSite.name} ({selectedSite.location}, {selectedSite.state})
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedSite.historicalSummary}
              </p>
              <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-xs text-slate-800 space-y-1">
                <strong>Architectural Style & Cultural Provenance:</strong>
                <p className="text-slate-600 text-[11px]">{selectedSite.culturalImportance} ({selectedSite.architectureStyle})</p>
              </div>
            </div>

            <div className="space-y-3 bg-sand-100 p-5 rounded-3xl border border-sand-200 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Site Information
                </span>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">State:</span>
                    <strong className="text-slate-900">{selectedSite.state}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Protection:</span>
                    <strong className="text-emerald-700 font-medium">ASI & UNESCO Monument</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Audio Guide:</span>
                    <strong className="text-amber-800 font-mono">Studio Narration Active</strong>
                  </div>
                </div>
              </div>

              <a
                href={`/planner?dest=${encodeURIComponent(selectedSite.name.split('&')[0].trim())}`}
                className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl text-xs font-sora font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
              >
                <span>Plan Journey to {selectedSite.name.split('&')[0].trim()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sanctuary Filter & Gallery Grid */}
      <div className="space-y-6">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-sora font-semibold transition-all cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-forest-800 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-sand-100 border border-sand-300'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sanctuaries, states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-sand-300 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-xs"
            />
          </div>
        </div>

        {/* 10 Sanctuary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSites.map((site) => {
            const isSelected = selectedSite?.id === site.id;
            return (
              <div
                key={site.id}
                onClick={() => {
                  setSelectedSite(site);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`group bg-white rounded-3xl overflow-hidden border transition-all cursor-pointer shadow-warm flex flex-col ${
                  isSelected 
                    ? 'border-forest-600 ring-3 ring-forest-600/20 shadow-xl' 
                    : 'border-sand-300 hover:border-forest-400 hover:shadow-lg'
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-forest-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
                      {site.region}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-serif font-bold text-sm leading-tight text-white drop-shadow-md">
                      {site.name}
                    </h4>
                    <span className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-saffron-400 shrink-0" />
                      <span>{site.location}, {site.state}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {site.historicalSummary}
                  </p>

                  <div className="pt-2 border-t border-sand-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-terracotta-800 font-bold">
                      {site.era}
                    </span>
                    <span className="font-sora font-bold text-forest-700 group-hover:text-forest-900 flex items-center gap-1 text-[11px]">
                      <span>Enter 360° VR</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
