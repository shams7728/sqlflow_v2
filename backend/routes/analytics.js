const express = require('express');
const router = express.Router();
const LearningAnalytics = require('../models/LearningAnalytics');
const UserProgress = require('../models/UserProgress');
const Achievement = require('../models/Achievement');

// Middleware to extract user ID
const getUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'] || (req.body && req.body.userId) || 'guest';
  req.userId = userId;
  next();
};

router.use(getUserId);

// =================== ANALYTICS ROUTES ===================

// Get dashboard analytics
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const days = parseInt(req.query.days) || 30;
    
    const [dashboardStats, weeklyProgress, currentStreak, recentAchievements] = await Promise.all([
      LearningAnalytics.getDashboardStats(userId, days),
      LearningAnalytics.getWeeklyProgress(userId, 4),
      LearningAnalytics.getCurrentStreak(userId),
      Achievement.getUserAchievements(userId).limit(5)
    ]);
    
    const stats = dashboardStats[0] || {
      totalLessons: 0,
      totalTimeSpent: 0,
      totalExercises: 0,
      averageScore: 0,
      activeDays: 0,
      totalSessions: 0,
      averageSessionTime: 0
    };
    
    // Calculate additional metrics
    const completionRate = stats.totalLessons > 0 ? 
      (stats.totalLessons / await getTotalAvailableLessons()) * 100 : 0;
    
    const learningVelocity = stats.activeDays > 0 ? 
      stats.totalLessons / stats.activeDays : 0;
    
    res.json({
      success: true,
      data: {
        overview: {
          ...stats,
          currentStreak,
          completionRate: Math.round(completionRate * 100) / 100,
          learningVelocity: Math.round(learningVelocity * 100) / 100
        },
        weeklyProgress,
        recentAchievements
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard analytics'
    });
  }
});

// Get detailed progress analytics
router.get('/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    
    const [analytics, progressData, achievements] = await Promise.all([
      LearningAnalytics.getUserAnalytics(userId, startDate, endDate),
      UserProgress.getUserProgress(userId),
      Achievement.getUserAchievements(userId)
    ]);
    
    // Process data for charts
    const dailyActivity = analytics.map(day => ({
      date: day.date,
      lessonsCompleted: day.lessonsCompleted,
      timeSpent: Math.round(day.timeSpent / 60), // Convert to minutes
      averageScore: day.averageScore,
      exercisesSolved: day.exercisesSolved
    }));
    
    // Calculate skill progression
    const skillProgression = calculateSkillProgression(progressData);
    
    // Calculate performance trends
    const performanceTrends = calculatePerformanceTrends(analytics);
    
    res.json({
      success: true,
      data: {
        dailyActivity,
        skillProgression,
        performanceTrends,
        totalAchievements: achievements.length,
        totalPoints: achievements.reduce((sum, a) => sum + a.points, 0)
      }
    });
    
  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress analytics'
    });
  }
});

// Track learning event
router.post('/track-event', async (req, res) => {
  try {
    const {
      eventType,
      lessonId,
      exerciseId,
      timeSpent,
      score,
      hintsUsed,
      errorsCount
    } = req.body;
    
    const userId = req.userId;
    
    // Update daily analytics based on event type
    const updates = {};
    
    switch (eventType) {
      case 'lesson_start':
        updates.sessionCount = 1;
        break;
        
      case 'lesson_complete':
        updates.lessonsCompleted = 1;
        if (timeSpent) updates.timeSpent = timeSpent;
        break;
        
      case 'exercise_complete':
        updates.exercisesSolved = 1;
        if (timeSpent) updates.timeSpent = timeSpent;
        break;
        
      case 'quiz_complete':
        updates.quizzesTaken = 1;
        if (timeSpent) updates.timeSpent = timeSpent;
        break;
        
      case 'hint_used':
        updates.hintsUsed = hintsUsed || 1;
        break;
        
      case 'error_encountered':
        updates.errorsEncountered = errorsCount || 1;
        break;
        
      case 'ai_interaction':
        updates.aiInteractions = 1;
        break;
    }
    
    if (Object.keys(updates).length > 0) {
      await LearningAnalytics.updateDailyStats(userId, updates);
    }
    
    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
    
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
});

// Get learning insights and recommendations
router.get('/insights/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    
    const [progressData, analytics, achievements] = await Promise.all([
      UserProgress.getUserProgress(userId),
      LearningAnalytics.getDashboardStats(userId, 30),
      Achievement.getUserAchievements(userId)
    ]);
    
    const insights = generateLearningInsights(progressData, analytics[0], achievements);
    
    res.json({
      success: true,
      data: insights
    });
    
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

// Export progress report
router.get('/report/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const format = req.query.format || 'json'; // json, csv, pdf
    
    const [progressData, analytics, achievements] = await Promise.all([
      UserProgress.getUserProgress(userId),
      LearningAnalytics.getUserAnalytics(userId),
      Achievement.getUserAchievements(userId)
    ]);
    
    const report = {
      generatedAt: new Date().toISOString(),
      userId,
      summary: {
        totalLessons: progressData.length,
        completedLessons: progressData.filter(p => p.status === 'completed').length,
        totalTimeSpent: progressData.reduce((sum, p) => sum + p.timeSpent, 0),
        averageScore: progressData.reduce((sum, p) => sum + p.score, 0) / progressData.length || 0,
        totalAchievements: achievements.length,
        totalPoints: achievements.reduce((sum, a) => sum + a.points, 0)
      },
      progressDetails: progressData,
      achievements,
      dailyActivity: analytics
    };
    
    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(report);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=progress-report.csv');
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: report
      });
    }
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report'
    });
  }
});

// =================== HELPER FUNCTIONS ===================

async function getTotalAvailableLessons() {
  // This would typically come from your lesson service
  // For now, return a reasonable estimate
  return 60;
}

function calculateSkillProgression(progressData) {
  const skills = {
    'SELECT': [],
    'JOIN': [],
    'GROUP BY': [],
    'Subqueries': [],
    'Functions': []
  };
  
  progressData.forEach(progress => {
    // This would need lesson metadata to categorize by skill
    // For now, we'll use a simple approach based on lesson ID patterns
    const lessonId = progress.lessonId.toLowerCase();
    
    if (lessonId.includes('select')) {
      skills['SELECT'].push(progress);
    } else if (lessonId.includes('join')) {
      skills['JOIN'].push(progress);
    } else if (lessonId.includes('group')) {
      skills['GROUP BY'].push(progress);
    } else if (lessonId.includes('subquery')) {
      skills['Subqueries'].push(progress);
    } else if (lessonId.includes('function')) {
      skills['Functions'].push(progress);
    }
  });
  
  return Object.entries(skills).map(([skill, lessons]) => ({
    skill,
    completed: lessons.filter(l => l.status === 'completed').length,
    total: lessons.length,
    averageScore: lessons.reduce((sum, l) => sum + l.score, 0) / lessons.length || 0,
    mastery: lessons.length > 0 ? 
      (lessons.filter(l => l.status === 'completed').length / lessons.length) * 100 : 0
  }));
}

function calculatePerformanceTrends(analytics) {
  if (analytics.length < 2) return { trend: 'stable', change: 0 };
  
  const recent = analytics.slice(0, 7); // Last 7 days
  const previous = analytics.slice(7, 14); // Previous 7 days
  
  const recentAvg = recent.reduce((sum, day) => sum + day.averageScore, 0) / recent.length;
  const previousAvg = previous.reduce((sum, day) => sum + day.averageScore, 0) / previous.length;
  
  const change = recentAvg - previousAvg;
  const trend = change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable';
  
  return { trend, change: Math.round(change * 100) / 100 };
}

function generateLearningInsights(progressData, analytics, achievements) {
  const insights = [];
  
  // Performance insights
  if (analytics && analytics.averageScore < 70) {
    insights.push({
      type: 'performance',
      level: 'warning',
      title: 'Room for Improvement',
      message: 'Your average score is below 70%. Consider reviewing completed lessons and practicing more exercises.',
      actionable: true,
      action: 'review_lessons'
    });
  }
  
  // Engagement insights
  if (analytics && analytics.activeDays < 7) {
    insights.push({
      type: 'engagement',
      level: 'info',
      title: 'Stay Consistent',
      message: 'Try to practice SQL daily for better retention and faster progress.',
      actionable: true,
      action: 'daily_practice'
    });
  }
  
  // Achievement insights
  if (achievements.length < 3) {
    insights.push({
      type: 'achievement',
      level: 'info',
      title: 'Unlock More Achievements',
      message: 'Complete more lessons and exercises to earn badges and points.',
      actionable: true,
      action: 'earn_achievements'
    });
  }
  
  // Progress insights
  const completedLessons = progressData.filter(p => p.status === 'completed').length;
  if (completedLessons > 10) {
    insights.push({
      type: 'progress',
      level: 'success',
      title: 'Great Progress!',
      message: `You've completed ${completedLessons} lessons. Keep up the excellent work!`,
      actionable: false
    });
  }
  
  return insights;
}

function convertToCSV(report) {
  const headers = ['Lesson ID', 'Status', 'Score', 'Time Spent (min)', 'Attempts', 'Last Accessed'];
  const rows = report.progressDetails.map(progress => [
    progress.lessonId,
    progress.status,
    progress.score,
    Math.round(progress.timeSpent / 60),
    progress.attempts,
    new Date(progress.lastAccessedAt).toLocaleDateString()
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

module.exports = router;