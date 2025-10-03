const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const UserStats = require('../models/UserStats');
const { authenticateToken } = require('../middleware/auth');
const { ACHIEVEMENT_DEFINITIONS } = require('../services/xpService');

// Get all achievements for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own data
    if (req.user.userId !== userId && userId !== 'guest') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const achievements = await Achievement.find({ userId }).sort({ earnedAt: -1 });
    const userStats = await UserStats.findOne({ userId });
    
    res.json({
      success: true,
      data: {
        achievements,
        totalPoints: userStats ? userStats.totalPoints : 0,
        level: userStats ? userStats.getLevelProgress() : { level: 1, currentXP: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get available achievements (not yet earned)
router.get('/available/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own data
    if (req.user.userId !== userId && userId !== 'guest') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const earnedAchievements = await Achievement.find({ userId });
    const earnedIds = earnedAchievements.map(a => a.achievementId);
    
    const available = Object.values(ACHIEVEMENT_DEFINITIONS)
      .filter(a => !earnedIds.includes(a.id))
      .map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        xp: a.xp,
        points: a.points,
        rarity: a.rarity,
        type: a.type
      }));
    
    res.json({
      success: true,
      data: available
    });
  } catch (error) {
    console.error('Error fetching available achievements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
