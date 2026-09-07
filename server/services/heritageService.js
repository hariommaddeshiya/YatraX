import { seedHeritageSites } from '../seed/destinationsData.js';
import { indiaStatesData } from '../data/indiaStatesData.js';

// Build unified 360 catalog across all destinations in India
const buildAllHeritageSites = () => {
  const catalog = [];
  const existingIds = new Set();

  // 1. Seed top 10 curated heritage sites
  seedHeritageSites.forEach(s => {
    existingIds.add(s.id);
    const img = s.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80';
    catalog.push({
      ...s,
      walkaroundNodes: s.walkaroundNodes || [
        {
          id: 'main',
          name: `1. ${s.name} - Principal View`,
          subtitle: `Front (0°): Main Sanctum • Behind (180°): Outer Horizon & Entrance`,
          frontImageUrl: s.panoramaUrl || img,
          backImageUrl: img
        },
        {
          id: 'courtyard',
          name: `2. Outer Courtyard & Colonnade`,
          subtitle: `Front (0°): Courtyard Colonnade • Behind (180°): Surrounding Heritage Horizon`,
          frontImageUrl: img,
          backImageUrl: s.panoramaUrl || img
        }
      ]
    });
  });

  // 2. Add all 292 destinations from all 36 States & UTs
  indiaStatesData.forEach(stateObj => {
    (stateObj.destinations || []).forEach(dest => {
      if (!existingIds.has(dest.id)) {
        existingIds.add(dest.id);

        const img = stateObj.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80';
        catalog.push({
          id: dest.id,
          name: dest.name,
          location: stateObj.capital || stateObj.name,
          state: stateObj.name,
          region: stateObj.region,
          coordinates: { lat: 20.5937, lng: 78.9629 },
          unescoHeritage: dest.category === 'Heritage' && (dest.xp >= 140),
          category: dest.category || 'Heritage',
          isOffbeat: dest.isOffbeat || false,
          era: 'Historic Indian Sanctuary & Architectural Wonder',
          historicalSummary: dest.description || `Historic monument and cultural beacon of ${stateObj.name}.`,
          culturalImportance: `Recognized cultural and architectural heritage beacon of ${stateObj.name}.`,
          architectureStyle: `${stateObj.name} Traditional Regional Heritage Architecture`,
          image: img,
          panoramaUrl: img,
          audioTourSummary: `Welcome to ${dest.name} in ${stateObj.name}. Experience the acoustic atmosphere, panoramic 360 horizons, and sacred architecture.`,
          walkaroundNodes: [
            {
              id: 'main',
              name: `1. ${dest.name} - Principal View`,
              subtitle: `Front (0°): Main Sanctum • Behind (180°): Outer Horizon & Entrance`,
              frontImageUrl: img,
              backImageUrl: img
            },
            {
              id: 'courtyard',
              name: `2. Outer Courtyard & Colonnade`,
              subtitle: `Front (0°): Courtyard Colonnade • Behind (180°): Surrounding Heritage Landscape`,
              frontImageUrl: img,
              backImageUrl: img
            }
          ],
          hotspots: [
            { id: `hp-${dest.id}-1`, title: 'Principal Architectural Feature', description: dest.description, position: { x: 0, y: 1.2, z: -3 }, type: 'architecture' },
            { id: `hp-${dest.id}-2`, title: 'Sacred Courtyard & Horizon', description: `Vibrant cultural surroundings and panoramic horizons of ${dest.name}.`, position: { x: 2.2, y: 0.5, z: -2.2 }, type: 'history' }
          ]
        });
      }
    });
  });

  return catalog;
};

let _allSitesCache = null;
const getAllSites = () => {
  if (!_allSitesCache) {
    _allSitesCache = buildAllHeritageSites();
  }
  return _allSitesCache;
};

export const getHeritageSites = (filter = {}) => {
  let list = getAllSites();
  const { region, category, search, top10 } = filter;

  if (top10 === 'true') {
    return list.slice(0, 10);
  }

  if (region && region !== 'ALL') {
    list = list.filter(s => s.region?.toLowerCase() === region.toLowerCase());
  }

  if (category && category !== 'ALL') {
    list = list.filter(s => s.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) ||
      (s.state && s.state.toLowerCase().includes(q)) ||
      (s.location && s.location.toLowerCase().includes(q))
    );
  }

  return list;
};

export const getHeritageSiteById = (idOrName) => {
  if (!idOrName) return getAllSites()[0];
  const q = idOrName.toLowerCase().trim();

  const all = getAllSites();

  // 1. Exact ID match
  const exact = all.find(site => site.id === idOrName);
  if (exact) return exact;

  // 2. Slug / lower match
  const slug = all.find(site => site.id.toLowerCase() === q);
  if (slug) return slug;

  // 3. Name match
  const name = all.find(site => site.name.toLowerCase().includes(q) || q.includes(site.name.toLowerCase()));
  if (name) return name;

  // 4. Keyword best-score match
  const keywords = q.split(/[-_ ]+/).filter(w => w.length > 2 && !['falls', 'temple', 'fort', 'sanctuary', 'park'].includes(w));
  if (keywords.length > 0) {
    const allMatch = all.find(s => {
      const target = (s.id + ' ' + s.name).toLowerCase();
      return keywords.every(kw => target.includes(kw));
    });
    if (allMatch) return allMatch;

    let bestCandidate = null;
    let maxMatches = 0;
    for (const s of all) {
      const target = (s.id + ' ' + s.name).toLowerCase();
      let matches = 0;
      for (const kw of keywords) {
        if (target.includes(kw)) matches++;
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCandidate = s;
      }
    }
    if (bestCandidate && maxMatches > 0) return bestCandidate;
  }

  // 5. Fallback to first site
  return all[0];
};
