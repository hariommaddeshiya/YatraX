# SafarAI: AI-Driven Eco-Tourism & Multi-Modal Travel Planner 🌿🇮🇳
### *Smart India Hackathon 2026 (SIH 2026) Innovation Platform*

> **Philosophy:** `PLAN` ➔ `MONITOR` ➔ `ADAPT` ➔ `PROTECT`  
> An adaptive Indian tourism intelligence engine that continuously recalculates travel routes, budgets, and itineraries while safeguarding local ecosystems, culture, and traveler safety.

---

## 🌟 Key Innovations & Features

1. **AI Multi-Modal Logistics Engine (`/planner`)**:
   - Compare Flight, Train (Vistadome/Express), Bus, Taxi, Rental SUV, Walking, and EV routes across India.
   - Dynamic Multi-Factor Scoring Formula:
     $$\text{Overall Score} = 0.40 \times \text{Cost} + 0.25 \times \text{Travel Time} + 0.20 \times \text{Eco Score} + 0.15 \times \text{Safety}$$
   - Live carbon footprint tracker in kg $\text{CO}_2$.

2. **Dynamic Budget Engine & Transparency (`/trip` & `/data-accuracy`)**:
   - Live category breakdown: $\text{Transport} + \text{Hotels} + \text{Food} + \text{Tickets} + \text{Local Travel} + \text{Buffer} = \text{Total Cost}$.
   - Mathematical Budget Accuracy:
     $$\text{Budget Accuracy} = \left(1 - \frac{|\text{Estimated Cost} - \text{Reference Cost}|}{\text{Reference Cost}}\right) \times 100\%$$
   - Dynamic auto-rebudgeting with partner eco-homestay substitution.

3. **Real-Time Adaptive Trip Engine (Socket.IO + REST)**:
   - **Weather Event**: Integrated with live **Open-Meteo API** (0-key live stream); automatically swaps high-risk outdoor waterfall treks for indoor tribal cultural museums when torrential rainfall (>15mm/hr) is detected.
   - **Crowd Event**: Predicts hourly peak curves; auto-shifts visit times to 07:00 AM tranquil windows or suggests offbeat alternatives.
   - **Price Event**: Detects hotel rate surges and rebalances budgets instantly.
   - **Geofence Safety Event**: Detects tourists crossing marked hazard perimeters, dispatches safe evacuation routes, and alerts the Government Command Center.

4. **360° Interactive Heritage Experience (`/heritage`)**:
   - Powered by **Three.js WebGL**.
   - Spherical equirectangular panoramas of the Taj Mahal, Varanasi Ghats, Hampi Ruins, and Tawang Monastery with interactive spatial hotspots and audio narration.

5. **Tourist Safety Geofencing & Government Command (`/safety` & `/admin/dashboard`)**:
   - Live safety score (91/100) monitoring 6 real-time sensors.
   - Interactive Leaflet geofence map with hazard zones, NABH trauma hospitals, police booths, and emergency safe shelters.
   - Universal floating Emergency SOS distress beacon.

6. **Full PWA Offline Mode**:
   - Service Worker caching + browser **IndexedDB** storage (`idb`).
   - All itineraries, vouchers, emergency numbers, and safe routes remain fully accessible without cellular connection.

7. **5-Minute SIH Presentation Simulation Panel (`/admin/demo`)**:
   - Dedicated evaluation dashboard to trigger the 5 core scenarios on demand:
     1. 🏨 Hotel Price Spike (₹4,000 ➔ ₹5,200 ➔ Re-budgeted to Hotel B ₹3,900)
     2. 🌧️ Torrential Weather Alert (Waterfall Trek ➔ Don Bosco Cultural Museum)
     3. 👥 Crowd Surge (Root Bridge 65% ➔ 92% ➔ 07:00 AM Slot Shift)
     4. 🚨 Hazard Geofence Breach (SOS Alert + Command Center Dispatch)
     5. 📶 Cellular Disconnect (PWA Offline Mode Toggle)

---

## 🏛️ System Architecture

```
d:\SIH 2026/
├── server/
│   ├── config/db.js                  # MongoDB / In-memory zero-friction store
│   ├── models/Schemas.js             # Mongoose Schemas
│   ├── seed/destinationsData.js      # Indian destinations, heritage & safety zones
│   ├── services/
│   │   ├── weatherService.js         # Live Open-Meteo API integration
│   │   ├── placesService.js          # OpenStreetMap / Overpass POIs query
│   │   ├── routingService.js         # Multi-modal logistics & scoring
│   │   ├── budgetService.js          # Dynamic budget breakdown & transparency math
│   │   ├── crowdService.js           # Crowd curves & time optimization
│   │   ├── safetyService.js          # Geofencing & SOS incident dispatcher
│   │   ├── heritageService.js        # Three.js 360 panorama assets & metadata
│   │   ├── apiMonitoringService.js   # Live API latency & health checks
│   │   └── adaptiveEngine.js         # Central event pipeline & Socket.IO broker
│   ├── routes/                       # Express REST endpoints
│   └── index.js                      # Express + Socket.IO server
└── client/
    ├── src/
    │   ├── components/               # Navbar, Footer, 360 Viewer, Map, SOS, Timeline
    │   ├── context/                  # SocketContext, TripContext, OfflineContext
    │   ├── pages/                    # Home, Explore, Planner, Trip, Heritage, Safety, Admin
    │   └── utils/                    # IndexedDB, Axios client
    └── vite.config.js
```

---

## 🚀 Running the Project Locally

### 1. Start the Backend API Server
```bash
cd server
npm install
npm start
# Server will run on http://localhost:5000
```

### 2. Start the Frontend React Client
```bash
cd client
npm install
npm run dev
# Vite client will run on http://localhost:3000
```

---

## 🎨 Cultural Design Palette
- **Warm Sand Background**: `#FAF8F5` / `#F8F6F0`
- **Earthy Terracotta**: `#B94723` / `#D95327`
- **Sacred Eco Emerald**: `#16A34A` / `#0F5132`
- **Saffron Gold**: `#D97706` / `#F59E0B`
- **Royal Indigo**: `#1E293B` / `#0F172A`
- **Emergency Crimson**: `#DC2626`

---

## 📜 Open Data Attributions
- **Weather Data**: Open-Meteo.com under [CC BY 4.0](https://open-meteo.com/)
- **Map & Spatial POIs**: © OpenStreetMap contributors under [ODbL](https://www.openstreetmap.org/)
- **Cultural Records**: Archaeological Survey of India & State Tourism Facilitation Portals.
