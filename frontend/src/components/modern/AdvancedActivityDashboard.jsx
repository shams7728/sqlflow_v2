import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  FireIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const AdvancedActivityDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchActivityData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        stats: {
          totalLessons: 45,
          completedLessons: 28,
          currentStreak: 12,
          totalXP: 2850,
          weeklyGoal: 5,
          weeklyProgress: 4,
          averageSessionTime: 25, // minutes
          totalStudyTime: 1240 // minutes
        },
        recentActivity: [
          {
            id: 1,
            type: 'lesson_completed',
            title: 'Advanced Joins',
            category: 'Joins',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            xp: 50,
            score: 95
          },
          {
            id: 2,
            type: 'practice_completed',
            title: 'String Functions Practice',
            category: 'Functions',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            xp: 25,
            score: 88
          },
          {
            id: 3,
            type: 'achievement_unlocked',
            title: 'Speed Demon',
            description: 'Complete a lesson in under 5 minutes',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            xp: 100
          },
          {
            id: 4,
            type: 'quiz_completed',
            title: 'Data Types Quiz',
            category: 'Data Definition',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            xp: 30,
            score: 92
          },
          {
            id: 5,
            type: 'lesson_started',
            title: 'Window Functions',
            category: 'Advanced Querying',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          }
        ],
        weeklyChart: [
          { day: 'Mon', lessons: 2, xp: 150, time: 45 },
          { day: 'Tue', lessons: 1, xp: 75, time: 30 },
          { day: 'Wed', lessons: 3, xp: 225, time: 60 },
          { day: 'Thu', lessons: 0, xp: 0, time: 0 },
          { day: 'Fri', lessons: 2, xp: 180, time: 50 },
          { day: 'Sat', lessons: 1, xp: 100, time: 25 },
          { day: 'Sun', lessons: 2, xp: 160, time: 40 }
        ],
        achievements: [
          {
            id: 1,
            title: 'Perfectionist',
            description: 'Get 100% score on a lesson',
            icon: '🎯',
            xp: 20,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            rarity: 'rare'
          },
          {
            id: 2,
            title: 'Speed Demon',
            description: 'Complete a lesson in under 5 minutes',
            icon: '⚡',
            xp: 15,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            rarity: 'common'
          },
          {
            id: 3,
            title: 'Consistent Learner',
            description: 'Complete 5 lessons in a row',
            icon: '🔥',
            xp: 25,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            rarity: 'uncommon'
          }
        ]
      };

      setActivityData(mockData);
      setIsLoading(false);
    };

    fetchActivityData();
  }, [timeRange]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'lesson_started':
        return <PlayIcon className="w-5 h-5 text-blue-500" />;
      case 'practice_completed':
        return <BookOpenIcon className="w-5 h-5 text-purple-500" />;
      case 'quiz_completed':
        return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
      case 'achievement_unlocked':
        return <TrophyIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
      case 'uncommon': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'rare': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'epic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      case 'legendary': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Dashboard</h2>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${timeRange === option.value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total XP</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{activityData.stats.totalXP.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400">+12% this week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Lessons Completed</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activityData.stats.completedLessons}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">of {activityData.stats.totalLessons} total</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Current Streak</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{activityData.stats.currentStreak} days</p>
              <div className="flex items-center mt-1">
                <FireIcon className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-xs text-orange-600 dark:text-orange-400">Keep it up!</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Study Time</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{Math.floor(activityData.stats.totalStudyTime / 60)}h</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Avg: {activityData.stats.averageSessionTime}m/session</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {activityData.recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'lesson_completed' ? 'bg-green-100 dark:bg-green-900/20' :
                    activity.type === 'practice_completed' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      activity.type === 'quiz_completed' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        activity.type === 'achievement_unlocked' ? 'bg-orange-100 dark:bg-orange-900/20' :
                          'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.category || activity.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      {activity.xp && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          +{activity.xp} XP
                        </span>
                      )}
                      {activity.score && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {activity.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* View All Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                View All Activity
              </button>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
            <TrophyIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {activityData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
                    {achievement.icon}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {achievement.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTimeAgo(achievement.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2">
                    {achievement.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      +{achievement.xp} XP
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* View All Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium py-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200">
                View All Achievements
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Analytics Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Analytics</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Lessons</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">XP</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Time (min)</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg viewBox="0 0 800 300" className="w-full h-64">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="800" height="300" fill="url(#grid)" />

            {/* Y-axis labels */}
            <g className="text-xs fill-current text-gray-500 dark:text-gray-400">
              <text x="30" y="50" textAnchor="end">4</text>
              <text x="30" y="100" textAnchor="end">3</text>
              <text x="30" y="150" textAnchor="end">2</text>
              <text x="30" y="200" textAnchor="end">1</text>
              <text x="30" y="250" textAnchor="end">0</text>
            </g>

            {/* X-axis labels */}
            <g className="text-xs fill-current text-gray-500 dark:text-gray-400">
              {activityData.weeklyChart.map((day, index) => (
                <text key={index} x={80 + index * 100} y="280" textAnchor="middle">
                  {day.day}
                </text>
              ))}
            </g>

            {/* Lessons line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={activityData.weeklyChart.map((day, index) => {
                const x = 80 + index * 100;
                const y = 250 - (day.lessons * 50); // Scale lessons (max 4)
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* XP line (scaled down) */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={activityData.weeklyChart.map((day, index) => {
                const x = 80 + index * 100;
                const y = 250 - (day.xp / 60); // Scale XP (divide by 60 to fit)
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Time line (scaled) */}
            <polyline
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={activityData.weeklyChart.map((day, index) => {
                const x = 80 + index * 100;
                const y = 250 - (day.time * 3); // Scale time (multiply by 3)
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Data points */}
            {activityData.weeklyChart.map((day, index) => {
              const x = 80 + index * 100;
              return (
                <g key={index}>
                  {/* Lessons point */}
                  <circle
                    cx={x}
                    cy={250 - (day.lessons * 50)}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all duration-200 cursor-pointer"
                  >
                    <title>{`${day.day}: ${day.lessons} lessons`}</title>
                  </circle>

                  {/* XP point */}
                  <circle
                    cx={x}
                    cy={250 - (day.xp / 60)}
                    r="4"
                    fill="#10B981"
                    className="hover:r-6 transition-all duration-200 cursor-pointer"
                  >
                    <title>{`${day.day}: ${day.xp} XP`}</title>
                  </circle>

                  {/* Time point */}
                  <circle
                    cx={x}
                    cy={250 - (day.time * 3)}
                    r="4"
                    fill="#8B5CF6"
                    className="hover:r-6 transition-all duration-200 cursor-pointer"
                  >
                    <title>{`${day.day}: ${day.time} minutes`}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Summary stats below chart */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activityData.stats.completedLessons}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              39h
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              79%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              30
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedActivityDashboard;