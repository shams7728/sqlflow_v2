# SQL-Flow Deployment Guide

## 📋 Overview
This guide will help you deploy SQL-Flow to:
- **GitHub**: Version control and source repository
- **Render**: Backend API deployment
- **Vercel**: Frontend deployment

---

## 🚀 Step 1: Prepare for GitHub

### 1.1 Check .gitignore
Ensure sensitive files are excluded:

```bash
# Check if .gitignore exists and has proper entries
cat .gitignore
```

### 1.2 Remove Sensitive Data
Before pushing to GitHub, ensure no sensitive data is committed:

```bash
# Check for sensitive files
git status

# If .env files are tracked, remove them
git rm --cached backend/.env
git rm --cached frontend/.env
```

### 1.3 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `sqlflow` (or your preferred name)
3. Description: "AI-Powered SQL Learning Platform"
4. Choose: Public or Private
5. **Don't** initialize with README (you already have one)
6. Click "Create repository"

### 1.4 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SQL-Flow learning platform"

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sqlflow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Prepare Backend for Render

### 2.1 Create render.yaml

This file tells Render how to deploy your backend.

**File**: `render.yaml` (in project root)

```yaml
services:
  - type: web
    name: sqlflow-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: FORMSPREE_ENDPOINT
        sync: false
      - key: ONESIGNAL_APP_ID
        sync: false
      - key: ONESIGNAL_REST_API_KEY
        sync: false
```

### 2.2 Update backend/package.json

Add engines and scripts:

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2.3 Update CORS in backend/server.js

```javascript
// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app', // Add your Vercel URL
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

---

## 🎨 Step 3: Prepare Frontend for Vercel

### 3.1 Create vercel.json

**File**: `frontend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_ONESIGNAL_APP_ID": "@react_app_onesignal_app_id"
  }
}
```

### 3.2 Update frontend/package.json

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "vercel-build": "react-scripts build"
  }
}
```

### 3.3 Create .env.production

**File**: `frontend/.env.production`

```env
# Production environment variables
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_ONESIGNAL_APP_ID=your-onesignal-app-id
GENERATE_SOURCEMAP=false
```

---

## 📦 Step 4: Deploy to Render (Backend)

### 4.1 Sign Up / Login
1. Go to https://render.com
2. Sign up or login with GitHub

### 4.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `sqlflow` repository

### 4.3 Configure Service
- **Name**: `sqlflow-backend`
- **Region**: Oregon (US West)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free

### 4.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_string_here
FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_REST_API_KEY=your-onesignal-api-key
FRONTEND_URL=https://your-app.vercel.app
```

### 4.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://sqlflow-backend.onrender.com`

---

## 🌐 Step 5: Deploy to Vercel (Frontend)

### 5.1 Sign Up / Login
1. Go to https://vercel.com
2. Sign up or login with GitHub

### 5.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select `sqlflow`

### 5.3 Configure Project
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 5.4 Add Environment Variables
Click "Environment Variables":

```
REACT_APP_API_URL=https://sqlflow-backend.onrender.com/api
REACT_APP_ONESIGNAL_APP_ID=16212e41-c716-4439-ae0a-676a8be6911e
GENERATE_SOURCEMAP=false
```

### 5.5 Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

---

## 🔄 Step 6: Update Backend CORS

After getting your Vercel URL, update backend CORS:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. Save and redeploy

---

## ✅ Step 7: Verify Deployment

### 7.1 Test Backend
```bash
curl https://sqlflow-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-04T...",
  "services": {
    "server": "running",
    "mongodb": "connected",
    "lessons": "available",
    "sqlExecution": "available"
  }
}
```

### 7.2 Test Frontend
1. Visit your Vercel URL
2. Try logging in
3. Complete a lesson
4. Check if progress saves
5. Test all major features

---

## 🔐 Step 8: Security Checklist

- [ ] All `.env` files in `.gitignore`
- [ ] MongoDB connection string secure
- [ ] JWT secret is strong and random
- [ ] CORS configured with specific origins
- [ ] API keys not exposed in frontend code
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

---

## 📊 Step 9: Monitoring

### Render Monitoring
- View logs: Render Dashboard → Your Service → Logs
- Check metrics: CPU, Memory, Response time
- Set up alerts for downtime

### Vercel Monitoring
- View analytics: Vercel Dashboard → Your Project → Analytics
- Check build logs for errors
- Monitor performance metrics

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
```bash
# Check logs in Render dashboard
# Common issues:
- Missing environment variables
- MongoDB connection failed
- Port already in use
```

**Solution**:
1. Verify all environment variables are set
2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for Render)
3. Ensure PORT is set to 5000

### Frontend Issues

**Problem**: API calls failing
```bash
# Check browser console
# Common issues:
- CORS errors
- Wrong API URL
- Backend not running
```

**Solution**:
1. Verify REACT_APP_API_URL is correct
2. Check backend CORS configuration
3. Ensure backend is deployed and running

### Database Issues

**Problem**: MongoDB connection timeout
```bash
# Check MongoDB Atlas
# Common issues:
- IP whitelist too restrictive
- Wrong connection string
- Network access not configured
```

**Solution**:
1. MongoDB Atlas → Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
2. Verify connection string format
3. Check database user permissions

---

## 🔄 Continuous Deployment

### Automatic Deployments
Both Render and Vercel support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build**:
   - Render detects changes and rebuilds backend
   - Vercel detects changes and rebuilds frontend

3. **Live in Minutes**:
   - Changes go live automatically
   - No manual deployment needed

---

## 📝 Post-Deployment Tasks

1. **Update README** with live URLs
2. **Test all features** in production
3. **Set up monitoring** and alerts
4. **Configure custom domain** (optional)
5. **Enable analytics** for usage tracking
6. **Set up backup** for MongoDB
7. **Document API endpoints**
8. **Create user documentation**

---

## 🎉 Success!

Your SQL-Flow app is now live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://sqlflow-backend.onrender.com
- **GitHub**: https://github.com/YOUR_USERNAME/sqlflow

Share your app with users and start teaching SQL! 🚀

---

## 📞 Support

If you encounter issues:
1. Check Render/Vercel logs
2. Review this guide
3. Check GitHub Issues
4. Contact support

**Happy Deploying! 🎊**
