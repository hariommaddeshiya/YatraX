import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema with Gamified India Explorer Progress
const UserSchema = new mongoose.Schema({
  username: { type: String, trim: true },
  name: { type: String, default: 'Explorer' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'admin', 'authority'], default: 'tourist' },
  avatar: { type: String, default: '🇮🇳' },
  phone: { type: String },
  
  // Gamification & Exploration Progress
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  exploredDestinations: [
    {
      destinationId: { type: String, required: true },
      stateId: { type: String, required: true },
      destinationName: { type: String },
      category: { type: String },
      completedAt: { type: Date, default: Date.now },
      xpEarned: { type: Number, default: 100 }
    }
  ],
  stateProgress: [
    {
      stateId: { type: String, required: true },
      completedDestinations: { type: Number, default: 0 },
      totalDestinations: { type: Number, default: 10 },
      percentage: { type: Number, default: 0 },
      isCompleted: { type: Boolean, default: false },
      completedAt: { type: Date }
    }
  ],
  achievements: [
    {
      achievementId: { type: String, required: true },
      title: { type: String, required: true },
      icon: { type: String, default: '🏅' },
      description: { type: String },
      unlockedAt: { type: Date, default: Date.now },
      xpBonus: { type: Number, default: 100 }
    }
  ],

  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: 'Family' }
  },
  homeCity: { type: String, default: 'New Delhi' },
  travelStyle: { type: String, default: 'Eco-Conscious' },
  dietaryPreference: { type: String, default: 'Vegetarian' },
  savedTrips: [
    {
      tripId: { type: String, required: true },
      origin: { type: String, required: true },
      destination: { type: String, required: true },
      startDate: { type: String },
      endDate: { type: String },
      totalDays: { type: Number },
      travellers: { type: Number },
      totalCostInr: { type: Number },
      travelStyle: { type: String },
      confirmedAt: { type: Date, default: Date.now },
      isCompleted: { type: Boolean, default: false }
    }
  ],
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  },
  activeTripId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save password hashing hook
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on XP
UserSchema.methods.calculateLevel = function () {
  // Levels: L1=0, L2=300, L3=700, L4=1200, L5=1800, L6=2600, L7=3500, L8=4600, L9=6000, L10=7500+
  const xp = this.xp || 0;
  if (xp >= 7500) return 10;
  if (xp >= 6000) return 9;
  if (xp >= 4600) return 8;
  if (xp >= 3500) return 7;
  if (xp >= 2600) return 6;
  if (xp >= 1800) return 5;
  if (xp >= 1200) return 4;
  if (xp >= 700) return 3;
  if (xp >= 300) return 2;
  return 1;
};

// Destination Schema
const DestinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  region: { type: String, enum: ['Northeast', 'North', 'South', 'West', 'East', 'Central'] },
  category: { type: String, enum: ['Featured', 'Offbeat', 'Heritage', 'Wildlife', 'Spiritual', 'Adventure'] },
  isOffbeat: { type: Boolean, default: false },
  tagline: { type: String },
  culturalDescription: { type: String },
  image: { type: String },
  gallery: [String],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  ecoScore: { type: Number, min: 0, max: 100, default: 85 },
  safetyScore: { type: Number, min: 0, max: 100, default: 90 },
  carbonFootprintPerDayKg: { type: Number, default: 4.5 },
  bestSeason: { type: String },
  popularAttractions: [{
    name: String,
    type: { type: String, enum: ['waterfall', 'trek', 'temple', 'museum', 'viewpoint', 'market', 'cultural', 'caving'] },
    isOutdoor: Boolean,
    ecoRating: Number,
    crowdPeakTime: String,
    averageVisitDurationMin: Number,
    ticketPriceInr: Number,
    image: String,
    coordinates: { lat: Number, lng: Number }
  }],
  cultureHighlights: {
    heritage: String,
    festivals: [String],
    food: [String],
    handicrafts: [String],
    tribalCulture: String,
    localExperiences: [String]
  },
  hotels: [{
    id: String,
    name: String,
    type: { type: String, enum: ['Eco-Lodge', 'Homestay', 'Heritage Haveli', 'Resort', 'Boutique Hotel'] },
    pricePerNightInr: Number,
    rating: Number,
    ecoCertified: Boolean,
    coordinates: { lat: Number, lng: Number },
    amenities: [String],
    image: String
  }],
  emergencyServices: {
    nearestHospital: { name: String, distanceKm: Number, phone: String, lat: Number, lng: Number },
    nearestPoliceStation: { name: String, distanceKm: Number, phone: String, lat: Number, lng: Number },
    touristAssistanceCenter: { name: String, phone: String, address: String },
    safeEvacuationPoint: { name: String, lat: Number, lng: Number }
  }
});

// Trip Schema
const TripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: 'tourist-demo-01' },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  destinationId: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  travellers: { type: Number, default: 2 },
  totalDays: { type: Number, default: 6 },
  budgetLimit: { type: Number, required: true },
  travelStyle: { type: String, enum: ['Budget', 'Luxury', 'Eco', 'Adventure', 'Family', 'Cultural'], default: 'Eco' },
  interests: [String],
  selectedTransport: {
    mode: { type: String, enum: ['Flight', 'Train', 'Bus', 'Taxi', 'Rental', 'Walking', 'EV'] },
    costInr: Number,
    travelTimeHours: Number,
    ecoScore: Number,
    safetyScore: Number,
    co2Kg: Number,
    overallScore: Number
  },
  transportOptions: [mongoose.Schema.Types.Mixed],
  itinerary: [{
    day: Number,
    date: String,
    theme: String,
    activities: [{
      id: String,
      time: String,
      title: String,
      description: String,
      type: String,
      isOutdoor: Boolean,
      estimatedCostInr: Number,
      carbonKg: Number,
      crowdForecast: String,
      crowdPercentage: Number,
      weatherRisk: { type: String, enum: ['LOW', 'MODERATE', 'HIGH'], default: 'LOW' },
      isReplaced: { type: Boolean, default: false },
      replacedFrom: String,
      replacementReason: String
    }],
    stay: {
      hotelId: String,
      name: String,
      costPerNightInr: Number,
      ecoCertified: Boolean,
      isSubstituted: { type: Boolean, default: false },
      substitutionReason: String
    }
  }],
  budgetBreakdown: {
    transportCost: Number,
    hotelCost: Number,
    foodCost: Number,
    ticketsCost: Number,
    localTravelCost: Number,
    bufferCost: Number,
    totalEstimatedCost: Number,
    remainingBudget: Number,
    utilizationPercent: Number,
    isOverBudget: Boolean,
    budgetAccuracy: Number,
    referenceCost: Number
  },
  ecoScore: { type: Number, default: 92 },
  safetyScore: { type: Number, default: 91 },
  totalCarbonKg: { type: Number, default: 85 },
  status: { type: String, enum: ['PLANNED', 'ACTIVE', 'ADAPTED', 'COMPLETED'], default: 'PLANNED' },
  adaptationHistory: [{
    timestamp: { type: Date, default: Date.now },
    triggerType: { type: String, enum: ['HOTEL_PRICE', 'WEATHER_ALERT', 'CROWD_SURGE', 'SAFETY_GEOFENCE', 'NETWORK_LOSS'] },
    message: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    actionTaken: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Heritage Site Schema
const HeritageSiteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  unescoHeritage: { type: Boolean, default: true },
  era: { type: String },
  historicalSummary: { type: String },
  culturalImportance: { type: String },
  architectureStyle: { type: String },
  image: { type: String },
  panoramaUrl: { type: String },
  audioTourSummary: { type: String },
  hotspots: [{
    id: String,
    title: String,
    description: String,
    position: { x: Number, y: Number, z: Number },
    type: { type: String, enum: ['architecture', 'sculpture', 'history', 'mythology'] }
  }]
});

// Safety Zone & Incident Schemas
const SafetyZoneSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  riskType: { type: String, enum: ['LANDSLIDE_PRONE', 'SUDDEN_SWELL_WATERFALL', 'ROCKFALL', 'HIGH_ALTITUDE_SICKNESS', 'RESTRICTED_FOREST'] },
  coordinates: { lat: Number, lng: Number },
  radiusMeters: { type: Number, default: 500 },
  advisory: { type: String },
  nearestSafePoint: { name: String, lat: Number, lng: Number }
});

const IncidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  touristId: { type: String, required: true },
  touristName: { type: String, default: 'Aarav Sharma' },
  tripId: { type: String },
  location: {
    lat: Number,
    lng: Number,
    name: String
  },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  triggerType: { type: String, enum: ['GEOFENCE_BREACH', 'WEATHER_ALERT', 'SOS_TRIGGERED', 'CROWD_CRUSH'] },
  status: { type: String, enum: ['ACTIVE', 'RESPONDING', 'RESOLVED'], default: 'ACTIVE' },
  timestamp: { type: Date, default: Date.now },
  recommendedAction: { type: String },
  actionTaken: { type: String }
});

// API Log Schema
const ApiLogSchema = new mongoose.Schema({
  apiName: { type: String, required: true },
  endpoint: { type: String },
  category: { type: String, enum: ['WEATHER', 'MAPS', 'ROUTING', 'POI', 'HERITAGE', 'SOCKET'] },
  sourceType: { type: String, enum: ['LIVE API', 'VERIFIED DATA', 'CALCULATED DATA', 'AI PREDICTION', 'DEMO DATA'] },
  status: { type: String, default: 'ONLINE' },
  responseTimeMs: { type: Number, default: 120 },
  statusCode: { type: Number, default: 200 },
  lastChecked: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
export const Destination = mongoose.model('Destination', DestinationSchema);
export const Trip = mongoose.model('Trip', TripSchema);
export const HeritageSite = mongoose.model('HeritageSite', HeritageSiteSchema);
export const SafetyZone = mongoose.model('SafetyZone', SafetyZoneSchema);
export const Incident = mongoose.model('Incident', IncidentSchema);
export const ApiLog = mongoose.model('ApiLog', ApiLogSchema);
