import React, { useState, useEffect } from 'react';
import {
  BeakerIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: string;
  points: number;
}

const PracticePage: React.FC = () => {
  const { progress, updateLessonProgress, isLoading } = useProgressStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showContent, setShowContent] = useState(false);

  // Mock practice exercises - in real app this would come from backend
  const practiceExercises: PracticeExercise[] = [
    {
      id: 'practice-select-1',
      title: 'Basic SELECT Queries',
      description: 'Practice writing SELECT statements with WHERE clauses',
      difficulty: 'beginner',
      category: 'SELECT',
      estimatedTime: '10 min',
      points: 50
    },
    {
      id: 'practice-join-1',
      title: 'INNER JOIN Practice',
      description: 'Master INNER JOIN operations between multiple tables',
      difficulty: 'intermediate',
      category: 'JOIN',
      estimatedTime: '15 min',
      points: 75
    },
    {
      id: 'practice-aggregate-1',
      title: 'Aggregate Functions',
      description: 'Practice using COUNT, SUM, AVG, MIN, MAX functions',
      difficulty: 'intermediate',
      category: 'Functions',
      estimatedTime: '12 min',
      points: 60
    },
    {
      id: 'practice-subquery-1',
      title: 'Subquery Challenges',
      description: 'Complex subquery problems with correlated queries',
      difficulty: 'advanced',
      category: 'Subqueries',
      estimatedTime: '20 min',
      points: 100
    },
    {
      id: 'practice-window-1',
      title: 'Window Functions',
      description: 'Advanced window functions and analytical queries',
      difficulty: 'advanced',
      category: 'Functions',
      estimatedTime: '25 min',
      points: 120
    },
    {
      id: 'practice-optimization-1',
      title: 'Query Optimization',
      description: 'Optimize slow queries and improve performance',
      difficulty: 'advanced',
      category: 'Performance',
      estimatedTime: '30 min',
      points: 150
    }
  ];

  const categories = ['all', 'SELECT', 'JOIN', 'Functions', 'Subqueries', 'Performance'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredExercises = practiceExercises.filter(exercise => {
    const categoryMatch = selectedCategory === 'all' || exercise.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getExerciseStatus = (exerciseId: string) => {
    const exerciseProgress = progress[exerciseId];
    if (!exerciseProgress) return 'not_started';
    return exerciseProgress.status;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
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

  const handleStartExercise = async (exercise: PracticeExercise) => {
    try {
      await updateLessonProgress(exercise.id, {
        status: 'in_progress',
        timeSpent: 0,
        score: 0
      });
      
      // In a real app, this would navigate to the exercise interface
      console.log(`Starting exercise: ${exercise.title}`);
    } catch (error) {
      console.error('Error starting exercise:', error);
    }
  };

  // Calculate stats
  const completedCount = practiceExercises.filter(ex => 
    getExerciseStatus(ex.id) === 'completed' || getExerciseStatus(ex.id) === 'mastered'
  ).length;
  
  const totalPoints = practiceExercises
    .filter(ex => getExerciseStatus(ex.id) === 'completed' || getExerciseStatus(ex.id) === 'mastered')
    .reduce((sum, ex) => sum + ex.points, 0);

  // Show content after 2 seconds regardless of loading state
  useEffect(() => {
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            SQL Practice
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Sharpen your SQL skills with hands-on exercises
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BeakerIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalPoints}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Points Earned
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((completedCount / practiceExercises.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completion Rate
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {practiceExercises.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Exercises
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredExercises.map((exercise) => {
            const status = getExerciseStatus(exercise.id);
            const isCompleted = status === 'completed' || status === 'mastered';
            
            return (
              <div
                key={exercise.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${
                  isCompleted 
                    ? 'border-green-200 dark:border-green-800 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                      <StarIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{exercise.points}</span>
                    </div>
                  </div>
                </div>

                <h3 className={`font-bold text-lg mb-2 ${
                  isCompleted ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {exercise.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  isCompleted ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {exercise.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{exercise.category}</span>
                    <span>•</span>
                    <span>{exercise.estimatedTime}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleStartExercise(exercise)}
                    disabled={isCompleted}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isCompleted
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : status === 'in_progress'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                        : 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/30'
                    }`}
                  >
                    {isCompleted ? 'Completed' : status === 'in_progress' ? 'Continue' : 'Start Exercise'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No exercises found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters to see more exercises.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;