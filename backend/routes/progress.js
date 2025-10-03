const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const UserStats = require('../models/UserStats');
const { authenticateToken } = require('../middleware/auth');
const { awardXP, checkAchievements, updateStreak, XP_REWARDS } = require('../services/xpService');

// Get user's progress for all lessons
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own data
    if (req.user.userId !== userId && userId !== 'guest') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const progress = await Progress.find({ userId }).sort({ lastAccessedAt: -1 });
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update lesson progress
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { lessonId, status, score, maxScore, timeSpent, exercisesCompleted, quizScore, notes } = req.body;
    const userId = req.user.userId || req.headers['x-user-id'] || 'guest';

    if (!lessonId) {
      return res.status(400).json({ success: false, error: 'Lesson ID is required' });
    }

    // Find existing progress or create new
    let progress = await Progress.findOne({ userId, lessonId });

    if (progress) {
      // Update existing progress
      if (status) progress.status = status;
      if (score !== undefined) progress.score = score;
      if (maxScore !== undefined) progress.maxScore = maxScore;
      if (timeSpent !== undefined) progress.timeSpent += timeSpent;
      if (exercisesCompleted) progress.exercisesCompleted = exercisesCompleted;
      if (quizScore !== undefined) progress.quizScore = quizScore;
      if (notes !== undefined) progress.notes = notes;
      
      progress.attempts += 1;
      progress.lastAccessedAt = new Date();
      
      if (status === 'completed' && !progress.firstCompletedAt) {
        progress.firstCompletedAt = new Date();
      }
    } else {
      // Create new progress
      progress = new Progress({
        userId,
        lessonId,
        status: status || 'in_progress',
        score: score || 0,
        maxScore: maxScore || 100,
        timeSpent: timeSpent || 0,
        attempts: 1,
        exercisesCompleted: exercisesCompleted || [],
        quizScore: quizScore || 0,
        notes: notes || '',
        isBookmarked: false,
        lastAccessedAt: new Date(),
        firstCompletedAt: status === 'completed' ? new Date() : null
      });
    }

    await progress.save();

    // Update streak
    await updateStreak(userId);

    // Award XP based on action
    let xpResult = null;
    const newAchievements = [];

    if (status === 'completed' && !progress.firstCompletedAt) {
      // Lesson completed
      xpResult = await awardXP(userId, XP_REWARDS.LESSON_COMPLETE, 'Lesson completed');
      
      // Bonus for perfect score
      if (score === 100) {
        const bonusXP = await awardXP(userId, XP_REWARDS.PERFECT_SCORE, 'Perfect score bonus');
        xpResult.xpAwarded += bonusXP.xpAwarded;
      }
      
      // Bonus for first try
      if (progress.attempts === 1) {
        const bonusXP = await awardXP(userId, XP_REWARDS.FIRST_TRY, 'First try bonus');
        xpResult.xpAwarded += bonusXP.xpAwarded;
      }
      
      // Update user stats
      await UserStats.findOneAndUpdate(
        { userId },
        { $inc: { totalLessonsCompleted: 1 } },
        { upsert: true }
      );
    }

    // Award XP for practice exercises
    if (exercisesCompleted && exercisesCompleted.length > 0) {
      const newExercises = exercisesCompleted.filter(
        ex => !progress.exercisesCompleted.includes(ex)
      );
      
      if (newExercises.length > 0) {
        xpResult = await awardXP(
          userId, 
          XP_REWARDS.PRACTICE_COMPLETE * newExercises.length, 
          `${newExercises.length} practice exercise(s) completed`
        );
        
        await UserStats.findOneAndUpdate(
          { userId },
          { $inc: { totalPracticeCompleted: newExercises.length } },
          { upsert: true }
        );
      }
    }

    // Award XP for quiz completion
    if (quizScore !== undefined && quizScore > 0) {
      xpResult = await awardXP(userId, XP_REWARDS.QUIZ_COMPLETE, 'Quiz completed');
      
      await UserStats.findOneAndUpdate(
        { userId },
        { $inc: { totalQuizzesCompleted: 1 } },
        { upsert: true }
      );
    }

    // Check for achievements
    const achievements = await checkAchievements(userId, { progress });

    res.json({
      success: true,
      data: progress,
      xp: xpResult,
      achievements: achievements || []
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle bookmark
router.post('/bookmark/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId || req.headers['x-user-id'] || 'guest';

    let progress = await Progress.findOne({ userId, lessonId });

    if (!progress) {
      // Create new progress with bookmark
      progress = new Progress({
        userId,
        lessonId,
        status: 'not_started',
        score: 0,
        maxScore: 100,
        timeSpent: 0,
        attempts: 0,
        exercisesCompleted: [],
        quizScore: 0,
        notes: '',
        isBookmarked: true,
        lastAccessedAt: new Date()
      });
    } else {
      progress.isBookmarked = !progress.isBookmarked;
      progress.lastAccessedAt = new Date();
    }

    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user stats
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own data
    if (req.user.userId !== userId && userId !== 'guest') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // Get user stats from database
    let userStats = await UserStats.findOne({ userId });
    
    if (!userStats) {
      userStats = new UserStats({ userId });
      await userStats.save();
    }

    const allProgress = await Progress.find({ userId });
    
    const completedLessons = allProgress.filter(
      p => p.status === 'completed' || p.status === 'mastered'
    ).length;
    
    const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const averageScore = allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.score, 0) / allProgress.length 
      : 0;

    const stats = {
      totalLessons: 60,
      completedLessons,
      totalTimeSpent,
      averageScore,
      totalAttempts: allProgress.reduce((sum, p) => sum + p.attempts, 0),
      currentStreak: userStats.currentStreak,
      longestStreak: userStats.longestStreak,
      totalPoints: userStats.totalPoints,
      totalXP: userStats.totalXP,
      practiceProblems: userStats.totalPracticeCompleted,
      totalStudyTime: totalTimeSpent,
      level: userStats.getLevelProgress()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset progress for a lesson
router.delete('/reset/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId || req.headers['x-user-id'] || 'guest';

    await Progress.findOneAndDelete({ userId, lessonId });

    res.json({
      success: true,
      message: 'Progress reset successfully'
    });
  } catch (error) {
    console.error('Error resetting progress:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
