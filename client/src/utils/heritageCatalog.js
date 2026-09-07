// Master 360 Heritage Catalog & Universal Destination Resolver
// Combines Top 10 Curated Wonders with all 292 Destinations across 36 Indian States & UTs

import { indiaStatesData } from '../data/indiaStatesData.js';

// Top 10 Curated Sanctuaries with Master High-Detail Metadata
export const TOP_10_CURATED_SANCTUARIES = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal & Agra Fort',
    location: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    category: 'Heritage',
    unescoHeritage: true,
    era: '1632 - 1653 CE',
    theme: 'mughal-marble',
    historicalSummary: 'Universal monument of love built from translucent white Makrana marble with Pietra Dura gemstone inlay, set amidst Persian Charbagh gardens along the Yamuna river.',
    culturalImportance: 'UNESCO World Heritage Wonder of the World and pinnacle of Mughal classical symmetry.',
    architectureStyle: 'Indo-Islamic White Makrana Marble Architecture',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Experience the acoustic echo under the 73-meter central dome and the intricate jade, jasper, and lapis lazuli inlays.',
    walkaroundNodes: [
      {
        id: 'pool',
        name: '1. Charbagh Central Reflection Pool',
        subtitle: 'Front (0°): Makrana Marble Dome & Minarets • Behind (180°): Royal Great Gate (Darwaza-i-Rauza)',
        frontImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'plinth',
        name: '2. Main White Marble Plinth & Archway',
        subtitle: 'Front (0°): Translucent Marble & Pietra Dura Inlay • Behind (180°): Charbagh Gardens & Yamuna River',
        frontImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'river',
        name: '3. Yamuna Riverfront & Mosque Terrace',
        subtitle: 'Front (0°): Red Sandstone Mosque Courtyard • Behind (180°): Broad Yamuna River & Mehtab Bagh Horizon',
        frontImageUrl: 'https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'varanasi-ghats',
    name: 'Varanasi Ghats & Kashi Vishwanath',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    category: 'Spiritual',
    unescoHeritage: true,
    era: '11th Century BCE - Present',
    theme: 'ghat-riverfront',
    historicalSummary: 'Ancient sacred city of light along the holy Ganga with 84 historic stone ghats, evening Maha Ganga Aarti, classical music gharanas, and handloom silk weavers.',
    culturalImportance: 'Spiritual epicenter of Indian civilization and sacred liberation tirtha.',
    architectureStyle: 'Ancient Stepped Stone Riverfront Ghat Architecture',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Listen to the evening Vedic chants, resonant conch shells, and rhythmic brass lamp aartis at Dashashwamedh Ghat.',
    walkaroundNodes: [
      {
        id: 'dash',
        name: '1. Dashashwamedh Main Ghat Arena',
        subtitle: 'Front (0°): Historic Tiered Stone Steps & Aarti Altars • Behind (180°): Holy Ganga Expanse & Riverboats',
        frontImageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'ganga',
        name: '2. Ganga Mid-River Vantage Point',
        subtitle: 'Front (0°): Crescent Curve of 84 Ancient Stone Ghats • Behind (180°): Eastern Sunrise Riverbank & Morning Mist',
        frontImageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'mani',
        name: '3. Ancient Sandstone River Pavilions',
        subtitle: 'Front (0°): Centuries-old Stone Chattris • Behind (180°): Sacred River Horizon & Wooden Boats',
        frontImageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'hampi-vijayanagara',
    name: 'Hampi Vijayanagara Ruins',
    location: 'Ballari',
    state: 'Karnataka',
    region: 'South',
    category: 'Heritage',
    unescoHeritage: true,
    era: '1336 - 1565 CE',
    theme: 'dravidian-stone',
    historicalSummary: 'Spectacular ruins of the medieval Vijayanagara Empire with monolithic stone chariots, 56 musical granite pillars, and ancient boulder-strewn hill horizons.',
    culturalImportance: 'UNESCO World Heritage site representing the zenith of South Indian empire architecture.',
    architectureStyle: 'Dravidian Granite Monolithic Sculpture',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Hear the unique resonant frequencies of the 56 monolithic musical pillars at the Vittala Temple complex.',
    walkaroundNodes: [
      {
        id: 'chariot',
        name: '1. Monolithic Vittala Stone Chariot',
        subtitle: 'Front (0°): Carved Granite Solar Chariot • Behind (180°): 56 Musical Pillars Maha-Mandapa',
        frontImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'pillars',
        name: '2. 56 Musical Granite Pillars Mandapa',
        subtitle: 'Front (0°): Resonating Dravidian Columns • Behind (180°): Hemakuta Hill Boulder Horizon',
        frontImageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'golden-temple',
    name: 'Golden Temple (Harmandir Sahib)',
    location: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    category: 'Spiritual',
    unescoHeritage: true,
    era: '1577 - 1604 CE',
    theme: 'golden-sarovar',
    historicalSummary: 'The holiest shrine of Sikhism clad in 500 kg of pure gold foil, resting at the center of the holy Amrit Sarovar lake and offering free communal meals (langar) to all.',
    culturalImportance: 'Universal sanctuary of equality, selfless service, and spiritual harmony.',
    architectureStyle: 'Sikh-Rajput Gilded Marble & Gold Foil Architecture',
    image: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Immerse in the 24x7 live Gurbani kirtan echoing across the serene waters of the sacred Amrit Sarovar.',
    walkaroundNodes: [
      {
        id: 'entrance',
        name: '1. Clock Tower Deori Gateway & Arch',
        subtitle: 'Front (0°): Gilded Harmandir Sahib in Amrit Sarovar • Behind (180°): Victorian Clock Tower Gateway Plaza',
        frontImageUrl: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1609137144820-21016834164b?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'parikrama',
        name: '2. Amrit Sarovar Marble Parikrama',
        subtitle: 'Front (0°): Akal Takht & Sacred Pool • Behind (180°): White Marble Colonnades & Dukh Bhanjani Beri',
        frontImageUrl: 'https://images.unsplash.com/photo-1609137144820-21016834164b?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    location: 'Puri',
    state: 'Odisha',
    region: 'East',
    category: 'Heritage',
    unescoHeritage: true,
    era: '1250 CE',
    theme: 'kalinga-stone',
    historicalSummary: 'Colossal 13th-century temple carved as a giant 24-wheeled chariot of Surya the Sun God, pulled by 7 sculpted horses along the Bay of Bengal coast.',
    culturalImportance: 'UNESCO World Heritage masterpiece of Kalinga stone engineering and astronomical alignment.',
    architectureStyle: 'Kalinga Chlorite & Khondalite Stone Carving',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Explore the sundial shadow calculations carved into each 10-foot stone wheel.',
    walkaroundNodes: [
      {
        id: 'wheels',
        name: '1. Grand Sun Chariot 24 Wheels',
        subtitle: 'Front (0°): Colossal Stone Sundial Wheels of Surya • Behind (180°): Natya Mandapa Dancing Hall',
        frontImageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Sundareswarar Temple',
    location: 'Madurai',
    state: 'Tamil Nadu',
    region: 'South',
    category: 'Spiritual',
    unescoHeritage: true,
    era: '6th Century CE - 16th Century',
    theme: 'dravidian-gopuram',
    historicalSummary: 'Historic Dravidian temple complex featuring 14 towering polychrome gopurams encrusted with 33,000 mythological stucco figures and the Hall of 1000 Pillars.',
    culturalImportance: 'Living heart of classical Tamil art, Carnatic music, and temple architecture.',
    architectureStyle: 'Dravidian Stucco Polychrome Gopuram Architecture',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Walk through the whispering corridors of the Thousand Pillar Hall and the sacred Golden Lotus Tank.',
    walkaroundNodes: [
      {
        id: 'gopuram',
        name: '1. Southern Polychrome Gopuram (170 ft)',
        subtitle: 'Front (0°): Soaring Gateway with 33,000 Deities • Behind (180°): Golden Lotus Sacred Water Tank',
        frontImageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'jaisalmer-fort',
    name: 'Jaisalmer Living Fort (Sonar Qila)',
    location: 'Jaisalmer',
    state: 'Rajasthan',
    region: 'West',
    category: 'Heritage',
    unescoHeritage: true,
    era: '1156 CE',
    theme: 'desert-fort',
    historicalSummary: 'The world’s largest living fort, built from golden yellow sandstone atop Trikuta Hill in the Thar Desert, housing 4,000 residents, havelis, and Jain temples.',
    culturalImportance: 'UNESCO Hill Fort of Rajasthan preserving ancient Silk Route merchant trade heritage.',
    architectureStyle: 'Rajput Yellow Sandstone Jali & Bastion Architecture',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Listen to the desert Kalbelia folk melodies and the history of the 99 fortified bastions.',
    walkaroundNodes: [
      {
        id: 'gate',
        name: '1. Suraj Pol Golden Gateway',
        subtitle: 'Front (0°): Yellow Sandstone Bastions & Ramps • Behind (180°): Great Thar Desert Vast Golden Dunes',
        frontImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'alleppey-backwaters',
    name: 'Alleppey Backwaters & Vembanad',
    location: 'Alappuzha',
    state: 'Kerala',
    region: 'South',
    category: 'Nature',
    unescoHeritage: true,
    era: 'Traditional Maritime Heritage',
    theme: 'coastal-lagoon',
    historicalSummary: 'Labyrinth of emerald canals, lagoons, and palm-fringed waterways explored aboard handcrafted eco-friendly wooden houseboats (Kettuvallams).',
    culturalImportance: 'Venice of the East celebrated for community-led eco-tourism and paddy canal farming.',
    architectureStyle: 'Indigenous Anjili Wood & Coir Houseboat Craftsmanship',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Experience the tranquil sounds of gentle ripples, coconut palm rustles, and local coir craftsmen along the waterways.',
    walkaroundNodes: [
      {
        id: 'boat',
        name: '1. Traditional Houseboat Sun Deck',
        subtitle: 'Front (0°): Handcrafted Wooden Kettuvallam & Vembanad Lake • Behind (180°): Lush Coconut Palm Canals',
        frontImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'ajanta-ellora',
    name: 'Ajanta & Ellora Rock-Cut Caves',
    location: 'Aurangabad',
    state: 'Maharashtra',
    region: 'West',
    category: 'Heritage',
    unescoHeritage: true,
    era: '600 - 1000 CE',
    theme: 'monolithic-cave',
    historicalSummary: 'Ancient monolithic cave temples carved from sheer basalt cliffs, featuring the Kailash Cave 16 monolith excavated top-down and ancient Buddhist fresco paintings.',
    culturalImportance: 'UNESCO World Heritage site showcasing the pinnacle of ancient Indian rock excavation.',
    architectureStyle: 'Monolithic Basalt Rock-Cut Architecture',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Learn how 200,000 tonnes of basalt rock were excavated by hand over 100 years to create the single-stone Kailash temple.',
    walkaroundNodes: [
      {
        id: 'kailash',
        name: '1. Kailash Temple Cave 16 Monolith Ground',
        subtitle: 'Front (0°): Monolithic Shrine Carved from Top-Down • Behind (180°): 100-ft Vertical Basalt Cliff Ravine',
        frontImageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  },
  {
    id: 'nongriat-bridges',
    name: 'Mawlynnong & Nongriat Root Bridges',
    location: 'Cherrapunji',
    state: 'Meghalaya',
    region: 'Northeast',
    category: 'Nature',
    unescoHeritage: true,
    era: '500-Year Living Bio-Engineering',
    theme: 'rainforest-canopy',
    historicalSummary: 'Centuries-old living bio-engineered bridges grown from Ficus elastica tree roots across rainforest mountain torrents, natural turquoise pools, and clean Khasi villages.',
    culturalImportance: 'World-renowned indigenous bio-engineering and community forest conservation.',
    architectureStyle: 'Living Root Lattice Bio-Architecture',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    audioTourSummary: 'Discover how Khasi tribal elders guide living aerial tree roots over 15 years to bridge mountain torrents.',
    walkaroundNodes: [
      {
        id: 'bridge',
        name: '1. Double Decker Living Root Bridge',
        subtitle: 'Front (0°): 500-Year Bio-Engineered Ficus Root Bridge • Behind (180°): Turquoise Glacial Rainforest Plunge Pool',
        frontImageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
        backImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80'
      }
    ]
  }
];

// Helper to determine aesthetic theme for procedural 360 photosphere
export const getThemeForDestination = (category, state = '', name = '') => {
  const norm = (name + ' ' + state + ' ' + category).toLowerCase();
  if (norm.includes('fort') || norm.includes('desert') || norm.includes('rajasthan') || norm.includes('jaisalmer') || norm.includes('jaipur')) {
    return 'desert-fort';
  }
  if (norm.includes('river') || norm.includes('ghat') || norm.includes('ganga') || norm.includes('varanasi') || norm.includes('puri')) {
    return 'ghat-riverfront';
  }
  if (norm.includes('mountain') || norm.includes('himalaya') || norm.includes('sikkim') || norm.includes('ladakh') || norm.includes('kashmir') || norm.includes('himachal') || norm.includes('pass') || norm.includes('peak')) {
    return 'himalayan-alpine';
  }
  if (norm.includes('cave') || norm.includes('rock') || norm.includes('ellora') || norm.includes('ajanta') || norm.includes('badami')) {
    return 'monolithic-cave';
  }
  if (norm.includes('golden') || norm.includes('amritsar') || norm.includes('sarovar')) {
    return 'golden-sarovar';
  }
  if (norm.includes('temple') || norm.includes('mandir') || norm.includes('meenakshi') || norm.includes('dham') || norm.includes('spiritual') || norm.includes('kashi') || norm.includes('ayodhya')) {
    return 'dravidian-gopuram';
  }
  if (norm.includes('forest') || norm.includes('rainforest') || norm.includes('waterfall') || norm.includes('falls') || norm.includes('meghalaya') || norm.includes('bridge') || norm.includes('tree') || norm.includes('national park') || norm.includes('safari')) {
    return 'rainforest-canopy';
  }
  if (norm.includes('kerala') || norm.includes('backwater') || norm.includes('lake') || norm.includes('beach') || norm.includes('goa') || norm.includes('island') || norm.includes('sea')) {
    return 'coastal-lagoon';
  }
  return 'heritage-courtyard';
};

// Curated authentic destination-specific photographs
export const DESTINATION_SPECIFIC_IMAGES = {
  'hawa-mahal': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=80',
  'ayodhya-ram-mandir': 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=1800&q=80',
  'fatehpur-sikri': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1800&q=80',
  'sarnath-dhamek': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=80',
  'mathura-vrindavan': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=80',
  'lucknow-imambara': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1800&q=80',
  'qutub-minar': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=80',
  'red-fort': 'https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=1800&q=80',
  'india-gate': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1800&q=80',
  'humayun-tomb': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=80',
  'lotus-temple': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=80',
  'gateway-of-india': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=80',
  'marine-drive': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1800&q=80',
  'chhatrapati-shivaji-terminus': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=80',
  'dudhsagar-falls-goa': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
  'basilica-bom-jesus': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=80',
  'calangute-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
  'munnar-tea-gardens': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=80',
  'athirappilly-falls': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
  'mysore-palace': 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=1800&q=80',
  'jog-falls': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
  'coorg-coffee-estates': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=80',
  'badami-caves': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1800&q=80',
  'shore-temple': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=80',
  'brihadeeswara-temple': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1800&q=80',
  'rameshwaram-temple': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1800&q=80',
  'kanyakumari-vivekananda': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=80',
  'kaziranga-national-park': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
  'pangong-lake': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80',
  'dal-lake-shikara': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=80',
  'gulmarg-gondola': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
  'kedarnath-temple': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=80',
  'rishikesh-ganga': 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1800&q=80',
  'badrinath-temple': 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=1800&q=80',
  'jagannath-temple': 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1800&q=80',
  'victoria-memorial': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=80',
  'howrah-bridge': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1800&q=80',
  'darjeeling-tea-hills': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=80'
};

// Build the comprehensive 360 catalog of all Indian destinations
export const buildAll360Destinations = () => {
  const catalog = [...TOP_10_CURATED_SANCTUARIES];
  const existingIds = new Set(catalog.map(s => s.id));

  // Iterate over all 36 States & Union Territories
  indiaStatesData.forEach(stateObj => {
    (stateObj.destinations || []).forEach(dest => {
      if (!existingIds.has(dest.id)) {
        existingIds.add(dest.id);

        const theme = getThemeForDestination(dest.category, stateObj.name, dest.name);
        const imageUrl = DESTINATION_SPECIFIC_IMAGES[dest.id] || stateObj.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=80';

        catalog.push({
          id: dest.id,
          name: dest.name,
          location: stateObj.capital || stateObj.name,
          state: stateObj.name,
          region: stateObj.region,
          category: dest.category || 'Heritage',
          isOffbeat: dest.isOffbeat || false,
          unescoHeritage: dest.category === 'Heritage' && (dest.xp >= 140),
          era: 'Historic Indian Sanctuary & Architectural Wonder',
          theme,
          historicalSummary: dest.description || `Historic landmark and cultural gem of ${stateObj.name}, showcasing indigenous art and heritage architecture.`,
          culturalImportance: `Recognized cultural and scenic heritage beacon of ${stateObj.name}.`,
          architectureStyle: `${stateObj.name} Traditional Regional Heritage Architecture`,
          image: imageUrl,
          panoramaUrl: imageUrl,
          audioTourSummary: `Welcome to ${dest.name} in ${stateObj.name}. Experience the acoustic atmosphere, panoramic 360 horizons, and sacred architecture.`,
          walkaroundNodes: [
            {
              id: 'sanctuary-main',
              name: `1. ${dest.name} - Principal View`,
              subtitle: `Front (0°): Main Monument Facade & Sanctum • Behind (180°): Entrance Plaza & Horizon Vista`,
              frontImageUrl: imageUrl,
              backImageUrl: imageUrl
            },
            {
              id: 'sanctuary-courtyard',
              name: `2. Outer Courtyard & Perimeter Vista`,
              subtitle: `Front (0°): Panoramic Colonnades & Courtyard • Behind (180°): Surrounding Natural Landscape of ${stateObj.name}`,
              frontImageUrl: imageUrl,
              backImageUrl: imageUrl
            }
          ]
        });
      }
    });
  });

  return catalog;
};

// Cached singleton catalog
let _cachedCatalog = null;
export const getAll360Destinations = () => {
  if (!_cachedCatalog) {
    _cachedCatalog = buildAll360Destinations();
  }
  return _cachedCatalog;
};

// Fast resolver by ID or Name
export const get360DestinationById = (idOrName) => {
  if (!idOrName) return getAll360Destinations()[0];

  const catalog = getAll360Destinations();
  const query = idOrName.toLowerCase().trim();

  // 1. Exact ID match
  const exact = catalog.find(s => s.id === idOrName);
  if (exact) return exact;

  // 2. Slug / lower match
  const slugMatch = catalog.find(s => s.id.toLowerCase() === query);
  if (slugMatch) return slugMatch;

  // 3. Name contains query or query contains name
  const nameMatch = catalog.find(s => 
    s.name.toLowerCase().includes(query) || query.includes(s.name.toLowerCase())
  );
  if (nameMatch) return nameMatch;

  // 4. Keyword best-score match
  const keywords = query.split(/[-_ ]+/).filter(w => w.length > 2 && !['falls', 'temple', 'fort', 'sanctuary', 'park'].includes(w));
  if (keywords.length > 0) {
    // 4a. Try all keywords matching
    const allMatch = catalog.find(s => {
      const target = (s.id + ' ' + s.name).toLowerCase();
      return keywords.every(kw => target.includes(kw));
    });
    if (allMatch) return allMatch;

    // 4b. Find candidate with highest keyword match count
    let bestCandidate = null;
    let maxMatches = 0;
    for (const s of catalog) {
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

  // Fallback to primary sanctuary
  return catalog[0];
};
