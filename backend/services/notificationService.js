const fetch = require('node-fetch');

/**
 * OneSignal Notification Service
 */
class NotificationService {
  constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID;
    this.restApiKey = process.env.ONESIGNAL_REST_API_KEY;
    this.apiUrl = 'https://onesignal.com/api/v1/notifications';
  }

  /**
   * Send notification to specific user
   */
  async sendToUser(userId, notification) {
    if (!this.appId || !this.restApiKey) {
      console.warn('OneSignal credentials not configured');
      return null;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify({
          app_id: this.appId,
          include_external_user_ids: [userId],
          headings: { en: notification.title },
          contents: { en: notification.message },
          data: notification.data || {},
          url: notification.url || undefined,
          icon: notification.icon || undefined,
          large_icon: notification.largeIcon || undefined,
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        console.error('OneSignal error:', data.errors);
        return null;
      }

      console.log('✅ Notification sent:', data.id);
      return data;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return null;
    }
  }

  /**
   * Send notification to all users
   */
  async sendToAll(notification) {
    if (!this.appId || !this.restApiKey) {
      console.warn('OneSignal credentials not configured');
      return null;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify({
          app_id: this.appId,
          included_segments: ['All'],
          headings: { en: notification.title },
          contents: { en: notification.message },
          data: notification.data || {},
          url: notification.url || undefined,
        })
      });

      const data = await response.json();
      console.log('✅ Broadcast notification sent:', data.id);
      return data;
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      return null;
    }
  }

  /**
   * Send notification to users with specific tags
   */
  async sendToSegment(tags, notification) {
    if (!this.appId || !this.restApiKey) {
      console.warn('OneSignal credentials not configured');
      return null;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify({
          app_id: this.appId,
          filters: tags.map(tag => ({
            field: 'tag',
            key: tag.key,
            relation: '=',
            value: tag.value
          })),
          headings: { en: notification.title },
          contents: { en: notification.message },
          data: notification.data || {},
        })
      });

      const data = await response.json();
      console.log('✅ Segment notification sent:', data.id);
      return data;
    } catch (error) {
      console.error('Failed to send segment notification:', error);
      return null;
    }
  }

  /**
   * Notification Templates
   */

  // Achievement unlocked
  async notifyAchievement(userId, achievement) {
    return this.sendToUser(userId, {
      title: '🏆 Achievement Unlocked!',
      message: `You earned "${achievement.title}"! +${achievement.xpReward} XP`,
      data: {
        type: 'achievement',
        achievementId: achievement.id
      },
      url: '/achievements'
    });
  }

  // Level up
  async notifyLevelUp(userId, newLevel) {
    return this.sendToUser(userId, {
      title: '⭐ Level Up!',
      message: `Congratulations! You reached Level ${newLevel}!`,
      data: {
        type: 'levelUp',
        level: newLevel
      },
      url: '/dashboard'
    });
  }

  // Streak reminder
  async notifyStreakReminder(userId, currentStreak) {
    return this.sendToUser(userId, {
      title: '🔥 Keep Your Streak!',
      message: `You're on a ${currentStreak} day streak! Complete a lesson today to keep it going.`,
      data: {
        type: 'streakReminder',
        streak: currentStreak
      },
      url: '/lessons'
    });
  }

  // Streak broken
  async notifyStreakBroken(userId, lostStreak) {
    return this.sendToUser(userId, {
      title: '💔 Streak Broken',
      message: `Your ${lostStreak} day streak ended. Start a new one today!`,
      data: {
        type: 'streakBroken',
        lostStreak: lostStreak
      },
      url: '/lessons'
    });
  }

  // Daily reminder
  async notifyDailyReminder(userId) {
    return this.sendToUser(userId, {
      title: '📚 Time to Learn!',
      message: 'Complete a lesson today and earn XP!',
      data: {
        type: 'dailyReminder'
      },
      url: '/lessons'
    });
  }

  // New lesson available
  async notifyNewLesson(lessonTitle) {
    return this.sendToAll({
      title: '🆕 New Lesson Available!',
      message: `Check out "${lessonTitle}" and start learning!`,
      data: {
        type: 'newLesson'
      },
      url: '/lessons'
    });
  }

  // Lesson completion
  async notifyLessonComplete(userId, lessonTitle, xpEarned) {
    return this.sendToUser(userId, {
      title: '✅ Lesson Complete!',
      message: `You completed "${lessonTitle}" and earned ${xpEarned} XP!`,
      data: {
        type: 'lessonComplete',
        xp: xpEarned
      },
      url: '/dashboard'
    });
  }

  // Challenge invitation
  async notifyChallengeInvite(userId, challengeName) {
    return this.sendToUser(userId, {
      title: '🎯 New Challenge!',
      message: `Try the "${challengeName}" challenge and test your skills!`,
      data: {
        type: 'challenge'
      },
      url: '/practice'
    });
  }
}

module.exports = new NotificationService();
