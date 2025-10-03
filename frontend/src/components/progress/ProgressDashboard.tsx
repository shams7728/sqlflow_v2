import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  BookmarkIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';
import ProgressChart from './ProgressChart';
import AchievementGallery from './AchievementGallery';
import StreakTracker from './StreakTracker';
import BookmarkManager from './BookmarkManager';
import LearningInsights from './LearningInsights';

const ProgressDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    stats,
    achievements,
    isLoading,
    fetchStats,
    fetchAchievements,
    fetchUserProgress
  } = useProgressStore();

  // Get initial tab from URL query parameter or default to 'overview'
  const initialTab = (searchParams.get('tab') as 'overview' | 'achievements' | 'analytics' | 'bookmarks' | 'insights') || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'analytics' | 'bookmarks' | 'insights'>(initialTab);

  // Sync activeTab with URL query parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as 'overview' | 'achievements' | 'analytics' | 'bookmarks' | 'insights';
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    // Fetch all progress data on component mount
    const loadData = async () => {
      await Promise.all([
        fetchStats(),
        fetchAchievements(),
        fetchUserProgress()
      ]);
    };
    
    loadData();
  }, [fetchStats, fetchAchievements, fetchUserProgress]); // Include all dependencies

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const completionRate = stats ? 
    (stats.completedLessons / Math.max(stats.totalLessons, 1)) * 100 : 0;

  const averageTimePerLesson = stats && stats.completedLessons > 0 ? 
    stats.totalTimeSpent / stats.completedLessons / 60 : 0; // in minutes

  const recentAchievements = achievements
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 3);

  const tabs = [
    { id: 'overview' as const, name: 'Overview', icon: ChartBarIcon },
    { id: 'achievements' as const, name: 'Achievements', icon: TrophyIcon },
    { id: 'analytics' as const, name: 'Analytics', icon: ArrowTrendingUpIcon },
    { id: 'bookmarks' as const, name: 'Bookmarks', icon: BookmarkIcon },
    { id: 'insights' as const, name: 'Insights', icon: SparklesIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your SQL learning journey and achievements
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Lessons Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.completedLessons || 0}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {completionRate.toFixed(1)}% complete
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <BookmarkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.currentStreak || 0}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                days in a row
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.averageScore?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                across all lessons
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Time Spent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats?.totalTimeSpent || 0) / 3600)}h
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {averageTimePerLesson.toFixed(1)} min/lesson
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Level Progress */}
      {stats?.level && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Level {stats.level.level} - {stats.level.title}
              </h3>
              <p className="text-primary-100 mb-3">
                {stats.level.currentPoints} / {stats.level.nextLevelThreshold || 'Max'} XP
              </p>
              {stats.level.nextLevelThreshold && (
                <div className="w-64 bg-primary-400 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{
                      width: `${(stats.level.currentPoints / stats.level.nextLevelThreshold) * 100}%`
                    }}
                  ></div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <TrophyIcon className="w-8 h-8" />
              </div>
              {stats.level.nextLevelThreshold && (
                <p className="text-sm text-primary-100">
                  {stats.level.pointsToNext} XP to next level
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ tab: tab.id });
                }}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <ProgressChart />
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Achievements
              </h3>
              {recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <TrophyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          +{achievement.points} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No achievements yet. Complete lessons to earn your first badge!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <AchievementGallery />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProgressChart detailed />
            </div>
            <div>
              <StreakTracker />
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <BookmarkManager />
        )}

        {activeTab === 'insights' && (
          <LearningInsights />
        )}
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;