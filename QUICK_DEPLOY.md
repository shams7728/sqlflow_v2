# Quick Deployment Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub (5 min)

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SQL-Flow platform"

# Create GitHub repo at https://github.com/new
# Then add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sqlflow.git

# Push
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Render (5 min)

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your `sqlflow` repository
5. Configure:
   - Name: `sqlflow-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
   ```
7. Click "Create Web Service"
8. **Copy your backend URL**: `https://sqlflow-backend-xxxx.onrender.com`

### Step 3: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `sqlflow` repository
5. Configure:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://sqlflow-backend-xxxx.onrender.com/api
   REACT_APP_ONESIGNAL_APP_ID=16212e41-c716-4439-ae0a-676a8be6911e
   GENERATE_SOURCEMAP=false
   ```
7. Click "Deploy"
8. **Your app is live!** 🎉

### Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Select your backend service
3. Environment → Add Variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Save (auto-redeploys)

### Step 5: Test Your App

Visit your Vercel URL and test:
- ✅ Login/Register
- ✅ Complete a lesson
- ✅ Check progress
- ✅ View achievements

## 🎊 Done!

Your app is now live and accessible worldwide!

**Frontend**: https://your-app.vercel.app
**Backend**: https://sqlflow-backend-xxxx.onrender.com

---

## 📝 Important Notes

### Free Tier Limitations

**Render Free Tier**:
- Spins down after 15 min of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Vercel Free Tier**:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### MongoDB Atlas

Make sure to:
1. Whitelist Render IPs: `0.0.0.0/0` (all IPs)
2. Create database user with read/write permissions
3. Use connection string with password

### Environment Variables

**Never commit**:
- `.env` files
- API keys
- Database passwords
- JWT secrets

**Always use**:
- Render/Vercel environment variables
- `.gitignore` for sensitive files

---

## 🔄 Update Your App

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment!
# Render and Vercel will auto-deploy
```

---

## 🐛 Common Issues

### Backend won't start
- Check Render logs
- Verify environment variables
- Check MongoDB connection

### Frontend can't connect to backend
- Verify REACT_APP_API_URL
- Check CORS configuration
- Ensure backend is running

### MongoDB connection failed
- Whitelist 0.0.0.0/0 in Atlas
- Check connection string
- Verify database user permissions

---

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain in Vercel
2. **Monitoring**: Set up error tracking
3. **Analytics**: Add Google Analytics
4. **SEO**: Optimize meta tags
5. **Performance**: Enable caching
6. **Backup**: Set up MongoDB backups

---

**Need help?** Check DEPLOYMENT_GUIDE.md for detailed instructions!
