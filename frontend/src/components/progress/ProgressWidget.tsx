import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrophyIcon,
  FireIcon,
  BookmarkIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface ProgressWidgetProps {
  compact?: boolean;
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({ compact = false }) => {
  const { stats, achievements, fetchStats, fetchAchievements, isLoading } = useProgressStore();

  useEffect(() => {
    if (!stats || achievements.length === 0) {
      fetchStats();
      fetchAchievements();
    }
  }, [stats, achievements]); // Only depend on the data, not the functions

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const recentAchievement = achievements
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())[0];

  const completionRate = stats && stats.totalLessons > 0 ? 
    (stats.completedLessons / stats.totalLessons) * 100 : 0;

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Learning Progress</p>
            <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
          </div>
          <ChartBarIcon className="w-8 h-8 text-primary-200" />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-primary-100">
            {stats?.completedLessons || 0} lessons completed
          </span>
          <Link
            to="/progress"
            className="text-primary-100 hover:text-white transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Progress
        </h3>
        <Link
          to="/progress"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <BookmarkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {stats?.completedLessons || 0}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">Lessons</p>
        </div>

        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <FireIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {stats?.currentStreak || 0}
          </p>
          <p className="text-sm text-orange-700 dark:text-orange-300">Day Streak</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round(completionRate)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
          ></motion.div>
        </div>
      </div>

      {/* Recent Achievement */}
      {recentAchievement && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrophyIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Latest Achievement
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 truncate">
                {recentAchievement.title}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                +{recentAchievement.points} XP
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to="/progress?tab=achievements"
          className="flex items-center justify-center space-x-2 py-2 px-3 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors text-sm"
        >
          <TrophyIcon className="w-4 h-4" />
          <span>Achievements</span>
        </Link>
        
        <Link
          to="/progress?tab=insights"
          className="flex items-center justify-center space-x-2 py-2 px-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>Insights</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProgressWidget;