import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FireIcon,
  CalendarDaysIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakDates: string[];
  weeklyGoal: number;
  dailyGoal: number; // in minutes
}

const StreakTracker: React.FC = () => {
  const { stats, trackEvent } = useProgressStore();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    streakDates: [],
    weeklyGoal: 5, // 5 days per week
    dailyGoal: 30 // 30 minutes per day
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showGoalSetter, setShowGoalSetter] = useState(false);

  useEffect(() => {
    // Load streak data
    const loadStreakData = async () => {
      try {
        // Generate mock streak data for demonstration
        const mockStreakDates = generateMockStreakDates();
        setStreakData(prev => ({
          ...prev,
          currentStreak: stats?.currentStreak || 0,
          longestStreak: Math.max(stats?.currentStreak || 0, 7), // Mock longest streak
          streakDates: mockStreakDates
        }));
      } catch (error) {
        console.error('Error loading streak data:', error);
      }
    };

    loadStreakData();
  }, [stats]);

  const generateMockStreakDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    
    // Generate some recent activity dates
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Simulate some activity pattern (not every day)
      if (Math.random() > 0.3) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const getCalendarDays = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endOfMonth || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isActiveDate = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return streakData.streakDates.includes(dateString);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const getStreakLevel = (streak: number): { level: string; color: string; icon: string } => {
    if (streak >= 30) return { level: 'Legendary', color: 'text-yellow-500', icon: '🔥' };
    if (streak >= 14) return { level: 'Epic', color: 'text-purple-500', icon: '⚡' };
    if (streak >= 7) return { level: 'Great', color: 'text-blue-500', icon: '💪' };
    if (streak >= 3) return { level: 'Good', color: 'text-green-500', icon: '👍' };
    return { level: 'Getting Started', color: 'text-gray-500', icon: '🌱' };
  };

  const streakLevel = getStreakLevel(streakData.currentStreak);
  const weeklyProgress = Math.min(100, (streakData.currentStreak / streakData.weeklyGoal) * 100);

  return (
    <div className="space-y-6">
      {/* Streak Overview */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FireIcon className="w-6 h-6" />
              <span className="text-lg font-semibold">Current Streak</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold">{streakData.currentStreak}</span>
              <span className="text-orange-100">days</span>
            </div>
            <p className="text-orange-100 text-sm mt-1">
              {streakLevel.level} streak {streakLevel.icon}
            </p>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm">Longest Streak</p>
            <p className="text-2xl font-bold">{streakData.longestStreak}</p>
            <p className="text-orange-100 text-sm">days</p>
          </div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Goal</h3>
          <button
            onClick={() => setShowGoalSetter(!showGoalSetter)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Edit Goal
          </button>
        </div>

        {showGoalSetter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Days per week
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={streakData.weeklyGoal}
                  onChange={(e) => setStreakData(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minutes per day
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={streakData.dailyGoal}
                  onChange={(e) => setStreakData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.min(streakData.currentStreak, streakData.weeklyGoal)} of {streakData.weeklyGoal} days this week
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(weeklyProgress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weeklyProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
            ></motion.div>
          </div>

          {weeklyProgress >= 100 && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <TrophyIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Weekly goal achieved! 🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <CalendarDaysIcon className="w-5 h-5" />
            <span>Activity Calendar</span>
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {getCalendarDays().map((date, index) => {
            const isActive = isActiveDate(date);
            const isTodayDate = isToday(date);
            const isCurrentMonthDate = isCurrentMonth(date);
            const dateString = date.toISOString().split('T')[0];

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(selectedDate === dateString ? null : dateString)}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all duration-200 relative
                  ${isCurrentMonthDate ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                  ${isActive ? 'bg-green-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                  ${isTodayDate && !isActive ? 'ring-2 ring-primary-500' : ''}
                  ${selectedDate === dateString ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {date.getDate()}
                
                {/* Activity Indicator */}
                {isActive && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                )}
                
                {/* Today Indicator */}
                {isTodayDate && !isActive && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Active day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-primary-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Inactive day</span>
          </div>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              This Month
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {streakData.streakDates.filter(date => {
              const d = new Date(date);
              const today = new Date();
              return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
            }).length}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">active days</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Daily Goal
            </span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {streakData.dailyGoal}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">minutes</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Best Streak
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {streakData.longestStreak}
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-300">days</p>
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Keep Going! 💪</h3>
          <p className="text-primary-100">
            {streakData.currentStreak === 0 
              ? "Start your learning streak today! Even 10 minutes counts."
              : streakData.currentStreak < 3
              ? "Great start! Keep the momentum going."
              : streakData.currentStreak < 7
              ? "You're building a solid habit! Don't break the chain."
              : streakData.currentStreak < 14
              ? "Amazing consistency! You're on fire! 🔥"
              : "Incredible dedication! You're a SQL learning machine! 🚀"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;