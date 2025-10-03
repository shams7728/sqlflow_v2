# ✅ OneSignal Integration Checklist

## 📋 Setup Checklist

### Phase 1: OneSignal Account Setup
- [ ] Go to https://onesignal.com/
- [ ] Create free account
- [ ] Create new app (Web Push)
- [ ] Name it "SQLFlow"
- [ ] Copy App ID
- [ ] Copy REST API Key
- [ ] Configure site URL (http://localhost:3000)
- [ ] Upload notification icon (optional)

### Phase 2: Install Dependencies
- [ ] Open terminal in frontend folder
- [ ] Run: `npm install react-onesignal`
- [ ] Wait for installation to complete
- [ ] Check package.json for react-onesignal

### Phase 3: Environment Variables
- [ ] Open `frontend/.env`
- [ ] Add: `REACT_APP_ONESIGNAL_APP_ID=your-app-id`
- [ ] Save file
- [ ] Open `backend/.env`
- [ ] Add: `ONESIGNAL_APP_ID=your-app-id`
- [ ] Add: `ONESIGNAL_REST_API_KEY=your-api-key`
- [ ] Save file
- [ ] Verify no spaces or quotes around values

### Phase 4: Frontend Integration
- [ ] Open `frontend/src/App.js`
- [ ] Add import: `import { OneSignalInit } from './components/OneSignalInit';`
- [ ] Add import: `import { NotificationPrompt } from './components/NotificationPrompt';`
- [ ] Add `<OneSignalInit />` component
- [ ] Add `<NotificationPrompt />` component
- [ ] Save file

### Phase 5: Backend Integration
- [ ] Open `backend/server.js`
- [ ] Add: `app.use('/api/notifications', require('./routes/notifications'));`
- [ ] Save file

### Phase 6: Testing
- [ ] Stop all running servers
- [ ] Start backend: `cd backend && npm start`
- [ ] Start frontend: `cd frontend && npm start`
- [ ] Open browser to http://localhost:3000
- [ ] Check console for "✅ OneSignal initialized successfully"
- [ ] Wait 5 seconds for permission prompt
- [ ] Click "Enable Notifications"
- [ ] Allow browser permission
- [ ] Check console for subscription confirmation

### Phase 7: Send Test Notification
- [ ] Go to notification settings page
- [ ] Click "Send Test Notification"
- [ ] Check browser for notification
- [ ] Verify notification appears
- [ ] Click notification to test URL

### Phase 8: Integration with Features
- [ ] Add notification to achievement unlock
- [ ] Add notification to level up
- [ ] Add notification to lesson complete
- [ ] Add notification to streak reminder
- [ ] Test each notification type

## 🔍 Verification Checklist

### OneSignal Dashboard
- [ ] App created and active
- [ ] Web Push platform configured
- [ ] Site URL set correctly
- [ ] Icon uploaded (optional)
- [ ] App ID visible
- [ ] REST API Key visible

### Frontend
- [ ] react-onesignal installed
- [ ] Environment variable set
- [ ] OneSignalInit component added
- [ ] NotificationPrompt component added
- [ ] No console errors
- [ ] Initialization message appears

### Backend
- [ ] Environment variables set
- [ ] Notification routes added
- [ ] notificationService.js exists
- [ ] No startup errors
- [ ] Can send test notification

### Browser
- [ ] Permission granted
- [ ] Subscription active
- [ ] User ID generated
- [ ] Test notification received
- [ ] Notification clickable

## 🐛 Troubleshooting Checklist

### If Notifications Don't Show
- [ ] Check browser allows notifications
- [ ] Check App ID is correct
- [ ] Check no typos in .env files
- [ ] Check console for errors
- [ ] Check OneSignal dashboard for errors
- [ ] Try different browser
- [ ] Clear browser cache
- [ ] Restart servers

### If Backend Fails
- [ ] Check REST API Key is correct
- [ ] Check backend .env file loaded
- [ ] Check notification routes added
- [ ] Check backend console for errors
- [ ] Test with curl command
- [ ] Verify OneSignal API is accessible

### If Permission Not Requested
- [ ] Check OneSignalInit component added
- [ ] Check NotificationPrompt component added
- [ ] Check 5-second delay passed
- [ ] Check not dismissed before
- [ ] Clear localStorage
- [ ] Refresh page

## 📊 Success Indicators

### You'll Know It's Working When:
- [ ] ✅ Console shows "OneSignal initialized successfully"
- [ ] ✅ Permission prompt appears after 5 seconds
- [ ] ✅ Browser shows notification permission dialog
- [ ] ✅ After allowing, subscription is active
- [ ] ✅ Test notification appears in browser
- [ ] ✅ Clicking notification opens correct URL
- [ ] ✅ Settings page shows "Notifications Enabled"
- [ ] ✅ User ID is displayed in settings
- [ ] ✅ Backend can send notifications without errors

## 🎯 Integration Checklist

### Add Notifications To:
- [ ] Achievement unlock handler
- [ ] Level up calculation
- [ ] Lesson completion
- [ ] Quiz completion
- [ ] Practice completion
- [ ] Streak update
- [ ] Daily reminder (cron job)
- [ ] New lesson announcement

### Test Each Notification:
- [ ] Achievement notification works
- [ ] Level up notification works
- [ ] Lesson complete notification works
- [ ] Streak reminder notification works
- [ ] Daily reminder notification works
- [ ] New lesson notification works
- [ ] Custom notification works
- [ ] Broadcast notification works

## 📱 Production Checklist

### Before Going Live:
- [ ] Update Site URL to production domain (HTTPS)
- [ ] Test on production environment
- [ ] Verify HTTPS is working
- [ ] Test notifications on production
- [ ] Set up monitoring
- [ ] Configure notification schedule
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Set up analytics tracking
- [ ] Document for team

## ✅ Final Verification

### Everything Working:
- [ ] Users can enable notifications
- [ ] Users can disable notifications
- [ ] Notifications appear correctly
- [ ] Notifications are clickable
- [ ] URLs open correctly
- [ ] Icons display properly
- [ ] Messages are clear
- [ ] No console errors
- [ ] No backend errors
- [ ] Analytics tracking works

---

## 🎉 Completion

When all checkboxes are checked, your OneSignal integration is complete!

**Estimated Time:** 15-30 minutes for complete setup and testing

**Next Steps:**
1. Monitor notification delivery rates
2. Adjust notification timing
3. A/B test notification messages
4. Gather user feedback
5. Optimize engagement

---

**Need Help?** See `ONESIGNAL_SETUP_COMPLETE.md` for detailed instructions.
