import { Context } from '../context';

// Import existing models
const User = require('../../models/User');

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const progressResolvers = {
  Query: {
    async myProgress(_: any, __: any, { user }: Context) {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      try {
        const userData = await User.findById(user.id);
        if (!userData || !userData.progress) {
          return [];
        }

        // Convert the existing progress structure to GraphQL format
        const progress = userData.progress;
        const progressArray = [];

        // Convert completed exercises to progress records
        if (progress.completedExercises) {
          for (const [exerciseId, completed] of progress.completedExercises) {
            if (completed) {
              progressArray.push({
                id: `exercise_${exerciseId}`,
                lessonId: exerciseId.split('_')[0], // Extract lesson ID from exercise ID
                status: 'COMPLETED',
                score: null,
                timeSpent: 0,
                completedAt: null,
              });
            }
          }
        }

        // Convert completed quizzes to progress records
        if (progress.completedQuizzes) {
          for (const [quizId, completed] of progress.completedQuizzes) {
            if (completed) {
              progressArray.push({
                id: `quiz_${quizId}`,
                lessonId: quizId.split('_')[0], // Extract lesson ID from quiz ID
                status: 'COMPLETED',
                score: null,
                timeSpent: 0,
                completedAt: null,
              });
            }
          }
        }

        return progressArray;
      } catch (error) {
        console.error('Progress fetch error:', error);
        return [];
      }
    }
  },

  Mutation: {
    async updateProgress(_: any, { lessonId, status, score, timeSpent }: any, { user }: Context) {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      try {
        const userData = await User.findById(user.id);
        if (!userData) {
          throw new Error('User not found');
        }

        // Initialize progress if it doesn't exist
        if (!userData.progress) {
          userData.progress = {
            completedExercises: new Map(),
            completedQuizzes: new Map(),
            completedChallenges: new Map(),
            unlockedAchievements: new Map(),
            xp: 0,
            level: 1,
            streak: 1,
            lastLogin: new Date(),
          };
        }

        // Update XP and level if completing something
        if (status === 'COMPLETED') {
          const xpGain = 20; // Default XP gain
          userData.progress.xp = (userData.progress.xp || 0) + xpGain;
          userData.progress.level = Math.floor(userData.progress.xp / 100) + 1;
          
          // Mark as completed in the appropriate category
          userData.progress.completedExercises.set(lessonId, true);
        }

        await userData.save();

        return {
          id: `progress_${lessonId}`,
          lessonId,
          status,
          score,
          timeSpent,
          completedAt: status === 'COMPLETED' ? new Date() : null,
        };
      } catch (error: any) {
        console.error('Progress update error:', error);
        throw new Error('Failed to update progress');
      }
    }
  },

  User: {
    async progress(parent: any) {
      try {
        const userData = await User.findById(parent.id);
        if (!userData || !userData.progress) {
          return [];
        }

        const progress = userData.progress;
        const progressArray = [];

        // Convert completed exercises
        if (progress.completedExercises) {
          for (const [exerciseId, completed] of progress.completedExercises) {
            if (completed) {
              progressArray.push({
                id: `exercise_${exerciseId}`,
                lessonId: exerciseId.split('_')[0],
                status: 'COMPLETED',
                score: null,
                timeSpent: 0,
                completedAt: null,
              });
            }
          }
        }

        return progressArray;
      } catch (error) {
        console.error('User progress fetch error:', error);
        return [];
      }
    },

    async achievements(parent: any) {
      try {
        const userData = await User.findById(parent.id);
        if (!userData || !userData.progress || !userData.progress.unlockedAchievements) {
          return [];
        }

        const achievements = [];
        for (const [achievementId, unlocked] of userData.progress.unlockedAchievements) {
          if (unlocked) {
            achievements.push({
              id: achievementId,
              badgeType: 'achievement',
              title: `Achievement ${achievementId}`,
              description: 'Achievement unlocked!',
              iconUrl: null,
              earnedAt: new Date(),
            });
          }
        }

        return achievements;
      } catch (error) {
        console.error('User achievements fetch error:', error);
        return [];
      }
    }
  }
};