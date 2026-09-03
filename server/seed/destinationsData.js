// destinationsData.js - Top 10 Best Indian Sanctuaries for YatraX
// Curated across North, South, East, West, Central & Northeast India

export const seedDestinations = [
  // 1. Taj Mahal (Agra, Uttar Pradesh)
  {
    id: 'taj-mahal',
    name: 'Taj Mahal & Agra Fort',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    category: 'Heritage',
    isOffbeat: false,
    ecoScore: 92,
    carbonFootprintPerDayKg: 14.5,
    bestSeason: 'October to March',
    avgDailyCostINR: 2600,
    crowdLevel: 'HIGH',
    culturalDescription: 'Universal monument of love built from translucent white Makrana marble with Pietra Dura gemstone inlay, set amidst Persian Charbagh gardens along the Yamuna river.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
    tags: ['UNESCO Wonder', 'Mughal Architecture', 'Pietra Dura', 'Charbagh', 'White Marble'],
    stays: [
      { id: 'stay-taj-01', name: 'Agra Heritage Eco-Boutique Haveli', type: 'Heritage', pricePerNight: 3200, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.8 }
    ]
  },

  // 2. Varanasi Sacred Ghats (Varanasi, Uttar Pradesh)
  {
    id: 'varanasi-ghats',
    name: 'Varanasi Ghats & Kashi Vishwanath',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { lat: 25.3076, lng: 83.0104 },
    category: 'Spiritual',
    isOffbeat: false,
    ecoScore: 88,
    carbonFootprintPerDayKg: 15.2,
    bestSeason: 'October to March',
    avgDailyCostINR: 2200,
    crowdLevel: 'HIGH',
    culturalDescription: 'Ancient sacred city of light along the holy Ganga with 84 historic stone ghats, evening Maha Ganga Aarti, classical music gharanas, and handloom silk weavers.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    tags: ['Sacred Ghats', 'Ganga Aarti', 'Banarasi Silk', 'Solar Boating', 'Ancient Kashi'],
    stays: [
      { id: 'stay-var-01', name: 'Assi Ghat Solar Eco-Lodge', type: 'Eco-Stay', pricePerNight: 2800, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.7 }
    ]
  },

  // 3. Hampi Vijayanagara (Ballari, Karnataka)
  {
    id: 'hampi-vijayanagara',
    name: 'Hampi Vijayanagara Ruins',
    state: 'Karnataka',
    region: 'South',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    category: 'Heritage',
    isOffbeat: true,
    ecoScore: 95,
    carbonFootprintPerDayKg: 12.8,
    bestSeason: 'October to March',
    avgDailyCostINR: 2100,
    crowdLevel: 'MEDIUM',
    culturalDescription: 'Spectacular ruins of the medieval Vijayanagara Empire with monolithic stone chariots, 56 musical granite pillars, and ancient boulder-strewn hill horizons.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    tags: ['UNESCO Heritage', 'Stone Chariot', 'Musical Pillars', 'Coracle Boating', 'Granite Boulders'],
    stays: [
      { id: 'stay-ham-01', name: 'Anegundi Rural Artisan Homestay', type: 'Homestay', pricePerNight: 2000, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.8 }
    ]
  },

  // 4. Golden Temple (Amritsar, Punjab)
  {
    id: 'golden-temple',
    name: 'Golden Temple (Harmandir Sahib)',
    state: 'Punjab',
    region: 'North',
    coordinates: { lat: 31.6200, lng: 74.8765 },
    category: 'Spiritual',
    isOffbeat: false,
    ecoScore: 94,
    carbonFootprintPerDayKg: 13.0,
    bestSeason: 'October to March',
    avgDailyCostINR: 1900,
    crowdLevel: 'HIGH',
    culturalDescription: 'The preeminent spiritual sanctuary of Sikhism, surrounded by the Amrit Sarovar. Known for 24x7 live Gurbani kirtan, golden craftsmanship, and the world’s largest free community kitchen (Langar).',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
    tags: ['Sikh Heritage', 'Harmandir Sahib', 'Amrit Sarovar', 'Guru Ka Langar', 'Pure Gold Foil'],
    stays: [
      { id: 'stay-gld-01', name: 'Amritsar Heritage Sarai Eco-Stay', type: 'Eco-Stay', pricePerNight: 2200, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.9 }
    ]
  },

  // 5. Konark Sun Temple (Puri, Odisha)
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple & Chandrabhaga',
    state: 'Odisha',
    region: 'East',
    coordinates: { lat: 19.8876, lng: 86.0945 },
    category: 'Heritage',
    isOffbeat: false,
    ecoScore: 91,
    carbonFootprintPerDayKg: 13.5,
    bestSeason: 'October to March',
    avgDailyCostINR: 2300,
    crowdLevel: 'MEDIUM',
    culturalDescription: 'Colossal 13th-century chariot of the Sun God Surya with 24 carved stone sundial wheels and 7 galloping horses overlooking the Bay of Bengal.',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1000&q=80',
    tags: ['UNESCO Heritage', 'Sun Chariot', 'Sundial Wheels', 'Kalinga Architecture', 'Bay of Bengal'],
    stays: [
      { id: 'stay-kon-01', name: 'Konark Coastal Eco-Retreat', type: 'Eco-Resort', pricePerNight: 3500, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.7 }
    ]
  },

  // 6. Meenakshi Amman Temple (Madurai, Tamil Nadu)
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple & Madurai',
    state: 'Tamil Nadu',
    region: 'South',
    coordinates: { lat: 9.9195, lng: 78.1193 },
    category: 'Spiritual',
    isOffbeat: false,
    ecoScore: 90,
    carbonFootprintPerDayKg: 14.1,
    bestSeason: 'October to March',
    avgDailyCostINR: 2000,
    crowdLevel: 'HIGH',
    culturalDescription: 'Historic Dravidian temple with 14 polychrome gopuram towers, the Thousand Pillar Hall, and sacred Golden Lotus Tank in ancient Madurai.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
    tags: ['Dravidian Temple', '14 Gopurams', '1000 Pillars', 'Living Heritage', 'Sangam Era'],
    stays: [
      { id: 'stay-mee-01', name: 'Madurai Traditional Heritage Home', type: 'Homestay', pricePerNight: 2400, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.8 }
    ]
  },

  // 7. Jaisalmer Living Fort (Jaisalmer, Rajasthan)
  {
    id: 'jaisalmer-fort',
    name: 'Jaisalmer Fort & Thar Desert',
    state: 'Rajasthan',
    region: 'West',
    coordinates: { lat: 26.9124, lng: 70.9127 },
    category: 'Featured',
    isOffbeat: false,
    ecoScore: 93,
    carbonFootprintPerDayKg: 13.9,
    bestSeason: 'October to March',
    avgDailyCostINR: 2700,
    crowdLevel: 'MEDIUM',
    culturalDescription: 'Golden sandstone living hill fort rising like a golden mirage from the Thar Desert with ancient Jain temples and desert havelis.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    tags: ['Living Fort', 'Sonar Qila', 'Golden Sandstone', 'Thar Desert', 'Jain Temples'],
    stays: [
      { id: 'stay-jai-01', name: 'Jaisalmer Sandstone Heritage Haveli', type: 'Heritage', pricePerNight: 3100, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.8 }
    ]
  },

  // 8. Alleppey Backwaters (Alappuzha, Kerala)
  {
    id: 'alleppey-backwaters',
    name: 'Alleppey Backwaters & Vembanad',
    state: 'Kerala',
    region: 'South',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    category: 'Featured',
    isOffbeat: false,
    ecoScore: 96,
    carbonFootprintPerDayKg: 12.9,
    bestSeason: 'September to March',
    avgDailyCostINR: 3200,
    crowdLevel: 'MEDIUM',
    culturalDescription: 'Interconnected emerald lagoons, solar wooden houseboats (Kettuvallam), coir craft villages, and below-sea-level paddy farming.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    tags: ['Solar Houseboat', 'Emerald Canals', 'Vembanad Lake', 'Ayurveda', 'Coir Villages'],
    stays: [
      { id: 'stay-all-01', name: 'Punnamada Solar-Electric Houseboat', type: 'Houseboat', pricePerNight: 4600, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.9 }
    ]
  },

  // 9. Ajanta & Ellora Caves (Maharashtra)
  {
    id: 'ajanta-ellora',
    name: 'Ajanta & Ellora Rock-Cut Caves',
    state: 'Maharashtra',
    region: 'West',
    coordinates: { lat: 20.5519, lng: 75.7033 },
    category: 'Heritage',
    isOffbeat: true,
    ecoScore: 95,
    carbonFootprintPerDayKg: 12.4,
    bestSeason: 'October to March',
    avgDailyCostINR: 2400,
    crowdLevel: 'MEDIUM',
    culturalDescription: 'Ancient monolithic cave temples carved from sheer basalt cliffs, featuring the Kailash Cave 16 monolith and ancient Buddhist fresco paintings.',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1000&q=80',
    tags: ['UNESCO Heritage', 'Kailash Monolith', 'Basalt Caves', 'Ancient Frescoes', 'Rock Engineering'],
    stays: [
      { id: 'stay-ell-01', name: 'Ellora Valley Eco-Lodge', type: 'Eco-Stay', pricePerNight: 2600, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.7 }
    ]
  },

  // 10. Nongriat Living Root Bridges (Cherrapunji, Meghalaya)
  {
    id: 'nongriat-bridges',
    name: 'Mawlynnong & Nongriat Root Bridges',
    state: 'Meghalaya',
    region: 'Northeast',
    coordinates: { lat: 25.2505, lng: 91.6738 },
    category: 'Offbeat',
    isOffbeat: true,
    ecoScore: 99,
    carbonFootprintPerDayKg: 10.5,
    bestSeason: 'October to May',
    avgDailyCostINR: 2500,
    crowdLevel: 'LOW',
    culturalDescription: 'Centuries-old living bio-engineered bridges grown from Ficus tree roots across rainforest mountain torrents, natural turquoise pools, and zero-waste Khasi villages.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    tags: ['Living Root Bridges', 'Cleanest Village', 'Rainforest', 'Bio-Architecture', 'Turquoise Pools'],
    stays: [
      { id: 'stay-nong-01', name: 'Nongriat Tribal Bamboo Homestay', type: 'Homestay', pricePerNight: 1900, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.9 }
    ]
  }
];

// =========================================================================
// TOP 10 HERITAGE SITES WITH COMPLETE METADATA FOR 360° VR ATLAS
// =========================================================================
export const seedHeritageSites = seedDestinations.map(d => ({
  id: d.id,
  name: d.name,
  location: d.name.split(' & ')[0],
  state: d.state,
  region: d.region,
  coordinates: d.coordinates,
  unescoHeritage: true,
  era: d.id === 'taj-mahal' ? '1632 - 1653 CE' :
       d.id === 'varanasi-ghats' ? '11th Century BCE - Present' :
       d.id === 'hampi-vijayanagara' ? '1336 - 1565 CE' :
       d.id === 'golden-temple' ? '1577 - 1604 CE' :
       d.id === 'konark-sun-temple' ? '1250 CE' :
       d.id === 'meenakshi-temple' ? '6th Century CE - 16th Century' :
       d.id === 'jaisalmer-fort' ? '1156 CE' :
       d.id === 'alleppey-backwaters' ? 'Traditional Kerala Canals' :
       d.id === 'ajanta-ellora' ? '600 - 1000 CE' :
       d.id === 'nongriat-bridges' ? '500-Year Bio-Engineering' :
       'Centuries-Old Indian Sanctuary',
  historicalSummary: d.culturalDescription,
  culturalImportance: `Recognized cultural and architectural beacon of ${d.state}.`,
  architectureStyle: `${d.state} Classical Architectural Heritage`,
  image: d.image,
  panoramaUrl: d.image.replace('w=1000&q=80', 'w=2400&q=90'),
  audioTourSummary: `Experience the live architectural narrative, acoustic echoes, and sacred heritage of ${d.name}.`,
  hotspots: [
    { id: `hp-${d.id}-1`, title: 'Principal Architectural Feature', description: d.culturalDescription, position: { x: 0, y: 1.2, z: -3 }, type: 'architecture' },
    { id: `hp-${d.id}-2`, title: 'Sacred Perimeter & Courtyard', description: `Vibrant cultural surroundings and panoramic horizons of ${d.name}.`, position: { x: 2.2, y: 0.5, z: -2.2 }, type: 'history' }
  ]
}));

export const seedSafetyZones = [
  {
    id: 'zone-meg-01',
    name: 'Nohkalikai Gorge Downstream High-Swell Zone',
    region: 'Meghalaya',
    riskLevel: 'HIGH',
    riskType: 'SUDDEN_SWELL_WATERFALL',
    coordinates: { lat: 25.2765, lng: 91.6850 },
    radiusMeters: 450,
    advisory: 'Flash flood danger during monsoonal cloud bursts.',
    nearestSafePoint: { name: 'Cherrapunji Forest Department Shelter', lat: 25.2740, lng: 91.6820 }
  },
  {
    id: 'zone-sik-01',
    name: 'North Sikkim Lachen Landslide Hazard Sector',
    region: 'Sikkim',
    riskLevel: 'CRITICAL',
    riskType: 'LANDSLIDE_PRONE',
    coordinates: { lat: 27.7250, lng: 88.5580 },
    radiusMeters: 800,
    advisory: 'Active scree slope. Heavy vehicle movement restricted after 4:00 PM.',
    nearestSafePoint: { name: 'Border Roads Organisation Post', lat: 27.7180, lng: 88.5510 }
  }
];
