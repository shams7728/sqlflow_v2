const UserStats = require('../models/UserStats');
const Achievement = require('../models/Achievement');
const Progress = require('../models/Progress');

// XP rewards for different actions
const XP_REWARDS = {
  LESSON_COMPLETE: 100,
  PRACTICE_COMPLETE: 50,
  QUIZ_COMPLETE: 75,
  PERFECT_SCORE: 50, // Bonus for 100% score
  FIRST_TRY: 25, // Bonus for completing on first attempt
  STREAK_BONUS: 10, // Per day of streak
  BOOKMARK: 5,
  NOTE_ADDED: 10
};

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS = {
  FIRST_LESSON: {
    id: 'first_lesson',
    type: 'lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    xp: 50,
    points: 10,
    rarity: 'common',
    check: async (userId) => {
      const count = await Progress.countDocuments({ 
        userId, 
        status: { $in: ['completed', 'mastered'] } 
      });
      return count === 1;
    }
  },
  FIVE_LESSONS: {
    id: 'five_lessons',
    type: 'lesson',
    title: 'Getting Started',
    description: 'Complete 5 lessons',
    xp: 100,
    points: 25,
    rarity: 'common',
    check: async (userId) => {
      const count = await Progress.countDocuments({ 
        userId, 
        status: { $in: ['completed', 'mastered'] } 
      });
      return count === 5;
    }
  },
  TEN_LESSONS: {
    id: 'ten_lessons',
    type: 'lesson',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    xp: 200,
    points: 50,
    rarity: 'rare',
    check: async (userId) => {
      const count = await Progress.countDocuments({ 
        userId, 
        status: { $in: ['completed', 'mastered'] } 
      });
      return count === 10;
    }
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    type: 'score',
    title: 'Perfectionist',
    description: 'Get 100% score on a lesson',
    xp: 75,
    points: 20,
    rarity: 'rare',
    check: async (userId, progress) => {
      return progress && progress.score === 100;
    }
  },
  WEEK_STREAK: {
    id: 'week_streak',
    type: 'streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    xp: 150,
    points: 30,
    rarity: 'rare',
    check: async (userId, stats) => {
      return stats && stats.currentStreak >= 7;
    }
  },
  PRACTICE_MASTER: {
    id: 'practice_master',
    type: 'practice',
    title: 'Practice Makes Perfect',
    description: 'Complete 20 practice exercises',
    xp: 100,
    points: 25,
    rarity: 'common',
    check: async (userId) => {
      const stats = await UserStats.findOne({ userId });
      return stats && stats.totalPracticeCompleted >= 20;
    }
  },
  QUIZ_CHAMPION: {
    id: 'quiz_champion',
    type: 'quiz',
    title: 'Quiz Champion',
    description: 'Complete 10 quizzes',
    xp: 100,
    points: 25,
    rarity: 'common',
    check: async (userId) => {
      const stats = await UserStats.findOne({ userId });
      return stats && stats.totalQuizzesCompleted >= 10;
    }
  }
};

// Award XP to user
async function awardXP(userId, amount, reason = '') {
  try {
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
      stats = new UserStats({ userId, totalXP: 0, level: 1 });
    }
    
    const oldLevel = stats.level;
    stats.totalXP += amount;
    stats.calculateLevel();
    const newLevel = stats.level;
    
    await stats.save();
    
    const leveledUp = newLevel > oldLevel;
    
    return {
      success: true,
      xpAwarded: amount,
      totalXP: stats.totalXP,
      oldLevel,
      newLevel,
      leveledUp,
      reason,
      levelProgress: stats.getLevelProgress()
    };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return { success: false, error: error.message };
  }
}

// Check and award achievements
async function checkAchievements(userId, context = {}) {
  const newAchievements = [];
  
  try {
    for (const [key, achievement] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      // Check if user already has this achievement
      const existing = await Achievement.findOne({ 
        userId, 
        achievementId: achievement.id 
      });
      
      if (existing) continue;
      
      // Check if user qualifies for this achievement
      const qualifies = await achievement.check(userId, context.progress, context.stats);
      
      if (qualifies) {
        const newAchievement = new Achievement({
          userId,
          achievementId: achievement.id,
          achievementType: achievement.type,
          title: achievement.title,
          description: achievement.description,
          points: achievement.points,
          xp: achievement.xp,
          rarity: achievement.rarity,
          earnedAt: new Date()
        });
        
        await newAchievement.save();
        
        // Award XP for achievement
        await awardXP(userId, achievement.xp, `Achievement: ${achievement.title}`);
        
        newAchievements.push(newAchievement);
      }
    }
    
    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

// Update streak
async function updateStreak(userId) {
  try {
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
      stats = new UserStats({ userId });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change
        return stats;
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.longestStreak) {
          stats.longestStreak = stats.currentStreak;
        }
      } else {
        // Streak broken
        stats.currentStreak = 1;
      }
    } else {
      // First activity
      stats.currentStreak = 1;
      stats.longestStreak = 1;
    }
    
    stats.lastActivityDate = new Date();
    await stats.save();
    
    // Check for streak achievements
    await checkAchievements(userId, { stats });
    
    return stats;
  } catch (error) {
    console.error('Error updating streak:', error);
    return null;
  }
}

module.exports = {
  XP_REWARDS,
  awardXP,
  checkAchievements,
  updateStreak,
  ACHIEVEMENT_DEFINITIONS
};
