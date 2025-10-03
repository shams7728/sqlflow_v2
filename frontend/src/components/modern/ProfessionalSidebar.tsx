import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  BookOpenIcon as BookSolidIcon,
  TrophyIcon as TrophySolidIcon,
  ChartBarIcon as ChartSolidIcon,
  QuestionMarkCircleIcon as QuestionSolidIcon,
  AcademicCapIcon as AcademicSolidIcon
} from '@heroicons/react/24/solid';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lesson } from '../../types';
import { useProgressStore } from '../../stores/progressStore';

interface ProfessionalSidebarProps {
  lessons: Lesson[];
}

const ProfessionalSidebar: React.FC<ProfessionalSidebarProps> = ({ lessons }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Getting Started']);
  const { progress, stats, achievements, fetchUserProgress, fetchStats, fetchAchievements } = useProgressStore();

  useEffect(() => {
    // Fetch user data on component mount
    fetchUserProgress();
    fetchStats();
    fetchAchievements();
  }, [fetchUserProgress, fetchStats, fetchAchievements]); // Include dependencies

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon,
      activeIcon: HomeSolidIcon,
      color: 'text-blue-600'
    },
    {
      id: 'lessons',
      label: 'Lessons',
      path: '/lessons',
      icon: BookOpenIcon,
      activeIcon: BookSolidIcon,
      color: 'text-green-600'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      path: '/progress?tab=achievements',
      icon: TrophyIcon,
      activeIcon: TrophySolidIcon,
      color: 'text-yellow-600'
    },
    {
      id: 'progress',
      label: 'Progress',
      path: '/progress',
      icon: ChartBarIcon,
      activeIcon: ChartSolidIcon,
      color: 'text-indigo-600'
    },
    {
      id: 'glossary',
      label: 'Glossary',
      path: '/glossary',
      icon: QuestionMarkCircleIcon,
      activeIcon: QuestionSolidIcon,
      color: 'text-cyan-600'
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep',
      path: '/sql-interview-preparation',
      icon: AcademicCapIcon,
      activeIcon: AcademicSolidIcon,
      color: 'text-orange-600'
    },
  ];

  // Group lessons by category
  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getDifficultyColor = (difficulty: string | undefined) => {
    if (!difficulty) return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';

    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'expert': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 h-full overflow-hidden flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Learning Path</h2>
          <div className="flex items-center space-x-1">
            <FireIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              {stats?.currentStreak || 0} day streak
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Overall Progress</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {stats && stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-primary-200 dark:bg-primary-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: stats && stats.totalLessons > 0 ? `${(stats.completedLessons / stats.totalLessons) * 100}%` : '0%'
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-primary-600 dark:text-primary-400">
            <span>{stats && stats.totalLessons > 0 ? `${stats.completedLessons || 0} of ${stats.totalLessons}` : '0 of 0'} lessons</span>
            <span>Level {stats?.level?.level || 1}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="space-y-1">
          {/* Main Navigation */}
          {navigationItems.filter(item => ['dashboard', 'achievements', 'progress'].includes(item.id)).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : ''} group-hover:scale-110 transition-transform duration-200`} />
                <span>{item.label}</span>
                {/* Progress badges */}
                {item.id === 'lessons' && stats && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {stats.completedLessons}/{stats.totalLessons}
                    </span>
                  </div>
                )}
                {item.id === 'achievements' && achievements.length > 0 && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {achievements.length}
                    </span>
                  </div>
                )}
                {item.id === 'glossary' && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                      200+
                    </span>
                  </div>
                )}
                {item.id === 'interview-prep' && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                      50+
                    </span>
                  </div>
                )}
                {item.id === 'practice' && stats && stats.practiceProblems > 0 && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      {stats.practiceProblems}
                    </span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Resources Section */}
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resources
              </span>
            </div>
            {navigationItems.filter(item => ['glossary', 'interview-prep'].includes(item.id)).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : ''} group-hover:scale-110 transition-transform duration-200`} />
                  <span>{item.label}</span>
                  {item.id === 'glossary' && (
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                        200+
                      </span>
                    </div>
                  )}
                  {item.id === 'interview-prep' && (
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        50+
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Lessons by Category */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {Object.entries(lessonsByCategory).map(([category, categoryLessons]) => {
            const isExpanded = expandedSections.includes(category);
            const completedCount = categoryLessons.filter(lesson => {
              const lessonProgress = progress[lesson.id];
              return lessonProgress?.status === 'completed' || lessonProgress?.status === 'mastered';
            }).length;

            return (
              <div key={category} className="space-y-2">
                <button
                  onClick={() => toggleSection(category)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${completedCount === categoryLessons.length ? 'bg-green-500' : 'bg-primary-500'}`}></div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {completedCount}/{categoryLessons.length}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="space-y-1 ml-4 animate-slide-down">
                    {categoryLessons.slice(0, 8).map((lesson, index) => {
                      const lessonProgress = progress[lesson.id];
                      const isCompleted = lessonProgress?.status === 'completed' || lessonProgress?.status === 'mastered';
                      const isInProgress = lessonProgress?.status === 'in_progress';
                      const isCurrent = isInProgress || (!isCompleted && index === 0); // First incomplete lesson is current

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 group text-left"
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            ) : isInProgress ? (
                              <PlayIcon className="w-4 h-4 text-primary-500" />
                            ) : isCurrent ? (
                              <PlayIcon className="w-4 h-4 text-blue-500" />
                            ) : (
                              <ClockIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isCompleted ? 'text-gray-600 dark:text-gray-400' :
                              isInProgress ? 'text-primary-600 dark:text-primary-400' :
                                isCurrent ? 'text-blue-600 dark:text-blue-400' :
                                  'text-gray-500 dark:text-gray-500'
                              }`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                                {lesson.difficulty}
                              </span>
                              <span className="text-xs text-gray-400">{lesson.estimatedTime}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {categoryLessons.length > 8 && (
                      <button className="w-full text-left p-2.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                        View all {categoryLessons.length} lessons →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};

export default ProfessionalSidebar;