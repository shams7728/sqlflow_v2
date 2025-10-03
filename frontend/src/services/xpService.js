import { api } from './api';

/**
 * XP Service - Handles all XP and achievement related API calls
 */
class XPService {
  /**
   * Get user stats (XP, level, streak, achievements)
   */
  async getUserStats(userId) {
    try {
      const response = await api.get(`/analytics/stats/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  }

  /**
   * Award XP to user
   */
  async awardXP(userId, amount, reason) {
    try {
      const response = await api.post('/progress/award-xp', {
        userId,
        amount,
        reason
      });
      return response;
    } catch (error) {
      console.error('Failed to award XP:', error);
      throw error;
    }
  }

  /**
   * Update lesson progress with XP rewards
   */
  async updateProgress(userId, lessonId, data) {
    try {
      const response = await api.post('/progress/update', {
        userId,
        lessonId,
        ...data
      });
      return response;
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }

  /**
   * Get user achievements
   */
  async getAchievements(userId) {
    try {
      const response = await api.get(`/achievements/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      throw error;
    }
  }

  /**
   * Check for new achievements
   */
  async checkAchievements(userId) {
    try {
      const response = await api.post('/achievements/check', { userId });
      return response;
    } catch (error) {
      console.error('Failed to check achievements:', error);
      throw error;
    }
  }

  /**
   * Update daily streak
   */
  async updateStreak(userId) {
    try {
      const response = await api.post('/analytics/streak', { userId });
      return response;
    } catch (error) {
      console.error('Failed to update streak:', error);
      throw error;
    }
  }

  /**
   * Calculate level from XP
   */
  calculateLevel(xp) {
    const levels = [
      { level: 1, xp: 0 },
      { level: 2, xp: 100 },
      { level: 3, xp: 300 },
      { level: 4, xp: 600 },
      { level: 5, xp: 1000 },
      { level: 6, xp: 1500 },
      { level: 7, xp: 2100 },
      { level: 8, xp: 2800 },
      { level: 9, xp: 3600 },
      { level: 10, xp: 4500 }
    ];

    let currentLevel = 1;
    let nextLevelXP = 100;
    let currentLevelXP = 0;

    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xp) {
        currentLevel = levels[i].level;
        currentLevelXP = levels[i].xp;
        nextLevelXP = i < levels.length - 1 ? levels[i + 1].xp : levels[i].xp + 1000;
        break;
      }
    }

    const xpInCurrentLevel = xp - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const progressToNextLevel = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    return {
      level: currentLevel,
      currentXP: xp,
      xpToNextLevel: nextLevelXP - xp,
      progressPercent: Math.min(progressToNextLevel, 100)
    };
  }

  /**
   * Get XP rewards for different actions
   */
  getXPRewards() {
    return {
      LESSON_COMPLETE: 100,
      PRACTICE_COMPLETE: 50,
      QUIZ_COMPLETE: 75,
      PERFECT_SCORE: 50,
      FIRST_TRY: 25,
      DAILY_LOGIN: 10,
      STREAK_BONUS: 20
    };
  }
}

export const xpService = new XPService();
