# 🔔 OneSignal Push Notifications - Complete Setup Guide

## 📋 What We've Created

I've created all the necessary files for OneSignal integration:

### Frontend Files:
- ✅ `frontend/src/services/oneSignalService.js` - OneSignal service wrapper
- ✅ `frontend/src/components/OneSignalInit.jsx` - Initialization component
- ✅ `frontend/src/components/NotificationPrompt.jsx` - Permission prompt dialog
- ✅ `frontend/src/components/NotificationSettings.jsx` - Settings page component

### Backend Files:
- ✅ `backend/services/notificationService.js` - Send notifications from backend
- ✅ `backend/routes/notifications.js` - API routes for notifications

## 🚀 Step-by-Step Setup

### Step 1: Create OneSignal Account

1. Go to https://onesignal.com/
2. Sign up for free account
3. Click "New App/Website"
4. Choose "Web Push"
5. Enter app name: **SQLFlow**
6. Click "Next"

### Step 2: Configure Web Push

1. In OneSignal Dashboard → Settings → Platforms → Web Push
2. Configure:
   - **Site Name**: SQLFlow
   - **Site URL (HTTP)**: `http://localhost:3000`
   - **Site URL (HTTPS)**: `https://yourdomain.com` (for production)
   - **Auto Resubscribe**: ON
   - **Default Icon**: Upload your logo (256x256 PNG)
3. Click "Save"

### Step 3: Get Your Credentials

In OneSignal Dashboard:
1. Go to Settings → Keys & IDs
2. Copy these values:
   - **App ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **REST API Key**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 4: Install Dependencies

```bash
cd frontend
npm install react-onesignal
```

### Step 5: Add Environment Variables

**frontend/.env:**
```env
REACT_APP_ONESIGNAL_APP_ID=your-app-id-here
```

**backend/.env:**
```env
ONESIGNAL_APP_ID=your-app-id-here
ONESIGNAL_REST_API_KEY=your-rest-api-key-here
```

### Step 6: Add OneSignal to App.js

Open `frontend/src/App.js` and add:

```javascript
// At the top with other imports
import { OneSignalInit } from './components/OneSignalInit';
import { NotificationPrompt } from './components/NotificationPrompt';

// Inside your main App component, add these components:
function App() {
  return (
    <UnifiedThemeProvider>
      <AccessibilityProvider>
        <ToastProvider>
          {/* Add these two lines */}
          <OneSignalInit />
          <NotificationPrompt />
          
          {/* Rest of your app */}
          <Routes>
            {/* Your routes */}
          </Routes>
        </ToastProvider>
      </AccessibilityProvider>
    </UnifiedThemeProvider>
  );
}
```

### Step 7: Add Notification Routes to Backend

Open `backend/server.js` and add:

```javascript
// Add this with other route imports
const notificationRoutes = require('./routes/notifications');

// Add this with other routes
app.use('/api/notifications', notificationRoutes);
```

### Step 8: Add Notification Settings Page

Create a settings page or add to existing profile page:

```javascript
import { NotificationSettings } from './components/NotificationSettings';

// In your settings/profile page:
<NotificationSettings />
```

### Step 9: Test the Integration

1. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Open browser:**
   - Go to `http://localhost:3000`
   - Login or continue as guest
   - You should see a notification permission prompt after 5 seconds

3. **Enable notifications:**
   - Click "Enable Notifications"
   - Allow browser permission
   - Check browser console for "✅ OneSignal initialized successfully"

4. **Test sending notification:**
   - Go to notification settings page
   - Click "Send Test Notification"
   - You should receive a browser notification

## 🎯 How to Use in Your Code

### Send Notification When Achievement Unlocked

```javascript
// In your achievement unlock code
import notificationService from '../services/notificationService';

// After unlocking achievement
await notificationService.notifyAchievement(userId, {
  id: 'first-lesson',
  title: 'First Steps',
  xpReward: 50
});
```

### Send Notification on Level Up

```javascript
// In your XP service when level increases
await notificationService.notifyLevelUp(userId, newLevel);
```

### Send Daily Reminder

```javascript
// In a scheduled job (cron)
await notificationService.notifyDailyReminder(userId);
```

### Send to All Users

```javascript
// Announce new lesson
await notificationService.notifyNewLesson('Advanced SQL Joins');
```

## 📱 Notification Types Available

### 1. Achievement Unlocked
```javascript
notificationService.notifyAchievement(userId, achievement);
```

### 2. Level Up
```javascript
notificationService.notifyLevelUp(userId, newLevel);
```

### 3. Streak Reminder
```javascript
notificationService.notifyStreakReminder(userId, currentStreak);
```

### 4. Streak Broken
```javascript
notificationService.notifyStreakBroken(userId, lostStreak);
```

### 5. Daily Reminder
```javascript
notificationService.notifyDailyReminder(userId);
```

### 6. New Lesson
```javascript
notificationService.notifyNewLesson(lessonTitle);
```

### 7. Lesson Complete
```javascript
notificationService.notifyLessonComplete(userId, lessonTitle, xpEarned);
```

### 8. Challenge Invite
```javascript
notificationService.notifyChallengeInvite(userId, challengeName);
```

## 🔧 Integration Examples

### Example 1: Send Notification on Lesson Complete

In your lesson completion handler:

```javascript
// frontend/src/hooks/useXPSystem.js
const completeLesson = async (lessonId, score, timeSpent, attempts) => {
  // ... existing code ...
  
  // Send notification
  try {
    await api.post('/notifications/achievement', {
      achievement: {
        id: 'lesson-complete',
        title: 'Lesson Complete!',
        xpReward: totalXP
      }
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};
```

### Example 2: Automatic Streak Reminders

Create a cron job in backend:

```javascript
// backend/jobs/streakReminders.js
const cron = require('node-cron');
const notificationService = require('../services/notificationService');
const UserStats = require('../models/UserStats');

// Run every day at 6 PM
cron.schedule('0 18 * * *', async () => {
  console.log('Sending streak reminders...');
  
  const users = await UserStats.find({ currentStreak: { $gt: 0 } });
  
  for (const user of users) {
    // Check if user hasn't completed lesson today
    const lastActivity = new Date(user.lastActivity);
    const today = new Date();
    
    if (lastActivity.toDateString() !== today.toDateString()) {
      await notificationService.notifyStreakReminder(
        user.userId,
        user.currentStreak
      );
    }
  }
});
```

### Example 3: Level Up Notification

In your XP service:

```javascript
// backend/services/xpService.js
async awardXP(userId, amount, reason) {
  // ... existing code ...
  
  // Check for level up
  if (newLevel > oldLevel) {
    await notificationService.notifyLevelUp(userId, newLevel);
  }
  
  return result;
}
```

## 🎨 Customization

### Custom Notification Icon

1. Create a 256x256 PNG icon
2. Upload to OneSignal Dashboard → Settings → Web Push → Default Icon
3. Or specify per notification:

```javascript
await notificationService.sendToUser(userId, {
  title: 'Custom Notification',
  message: 'With custom icon',
  icon: 'https://yourdomain.com/icon.png',
  largeIcon: 'https://yourdomain.com/large-icon.png'
});
```

### Custom Notification Sound

In OneSignal Dashboard:
1. Settings → Web Push → Notification Sound
2. Upload custom sound file (MP3, WAV)
3. Or use default browser sound

### Custom Prompt Timing

Edit `NotificationPrompt.jsx`:

```javascript
// Change delay from 5 seconds to 10 seconds
setTimeout(() => setOpen(true), 10000);

// Or show on specific action
const handleShowPrompt = () => setOpen(true);
```

## 📊 Analytics & Tracking

### View Notification Stats

1. Go to OneSignal Dashboard
2. Click "Delivery" to see:
   - Sent notifications
   - Delivery rate
   - Click-through rate
   - Conversion rate

### Track in Your App

```javascript
// Track notification clicks
OneSignal.on('notificationDisplay', (event) => {
  console.log('Notification displayed:', event);
  // Send to your analytics
});

OneSignal.on('notificationDismiss', (event) => {
  console.log('Notification dismissed:', event);
});
```

## 🐛 Troubleshooting

### Notifications Not Showing

1. **Check browser permissions:**
   - Chrome: Settings → Privacy → Site Settings → Notifications
   - Allow notifications for localhost:3000

2. **Check OneSignal initialization:**
   - Open browser console (F12)
   - Look for "✅ OneSignal initialized successfully"
   - If not, check App ID in .env file

3. **Check subscription:**
   - Console: `OneSignal.isPushNotificationsEnabled()`
   - Should return `true`

4. **Check user ID:**
   - Console: `OneSignal.getUserId()`
   - Should return a UUID

### Backend Errors

1. **Check credentials:**
   - Verify ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in backend/.env
   - Make sure they match OneSignal dashboard

2. **Check API response:**
   - Look at backend console for error messages
   - OneSignal API errors will be logged

3. **Test with curl:**
   ```bash
   curl -X POST https://onesignal.com/api/v1/notifications \
     -H "Content-Type: application/json" \
     -H "Authorization: Basic YOUR_REST_API_KEY" \
     -d '{
       "app_id": "YOUR_APP_ID",
       "included_segments": ["All"],
       "contents": {"en": "Test notification"}
     }'
   ```

### HTTPS Required for Production

OneSignal requires HTTPS in production. For localhost, it works with HTTP.

For production:
1. Get SSL certificate (Let's Encrypt, Cloudflare)
2. Update Site URL in OneSignal to HTTPS
3. Deploy with HTTPS enabled

## ✅ Testing Checklist

- [ ] OneSignal account created
- [ ] App ID and REST API Key obtained
- [ ] Environment variables added
- [ ] Dependencies installed (`react-onesignal`)
- [ ] OneSignalInit component added to App.js
- [ ] NotificationPrompt component added
- [ ] Backend routes added
- [ ] Browser permission granted
- [ ] Test notification received
- [ ] User ID set correctly
- [ ] Notifications working on achievement unlock
- [ ] Notifications working on level up

## 🚀 Production Deployment

### Before Going Live:

1. **Update Site URL:**
   - OneSignal Dashboard → Settings → Web Push
   - Change from `http://localhost:3000` to `https://yourdomain.com`

2. **Update Environment Variables:**
   - Production .env files with real credentials
   - Never commit .env files to git

3. **Test on Production:**
   - Deploy to production
   - Test notification flow
   - Verify HTTPS is working

4. **Set up Scheduled Jobs:**
   - Daily reminders
   - Streak alerts
   - Weekly summaries

## 📚 Additional Resources

- OneSignal Docs: https://documentation.onesignal.com/
- React OneSignal: https://github.com/OneSignal/react-onesignal
- Web Push API: https://documentation.onesignal.com/docs/web-push-quickstart

## 🎉 You're Done!

Your push notification system is now ready! Users will receive notifications for:
- ✅ Achievement unlocks
- ✅ Level ups
- ✅ Streak reminders
- ✅ Daily learning reminders
- ✅ New content announcements

Test it out and watch user engagement increase! 🚀
