// Mock progress store for fallback
export const mockProgressStore = {
  getLessonProgress: (lessonId) => ({
    status: 'not_started',
    score: 0,
    attempts: 0,
    timeSpent: 0,
    notes: '',
    isBookmarked: false
  }),
  
  updateLessonProgress: async (lessonId, updates) => {
    console.log('Mock: Updating lesson progress', lessonId, updates);
    return [];
  },
  
  toggleBookmark: async (lessonId) => {
    console.log('Mock: Toggling bookmark for', lessonId);
  },
  
  saveNotes: async (lessonId, notes) => {
    console.log('Mock: Saving notes for', lessonId, notes);
  },
  
  trackEvent: async (eventType, data) => {
    console.log('Mock: Tracking event', eventType, data);
  }
};

export const useMockProgressStore = () => mockProgressStore;