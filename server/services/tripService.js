import { seedDestinations } from '../seed/destinationsData.js';
import { getMultiModalOptions } from './routingService.js';
import { calculateBudgetBreakdown } from './budgetService.js';
import { getLiveWeather } from './weatherService.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory trips store
export const localTrips = new Map();

// Extended Indian Destination Atlas Coordinates & Defaults
const EXTENDED_DESTINATIONS = {
  'taj mahal': {
    name: 'Taj Mahal & Agra Fort',
    state: 'Uttar Pradesh',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    culturalDescription: 'Universal monument of love built from white Makrana marble with Pietra Dura gemstone inlay along the Yamuna river.',
    tags: ['UNESCO Wonder', 'Mughal Architecture', 'Pietra Dura', 'Charbagh Garden', 'Agra Fort'],
    avgDailyCostINR: 2600
  },
  'varanasi': {
    name: 'Varanasi Sacred Ghats & Kashi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.3076, lng: 83.0104 },
    culturalDescription: 'Ancient sacred city of light along the Ganga with 84 historic stone ghats, evening Maha Aarti, and Banarasi handlooms.',
    tags: ['Sacred Ghats', 'Ganga Aarti', 'Banarasi Silk', 'Solar Boating', 'Ancient Kashi'],
    avgDailyCostINR: 2200
  },
  'hampi': {
    name: 'Hampi Vijayanagara Ruins',
    state: 'Karnataka',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    culturalDescription: 'Spectacular ruins of the medieval Vijayanagara Empire with monolithic stone chariots, musical granite pillars, and coracle boating.',
    tags: ['UNESCO Heritage', 'Stone Chariot', 'Musical Pillars', 'Coracle Boating', 'Granite Boulders'],
    avgDailyCostINR: 2100
  },
  'golden temple': {
    name: 'Golden Temple (Harmandir Sahib)',
    state: 'Punjab',
    coordinates: { lat: 31.6200, lng: 74.8765 },
    culturalDescription: 'The preeminent spiritual sanctuary of Sikhism surrounded by the Amrit Sarovar, featuring 24x7 live Gurbani kirtan and Guru Ka Langar.',
    tags: ['Sikh Heritage', 'Harmandir Sahib', 'Amrit Sarovar', 'Guru Ka Langar', 'Pure Gold Foil'],
    avgDailyCostINR: 1900
  },
  'konark': {
    name: 'Konark Sun Temple & Chandrabhaga',
    state: 'Odisha',
    coordinates: { lat: 19.8876, lng: 86.0945 },
    culturalDescription: '13th-century chariot temple designed as a colossal solar chariot with 24 carved stone wheels acting as accurate sundials.',
    tags: ['UNESCO Solar Chariot', 'Kalinga Architecture', 'Sundial Wheels', 'Chandrabhaga Beach'],
    avgDailyCostINR: 2300
  },
  'meenakshi': {
    name: 'Meenakshi Amman Temple',
    state: 'Tamil Nadu',
    coordinates: { lat: 9.9195, lng: 78.1193 },
    culturalDescription: 'Dravidian architectural marvel boasting 14 soaring Gopuram towers sculpted with 33,000 multi-colored deities.',
    tags: ['Dravidian Wonder', '14 Gopurams', '33000 Deities', 'Golden Lotus Tank', 'Hall of 1000 Pillars'],
    avgDailyCostINR: 2000
  },
  'jaisalmer': {
    name: 'Jaisalmer Living Fort & Thar Desert',
    state: 'Rajasthan',
    coordinates: { lat: 26.9157, lng: 70.9160 },
    culturalDescription: 'One of the world’s few functioning living forts, crafted from golden yellow sandstone rising out of the Great Thar Desert.',
    tags: ['Living Fort', 'Yellow Sandstone', 'Thar Desert Camel Safari', 'Sam Dunes Sunset', 'Patwon Ki Haveli'],
    avgDailyCostINR: 2500
  },
  'alleppey': {
    name: 'Alleppey & Vembanad Backwaters',
    state: 'Kerala',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    culturalDescription: 'Venice of the East with interconnected lagoons, solar-powered wooden houseboats, and below-sea-level paddy farming.',
    tags: ['Backwater Canals', 'Solar Houseboat', 'Vembanad Lake', 'Ayurvedic Spas', 'Punnamada Kayaking'],
    avgDailyCostINR: 2800
  },
  'ajanta': {
    name: 'Ajanta & Ellora Caves',
    state: 'Maharashtra',
    coordinates: { lat: 20.5519, lng: 75.7033 },
    culturalDescription: 'Ancient rock-cut cave sanctuaries featuring the world’s largest monolithic rock excavation (Kailash Temple, Cave 16).',
    tags: ['UNESCO Caves', 'Kailash Monolith', 'Ancient Frescoes', 'Buddhist Viharas', 'Sahyadri Hills'],
    avgDailyCostINR: 2400
  },
  'meghalaya': {
    name: 'Mawlynnong & Nongriat Living Roots',
    state: 'Meghalaya',
    coordinates: { lat: 25.2986, lng: 91.5822 },
    culturalDescription: 'Asia’s cleanest eco-village with 500-year-old bio-engineered double-decker living root bridges and crystal-clear Umngot river.',
    tags: ['Living Root Bridges', 'Cleanest Village', 'Dawki Crystal River', 'Cherrapunji Waterfalls'],
    avgDailyCostINR: 2700
  },
  'ladakh': {
    name: 'Leh Ladakh & Pangong Tso',
    state: 'Ladakh',
    coordinates: { lat: 34.1526, lng: 77.5771 },
    culturalDescription: 'High-altitude cold desert wonderland with azure glacial lakes, ancient cliffside Gompas, and high-mountain passes.',
    tags: ['Pangong Tso', 'Nubra Valley', 'Khardung La Pass', 'Thiksey Monastery', 'Solar Homestays'],
    avgDailyCostINR: 3200
  },
  'sikkim': {
    name: 'Gangtok & Kanchenjunga Valleys',
    state: 'Sikkim',
    coordinates: { lat: 27.5330, lng: 88.5122 },
    culturalDescription: 'India’s 100% organic Himalayan state boasting pristine mountain passes, sacred Gurudongmar Lake, and Rumtek Monastery.',
    tags: ['Kanchenjunga Views', '100% Organic State', 'Nathu La Pass', 'Rumtek Monastery', 'Tsomgo Lake'],
    avgDailyCostINR: 2900
  },
  'goa': {
    name: 'Goa Heritage & Eco-Coastline',
    state: 'Goa',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    culturalDescription: 'Portuguese colonial heritage cathedrals, spice plantations, serene mangrove backwaters, and pristine golden beaches.',
    tags: ['Old Goa Churches', 'Dudhsagar Waterfalls', 'Spice Plantation', 'Mandovi Backwaters', 'Sunset Coast'],
    avgDailyCostINR: 3000
  },
  'jaipur': {
    name: 'Jaipur Pink City & Amer Fort',
    state: 'Rajasthan',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    culturalDescription: 'UNESCO World Heritage city with majestic hill forts, Hawa Mahal palace facades, and royal astronomical observatories.',
    tags: ['Amer Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Rajasthani Crafts'],
    avgDailyCostINR: 2400
  },
  'manali': {
    name: 'Manali & Solang Valley',
    state: 'Himachal Pradesh',
    coordinates: { lat: 32.2396, lng: 77.1887 },
    culturalDescription: 'Picturesque Himalayan valley town with pine forests, Hadimba cedar temple, hot sulfur springs, and Atal Tunnel.',
    tags: ['Solang Valley', 'Atal Tunnel', 'Hadimba Temple', 'Beas River', 'Rohtang Pass'],
    avgDailyCostINR: 2600
  },
  'rishikesh': {
    name: 'Rishikesh & Haridwar Yoga Sanctuary',
    state: 'Uttarakhand',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    culturalDescription: 'Yoga capital of the world situated in Himalayan foothills along the sacred Ganga, with suspension bridges and river trails.',
    tags: ['Yoga & Meditation', 'Ganga Aarti', 'Ram Jhula', 'Neelkanth Mahadev', 'Himalayan Foothills'],
    avgDailyCostINR: 2100
  }
};

export const generateSmartTrip = async ({
  origin = 'Delhi',
  destination = 'Meghalaya',
  startDate = new Date().toISOString().split('T')[0],
  endDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
  travellers = 2,
  budget = 40000,
  travelStyle = 'Eco',
  interests = ['Waterfalls', 'Mountains', 'Heritage', 'Villages']
}) => {
  const destKey = destination.toLowerCase().trim();

  // 1. Check in primary seed destinations
  let destObj = seedDestinations.find(d => 
    d.id.toLowerCase().includes(destKey) || 
    d.name.toLowerCase().includes(destKey) || 
    d.state.toLowerCase().includes(destKey) ||
    destKey.includes(d.id.toLowerCase()) ||
    destKey.includes(d.name.toLowerCase().split(' ')[0])
  );

  // 2. Check in extended destination atlas
  if (!destObj) {
    for (const [key, ext] of Object.entries(EXTENDED_DESTINATIONS)) {
      if (destKey.includes(key) || key.includes(destKey)) {
        destObj = {
          id: key.replace(/\s+/g, '-'),
          name: ext.name,
          state: ext.state,
          coordinates: ext.coordinates,
          culturalDescription: ext.culturalDescription,
          tags: ext.tags,
          avgDailyCostINR: ext.avgDailyCostINR,
          category: 'Heritage',
          ecoScore: 92,
          carbonFootprintPerDayKg: 14,
          stays: [
            { id: `stay-${key}-01`, name: `${ext.name} Eco-Lodge`, type: 'Eco-Stay', pricePerNight: ext.avgDailyCostINR, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.8 }
          ]
        };
        break;
      }
    }
  }

  // 3. Fallback to customized dynamic destination
  if (!destObj) {
    const formattedName = destination.charAt(0).toUpperCase() + destination.slice(1);
    destObj = {
      id: destKey.replace(/\s+/g, '-'),
      name: formattedName,
      state: 'India',
      coordinates: { lat: 22.5937, lng: 79.9629 },
      culturalDescription: `Explore the vibrant heritage, sacred architecture, and scenic natural wonders of ${formattedName}.`,
      tags: ['Indian Heritage', 'Scenic Vistas', 'Local Culture', 'Eco-Trails'],
      avgDailyCostINR: 2500,
      category: 'Explore',
      ecoScore: 90,
      carbonFootprintPerDayKg: 15,
      stays: [
        { id: `stay-${destKey}-01`, name: `${formattedName} Heritage Homestay`, type: 'Homestay', pricePerNight: 2500, ecoCertified: true, solarPowered: true, organicFood: true, rating: 4.8 }
      ]
    };
  }

  // Calculate day difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const totalDays = Math.max(3, Math.min(10, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));
  const numTravellers = Math.max(1, Number(travellers) || 2);
  const numBudget = Math.max(10000, Number(budget) || 40000);

  // Multi-modal transport comparison calibrated for requested origin & destination
  const transportData = getMultiModalOptions(origin, destObj.coordinates, numTravellers, numBudget);
  const selectedTransport = transportData.options[0] || {
    mode: 'Train',
    label: 'Vande Bharat / Express Train',
    totalCostInr: Math.round(1850 * numTravellers),
    costPerPersonInr: 1850,
    travelTimeHours: 14,
    ecoScore: 94,
    safetyScore: 92,
    co2Kg: Math.round(18.4 * numTravellers)
  };

  // Fetch live/initial weather
  const weather = await getLiveWeather(destObj.coordinates.lat, destObj.coordinates.lng, destObj.name);

  // Hotel identification with fallback
  const rawHotel = (destObj.hotels && destObj.hotels[0]) || (destObj.stays && destObj.stays[0]) || {};
  const hotelPricePerNight = Number(rawHotel.pricePerNightInr || rawHotel.pricePerNight || destObj.avgDailyCostINR || 2600);
  const primaryHotel = {
    id: rawHotel.id || `ht-${destObj.id}-01`,
    name: rawHotel.name || `${destObj.name} Heritage Eco-Stay`,
    pricePerNightInr: hotelPricePerNight,
    pricePerNight: hotelPricePerNight,
    ecoCertified: rawHotel.ecoCertified !== false,
    solarPowered: true,
    organicFood: true,
    rating: rawHotel.rating || 4.8
  };

  const dayThemes = [
    'Arrival, Traditional Welcome & Sanctuary Acclimatization',
    'Sacred Architectural Wonders & Heritage Guided Tour',
    'Spectacular Natural Horizons & Eco-Exploration Excursion',
    'Indigenous Craft Masterclass & Local Culture Immersion',
    'Offbeat Village Homestay & Organic Culinary Walk',
    'Sunrise Viewpoint, Cultural Souvenirs & Return Journey'
  ];

  const itinerary = [];

  for (let i = 1; i <= totalDays; i++) {
    const dayDate = new Date(start.getTime() + (i - 1) * 86400000).toISOString().split('T')[0];
    const theme = dayThemes[(i - 1) % dayThemes.length];

    const dayActivities = [];

    if (i === 1) {
      dayActivities.push({
        id: `act-d${i}-1`,
        time: '11:00 AM',
        title: `Arrive in ${destObj.name} from ${origin} via ${selectedTransport.mode}`,
        description: `Scenic arrival with zero-carbon transfer to verified eco-stay. Welcome herbal refreshments with local host.`,
        type: 'transit',
        isOutdoor: false,
        estimatedCostInr: 0,
        carbonKg: 0,
        crowdForecast: 'LOW',
        crowdPercentage: 20,
        weatherRisk: 'LOW'
      });
      dayActivities.push({
        id: `act-d${i}-2`,
        time: '04:00 PM',
        title: `${destObj.name} Cultural Center & Heritage Walk`,
        description: 'Explore traditional architectural courtyards, local spice markets, and classical music traditions.',
        type: 'cultural',
        isOutdoor: false,
        estimatedCostInr: 120 * numTravellers,
        carbonKg: 0.5,
        crowdForecast: 'MODERATE',
        crowdPercentage: 45,
        weatherRisk: 'LOW'
      });
    } else if (i === 2) {
      dayActivities.push({
        id: `act-d${i}-1`,
        time: '09:30 AM',
        title: `${destObj.name} Grand Monument Guided Exploration`,
        description: destObj.culturalDescription || 'Walk through historical corridors with Archaeological Survey verified local guides.',
        type: 'heritage',
        isOutdoor: true,
        estimatedCostInr: 250 * numTravellers,
        carbonKg: 0.8,
        crowdForecast: 'MODERATE',
        crowdPercentage: 55,
        weatherRisk: 'LOW'
      });
      dayActivities.push({
        id: `act-d${i}-2`,
        time: '02:30 PM',
        title: 'Sacred Perimeter & Panoramic Viewpoint',
        description: 'Breathtaking panoramic viewpoint overlooking historical landmarks and surrounding landscapes.',
        type: 'sightseeing',
        isOutdoor: true,
        estimatedCostInr: 100 * numTravellers,
        carbonKg: 0.6,
        crowdForecast: 'LOW',
        crowdPercentage: 35,
        weatherRisk: 'LOW'
      });
    } else if (i === 3) {
      dayActivities.push({
        id: `act-d${i}-1`,
        time: '08:30 AM',
        title: 'Local Artisan Handloom & Craft Heritage',
        description: 'Witness master artisans preserving centuries-old indigenous weaving and traditional handicraft.',
        type: 'cultural',
        isOutdoor: true,
        estimatedCostInr: 150 * numTravellers,
        carbonKg: 0.4,
        crowdForecast: 'LOW',
        crowdPercentage: 30,
        weatherRisk: 'LOW'
      });
      dayActivities.push({
        id: `act-d${i}-2`,
        time: '01:30 PM',
        title: 'Eco-Boating / Scenic River Trail Excursion',
        description: 'Glide along serene waterways in non-motorized traditional craft with local boatmen.',
        type: 'nature',
        isOutdoor: true,
        estimatedCostInr: 300 * numTravellers,
        carbonKg: 0.2,
        crowdForecast: 'MODERATE',
        crowdPercentage: 45,
        weatherRisk: 'LOW'
      });
    } else {
      dayActivities.push({
        id: `act-d${i}-1`,
        time: '10:00 AM',
        title: 'Heritage Museum & Gallery Exhibition',
        description: 'Exhibition of rare archival photographs, royal artifacts, and preserved sculptures.',
        type: 'museum',
        isOutdoor: false,
        estimatedCostInr: 150 * numTravellers,
        carbonKg: 0.4,
        crowdForecast: 'LOW',
        crowdPercentage: 30,
        weatherRisk: 'LOW'
      });
      dayActivities.push({
        id: `act-d${i}-2`,
        time: '03:30 PM',
        title: 'Sunset Viewpoint & Farewell Culinary Experience',
        description: 'Enjoy panoramic sunset horizons followed by organic farm-to-table regional dinner.',
        type: 'sightseeing',
        isOutdoor: true,
        estimatedCostInr: 200 * numTravellers,
        carbonKg: 0.5,
        crowdForecast: 'LOW',
        crowdPercentage: 25,
        weatherRisk: 'LOW'
      });
    }

    const dayWeather = (weather?.dailyForecast && weather.dailyForecast[i - 1]) || {};

    itinerary.push({
      day: i,
      date: dayDate,
      theme,
      weather: {
        condition: dayWeather.weatherCondition || 'Sunny & Clear',
        tempC: dayWeather.tempMaxC || 24,
        rainChance: dayWeather.precipProbPercent || 10,
        uvIndex: 4,
        airQuality: 'Good (AQI 45)'
      },
      activities: dayActivities,
      stay: primaryHotel,
      dailyCostInr: Math.round(hotelPricePerNight + 950 * numTravellers),
      dailyCarbonKg: Math.round(1.5 * numTravellers)
    });
  }

  // Calculate detailed transparent budget with user-specified budgetLimit
  const budgetBreakdown = calculateBudgetBreakdown({
    budgetLimit: numBudget,
    totalDays,
    travellers: numTravellers,
    transportCost: selectedTransport.totalCostInr,
    hotelPricePerNight,
    travelStyle
  });

  const tripId = `trip-${uuidv4().slice(0, 8)}`;
  const trip = {
    id: tripId,
    origin: origin.trim(),
    destination: destObj.name || destination.trim(),
    startDate,
    endDate,
    totalDays,
    travellers: numTravellers,
    userBudget: numBudget,
    budgetLimit: numBudget,
    travelStyle,
    interests,
    status: 'ACTIVE',
    isConfirmed: false,
    selectedTransport,
    transportOptions: transportData.options,
    hotel: primaryHotel,
    hotels: [primaryHotel],
    weather,
    itinerary,
    budgetBreakdown,
    totalCarbonKg: Math.round(selectedTransport.co2Kg + (destObj.carbonFootprintPerDayKg || 14) * totalDays),
    carbonOffsetRecommendation: {
      treesToPlant: Math.max(1, Math.round(selectedTransport.co2Kg / 22)),
      offsetCostInr: Math.max(100, Math.round(selectedTransport.co2Kg * 4.5)),
      partner: 'National Green Corridor Initiative'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  localTrips.set(tripId, trip);
  localTrips.set('active-trip', trip);

  return trip;
};

export const getTripById = (id) => {
  return localTrips.get(id) || localTrips.get('active-trip');
};
