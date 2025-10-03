import React from 'react';
import { FireIcon } from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface StreakTrackerProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ 
  variant = 'detailed', 
  className = '' 
}) => {
  const { stats } = useProgressStore();

  if (!stats) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
      </div>
    );
  }

  // Generate last 7 days for streak visualization
  const generateStreakDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Mock streak data - in real app this would come from backend
      const hasActivity = i <= stats.currentStreak - 1;
      
      days.push({
        date: date.getDate(),
        dayName: date.toLocaleDateString('en', { weekday: 'short' }),
        hasActivity,
        isToday: i === 0
      });
    }
    
    return days;
  };

  const streakDays = generateStreakDays();

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FireIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.currentStreak} Day Streak
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Best: {stats.longestStreak} days
              </p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {streakDays.slice(-5).map((day, index) => (
              <div
                key={index}
                className={`w-2 h-6 rounded-full ${
                  day.hasActivity 
                    ? 'bg-orange-500' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <FireIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Learning Streak
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep the momentum going!
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            days
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Last 7 Days
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Best streak: {stats.longestStreak} days
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {streakDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {day.dayName}
              </div>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  day.hasActivity
                    ? day.isToday
                      ? 'bg-orange-500 text-white ring-2 ring-orange-300 dark:ring-orange-700'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                {day.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {stats.longestStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Longest Streak
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.floor(stats.totalStudyTime / 60) || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Hours Studied
          </div>
        </div>
      </div>

      {/* Motivation Message */}
      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
          {stats.currentStreak === 0 
            ? "Start your learning streak today! 🚀"
            : stats.currentStreak < 7
            ? `Great start! Keep going to reach a week streak! 💪`
            : stats.currentStreak < 30
            ? `Amazing! You're building a strong habit! 🔥`
            : `Incredible dedication! You're a learning champion! 🏆`
          }
        </p>
      </div>
    </div>
  );
};

export default StreakTracker;