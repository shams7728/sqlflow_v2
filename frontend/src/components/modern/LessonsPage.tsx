import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  estimatedTime: string;
  topics: string[];
}

const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, isLoading } = useProgressStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showContent, setShowContent] = useState(false);

  // Mock lessons data - in real app this would come from props or API
  const lessons: Lesson[] = [
    {
      id: 'sql-basics-1',
      title: 'Introduction to SQL',
      description: 'Learn the fundamentals of SQL and database concepts',
      difficulty: 'Beginner',
      category: 'Getting Started',
      estimatedTime: '15 min',
      topics: ['SQL Basics', 'Database Concepts', 'SELECT Statement']
    },
    {
      id: 'sql-basics-2',
      title: 'SELECT Statement Basics',
      description: 'Master the SELECT statement and basic querying',
      difficulty: 'Beginner',
      category: 'Getting Started',
      estimatedTime: '20 min',
      topics: ['SELECT', 'WHERE', 'ORDER BY']
    },
    {
      id: 'sql-joins-1',
      title: 'Understanding JOINs',
      description: 'Learn different types of JOINs and when to use them',
      difficulty: 'Intermediate',
      category: 'Joins & Relationships',
      estimatedTime: '25 min',
      topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN']
    },
    {
      id: 'sql-functions-1',
      title: 'Aggregate Functions',
      description: 'Master COUNT, SUM, AVG, MIN, MAX functions',
      difficulty: 'Intermediate',
      category: 'Functions',
      estimatedTime: '18 min',
      topics: ['COUNT', 'SUM', 'AVG', 'GROUP BY']
    },
    {
      id: 'sql-advanced-1',
      title: 'Subqueries and CTEs',
      description: 'Advanced querying with subqueries and Common Table Expressions',
      difficulty: 'Advanced',
      category: 'Advanced Queries',
      estimatedTime: '30 min',
      topics: ['Subqueries', 'CTEs', 'Window Functions']
    },
    {
      id: 'sql-performance-1',
      title: 'Query Optimization',
      description: 'Learn to write efficient queries and optimize performance',
      difficulty: 'Advanced',
      category: 'Performance',
      estimatedTime: '35 min',
      topics: ['Indexes', 'Query Plans', 'Optimization']
    }
  ];

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(lessons.map(lesson => lesson.category)))];
  }, [lessons]);

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const categoryMatch = selectedCategory === 'all' || lesson.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [lessons, selectedCategory, selectedDifficulty]);

  const getLessonStatus = (lessonId: string) => {
    const lessonProgress = progress[lessonId];
    if (!lessonProgress) return 'not_started';
    return lessonProgress.status;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'mastered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <PlayIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  // Calculate stats
  const completedCount = lessons.filter(lesson => 
    getLessonStatus(lesson.id) === 'completed' || getLessonStatus(lesson.id) === 'mastered'
  ).length;
  
  const inProgressCount = lessons.filter(lesson => 
    getLessonStatus(lesson.id) === 'in_progress'
  ).length;

  // Show content after 2 seconds regardless of loading state
  React.useEffect(() => {
    setTimeout(() => setShowContent(true), 2000);
  }, []);

  if (isLoading && !showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                SQL Lessons
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Master SQL with our comprehensive lesson library
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lessons.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Lessons
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <PlayIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {inProgressCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    In Progress
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round((completedCount / lessons.length) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            const isCompleted = status === 'completed' || status === 'mastered';
            
            return (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson.id)}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  isCompleted 
                    ? 'border-green-200 dark:border-green-800 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm">{lesson.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <h3 className={`font-bold text-lg mb-2 ${
                  isCompleted ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {lesson.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  isCompleted ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {lesson.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {lesson.category}
                  </span>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {lesson.topics.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      {topic}
                    </span>
                  ))}
                  {lesson.topics.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{lesson.topics.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : status === 'in_progress'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/30'
                    }`}
                  >
                    {isCompleted ? 'Completed' : status === 'in_progress' ? 'Continue' : 'Start Lesson'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No lessons found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters to see more lessons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsPage;