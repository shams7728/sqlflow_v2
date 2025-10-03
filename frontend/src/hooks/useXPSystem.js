import { useState, useCallback, useEffect } from 'react';
import { xpService } from '../services/xpService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to manage XP system integration
 */
export function useXPSystem() {
  const { user, isGuest } = useAuth();
  const [xpNotification, setXPNotification] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user stats on mount
  useEffect(() => {
    const loadStats = async () => {
      if (isGuest || !user) {
        setUserStats({
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          practiceCompleted: 0,
          quizzesCompleted: 0
        });
        setLoading(false);
        return;
      }

      try {
        const userId = user.id || user._id;
        const stats = await xpService.getUserStats(userId);
        setUserStats(stats);
      } catch (error) {
        console.error('Failed to load user stats:', error);
        // Set default stats on error
        setUserStats({
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          practiceCompleted: 0,
          quizzesCompleted: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, isGuest]);

  /**
   * Award XP to the user
   */
  const awardXP = useCallback(async (amount, reason) => {
    if (isGuest || !user) {
      console.log('Guest mode: XP not saved');
      return;
    }

    try {
      const userId = user.id || user._id;
      const oldLevel = userStats?.level || 1;
      
      const result = await xpService.awardXP(userId, amount, reason);
      
      // Update local stats
      setUserStats(prev => ({
        ...prev,
        totalXP: result.totalXP,
        level: result.level
      }));

      // Show XP notification
      setXPNotification({
        type: 'xp',
        data: { amount, reason }
      });

      // Check for level up
      if (result.level > oldLevel) {
        setTimeout(() => {
          setXPNotification({
            type: 'levelUp',
            data: { newLevel: result.level, oldLevel }
          });
        }, 1500);
      }

      return result;
    } catch (error) {
      console.error('Failed to award XP:', error);
    }
  }, [user, isGuest, userStats]);

  /**
   * Complete a lesson and award XP
   */
  const completeLesson = useCallback(async (lessonId, score, timeSpent, attempts = 1) => {
    if (isGuest || !user) {
      console.log('Guest mode: Progress not saved');
      return;
    }

    try {
      const userId = user.id || user._id;
      const rewards = xpService.getXPRewards();
      
      // Calculate XP rewards
      let totalXP = rewards.LESSON_COMPLETE;
      const bonuses = [];

      if (score === 100) {
        totalXP += rewards.PERFECT_SCORE;
        bonuses.push('Perfect Score');
      }

      if (attempts === 1) {
        totalXP += rewards.FIRST_TRY;
        bonuses.push('First Try');
      }

      // Update progress in backend
      const result = await xpService.updateProgress(userId, lessonId, {
        status: 'completed',
        score,
        timeSpent,
        attempts
      });

      // Update local stats
      setUserStats(prev => ({
        ...prev,
        totalXP: result.stats.totalXP,
        level: result.stats.level,
        lessonsCompleted: (prev.lessonsCompleted || 0) + 1
      }));

      // Show notification
      const bonusText = bonuses.length > 0 ? ` (${bonuses.join(', ')})` : '';
      setXPNotification({
        type: 'xp',
        data: { 
          amount: totalXP, 
          reason: `Lesson Complete${bonusText}` 
        }
      });

      // Check for achievements
      if (result.newAchievements && result.newAchievements.length > 0) {
        result.newAchievements.forEach((achievement, index) => {
          setTimeout(() => {
            setXPNotification({
              type: 'achievement',
              data: achievement
            });
          }, 2000 + (index * 2000));
        });
      }

      return result;
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  }, [user, isGuest]);

  /**
   * Complete practice exercises
   */
  const completePractice = useCallback(async (practiceId, score) => {
    if (isGuest || !user) return;

    try {
      const userId = user.id || user._id;
      const rewards = xpService.getXPRewards();
      const xpAmount = rewards.PRACTICE_COMPLETE;

      await awardXP(xpAmount, 'Practice Complete');

      setUserStats(prev => ({
        ...prev,
        practiceCompleted: (prev.practiceCompleted || 0) + 1
      }));
    } catch (error) {
      console.error('Failed to complete practice:', error);
    }
  }, [user, isGuest, awardXP]);

  /**
   * Complete quiz
   */
  const completeQuiz = useCallback(async (quizId, score) => {
    if (isGuest || !user) return;

    try {
      const userId = user.id || user._id;
      const rewards = xpService.getXPRewards();
      let xpAmount = rewards.QUIZ_COMPLETE;

      if (score === 100) {
        xpAmount += rewards.PERFECT_SCORE;
      }

      await awardXP(xpAmount, score === 100 ? 'Quiz Perfect!' : 'Quiz Complete');

      setUserStats(prev => ({
        ...prev,
        quizzesCompleted: (prev.quizzesCompleted || 0) + 1
      }));
    } catch (error) {
      console.error('Failed to complete quiz:', error);
    }
  }, [user, isGuest, awardXP]);

  /**
   * Update daily streak
   */
  const updateStreak = useCallback(async () => {
    if (isGuest || !user) return;

    try {
      const userId = user.id || user._id;
      const result = await xpService.updateStreak(userId);

      setUserStats(prev => ({
        ...prev,
        currentStreak: result.currentStreak,
        longestStreak: result.longestStreak
      }));

      // Award streak bonus if applicable
      if (result.streakBonus) {
        await awardXP(result.streakBonus, `${result.currentStreak} Day Streak!`);
      }

      return result;
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  }, [user, isGuest, awardXP]);

  /**
   * Close XP notification
   */
  const closeNotification = useCallback(() => {
    setXPNotification(null);
  }, []);

  return {
    userStats,
    loading,
    awardXP,
    completeLesson,
    completePractice,
    completeQuiz,
    updateStreak,
    xpNotification,
    closeNotification
  };
}
