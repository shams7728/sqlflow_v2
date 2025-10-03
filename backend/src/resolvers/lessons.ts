import { Context } from '../context';

// Import existing lesson service
const lessonService = require('../../services/lessonService');
const validationService = require('../../services/validationService');
const { getLessonDB } = require('../../utils/db');
const { sanitizeQuery } = require('../../utils/security');

export const lessonResolvers = {
  Query: {
    async lessons(_: any, __: any, { user }: Context) {
      // Use existing lesson service
      return lessonService.getAllLessons();
    },

    async lesson(_: any, { id }: { id: string }, { user }: Context) {
      // Use existing lesson service
      const lessons = lessonService.getAllLessons();
      return lessons.find((lesson: any) => lesson.id === id) || null;
    },

    async leaderboard(_: any, { limit = 10 }: { limit?: number }, { user }: Context) {
      // TODO: Implement leaderboard logic using existing User model
      const User = require('../../models/User');
      
      try {
        const users = await User.find({ isGuest: { $ne: true } })
          .select('name email createdAt')
          .limit(limit)
          .sort({ createdAt: -1 });

        return users.map((user: any) => ({
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: 'STUDENT',
          isGuest: false,
          createdAt: user.createdAt,
        }));
      } catch (error) {
        console.error('Leaderboard error:', error);
        return [];
      }
    }
  },

  Mutation: {
    async executeQuery(_: any, { lessonId, query }: { lessonId: string; query: string }, { user }: Context) {
      try {
        if (!lessonId || !query) {
          throw new Error('Missing parameters');
        }

        const db = getLessonDB(lessonId);
        const sanitized = sanitizeQuery(query);

        return new Promise((resolve, reject) => {
          const startTime = Date.now();
          
          db.all(sanitized, (err: any, rows: any) => {
            db.close();
            const executionTime = (Date.now() - startTime) / 1000;
            
            if (err) {
              resolve({
                success: false,
                error: err.message,
                executionTime
              });
            } else {
              const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
              resolve({
                success: true,
                data: rows,
                columns,
                executionTime
              });
            }
          });
        });
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          executionTime: 0
        };
      }
    },

    async submitFeedback(_: any, { message, type }: { message: string; type: string }, { user }: Context) {
      // Mock feedback submission for now - can be enhanced later
      console.log('GraphQL Feedback received:', { 
        message, 
        type, 
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Implement actual feedback storage or external service integration
      return true;
    }
  }
};