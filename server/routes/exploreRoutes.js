import express from 'express';
import passport from 'passport';
import { User } from '../models/Schemas.js';
import { isMongoConnected, localStore } from '../config/db.js';
import { 
  indiaStatesData, 
  getStateById, 
  getDestinationById, 
  getTotalDestinationsCount 
} from '../data/indiaStatesData.js';

const router = express.Router();

// Achievement Definitions
export const ALL_ACHIEVEMENTS = [
  {
    id: 'welcome-explorer',
    title: 'Namaste Explorer',
    icon: '🇮🇳',
    category: 'Special',
    description: 'Began the journey across Incredible India.',
    xpBonus: 100,
    check: () => true
  },
  {
    id: 'heritage-explorer',
    title: 'Heritage Explorer',
    icon: '🏛️',
    category: 'Heritage',
    description: 'Explored 3 UNESCO & ancient heritage monuments.',
    xpBonus: 250,
    check: (user) => {
      const count = (user.exploredDestinations || []).filter(d => d.category === 'Heritage').length;
      return count >= 3;
    }
  },
  {
    id: 'eco-traveller',
    title: 'Eco Traveller',
    icon: '🌱',
    category: 'Eco',
    description: 'Visited 3 sacred rainforests & natural sanctuaries.',
    xpBonus: 250,
    check: (user) => {
      const count = (user.exploredDestinations || []).filter(d => d.category === 'Nature').length;
      return count >= 3;
    }
  },
  {
    id: 'culture-explorer',
    title: 'Culture Explorer',
    icon: '🎨',
    category: 'Culture',
    description: 'Experienced 3 living folk arts, satras, or museums.',
    xpBonus: 250,
    check: (user) => {
      const count = (user.exploredDestinations || []).filter(d => d.category === 'Culture').length;
      return count >= 3;
    }
  },
  {
    id: 'adventure-seeker',
    title: 'Adventure Seeker',
    icon: '🏔️',
    category: 'Adventure',
    description: 'Conquered 3 mountain treks, caves, or high passes.',
    xpBonus: 300,
    check: (user) => {
      const count = (user.exploredDestinations || []).filter(d => d.category === 'Adventure').length;
      return count >= 3;
    }
  },
  {
    id: 'food-explorer',
    title: 'Food Explorer',
    icon: '🍛',
    category: 'Food',
    description: 'Tasted authentic regional & street food culinary heritages.',
    xpBonus: 200,
    check: (user) => {
      const count = (user.exploredDestinations || []).filter(d => d.category === 'Food').length;
      return count >= 1;
    }
  },
  {
    id: 'state-hopper',
    title: 'State Hopper',
    icon: '🗺️',
    category: 'Exploration',
    description: 'Explored destinations in 3 different Indian States/UTs.',
    xpBonus: 400,
    check: (user) => {
      const stateSet = new Set((user.exploredDestinations || []).map(d => d.stateId));
      return stateSet.size >= 3;
    }
  },
  {
    id: 'trailblazer',
    title: 'Trailblazer',
    icon: '🔥',
    category: 'Offbeat',
    description: 'Discovered 3 offbeat & hidden gems of India.',
    xpBonus: 350,
    check: (user) => {
      const count = (user.exploredDestinations || []).filter(d => {
        const dest = getDestinationById(d.destinationId);
        return dest && dest.isOffbeat;
      }).length;
      return count >= 3;
    }
  },
  {
    id: 'state-master',
    title: 'State Master',
    icon: '👑',
    category: 'Mastery',
    description: 'Completed 100% of all destinations in any Indian State.',
    xpBonus: 500,
    check: (user) => {
      return (user.stateProgress || []).some(s => s.isCompleted || s.percentage === 100);
    }
  },
  {
    id: 'india-explorer',
    title: 'Bharat Explorer',
    icon: '🌟',
    category: 'Mastery',
    description: 'Explored destinations across 10 or more Indian States.',
    xpBonus: 1000,
    check: (user) => {
      const stateSet = new Set((user.exploredDestinations || []).map(d => d.stateId));
      return stateSet.size >= 10;
    }
  }
];

// Helper: Calculate level from XP
const calculateLevelFromXP = (xp = 0) => {
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

// Optional auth helper to check if a valid bearer token is sent
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const jwt = (await import('jsonwebtoken')).default;
    const { JWT_SECRET } = await import('../config/passport.js');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (isMongoConnected) {
      return await User.findById(decoded.id).select('-password');
    }
    const memUser = (localStore.users || []).find(u => u.id === decoded.id || u._id === decoded.id);
    return memUser || null;
  } catch (err) {
    return null;
  }
};

// GET /api/explore/states
router.get('/states', async (req, res) => {
  try {
    const user = await getOptionalUser(req);
    const guestExplored = localStore.guestExploredDestinations || [];
    const userExploredList = [...(user?.exploredDestinations || []), ...guestExplored];
    const userExplored = new Set(userExploredList.map(d => d.destinationId));

    const statesWithProgress = indiaStatesData.map(state => {
      const total = state.destinations.length;
      const completed = state.destinations.filter(d => userExplored.has(d.id)).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const isCompleted = completed === total && total > 0;

      return {
        id: state.id,
        code: state.code,
        name: state.name,
        capital: state.capital,
        region: state.region,
        description: state.description,
        image: state.image,
        totalDestinations: total,
        completedDestinations: completed,
        percentage,
        isCompleted,
        destinations: state.destinations.map(d => ({
          ...d,
          isCompleted: userExplored.has(d.id)
        }))
      };
    });

    res.json({
      success: true,
      states: statesWithProgress
    });
  } catch (error) {
    console.error('States error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/explore/progress
router.get('/progress', async (req, res) => {
  try {
    const user = await getOptionalUser(req);
    const totalDestinations = getTotalDestinationsCount();
    const guestExplored = localStore.guestExploredDestinations || [];
    const userExplored = [...(user?.exploredDestinations || []), ...guestExplored];
    const exploredCount = userExplored.length;
    const overallPercentage = totalDestinations > 0 
      ? Math.round((exploredCount / totalDestinations) * 100) 
      : 0;

    // Calculate states completed
    let statesCompletedCount = 0;
    const userExploredSet = new Set(userExplored.map(d => d.destinationId));
    
    indiaStatesData.forEach(state => {
      const stateCompleted = state.destinations.every(d => userExploredSet.has(d.id));
      if (stateCompleted && state.destinations.length > 0) {
        statesCompletedCount++;
      }
    });

    const uniqueStatesExplored = new Set(userExplored.map(d => d.stateId)).size;

    res.json({
      success: true,
      isLoggedIn: !!user,
      user: user ? {
        username: user.username || user.name,
        email: user.email,
        xp: user.xp || 0,
        level: user.level || calculateLevelFromXP(user.xp),
        avatar: user.avatar || '🇮🇳'
      } : null,
      stats: {
        totalDestinations,
        exploredCount,
        overallPercentage,
        statesCompletedCount,
        uniqueStatesExplored,
        totalStates: indiaStatesData.length,
        totalXP: user?.xp || 0,
        level: user?.level || calculateLevelFromXP(user?.xp),
        achievementsUnlockedCount: user?.achievements?.length || 0,
        totalAchievementsCount: ALL_ACHIEVEMENTS.length
      }
    });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/explore/destination/:destinationId/complete (PROTECTED - Strict Anti-Cheat)
router.post(
  '/destination/:destinationId/complete',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { destinationId } = req.params;
      const user = req.user;

      // 1. Verify destination exists in master catalog
      const dest = getDestinationById(destinationId);
      if (!dest) {
        return res.status(404).json({
          success: false,
          message: `Destination with ID '${destinationId}' not found in India master catalog.`
        });
      }

      // 2. Anti-Cheat Check: Prevent duplicate reward exploitation
      const alreadyCompleted = (user.exploredDestinations || []).some(
        d => d.destinationId === destinationId
      );

      if (alreadyCompleted) {
        return res.json({
          success: true,
          message: `You have already explored ${dest.name}!`,
          alreadyCompleted: true,
          destination: dest.name,
          xpEarned: 0,
          totalXP: user.xp,
          level: user.level
        });
      }

      // 3. Server-side deterministic XP calculation (Never trust frontend amounts)
      const earnedXP = dest.xp || 100;
      let totalXPGained = earnedXP;

      // Add to user explored destinations
      user.exploredDestinations.push({
        destinationId: dest.id,
        stateId: dest.stateId,
        destinationName: dest.name,
        category: dest.category,
        completedAt: new Date(),
        xpEarned: earnedXP
      });

      // 4. Update state progress
      const stateObj = getStateById(dest.stateId);
      const userExploredSet = new Set(user.exploredDestinations.map(d => d.destinationId));
      const stateDestinations = stateObj?.destinations || [];
      const completedCount = stateDestinations.filter(d => userExploredSet.has(d.id)).length;
      const totalCount = stateDestinations.length;
      const percentage = Math.round((completedCount / totalCount) * 100);
      const isStateMastered = completedCount === totalCount && totalCount > 0;

      // Update stateProgress entry on user
      const existingStateIndex = (user.stateProgress || []).findIndex(s => s.stateId === dest.stateId);
      let stateMasteryBonusAwarded = false;

      if (existingStateIndex >= 0) {
        const prevState = user.stateProgress[existingStateIndex];
        if (!prevState.isCompleted && isStateMastered) {
          // Award 500 XP State Mastery Bonus!
          totalXPGained += 500;
          stateMasteryBonusAwarded = true;
          prevState.isCompleted = true;
          prevState.completedAt = new Date();
        }
        prevState.completedDestinations = completedCount;
        prevState.totalDestinations = totalCount;
        prevState.percentage = percentage;
      } else {
        if (isStateMastered) {
          totalXPGained += 500;
          stateMasteryBonusAwarded = true;
        }
        user.stateProgress.push({
          stateId: dest.stateId,
          completedDestinations: completedCount,
          totalDestinations: totalCount,
          percentage,
          isCompleted: isStateMastered,
          completedAt: isStateMastered ? new Date() : null
        });
      }

      // Update XP & recalculate Level
      user.xp = (user.xp || 0) + totalXPGained;
      user.level = calculateLevelFromXP(user.xp);

      // 5. Evaluate and unlock any new achievements
      const newlyUnlocked = [];
      const userAchievementIds = new Set((user.achievements || []).map(a => a.achievementId));

      for (const ach of ALL_ACHIEVEMENTS) {
        if (!userAchievementIds.has(ach.id) && ach.check(user)) {
          user.achievements.push({
            achievementId: ach.id,
            title: ach.title,
            icon: ach.icon,
            description: ach.description,
            unlockedAt: new Date(),
            xpBonus: ach.xpBonus
          });
          user.xp += ach.xpBonus;
          user.level = calculateLevelFromXP(user.xp);
          newlyUnlocked.push({
            id: ach.id,
            title: ach.title,
            icon: ach.icon,
            description: ach.description,
            xpBonus: ach.xpBonus
          });
        }
      }

      // Save user to database
      if (isMongoConnected) {
        await user.save();
      } else {
        const memIdx = (localStore.users || []).findIndex(u => u.id === user.id || u._id === user._id);
        if (memIdx >= 0) {
          localStore.users[memIdx] = { ...user };
        }
      }

      res.json({
        success: true,
        message: `Explored ${dest.name}! +${earnedXP} XP earned.`,
        destination: dest.name,
        destinationId: dest.id,
        xpEarned: earnedXP,
        totalXPGained,
        stateMasteryBonusAwarded,
        totalXP: user.xp,
        level: user.level,
        state: {
          id: dest.stateId,
          name: stateObj?.name,
          completed: completedCount,
          total: totalCount,
          percentage,
          isCompleted: isStateMastered
        },
        newAchievements: newlyUnlocked
      });
    } catch (error) {
      console.error('Complete destination error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// GET /api/explore/state/:stateId
router.get('/state/:stateId', async (req, res) => {
  try {
    const { stateId } = req.params;
    const state = getStateById(stateId);
    if (!state) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }

    const user = await getOptionalUser(req);
    const userExplored = new Set((user?.exploredDestinations || []).map(d => d.destinationId));

    const completed = state.destinations.filter(d => userExplored.has(d.id)).length;
    const total = state.destinations.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      state: {
        ...state,
        completedDestinations: completed,
        totalDestinations: total,
        percentage,
        isCompleted: completed === total && total > 0,
        destinations: state.destinations.map(d => ({
          ...d,
          isCompleted: userExplored.has(d.id)
        }))
      }
    });
  } catch (error) {
    console.error('State detail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/explore/achievements
router.get('/achievements', async (req, res) => {
  try {
    const user = await getOptionalUser(req);
    const userUnlocked = new Map(
      (user?.achievements || []).map(a => [a.achievementId, a.unlockedAt])
    );

    const achievementsList = ALL_ACHIEVEMENTS.map(ach => ({
      id: ach.id,
      title: ach.title,
      icon: ach.icon,
      category: ach.category,
      description: ach.description,
      xpBonus: ach.xpBonus,
      isUnlocked: userUnlocked.has(ach.id),
      unlockedAt: userUnlocked.get(ach.id) || null
    }));

    res.json({
      success: true,
      achievements: achievementsList
    });
  } catch (error) {
    console.error('Achievements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/explore/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    let topUsers = [];

    if (isMongoConnected) {
      topUsers = await User.find({})
        .sort({ xp: -1 })
        .limit(10)
        .select('username name avatar xp level exploredDestinations stateProgress');
    } else {
      topUsers = (localStore.users || [])
        .slice()
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 10);
    }

    const leaderboard = topUsers.map((u, idx) => ({
      rank: idx + 1,
      username: u.username || u.name || 'Anonymous Explorer',
      avatar: u.avatar || '🇮🇳',
      xp: u.xp || 0,
      level: u.level || calculateLevelFromXP(u.xp),
      destinationsCount: u.exploredDestinations?.length || 0,
      statesMasteredCount: (u.stateProgress || []).filter(s => s.isCompleted || s.percentage === 100).length
    }));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
