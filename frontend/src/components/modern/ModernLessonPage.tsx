import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  AcademicCapIcon,
  StarIcon,
  CheckCircleIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import AdvancedSQLWorkspace from '../advanced/AdvancedSQLWorkspace';
import { Lesson } from '../../types';
import { useProgressStore } from '../../stores/progressStore';

interface ModernLessonPageProps {
  lessons: Lesson[];
}

const ModernLessonPage: React.FC<ModernLessonPageProps> = ({ lessons }) => {
  const { id } = useParams<{ id: string }>();
  const lesson = lessons.find(l => l.id === id);
  
  // Progress store
  const { 
    getLessonProgress, 
    updateLessonProgress, 
    toggleBookmark 
  } = useProgressStore();
  
  // Local state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Load progress on mount
  useEffect(() => {
    if (lesson?.id) {
      const progress = getLessonProgress(lesson.id);
      if (progress) {
        setIsBookmarked(progress.isBookmarked || false);
        setIsCompleted(progress.status === 'completed' || progress.status === 'mastered');
      }
    }
  }, [lesson?.id, getLessonProgress]);
  
  // Find current lesson index and get next/previous lessons
  const currentIndex = lessons.findIndex(l => l.id === id);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Lesson Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The lesson with ID <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{id}</code> could not be found.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const levels = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };
    return levels[difficulty.toLowerCase() as keyof typeof levels] || 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {lesson.category}
              </span>
            </div>

            {/* Lesson Progress */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {[...Array(4)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < getDifficultyStars(lesson.difficulty)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                {lesson.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AcademicCapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words">
                      {lesson.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                      {lesson.category} • Lesson {lesson.id}
                    </p>
                  </div>
                </div>

                {/* Lesson Stats */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{lesson.estimatedTime || '15-20 min'}</span>
                  </div>
                  
                  {lesson.practice && (
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{lesson.practice.length} exercises</span>
                    </div>
                  )}

                  {lesson.quiz && (
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{lesson.quiz.length} quiz questions</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button 
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm ${
                    isBookmarked
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={async () => {
                    if (!lesson?.id || isUpdating) return;
                    setIsUpdating(true);
                    try {
                      await toggleBookmark(lesson.id);
                      setIsBookmarked(!isBookmarked);
                    } catch (error) {
                      console.error('Failed to toggle bookmark:', error);
                    } finally {
                      setIsUpdating(false);
                    }
                  }}
                  disabled={isUpdating}
                >
                  {isBookmarked ? (
                    <BookmarkSolidIcon className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="hidden sm:inline">
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>
                <button 
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm whitespace-nowrap ${
                    isCompleted
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                  onClick={async () => {
                    if (!lesson?.id || isUpdating) return;
                    setIsUpdating(true);
                    try {
                      await updateLessonProgress(lesson.id, {
                        status: isCompleted ? 'in_progress' : 'completed',
                        score: isCompleted ? 0 : 100,
                        maxScore: 100,
                      });
                      setIsCompleted(!isCompleted);
                    } catch (error) {
                      console.error('Failed to update completion status:', error);
                    } finally {
                      setIsUpdating(false);
                    }
                  }}
                  disabled={isUpdating}
                >
                  <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced SQL Workspace */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AdvancedSQLWorkspace lesson={lesson} />
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex items-center justify-between"
        >
          <div>
            {/* Previous Lesson */}
            {previousLesson ? (
              <Link
                to={`/lesson/${previousLesson.id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Previous</div>
                  <div className="text-sm font-medium">{previousLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
          
          <div>
            {nextLesson ? (
              <Link
                to={`/lesson/${nextLesson.id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <div className="text-right">
                  <div className="text-xs text-primary-100">Next</div>
                  <div className="text-sm font-medium">{nextLesson.title}</div>
                </div>
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <CheckCircleIcon className="w-4 h-4" />
                <span>Complete Course</span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLessonPage;