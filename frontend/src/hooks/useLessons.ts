import { useQuery, gql } from '@apollo/client';
import { Lesson } from '../types';

const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      id
      title
      category
    }
  }
`;

interface LessonsData {
  lessons: Array<{
    id: string;
    title: string;
    category: string;
  }>;
}

export const useLessons = () => {
  const { data, loading, error, refetch } = useQuery<LessonsData>(GET_LESSONS, {
    errorPolicy: 'all',
  });

  return {
    lessons: data?.lessons || [],
    loading,
    error,
    refetch,
  };
};

// Hook for getting a single lesson (we'll use REST API for now since GraphQL doesn't have full lesson data yet)
export const useLesson = (lessonId: string) => {
  // For now, we'll use the existing REST API
  // Later we can migrate this to GraphQL when we add full lesson support
  return {
    lesson: null as Lesson | null,
    loading: false,
    error: null,
  };
};