import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProgress {
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  score: number;
  maxScore: number;
  timeSpent: number; // in seconds
  attempts: number;
  exercisesCompleted: string[];
  quizScore: number;
  firstCompletedAt?: string;
  lastAccessedAt: string;
  notes: string;
  isBookmarked: boolean;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  achievementId: string;
  title: string;
  description: string;
  iconUrl: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

export interface LearningStats {
  totalLessons: number;
  completedLessons: number;
  totalTimeSpent: number;
  averageScore: number;
  totalAttempts: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  practiceProblems: number;
  totalStudyTime: number;
  level: {
    level: number;
    title: string;
    currentPoints: number;
    currentXP: number;
    nextLevelThreshold: number | null;
    pointsToNext: number;
    xpToNext: number;
  };
}

export interface ProgressState {
  // Progress data
  progress: Record<string, UserProgress>;
  achievements: Achievement[];
  stats: LearningStats | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  
  // Actions
  fetchUserProgress: (userId?: string) => Promise<void>;
  updateLessonProgress: (lessonId: string, updates: Partial<UserProgress>) => Promise<Achievement[]>;
  getLessonProgress: (lessonId: string) => UserProgress | null;
  toggleBookmark: (lessonId: string) => Promise<void>;
  saveNotes: (lessonId: string, notes: string) => Promise<void>;
  
  // Achievement actions
  fetchAchievements: (userId?: string) => Promise<void>;
  checkForNewAchievements: (lessonId: string) => Promise<Achievement[]>;
  
  // Stats actions
  fetchStats: (userId?: string) => Promise<void>;
  trackEvent: (eventType: string, data: any) => Promise<void>;
  
  // Utility actions
  resetProgress: (lessonId: string) => Promise<void>;
  exportProgress: () => Promise<any>;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get current user ID
const getUserId = (): string => {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('isGuest') === 'true';
  
  if (token) {
    // Extract user ID from token (you might need to decode JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || 'guest';
    } catch (e) {
      console.error('Failed to parse token:', e);
      return 'guest';
    }
  }
  
  if (isGuest) {
    return 'guest';
  }
  
  return 'guest';
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      progress: {},
      achievements: [],
      stats: null,
      isLoading: false,
      isUpdating: false,

      // Fetch user's complete progress
      fetchUserProgress: async (userId?: string) => {
        const actualUserId = userId || getUserId();
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE}/progress/user/${actualUserId}`, {
            headers: {
              'x-user-id': actualUserId,
            },
          });
          
          if (!response.ok) throw new Error('Failed to fetch progress');
          
          const data = await response.json();
          
          if (data.success) {
            const progressMap: Record<string, UserProgress> = {};
            data.data.forEach((p: UserProgress) => {
              progressMap[p.lessonId] = p;
            });
            
            set({ progress: progressMap });
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
          // Provide default empty progress when backend is not available
          set({ progress: {} });
        } finally {
          set({ isLoading: false });
        }
      },

      // Update lesson progress
      updateLessonProgress: async (lessonId: string, updates: Partial<UserProgress>) => {
        set({ isUpdating: true });
        const userId = getUserId();
        
        try {
          const response = await fetch(`${API_BASE}/progress/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId,
            },
            body: JSON.stringify({
              lessonId,
              ...updates,
            }),
          });
          
          if (!response.ok) throw new Error('Failed to update progress');
          
          const data = await response.json();
          
          if (data.success) {
            // Update local progress
            set((state) => ({
              progress: {
                ...state.progress,
                [lessonId]: data.data,
              },
            }));
            
            // Handle new achievements
            if (data.achievements && data.achievements.length > 0) {
              set((state) => ({
                achievements: [...state.achievements, ...data.achievements],
              }));
              
              // Show achievement notifications
              data.achievements.forEach((achievement: Achievement) => {
                console.log('New achievement unlocked:', achievement.title);
              });
            }
            
            // Recalculate stats
            await get().fetchStats();
            
            return data.achievements || [];
          }
        } catch (error) {
          console.error('Error updating progress (using local fallback):', error);
          
          // Fallback: Save progress locally when backend is unavailable
          const currentProgress = get().progress[lessonId] || {
            userId,
            lessonId,
            status: 'not_started' as const,
            score: 0,
            maxScore: 100,
            timeSpent: 0,
            attempts: 0,
            exercisesCompleted: [],
            quizScore: 0,
            lastAccessedAt: new Date().toISOString(),
            notes: '',
            isBookmarked: false
          };
          
          const updatedProgress: UserProgress = {
            ...currentProgress,
            ...updates,
            lastAccessedAt: new Date().toISOString(),
            attempts: (currentProgress.attempts || 0) + 1
          };
          
          // Update local state
          set((state) => ({
            progress: {
              ...state.progress,
              [lessonId]: updatedProgress,
            },
          }));
          
          // Recalculate stats from local data
          await get().fetchStats();
          
          return [];
        } finally {
          set({ isUpdating: false });
        }
      },

      // Get lesson progress
      getLessonProgress: (lessonId: string) => {
        const { progress } = get();
        return progress[lessonId] || null;
      },

      // Toggle bookmark
      toggleBookmark: async (lessonId: string) => {
        try {
          const userId = getUserId();
          
          const response = await fetch(`${API_BASE}/progress/bookmark/${lessonId}`, {
            method: 'POST',
            headers: {
              'x-user-id': userId,
            },
          });
          
          if (!response.ok) throw new Error('Failed to toggle bookmark');
          
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              progress: {
                ...state.progress,
                [lessonId]: {
                  ...state.progress[lessonId],
                  isBookmarked: data.data.isBookmarked,
                } as UserProgress,
              },
            }));
          }
        } catch (error) {
          console.error('Error toggling bookmark:', error);
        }
      },

      // Save notes
      saveNotes: async (lessonId: string, notes: string) => {
        try {
          await get().updateLessonProgress(lessonId, { notes });
        } catch (error) {
          console.error('Error saving notes:', error);
        }
      },

      // Fetch achievements
      fetchAchievements: async (userId?: string) => {
        const actualUserId = userId || getUserId();
        try {
          const response = await fetch(`${API_BASE}/achievements/user/${actualUserId}`, {
            headers: {
              'x-user-id': actualUserId,
            },
          });
          
          if (!response.ok) throw new Error('Failed to fetch achievements');
          
          const data = await response.json();
          
          if (data.success) {
            set({ 
              achievements: data.data.achievements,
              stats: {
                ...get().stats,
                totalPoints: data.data.totalPoints,
                level: data.data.level,
              } as LearningStats,
            });
          }
        } catch (error) {
          console.error('Error fetching achievements:', error);
          // Provide empty achievements when backend is not available
          set({ achievements: [] });
        }
      },

      // Check for new achievements
      checkForNewAchievements: async (lessonId: string) => {
        // This is handled automatically in updateLessonProgress
        return [];
      },

      // Fetch stats
      fetchStats: async (userId?: string) => {
        const actualUserId = userId || getUserId();
        try {
          const response = await fetch(`${API_BASE}/progress/stats/${actualUserId}`, {
            headers: {
              'x-user-id': actualUserId,
            },
          });
          
          if (!response.ok) throw new Error('Failed to fetch stats');
          
          const data = await response.json();
          
          if (data.success) {
            set({ 
              stats: {
                ...data.data.progress,
                currentStreak: data.data.currentStreak || 0,
                longestStreak: data.data.longestStreak || 0,
                practiceProblems: data.data.practiceProblems || 0,
                totalStudyTime: data.data.totalStudyTime || 0,
                totalPoints: get().achievements.reduce((sum, a) => sum + a.points, 0),
                level: {
                  level: 1,
                  title: 'SQL Novice',
                  currentPoints: 0,
                  currentXP: 0,
                  nextLevelThreshold: 100,
                  pointsToNext: 100,
                  xpToNext: 100,
                },
              },
            });
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
          // Calculate stats from local progress data when backend is not available
          const { progress } = get();
          const progressArray = Object.values(progress);
          const completedCount = progressArray.filter(p => p.status === 'completed' || p.status === 'mastered').length;
          const totalTime = progressArray.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
          const scores = progressArray.filter(p => p.score > 0).map(p => p.score);
          const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          
          set({ 
            stats: {
              totalLessons: 60, // Total available lessons
              completedLessons: completedCount,
              totalTimeSpent: totalTime,
              averageScore: avgScore,
              totalAttempts: progressArray.reduce((sum, p) => sum + (p.attempts || 0), 0),
              currentStreak: 0,
              longestStreak: 0,
              totalPoints: get().achievements.reduce((sum, a) => sum + a.points, 0),
              practiceProblems: 0,
              totalStudyTime: totalTime,
              level: {
                level: Math.floor(completedCount / 10) + 1,
                title: completedCount === 0 ? 'SQL Novice' : 
                       completedCount < 10 ? 'SQL Learner' :
                       completedCount < 30 ? 'SQL Practitioner' :
                       completedCount < 50 ? 'SQL Expert' : 'SQL Master',
                currentPoints: completedCount * 10,
                currentXP: completedCount * 10,
                nextLevelThreshold: ((Math.floor(completedCount / 10) + 1) * 10) * 10,
                pointsToNext: ((Math.floor(completedCount / 10) + 1) * 10) * 10 - (completedCount * 10),
                xpToNext: ((Math.floor(completedCount / 10) + 1) * 10) * 10 - (completedCount * 10),
              },
            },
          });
        }
      },

      // Track event
      trackEvent: async (eventType: string, data: any) => {
        try {
          const userId = getUserId();
          
          await fetch(`${API_BASE}/analytics/track-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId,
            },
            body: JSON.stringify({
              eventType,
              ...data,
            }),
          });
        } catch (error) {
          console.error('Error tracking event:', error);
        }
      },

      // Reset progress
      resetProgress: async (lessonId: string) => {
        try {
          const userId = getUserId();
          
          const response = await fetch(`${API_BASE}/progress/reset/${lessonId}`, {
            method: 'DELETE',
            headers: {
              'x-user-id': userId,
            },
          });
          
          if (!response.ok) throw new Error('Failed to reset progress');
          
          set((state) => {
            const newProgress = { ...state.progress };
            delete newProgress[lessonId];
            return { progress: newProgress };
          });
        } catch (error) {
          console.error('Error resetting progress:', error);
        }
      },

      // Export progress
      exportProgress: async () => {
        try {
          const userId = getUserId();
          
          const response = await fetch(`${API_BASE}/analytics/report/${userId}`, {
            headers: {
              'x-user-id': userId,
            },
          });
          
          if (!response.ok) throw new Error('Failed to export progress');
          
          const data = await response.json();
          return data.data;
        } catch (error) {
          console.error('Error exporting progress:', error);
          return null;
        }
      },
    }),
    {
      name: `progress-storage-${getUserId()}`, // User-specific storage
      partialize: (state) => ({
        progress: state.progress,
        achievements: state.achievements,
        stats: state.stats,
      }),
    }
  )
);