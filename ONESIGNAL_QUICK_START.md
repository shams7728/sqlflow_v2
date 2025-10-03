# 🔔 OneSignal Quick Start - 5 Minutes Setup

## ⚡ Super Quick Setup

### 1. Create OneSignal Account (2 min)

```
1. Go to https://onesignal.com/
2. Sign up → New App → Web Push
3. Name: "SQLFlow"
4. Get App ID and REST API Key
```

### 2. Install Package (30 sec)

```bash
cd frontend
npm install react-onesignal
```

### 3. Add Environment Variables (30 sec)

**frontend/.env:**

```
REACT_APP_ONESIGNAL_APP_ID=your-app-id
```

**backend/.env:**

```
ONESIGNAL_APP_ID=your-app-id
ONESIGNAL_REST_API_KEY=your-api-key
```

### 4. Add to App.js (1 min)

```javascript
// Add imports at top
import { OneSignalInit } from './components/OneSignalInit';
import { NotificationPrompt } from './components/NotificationPrompt';

// Add inside your App component (after providers)
<OneSignalInit />
<NotificationPrompt />
```

### 5. Add Backend Route (30 sec)

In `backend/server.js`:

```javascript
// Add with other routes
app.use("/api/notifications", require("./routes/notifications"));
```

### 6. Test It! (30 sec)

```bash
# Start servers
npm start

# Open browser → Allow notifications
# Should see: "✅ OneSignal initialized successfully"
```

## 🎯 Send Your First Notification

```javascript
// In your code
import notificationService from "../services/notificationService";

await notificationService.notifyAchievement(userId, {
  id: "test",
  title: "Test Achievement",
  xpReward: 50,
});
```

## 📁 Files Created

All files are ready to use:

- ✅ `frontend/src/services/oneSignalService.js`
- ✅ `frontend/src/components/OneSignalInit.jsx`
- ✅ `frontend/src/components/NotificationPrompt.jsx`
- ✅ `frontend/src/components/NotificationSettings.jsx`
- ✅ `backend/services/notificationService.js`
- ✅ `backend/routes/notifications.js`

## 🚀 Ready to Use!

See `ONESIGNAL_SETUP_COMPLETE.md` for detailed guide.

---

**Total Setup Time: ~5 minutes** ⏱️
