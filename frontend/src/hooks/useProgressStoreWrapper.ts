import { useProgressStore, ProgressState } from '../stores/progressStore';

// Wrapper hook that provides fallbacks if the store is not available
export const useProgressStoreWrapper = (): ProgressState => {
  try {
    return useProgressStore();
  } catch (error) {
    console.warn('Progress store not available, using fallback:', error);
    
    // Return fallback object with same interface
    return {
      progress: {},
      achievements: [],
      stats: null,
      isLoading: false,
      isUpdating: false,
      
      // Fallback functions
      fetchUserProgress: async () => {
        console.log('Progress not saved - guest mode active');
      },
      fetchStats: async () => {
        console.log('Progress not saved - guest mode active');
      },
      fetchAchievements: async () => {
        console.log('Progress not saved - guest mode active');
      },
      getLessonProgress: () => null,
      updateLessonProgress: async () => {
        console.log('Progress not saved - guest mode active');
        return [];
      },
      toggleBookmark: async () => {
        console.log('Progress not saved - guest mode active');
      },
      saveNotes: async () => {
        console.log('Progress not saved - guest mode active');
      },
      trackEvent: async () => {
        console.log('Progress not saved - guest mode active');
      },
      resetProgress: async () => {
        console.log('Progress not saved - guest mode active');
      },
      exportProgress: async () => {
        console.log('Progress not saved - guest mode active');
        return {};
      },
      checkForNewAchievements: async () => {
        console.log('Progress not saved - guest mode active');
        return [];
      }
    };
  }
};