import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FireIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  PlayIcon,
  BookOpenIcon,
  BeakerIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { Lesson } from '../../types';
import ProgressWidget from '../progress/ProgressWidget';
import ProgressTracker from './ProgressTracker';
import StreakTracker from './StreakTracker';
import { useProgressStore } from '../../stores/progressStore';

interface ProfessionalDashboardProps {
  lessons: Lesson[];
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ lessons }) => {
  const navigate = useNavigate();
  const { 
    stats: progressStats, 
    achievements, 
    isLoading,
    fetchUserProgress,
    fetchStats,
    fetchAchievements 
  } = useProgressStore();

  // Fetch progress data on mount
  React.useEffect(() => {
    const loadProgressData = async () => {
      await Promise.all([
        fetchUserProgress(),
        fetchStats(),
        fetchAchievements()
      ]);
    };
    
    loadProgressData();
  }, [fetchUserProgress, fetchStats, fetchAchievements]);

  // Handle lesson navigation
  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  // Calculate real stats from progress store
  const totalLessons = lessons?.length || 60; // Use actual lessons count or fallback
  const completedLessons = progressStats?.completedLessons || 0;
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const averageScore = progressStats?.averageScore || 0;
  const currentStreak = progressStats?.currentStreak || 0;
  const totalTimeSpent = progressStats?.totalTimeSpent || 0;

  const stats = [
    {
      title: 'Lessons Completed',
      value: completedLessons.toString(),
      total: totalLessons.toString(),
      percentage: completionPercentage,
      icon: BookOpenIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: completedLessons > 0 ? `${completedLessons} completed` : 'Get started!',
      changeType: 'positive'
    },
    {
      title: 'Average Score',
      value: Math.round(averageScore).toString(),
      total: '100',
      percentage: averageScore,
      icon: BeakerIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: averageScore > 0 ? `${Math.round(averageScore)}% avg` : 'No scores yet',
      changeType: averageScore >= 80 ? 'positive' : averageScore >= 60 ? 'neutral' : 'negative'
    },
    {
      title: 'Current Streak',
      value: currentStreak.toString(),
      total: 'days',
      percentage: Math.min(currentStreak * 10, 100), // Visual representation
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: currentStreak > 0 ? `${currentStreak} day${currentStreak !== 1 ? 's' : ''}` : 'Start learning!',
      changeType: currentStreak > 0 ? 'positive' : 'neutral'
    },
    {
      title: 'Time Spent',
      value: (totalTimeSpent / 3600).toFixed(1), // Convert seconds to hours
      total: 'hours',
      percentage: Math.min((totalTimeSpent / 3600) * 5, 100), // Visual representation
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: totalTimeSpent > 0 ? `${Math.round(totalTimeSpent / 60)} min total` : 'No time logged',
      changeType: totalTimeSpent > 0 ? 'positive' : 'neutral'
    }
  ];

  const recentLessons = lessons.slice(0, 4);
  // Convert real achievements to display format and add mock ones if needed
  const displayAchievements = [
    ...achievements.map(ach => ({
      title: ach.title,
      description: ach.description,
      earned: true,
      icon: '🏆'
    })),
    // Add mock achievements if we have fewer than 4 real ones
    ...(achievements.length < 4 ? [
      { title: 'SQL Novice', description: 'Complete your first lesson', earned: completedLessons > 0, icon: '🎯' },
      { title: 'Query Master', description: 'Write 50 SQL queries', earned: false, icon: '⚡' },
      { title: 'Week Warrior', description: 'Maintain a 7-day streak', earned: currentStreak >= 7, icon: '🔥' },
      { title: 'Join Expert', description: 'Master all JOIN operations', earned: false, icon: '🔗' },
    ].slice(0, 4 - achievements.length) : [])
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto mobile-container">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-primary-100 text-lg">Ready to continue your SQL journey?</p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">
                    Level {progressStats?.level?.level || 1} {progressStats?.level?.title || 'Beginner'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FireIcon className="w-5 h-5 text-orange-300" />
                  <span className="text-sm font-medium">
                    {currentStreak} Day{currentStreak !== 1 ? 's' : ''} Streak
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <RocketLaunchIcon className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
      </div>

      {/* Progress Overview */}
      <ProgressTracker variant="dashboard" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
            </div>
            
            <div className="space-y-4">
              {recentLessons.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  onClick={() => handleLessonClick(lesson.id)}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group transform hover:scale-[1.02]"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLessonClick(lesson.id);
                    }
                  }}
                  aria-label={`Start lesson: ${lesson.title}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:shadow-lg transition-shadow">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.category}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                        {lesson.difficulty}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.estimatedTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <PlayIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Card removed */}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Progress Widget */}
          <ProgressWidget />
          
          {/* Streak Tracker */}
          <StreakTracker variant="compact" />
          
          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h2>
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
            </div>
            
            <div className="space-y-4">
              {displayAchievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.earned ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${achievement.earned ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${achievement.earned ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Learning Streak</h2>
              <FireIcon className="w-5 h-5 text-orange-500" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">7 Days</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Keep it up! You're on fire 🔥</p>
              
              {/* Streak Calendar */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                    i < 7 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  // Navigate to the first lesson or last accessed lesson
                  const firstLesson = lessons[0];
                  if (firstLesson) {
                    handleLessonClick(firstLesson.id);
                  } else {
                    navigate('/lessons');
                  }
                }}
                className="w-full flex items-center space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <PlayIcon className="w-5 h-5" />
                <span className="font-medium">Continue Last Lesson</span>
              </button>
              
              <button 
                onClick={() => navigate('/practice')}
                className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <BeakerIcon className="w-5 h-5" />
                <span className="font-medium">Practice Exercises</span>
              </button>
              
              {/* AI Assistant button removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;