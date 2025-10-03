import React, { useEffect, useState } from 'react';
import {
    TrophyIcon,
    StarIcon,
    FireIcon,
    BookOpenIcon,
    BeakerIcon,
    ClockIcon,

    RocketLaunchIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    LockClosedIcon,
    SparklesIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface LocalAchievement {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    category: 'learning' | 'streak' | 'practice' | 'mastery' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    requirement: string;
    progress?: number;
    maxProgress?: number;
    earned: boolean;
    earnedDate?: string;
    xpReward: number;
}

const AchievementsPage: React.FC = () => {
    const { achievements, stats, fetchAchievements, fetchStats, isLoading } = useProgressStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Try to fetch data, but don't block the UI if it fails
        const loadData = async () => {
            try {
                await fetchAchievements();
                await fetchStats();
            } catch (error) {
                console.log('Backend not available, using mock data');
            }
            // Always show content after 2 seconds, regardless of backend status
            setTimeout(() => setShowContent(true), 2000);
        };
        loadData();
    }, [fetchAchievements, fetchStats]); // Empty dependency array - only run on mount

    // Provide fallback values when stats is not available
    const safeStats = stats || {
        completedLessons: 5,
        totalLessons: 20,
        currentStreak: 3,
        averageScore: 85,
        totalAttempts: 15,
        practiceProblems: 8,
        level: { level: 2, title: 'SQL Learner' }
    };

    // Define achievement templates with progress tracking
    const achievementTemplates: LocalAchievement[] = [
        // Learning Achievements
        {
            id: 'first_lesson',
            title: 'First Steps',
            description: 'Complete your first SQL lesson',
            icon: BookOpenIcon,
            category: 'learning',
            rarity: 'common',
            requirement: 'Complete 1 lesson',
            progress: safeStats.completedLessons || 0,
            maxProgress: 1,
            earned: (safeStats.completedLessons || 0) >= 1,
            xpReward: 50
        },
        {
            id: 'lesson_master',
            title: 'Lesson Master',
            description: 'Complete 10 lessons',
            icon: AcademicCapIcon,
            category: 'learning',
            rarity: 'rare',
            requirement: 'Complete 10 lessons',
            progress: safeStats.completedLessons || 0,
            maxProgress: 10,
            earned: (safeStats.completedLessons || 0) >= 10,
            xpReward: 200
        },
        {
            id: 'sql_expert',
            title: 'SQL Expert',
            description: 'Complete 25 lessons',
            icon: StarIcon,
            category: 'learning',
            rarity: 'epic',
            requirement: 'Complete 25 lessons',
            progress: safeStats.completedLessons || 0,
            maxProgress: 25,
            earned: (safeStats.completedLessons || 0) >= 25,
            xpReward: 500
        },

        // Streak Achievements
        {
            id: 'streak_starter',
            title: 'Getting Warmed Up',
            description: 'Maintain a 3-day learning streak',
            icon: FireIcon,
            category: 'streak',
            rarity: 'common',
            requirement: '3-day streak',
            progress: safeStats.currentStreak || 0,
            maxProgress: 3,
            earned: (safeStats.currentStreak || 0) >= 3,
            xpReward: 75
        },
        {
            id: 'streak_warrior',
            title: 'Streak Warrior',
            description: 'Maintain a 7-day learning streak',
            icon: FireIcon,
            category: 'streak',
            rarity: 'rare',
            requirement: '7-day streak',
            progress: safeStats.currentStreak || 0,
            maxProgress: 7,
            earned: (safeStats.currentStreak || 0) >= 7,
            xpReward: 150
        },
        {
            id: 'streak_legend',
            title: 'Streak Legend',
            description: 'Maintain a 30-day learning streak',
            icon: RocketLaunchIcon,
            category: 'streak',
            rarity: 'legendary',
            requirement: '30-day streak',
            progress: safeStats.currentStreak || 0,
            maxProgress: 30,
            earned: (safeStats.currentStreak || 0) >= 30,
            xpReward: 1000
        },

        // Practice Achievements
        {
            id: 'practice_beginner',
            title: 'Practice Makes Perfect',
            description: 'Complete 5 practice exercises',
            icon: BeakerIcon,
            category: 'practice',
            rarity: 'common',
            requirement: 'Complete 5 exercises',
            progress: safeStats.totalAttempts || 0,
            maxProgress: 5,
            earned: (safeStats.totalAttempts || 0) >= 5,
            xpReward: 100
        },

        // Mastery Achievements
        {
            id: 'high_scorer',
            title: 'High Scorer',
            description: 'Achieve 90% average score',
            icon: TrophyIcon,
            category: 'mastery',
            rarity: 'epic',
            requirement: '90% average score',
            progress: Math.round(safeStats.averageScore || 0),
            maxProgress: 90,
            earned: (safeStats.averageScore || 0) >= 90,
            xpReward: 300
        },

        // Special Achievements
        {
            id: 'early_bird',
            title: 'Early Bird',
            description: 'Complete a lesson before 9 AM',
            icon: ClockIcon,
            category: 'special',
            rarity: 'rare',
            requirement: 'Learn before 9 AM',
            earned: false, // This would need special tracking
            xpReward: 125
        },
        {
            id: 'night_owl',
            title: 'Night Owl',
            description: 'Complete a lesson after 10 PM',
            icon: SparklesIcon,
            category: 'special',
            rarity: 'rare',
            requirement: 'Learn after 10 PM',
            earned: false, // This would need special tracking
            xpReward: 125
        }
    ];

    // Merge with actual achievements from store
    const mergedAchievements = achievementTemplates.map(template => {
        const storeAchievement = achievements.find(a => a.achievementId === template.id);
        if (storeAchievement) {
            return {
                ...template,
                earned: true,
                earnedDate: storeAchievement.earnedAt
            };
        }
        return template;
    });

    const categories = [
        { id: 'all', name: 'All', icon: TrophyIcon },
        { id: 'learning', name: 'Learning', icon: BookOpenIcon },
        { id: 'streak', name: 'Streaks', icon: FireIcon },
        { id: 'practice', name: 'Practice', icon: BeakerIcon },
        { id: 'mastery', name: 'Mastery', icon: StarIcon },
        { id: 'special', name: 'Special', icon: SparklesIcon }
    ];

    const filteredAchievements = selectedCategory === 'all'
        ? mergedAchievements
        : mergedAchievements.filter(a => a.category === selectedCategory);

    const earnedCount = mergedAchievements.filter(a => a.earned).length;
    const totalXP = mergedAchievements.filter(a => a.earned).reduce((sum, a) => sum + a.xpReward, 0);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
            case 'rare': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'epic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
        }
    };

    const getRarityBorder = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'border-gray-200 dark:border-gray-700';
            case 'rare': return 'border-blue-200 dark:border-blue-800';
            case 'epic': return 'border-purple-200 dark:border-purple-800';
            case 'legendary': return 'border-yellow-200 dark:border-yellow-800';
            default: return 'border-gray-200 dark:border-gray-700';
        }
    };

    if (isLoading && !showContent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 pb-20 sm:pb-6">
            <div className="max-w-7xl mx-auto mobile-container">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Achievements
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Track your learning progress and unlock rewards
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {earnedCount}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Achievements Earned
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {totalXP}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Total XP Earned
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {Math.round((earnedCount / mergedAchievements.length) * 100)}%
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Completion Rate
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory === category.id
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredAchievements.map((achievement) => {
                        const Icon = achievement.icon;
                        const isEarned = achievement.earned;

                        return (
                            <div
                                key={achievement.id}
                                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${isEarned
                                    ? `${getRarityBorder(achievement.rarity)} shadow-sm`
                                    : 'border-gray-200 dark:border-gray-700 opacity-75'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isEarned ? getRarityColor(achievement.rarity) : 'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                        {isEarned ? (
                                            <Icon className="w-6 h-6" />
                                        ) : (
                                            <LockClosedIcon className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                                            {achievement.rarity}
                                        </span>
                                        {isEarned && (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                </div>

                                <h3 className={`font-bold text-lg mb-2 ${isEarned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {achievement.title}
                                </h3>

                                <p className={`text-sm mb-4 ${isEarned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {achievement.description}
                                </p>

                                {/* Progress Bar */}
                                {achievement.maxProgress && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${isEarned ? 'bg-green-500' : 'bg-primary-500'
                                                    }`}
                                                style={{
                                                    width: `${Math.min((achievement.progress || 0) / achievement.maxProgress * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {achievement.requirement}
                                    </span>
                                    <span className={`text-sm font-medium ${isEarned ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                                        }`}>
                                        +{achievement.xpReward} XP
                                    </span>
                                </div>

                                {isEarned && achievement.earnedDate && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                            <CalendarDaysIcon className="w-4 h-4" />
                                            <span>Earned {new Date(achievement.earnedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredAchievements.length === 0 && (
                    <div className="text-center py-12">
                        <TrophyIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No achievements in this category
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Keep learning to unlock more achievements!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsPage;