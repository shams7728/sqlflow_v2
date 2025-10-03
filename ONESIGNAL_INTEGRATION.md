# 🔔 OneSignal Push Notifications Integration Guide

## 📋 Overview

This guide will help you integrate OneSignal push notifications into your SQLFlow application for:
- Lesson completion reminders
- Achievement unlocks
- Daily streak notifications
- New content alerts
- XP milestones

## 🚀 Step-by-Step Integration

### Step 1: Create OneSignal Account

1. Go to https://onesignal.com/
2. Sign up for a free account
3. Click "New App/Website"
4. Choose "Web Push"
5. Enter your app name: "SQLFlow"

### Step 2: Get Your Credentials

After creating the app, you'll get:
- **App ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **REST API Key**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Save these for later!

### Step 3: Configure Web Push Settings

In OneSignal Dashboard:
1. Go to Settings → Platforms → Web Push
2. Configure:
   - **Site Name**: SQLFlow
   - **Site URL**: `http://localhost:3000` (for development)
   - **Auto Resubscribe**: ON
   - **Default Notification Icon**: Upload your logo
3. Save configuration

### Step 4: Install OneSignal SDK

```bash
cd frontend
npm install react-onesignal
```

### Step 5: Add Environment Variables

Add to `frontend/.env`:
```env
REACT_APP_ONESIGNAL_APP_ID=your-app-id-here
```

Add to `backend/.env`:
```env
ONESIGNAL_APP_ID=your-app-id-here
ONESIGNAL_REST_API_KEY=your-rest-api-key-here
```

## 📁 Implementation Files

I'll create all the necessary files for you now...

