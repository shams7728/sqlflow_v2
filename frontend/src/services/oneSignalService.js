import OneSignal from 'react-onesignal';

/**
 * OneSignal Service for Push Notifications
 */
class OneSignalService {
  constructor() {
    this.initialized = false;
    this.appId = process.env.REACT_APP_ONESIGNAL_APP_ID;
  }

  /**
   * Initialize OneSignal
   */
  async initialize() {
    if (this.initialized || !this.appId) {
      console.warn('OneSignal already initialized or App ID missing');
      return;
    }

    try {
      await OneSignal.init({
        appId: this.appId,
        allowLocalhostAsSecureOrigin: true, // For development
        notifyButton: {
          enable: false, // We'll use custom UI
        },
        welcomeNotification: {
          title: "Welcome to SQLFlow!",
          message: "You'll receive notifications about your learning progress.",
        },
      });

      this.initialized = true;
      console.log('✅ OneSignal initialized successfully');

      // Set up event listeners
      this.setupEventListeners();

      return true;
    } catch (error) {
      console.error('❌ OneSignal initialization failed:', error);
      return false;
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for subscription changes
    OneSignal.on('subscriptionChange', (isSubscribed) => {
      console.log('Subscription changed:', isSubscribed);
    });

    // Listen for notification display
    OneSignal.on('notificationDisplay', (event) => {
      console.log('Notification displayed:', event);
    });

    // Listen for notification clicks
    OneSignal.on('notificationDismiss', (event) => {
      console.log('Notification dismissed:', event);
    });
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    try {
      const permission = await OneSignal.showNativePrompt();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Failed to request permission:', error);
      return false;
    }
  }

  /**
   * Check if user is subscribed
   */
  async isSubscribed() {
    try {
      return await OneSignal.isPushNotificationsEnabled();
    } catch (error) {
      console.error('Failed to check subscription:', error);
      return false;
    }
  }

  /**
   * Get user's OneSignal ID
   */
  async getUserId() {
    try {
      return await OneSignal.getUserId();
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
  }

  /**
   * Set external user ID (your app's user ID)
   */
  async setExternalUserId(userId) {
    try {
      await OneSignal.setExternalUserId(userId);
      console.log('External user ID set:', userId);
    } catch (error) {
      console.error('Failed to set external user ID:', error);
    }
  }

  /**
   * Remove external user ID (on logout)
   */
  async removeExternalUserId() {
    try {
      await OneSignal.removeExternalUserId();
      console.log('External user ID removed');
    } catch (error) {
      console.error('Failed to remove external user ID:', error);
    }
  }

  /**
   * Add tags for user segmentation
   */
  async setTags(tags) {
    try {
      await OneSignal.sendTags(tags);
      console.log('Tags set:', tags);
    } catch (error) {
      console.error('Failed to set tags:', error);
    }
  }

  /**
   * Send a test notification (for testing)
   */
  async sendTestNotification() {
    try {
      const userId = await this.getUserId();
      if (!userId) {
        console.warn('No user ID available');
        return;
      }

      console.log('Test notification would be sent to:', userId);
      // Actual sending happens from backend
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe() {
    try {
      await OneSignal.setSubscription(false);
      console.log('Unsubscribed from notifications');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }

  /**
   * Subscribe to notifications
   */
  async subscribe() {
    try {
      await OneSignal.setSubscription(true);
      console.log('Subscribed to notifications');
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }
}

export const oneSignalService = new OneSignalService();
