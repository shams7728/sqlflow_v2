import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  BookOpenIcon,
  FlagIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useProgressStore } from '../../stores/progressStore';

interface LearningInsight {
  id: string;
  type: 'performance' | 'engagement' | 'achievement' | 'progress' | 'recommendation';
  level: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  actionable: boolean;
  action?: string;
  actionLabel?: string;
  data?: any;
}

interface SkillAnalysis {
  skill: string;
  completed: number;
  total: number;
  averageScore: number;
  mastery: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface StudyRecommendation {
  type: 'review' | 'practice' | 'advance' | 'focus';
  title: string;
  description: string;
  lessonIds: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // in minutes
}

const LearningInsights: React.FC = () => {
  const navigate = useNavigate();
  const { stats, progress, achievements } = useProgressStore();
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[]>([]);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      setIsLoading(true);
      try {
        // Generate insights based on user data
        const generatedInsights = await analyzeUserProgress();
        const skillData = await analyzeSkillProgress();
        const studyRecs = await generateStudyRecommendations();

        setInsights(generatedInsights);
        setSkillAnalysis(skillData);
        setRecommendations(studyRecs);
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [stats, progress, achievements]);

  const analyzeUserProgress = async (): Promise<LearningInsight[]> => {
    const insights: LearningInsight[] = [];

    // Performance insights
    if (stats && stats.averageScore < 70) {
      insights.push({
        id: 'low-performance',
        type: 'performance',
        level: 'warning',
        title: 'Room for Improvement',
        message: `Your average score is ${stats.averageScore.toFixed(1)}%. Consider reviewing completed lessons and practicing more exercises.`,
        actionable: true,
        action: 'review_lessons',
        actionLabel: 'Review Lessons'
      });
    } else if (stats && stats.averageScore >= 90) {
      insights.push({
        id: 'high-performance',
        type: 'performance',
        level: 'success',
        title: 'Excellent Performance!',
        message: `Outstanding! Your average score is ${stats.averageScore.toFixed(1)}%. You're mastering SQL concepts effectively.`,
        actionable: false
      });
    }

    // Engagement insights
    if (stats && stats.currentStreak === 0) {
      insights.push({
        id: 'no-streak',
        type: 'engagement',
        level: 'info',
        title: 'Start Your Learning Streak',
        message: 'Build a daily learning habit! Even 10 minutes of practice can make a big difference.',
        actionable: true,
        action: 'start_lesson',
        actionLabel: 'Start Learning'
      });
    } else if (stats && stats.currentStreak >= 7) {
      insights.push({
        id: 'good-streak',
        type: 'engagement',
        level: 'success',
        title: 'Great Consistency!',
        message: `You've maintained a ${stats.currentStreak}-day learning streak. Keep up the excellent work!`,
        actionable: false
      });
    }

    // Achievement insights
    if (achievements.length < 3) {
      insights.push({
        id: 'few-achievements',
        type: 'achievement',
        level: 'info',
        title: 'Unlock More Achievements',
        message: 'Complete more lessons and exercises to earn badges and points. You have many achievements waiting!',
        actionable: true,
        action: 'view_achievements',
        actionLabel: 'View Achievements'
      });
    }

    // Progress insights
    if (stats && stats.completedLessons > 10) {
      insights.push({
        id: 'good-progress',
        type: 'progress',
        level: 'success',
        title: 'Solid Foundation Built',
        message: `You've completed ${stats.completedLessons} lessons! You're building a strong SQL foundation.`,
        actionable: false
      });
    }

    // Time management insights
    if (stats && stats.totalTimeSpent > 0) {
      const avgTimePerLesson = stats.totalTimeSpent / Math.max(stats.completedLessons, 1) / 60;
      if (avgTimePerLesson > 45) {
        insights.push({
          id: 'long-sessions',
          type: 'engagement',
          level: 'info',
          title: 'Consider Shorter Sessions',
          message: `Your average lesson time is ${avgTimePerLesson.toFixed(1)} minutes. Shorter, frequent sessions often improve retention.`,
          actionable: true,
          action: 'set_timer',
          actionLabel: 'Set Study Timer'
        });
      }
    }

    return insights;
  };

  const analyzeSkillProgress = async (): Promise<SkillAnalysis[]> => {
    // Mock skill analysis - in real app, this would analyze lesson categories
    return [
      {
        skill: 'SELECT Statements',
        completed: 8,
        total: 10,
        averageScore: 92,
        mastery: 80,
        trend: 'improving'
      },
      {
        skill: 'JOIN Operations',
        completed: 5,
        total: 8,
        averageScore: 78,
        mastery: 62,
        trend: 'stable'
      },
      {
        skill: 'GROUP BY & Aggregation',
        completed: 3,
        total: 6,
        averageScore: 65,
        mastery: 50,
        trend: 'improving'
      },
      {
        skill: 'Subqueries',
        completed: 2,
        total: 5,
        averageScore: 58,
        mastery: 40,
        trend: 'declining'
      },
      {
        skill: 'Window Functions',
        completed: 1,
        total: 4,
        averageScore: 45,
        mastery: 25,
        trend: 'stable'
      }
    ];
  };

  const generateStudyRecommendations = async (): Promise<StudyRecommendation[]> => {
    return [
      {
        type: 'review',
        title: 'Review JOIN Fundamentals',
        description: 'Your JOIN performance could improve. Review INNER, LEFT, and RIGHT joins.',
        lessonIds: ['inner-join', 'left-join'],
        priority: 'high',
        estimatedTime: 45
      },
      {
        type: 'practice',
        title: 'Practice Subqueries',
        description: 'Strengthen your subquery skills with more practice exercises.',
        lessonIds: ['subqueries', 'exists-any-all'],
        priority: 'medium',
        estimatedTime: 60
      },
      {
        type: 'advance',
        title: 'Learn Window Functions',
        description: 'Ready for advanced topics? Window functions are powerful for analytics.',
        lessonIds: ['window-functions'],
        priority: 'low',
        estimatedTime: 90
      },
      {
        type: 'focus',
        title: 'Master GROUP BY',
        description: 'Focus on aggregation functions and grouping concepts.',
        lessonIds: ['group-by', 'aggregate-functions'],
        priority: 'medium',
        estimatedTime: 30
      }
    ];
  };

  const handleStartRecommendation = (lessonIds: string[]) => {
    // Navigate to the first lesson in the recommendation
    if (lessonIds.length > 0) {
      navigate(`/lesson/${lessonIds[0]}`);
    }
  };

  const getInsightIcon = (type: string, level: string) => {
    if (level === 'success') return CheckCircleIcon;
    if (level === 'warning') return ExclamationTriangleIcon;
    if (level === 'error') return ExclamationTriangleIcon;
    
    switch (type) {
      case 'performance':
        return ChartBarIcon;
      case 'engagement':
        return ClockIcon;
      case 'achievement':
        return SparklesIcon;
      case 'progress':
        return ArrowTrendingUpIcon;
      default:
        return LightBulbIcon;
    }
  };

  const getInsightColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getInsightTextColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'info':
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your learning patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered analysis of your SQL learning journey
        </p>
      </div>

      {/* Key Insights */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <LightBulbIcon className="w-6 h-6 text-yellow-500" />
          <span>Key Insights</span>
        </h3>
        
        {insights.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Keep learning to unlock personalized insights!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type, insight.level);
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`border rounded-xl p-6 ${getInsightColor(insight.level)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getInsightTextColor(insight.level)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 ${getInsightTextColor(insight.level)}`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm mb-3 ${getInsightTextColor(insight.level)}`}>
                        {insight.message}
                      </p>
                      {insight.actionable && (
                        <button className={`inline-flex items-center space-x-2 text-sm font-medium ${getInsightTextColor(insight.level)} hover:underline`}>
                          <span>{insight.actionLabel || 'Take Action'}</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skill Analysis */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <ChartBarIcon className="w-6 h-6 text-blue-500" />
          <span>Skill Analysis</span>
        </h3>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            {skillAnalysis.map((skill, index) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{skill.skill}</h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(skill.trend)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.completed}/{skill.total} lessons
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Mastery</span>
                        <span>{skill.mastery}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.mastery}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.averageScore}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">avg score</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <FlagIcon className="w-6 h-6 text-purple-500" />
          <span>Study Recommendations</span>
        </h3>
        
        <div className="grid gap-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={`${rec.type}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      {rec.type === 'review' && <BookOpenIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                      {rec.type === 'practice' && <AcademicCapIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                      {rec.type === 'advance' && <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                      {rec.type === 'focus' && <FlagIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{rec.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>~{rec.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpenIcon className="w-4 h-4" />
                      <span>{rec.lessonIds.length} lessons</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleStartRecommendation(rec.lessonIds)}
                  className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Start</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningInsights;