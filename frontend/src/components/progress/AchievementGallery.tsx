import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  LockClosedIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  FireIcon,
  BookmarkIcon,
  AcademicCapIcon,
  BoltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface AvailableAchievement {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  iconUrl: string;
  isEarned: boolean;
  progress: number;
  earnedAt?: string;
}

const AchievementGallery: React.FC = () => {
  const { achievements, fetchAchievements } = useProgressStore();
  const [availableAchievements, setAvailableAchievements] = useState<AvailableAchievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<AvailableAchievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<AvailableAchievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'unearned'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const loadAchievements = async () => {
      setIsLoading(true);
      try {
        await fetchAchievements();
        
        // Fetch available achievements from API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/achievements/available/guest`, {
          headers: { 'x-user-id': 'guest' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAvailableAchievements(data.data);
            setFilteredAchievements(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
        // Fallback to mock data for demonstration
        setAvailableAchievements(getMockAchievements());
        setFilteredAchievements(getMockAchievements());
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, []); // Empty dependency array - only run on mount

  // Apply filters
  useEffect(() => {
    let filtered = availableAchievements;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(achievement => achievement.rarity === rarityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(achievement => 
        statusFilter === 'earned' ? achievement.isEarned : !achievement.isEarned
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(achievement => achievement.type === typeFilter);
    }

    setFilteredAchievements(filtered);
  }, [availableAchievements, searchTerm, rarityFilter, statusFilter, typeFilter]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-500';
      case 'rare':
        return 'from-blue-400 to-blue-500';
      case 'epic':
        return 'from-purple-400 to-purple-500';
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 dark:border-gray-600';
      case 'rare':
        return 'border-blue-300 dark:border-blue-600';
      case 'epic':
        return 'border-purple-300 dark:border-purple-600';
      case 'legendary':
        return 'border-yellow-300 dark:border-yellow-600';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'lesson_completion':
        return AcademicCapIcon;
      case 'performance':
        return StarIcon;
      case 'engagement':
        return BookmarkIcon;
      case 'streak':
        return FireIcon;
      case 'skill_mastery':
        return BoltIcon;
      default:
        return TrophyIcon;
    }
  };

  const earnedCount = availableAchievements.filter(a => a.isEarned).length;
  const totalPoints = availableAchievements
    .filter(a => a.isEarned)
    .reduce((sum, a) => sum + a.points, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Achievements Earned</p>
              <p className="text-3xl font-bold">{earnedCount}</p>
              <p className="text-yellow-100 text-sm">
                of {availableAchievements.length} available
              </p>
            </div>
            <TrophyIcon className="w-12 h-12 text-yellow-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Points</p>
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-purple-100 text-sm">XP earned</p>
            </div>
            <SparklesIcon className="w-12 h-12 text-purple-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold">
                {Math.round((earnedCount / availableAchievements.length) * 100)}%
              </p>
              <p className="text-green-100 text-sm">of all achievements</p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-100" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="earned">Earned</option>
              <option value="unearned">Not Earned</option>
            </select>

            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="lesson_completion">Lesson Completion</option>
              <option value="performance">Performance</option>
              <option value="engagement">Engagement</option>
              <option value="streak">Streak</option>
              <option value="skill_mastery">Skill Mastery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => {
            const Icon = getAchievementIcon(achievement.type);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedAchievement(achievement)}
                className={`relative bg-white dark:bg-gray-900 rounded-xl border-2 ${getRarityBorder(achievement.rarity)} p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  achievement.isEarned ? '' : 'opacity-75'
                }`}
              >
                {/* Rarity Indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-t-xl`}></div>

                {/* Lock Overlay for Unearned */}
                {!achievement.isEarned && (
                  <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-100/10 rounded-xl flex items-center justify-center">
                    <LockClosedIcon className="w-8 h-8 text-gray-500" />
                  </div>
                )}

                {/* Achievement Content */}
                <div className="text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-full flex items-center justify-center ${
                    achievement.isEarned ? 'shadow-lg' : 'grayscale'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className={`font-bold text-lg mb-2 ${
                    achievement.isEarned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm mb-4 ${
                    achievement.isEarned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Points */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <SparklesIcon className="w-4 h-4 text-yellow-500" />
                    <span className={`font-medium ${
                      achievement.isEarned ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                    }`}>
                      {achievement.points} XP
                    </span>
                  </div>

                  {/* Progress Bar (for unearned achievements) */}
                  {!achievement.isEarned && achievement.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(achievement.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Rarity Badge */}
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    achievement.rarity === 'common' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
                    achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                    achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                  }`}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </span>

                  {/* Earned Date */}
                  {achievement.isEarned && achievement.earnedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No achievements found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full"
            >
              <div className="text-center">
                {/* Large Icon */}
                <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${getRarityColor(selectedAchievement.rarity)} rounded-full flex items-center justify-center shadow-xl ${
                  selectedAchievement.isEarned ? '' : 'grayscale'
                }`}>
                  {React.createElement(getAchievementIcon(selectedAchievement.type), {
                    className: "w-12 h-12 text-white"
                  })}
                </div>

                {/* Title and Description */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedAchievement.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedAchievement.description}
                </p>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Points:</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {selectedAchievement.points} XP
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Rarity:</span>
                    <span className={`font-medium ${
                      selectedAchievement.rarity === 'legendary' ? 'text-yellow-600' :
                      selectedAchievement.rarity === 'epic' ? 'text-purple-600' :
                      selectedAchievement.rarity === 'rare' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {selectedAchievement.rarity.charAt(0).toUpperCase() + selectedAchievement.rarity.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`font-medium ${
                      selectedAchievement.isEarned ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {selectedAchievement.isEarned ? 'Earned' : 'Not Earned'}
                    </span>
                  </div>

                  {selectedAchievement.earnedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Earned:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedAchievement.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="mt-6 w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mock data for demonstration
const getMockAchievements = (): AvailableAchievement[] => [
  {
    id: 'first_lesson',
    type: 'lesson_completion',
    title: 'Getting Started',
    description: 'Complete your first SQL lesson',
    points: 10,
    rarity: 'common',
    iconUrl: '',
    isEarned: true,
    progress: 100,
    earnedAt: new Date().toISOString()
  },
  {
    id: 'lesson_streak_5',
    type: 'engagement',
    title: 'Consistent Learner',
    description: 'Complete 5 lessons in a row',
    points: 25,
    rarity: 'rare',
    iconUrl: '',
    isEarned: false,
    progress: 60
  },
  {
    id: 'perfect_score',
    type: 'performance',
    title: 'Perfectionist',
    description: 'Get 100% score on a lesson',
    points: 20,
    rarity: 'rare',
    iconUrl: '',
    isEarned: true,
    progress: 100,
    earnedAt: new Date().toISOString()
  },
  {
    id: 'sql_master',
    type: 'skill_mastery',
    title: 'SQL Master',
    description: 'Complete all lessons with mastery level',
    points: 200,
    rarity: 'legendary',
    iconUrl: '',
    isEarned: false,
    progress: 15
  }
];

export default AchievementGallery;