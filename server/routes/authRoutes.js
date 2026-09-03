import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from '../models/Schemas.js';
import { isMongoConnected, localStore } from '../config/db.js';
import { JWT_SECRET } from '../config/passport.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Ensure local store has users array
if (!localStore.users) {
  localStore.users = [];
}

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      username: user.username || user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check existing user in MongoDB
    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please login.'
        });
      }

      const newUser = new User({
        username: cleanUsername,
        name: cleanUsername,
        email: cleanEmail,
        password: password, // Pre-save hook will hash this
        xp: 100, // 100 XP Welcome Bonus!
        level: 1,
        exploredDestinations: [],
        stateProgress: [],
        achievements: [
          {
            achievementId: 'welcome-explorer',
            title: 'Namaste Explorer',
            icon: '🇮🇳',
            description: 'Joined YatraX to discover incredible India.',
            unlockedAt: new Date(),
            xpBonus: 100
          }
        ]
      });

      await newUser.save();

      const token = generateToken(newUser);
      const userProfile = newUser.toObject();
      delete userProfile.password;

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to YatraX.',
        token,
        user: userProfile
      });
    }

    // In-memory fallback
    const existingMem = localStore.users.find(u => u.email === cleanEmail);
    if (existingMem) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const memUser = {
      _id: `usr-${uuidv4()}`,
      id: `usr-${uuidv4()}`,
      username: cleanUsername,
      name: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: 'tourist',
      avatar: '🇮🇳',
      xp: 100, // 100 XP Welcome Bonus
      level: 1,
      exploredDestinations: [],
      stateProgress: [],
      achievements: [
        {
          achievementId: 'welcome-explorer',
          title: 'Namaste Explorer',
          icon: '🇮🇳',
          description: 'Joined YatraX to discover incredible India.',
          unlockedAt: new Date(),
          xpBonus: 100
        }
      ],
      createdAt: new Date()
    };

    localStore.users.push(memUser);

    const token = generateToken(memUser);
    const userProfile = { ...memUser };
    delete userProfile.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to YatraX.',
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);
      const userProfile = user.toObject();
      delete userProfile.password;

      return res.json({
        success: true,
        message: 'Welcome back to YatraX!',
        token,
        user: userProfile
      });
    }

    // In-memory fallback
    const memUser = localStore.users.find(u => u.email === cleanEmail);
    if (!memUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(memUser);
    const userProfile = { ...memUser };
    delete userProfile.password;

    res.json({
      success: true,
      message: 'Welcome back to YatraX!',
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// GET /api/auth/me (Protected)
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/profile (Protected - Update user details & preferences)
router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const { 
      name, 
      username, 
      phone, 
      homeCity, 
      travelStyle, 
      dietaryPreference, 
      emergencyContact 
    } = req.body;

    if (name) user.name = name.trim();
    if (username) user.username = username.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (homeCity) user.homeCity = homeCity.trim();
    if (travelStyle) user.travelStyle = travelStyle.trim();
    if (dietaryPreference) user.dietaryPreference = dietaryPreference.trim();
    if (emergencyContact) {
      user.emergencyContact = {
        name: emergencyContact.name || user.emergencyContact?.name || '',
        phone: emergencyContact.phone || user.emergencyContact?.phone || '',
        relation: emergencyContact.relation || user.emergencyContact?.relation || 'Family'
      };
    }

    if (isMongoConnected) {
      await user.save();
    } else {
      const idx = (localStore.users || []).findIndex(u => (u._id || u.id) === (user._id || user.id));
      if (idx >= 0) {
        localStore.users[idx] = { ...user };
      }
    }

    const cleanUser = user.toObject ? user.toObject() : { ...user };
    delete cleanUser.password;

    res.json({
      success: true,
      message: 'Profile and preferences updated successfully!',
      user: cleanUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/save-trip (Protected - Save confirmed trip to user profile)
router.post('/save-trip', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const { trip } = req.body;

    if (!trip || !trip.id) {
      return res.status(400).json({ success: false, message: 'Invalid trip data' });
    }

    if (!user.savedTrips) user.savedTrips = [];

    // Check if already in saved trips
    const existingIdx = user.savedTrips.findIndex(t => t.tripId === trip.id);
    const tripEntry = {
      tripId: trip.id,
      origin: trip.origin,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      totalDays: trip.totalDays,
      travellers: trip.travellers,
      totalCostInr: trip.budgetBreakdown?.totalEstimatedCostInr || trip.estimatedBudgetInr || 0,
      travelStyle: trip.travelStyle,
      confirmedAt: new Date(),
      isCompleted: false
    };

    if (existingIdx >= 0) {
      user.savedTrips[existingIdx] = tripEntry;
    } else {
      user.savedTrips.unshift(tripEntry);
      // Award Planner XP Bonus (+150 XP) for creating & confirming a smart trip
      user.xp = (user.xp || 0) + 150;
      if (user.calculateLevel) user.level = user.calculateLevel();
    }

    user.activeTripId = trip.id;

    if (isMongoConnected) {
      await user.save();
    } else {
      const idx = (localStore.users || []).findIndex(u => (u._id || u.id) === (user._id || user.id));
      if (idx >= 0) {
        localStore.users[idx] = { ...user };
      }
    }

    const cleanUser = user.toObject ? user.toObject() : { ...user };
    delete cleanUser.password;

    res.json({
      success: true,
      message: 'Trip confirmed and saved to your profile! +150 XP awarded.',
      user: cleanUser,
      xpGained: 150
    });
  } catch (error) {
    console.error('Save trip error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
