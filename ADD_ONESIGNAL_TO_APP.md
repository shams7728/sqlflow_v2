# 🔔 Add OneSignal to App.js - Manual Steps

## ✅ Credentials Added!

Your OneSignal credentials have been added to:
- ✅ `frontend/.env` - App ID added
- ✅ `backend/.env` - App ID and REST API Key added
- ✅ `react-onesignal` package installed
- ✅ Backend notification route added to `server.js`

## 📝 Final Step: Add Components to App.js

Open `frontend/src/App.js` and make these changes:

### Step 1: Add Imports (at the top with other imports)

```javascript
// Add these two imports after your other component imports
import { OneSignalInit } from './components/OneSignalInit';
import { NotificationPrompt } from './components/NotificationPrompt';
```

### Step 2: Add Components (inside your App component)

Find where your App component returns JSX, and add these two components:

```javascript
function App() {
  return (
    <UnifiedThemeProvider>
      <AccessibilityProvider>
        <ToastProvider>
          {/* ADD THESE TWO LINES */}
          <OneSignalInit />
          <NotificationPrompt />
          
          {/* Rest of your existing code */}
          <Routes>
            {/* Your routes */}
          </Routes>
        </ToastProvider>
      </AccessibilityProvider>
    </UnifiedThemeProvider>
  );
}
```

## 🚀 Test It!

1. **Restart your servers:**
   ```bash
   # Stop both servers (Ctrl+C)
   
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Open browser:**
   - Go to `http://localhost:3000`
   - Open console (F12)
   - Look for: `✅ OneSignal initialized successfully`

3. **Enable notifications:**
   - Wait 5 seconds for permission prompt
   - Click "Enable Notifications"
   - Allow browser permission
   - You should see a welcome notification!

## 🎯 Send Test Notification

Once enabled, you can test by calling the API:

```bash
# Using curl (replace with your user token)
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

Or create a test button in your app:

```javascript
const handleTestNotification = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/notifications/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      }
    });
    const data = await response.json();
    console.log('Test notification sent:', data);
  } catch (error) {
    console.error('Failed to send test:', error);
  }
};
```

## ✅ Success Indicators

You'll know it's working when you see:

1. **Console Messages:**
   ```
   ✅ OneSignal initialized successfully
   Subscription changed: true
   ```

2. **Permission Prompt:**
   - Dialog appears after 5 seconds
   - Shows benefits of enabling notifications

3. **Browser Permission:**
   - Browser asks to allow notifications
   - After allowing, subscription is active

4. **Test Notification:**
   - Appears in browser
   - Shows title and message
   - Clickable

## 🐛 Troubleshooting

### If console shows errors:
- Check App ID in `frontend/.env` is correct
- Make sure no extra spaces or quotes
- Restart frontend server

### If permission prompt doesn't appear:
- Check both components are added to App.js
- Check imports are correct
- Clear browser cache and refresh

### If notifications don't appear:
- Check browser allows notifications
- Check console for errors
- Try in incognito mode
- Try different browser

## 📚 Next Steps

Once working:
1. Add notification to achievement unlocks
2. Add notification to level ups
3. Add notification to lesson completions
4. Set up daily reminders
5. Test on mobile devices

---

**Need Help?** Check `ONESIGNAL_SETUP_COMPLETE.md` for detailed guide.
