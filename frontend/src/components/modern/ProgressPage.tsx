import React, { useState, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import AdvancedActivityDashboard from './AdvancedActivityDashboard';
import ProgressTracker from './ProgressTracker';
import StreakTracker from './StreakTracker';
import { useProgressStore, Achievement } from '../../stores/progressStore';

const ProgressPage: React.FC = () => {
  const { 
    progress, 
    stats, 
    achievements, 
    fetchUserProgress, 
    fetchStats, 
    fetchAchievements 
  } = useProgressStore();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserProgress();
        await fetchStats();
        await fetchAchievements();
      } catch (error) {
        console.log('Backend not available, using mock data');
      }
    };
    loadData();
    // Always show content after 2 seconds
    setTimeout(() => setShowContent(true), 2000);
  }, []); // Empty dependency array - only run on mount

  // Mock data for charts - in real app this would come from backend
  const generateProgressData = () => {
    const data = [];
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en', { 
          month: 'short', 
          day: 'numeric',
          ...(timeRange === 'year' && { year: '2-digit' })
        }),
        lessons: Math.floor(Math.random() * 3),
        practice: Math.floor(Math.random() * 5),
        time: Math.floor(Math.random() * 120) + 30 // 30-150 minutes
      });
    }
    
    return data;
  };

  const progressData = generateProgressData();
  const maxTime = Math.max(...progressData.map(d => d.time));
  
  // Provide fallback values when stats is not available
  const safeStats = stats || {
    completedLessons: 8,
    totalLessons: 25,
    currentStreak: 5,
    averageScore: 87,
    totalAttempts: 22,
    practiceProblems: 12,
    level: { level: 3, title: 'SQL Developer' }
  };

  if (!stats && !showContent) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Learning Progress
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track your SQL learning journey and achievements
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <ProgressTracker variant="dashboard" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Study Activity
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Study Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Lessons</span>
                </div>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-2">
              {progressData.slice(-14).map((day, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 text-xs text-gray-500 dark:text-gray-400">
                    {day.date}
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    {/* Study Time Bar */}
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.time / maxTime) * 100}%` }}
                      ></div>
                    </div>
                    {/* Lessons Indicator */}
                    <div className="flex space-x-1">
                      {Array.from({ length: day.lessons }, (_, i) => (
                        <div key={i} className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {day.time}m
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Learning Path Progress
            </h3>
            
            <div className="space-y-4">
              {[
                { category: 'SQL Basics', completed: 8, total: 10, color: 'green' },
                { category: 'Joins & Relationships', completed: 5, total: 8, color: 'blue' },
                { category: 'Advanced Queries', completed: 2, total: 12, color: 'purple' },
                { category: 'Database Design', completed: 0, total: 6, color: 'orange' }
              ].map((path, index) => {
                const percentage = (path.completed / path.total) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {path.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {path.completed}/{path.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${path.color}-500 transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Streak Tracker */}
          <StreakTracker />
          
          {/* Recent Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Achievements
              </h3>
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
            </div>
            
            <div className="space-y-3">
              {achievements.slice(0, 5).map((achievement: Achievement, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <TrophyIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {achievements.length === 0 && (
                <div className="text-center py-4">
                  <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete lessons to earn achievements!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Study Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Study Goals
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Goal
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    30 min
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  22 min completed today
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weekly Goal
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    5 lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-2/5"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 lessons completed this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;