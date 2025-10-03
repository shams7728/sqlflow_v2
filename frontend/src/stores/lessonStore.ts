import { create } from 'zustand';
import { LessonState, Lesson } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,

  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_URL}/lessons`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.statusText}`);
      }
      
      const lessons: Lesson[] = await response.json();
      set({ lessons, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lessons';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching lessons:', error);
    }
  },

  setCurrentLesson: (lesson: Lesson | null) => {
    set({ currentLesson: lesson });
  },
}));