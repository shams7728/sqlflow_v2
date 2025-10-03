import React from 'react';
import { 
  FireIcon, 
  TrophyIcon, 
  BookOpenIcon, 
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface ProgressTrackerProps {
  variant?: 'compact' | 'detailed' | 'dashboard';
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  variant = 'detailed', 
  className = '' 
}) => {
  const { stats, achievements } = useProgressStore();

  if (!stats) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
      </div>
    );
  }

  const progressPercentage = Math.round((stats.completedLessons / stats.totalLessons) * 100);
  const level = stats.level?.level || 1;
  const xpProgress = stats.level ? (stats.level.currentXP / stats.level.xpToNext) * 100 : 0;

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
          <div className="flex items-center space-x-1">
            <FireIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {stats.currentStreak}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Lessons</span>
            <span className="font-medium">{stats.completedLessons}/{stats.totalLessons}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {/* Lessons Progress */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <BookOpenIcon className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              {progressPercentage}%
            </span>
          </div>
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Lessons</h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {stats.completedLessons} of {stats.totalLessons} completed
          </p>
          <div className="mt-3 w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-4">
            <FireIcon className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {stats.currentStreak}
            </span>
          </div>
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">Day Streak</h3>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Keep it up! Best: {stats.longestStreak} days
          </p>
        </div>

        {/* Practice Problems */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <BeakerIcon className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {stats.practiceProblems || 0}
            </span>
          </div>
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Practice</h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Problems solved
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-4">
            <TrophyIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {achievements.length}
            </span>
          </div>
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Achievements</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Badges earned
          </p>
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Progress</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {stats.currentStreak} day streak
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              Level {level}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{stats.completedLessons} lessons completed</span>
          <span>{stats.totalLessons - stats.completedLessons} remaining</span>
        </div>
      </div>

      {/* XP Progress */}
      {stats.level && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Level {level} Progress
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {stats.level.currentXP} / {stats.level.xpToNext} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.practiceProblems || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Practice Problems</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {achievements.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Achievements</div>
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Achievement
          </h4>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <TrophyIcon className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                {achievements[achievements.length - 1]?.title}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {achievements[achievements.length - 1]?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;