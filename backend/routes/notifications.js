const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

/**
 * @route   POST /api/notifications/test
 * @desc    Send test notification
 * @access  Private
 */
router.post('/test', optionalAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await notificationService.sendToUser(userId, {
      title: '🧪 Test Notification',
      message: 'This is a test notification from SQLFlow!',
      data: { type: 'test' },
      url: '/dashboard'
    });

    if (result) {
      res.json({ 
        success: true, 
        message: 'Test notification sent',
        notificationId: result.id
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send notification' 
      });
    }
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/notifications/achievement
 * @desc    Send achievement notification
 * @access  Private
 */
router.post('/achievement', optionalAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { achievement } = req.body;

    const result = await notificationService.notifyAchievement(userId, achievement);

    res.json({ 
      success: true, 
      message: 'Achievement notification sent',
      notificationId: result?.id
    });
  } catch (error) {
    console.error('Achievement notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/notifications/level-up
 * @desc    Send level up notification
 * @access  Private
 */
router.post('/level-up', optionalAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { newLevel } = req.body;

    const result = await notificationService.notifyLevelUp(userId, newLevel);

    res.json({ 
      success: true, 
      message: 'Level up notification sent',
      notificationId: result?.id
    });
  } catch (error) {
    console.error('Level up notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/notifications/streak-reminder
 * @desc    Send streak reminder notification
 * @access  Private
 */
router.post('/streak-reminder', optionalAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentStreak } = req.body;

    const result = await notificationService.notifyStreakReminder(userId, currentStreak);

    res.json({ 
      success: true, 
      message: 'Streak reminder sent',
      notificationId: result?.id
    });
  } catch (error) {
    console.error('Streak reminder error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Send notification to all users (admin only)
 * @access  Private/Admin
 */
router.post('/broadcast', optionalAuth, async (req, res) => {
  try {
    // TODO: Add admin check
    const { title, message, url } = req.body;

    const result = await notificationService.sendToAll({
      title,
      message,
      url
    });

    res.json({ 
      success: true, 
      message: 'Broadcast sent',
      notificationId: result?.id
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
