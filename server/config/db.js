import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory / File-based Store fallback if MongoDB is not connected
export const localStore = {
  destinations: [],
  trips: [],
  heritageSites: [],
  safetyZones: [],
  incidents: [],
  events: [],
  apiLogs: [],
  hotels: [],
  transportOptions: [],
  crowdData: []
};

export let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/safarai_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database] MongoDB not detected. Activating zero-friction in-memory store.`);
  }
};
