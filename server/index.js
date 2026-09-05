import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { setIoInstance } from './services/adaptiveEngine.js';
import { generateSmartTrip } from './services/tripService.js';
import passport from 'passport';
import { configurePassport } from './config/passport.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import placesRoutes from './routes/placesRoutes.js';
import safetyRoutes from './routes/safetyRoutes.js';
import heritageRoutes from './routes/heritageRoutes.js';
import demoRoutes from './routes/demoRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Passport Configuration
configurePassport(passport);
app.use(passport.initialize());

// Socket.IO real-time event broker
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setIoInstance(io);

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('JOIN_TRIP', (tripId) => {
    socket.join(tripId);
    console.log(`[Socket.IO] Client ${socket.id} joined trip room: ${tripId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/heritage', heritageRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    platform: 'YatraX - AI-Driven Multi-Modal Travel & 360° Sacred Sanctuaries',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve client static build files in production (Full-stack 1-Service Render Deployment)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  // Never cache sw.js so mobile browsers immediately detect updates
  app.get('/sw.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.sendFile(path.join(clientDistPath, 'sw.js'));
  });

  app.use(express.static(clientDistPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 YatraX Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO gateway active on port ${PORT}`);
  console.log(`🌿 Indian Eco-Tourism & Adaptive Engine Ready`);
  console.log(`=======================================================`);
});

// Seed default Meghalaya Trip on startup
const initializeServer = async () => {
  try {
    await connectDB();
    console.log('[YatraX] Seeding baseline smart trip (Delhi -> Meghalaya, Eco-Style)...');
    await generateSmartTrip({
      origin: 'Delhi',
      destination: 'Meghalaya',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      travellers: 2,
      budget: 40000,
      travelStyle: 'Eco',
      interests: ['Waterfalls', 'Mountains', 'Heritage', 'Villages']
    });
    console.log('[YatraX] Baseline smart trip initialized successfully.');
  } catch (err) {
    console.warn('[YatraX] Trip initialization warning:', err.message);
  }
};

initializeServer();
