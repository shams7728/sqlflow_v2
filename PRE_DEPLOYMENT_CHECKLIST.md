# Pre-Deployment Checklist ✅

## Before Pushing to GitHub

### 1. Security Check
- [ ] `.env` files are in `.gitignore`
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No sensitive data committed
- [ ] JWT secret is strong (32+ characters)

### 2. Code Quality
- [ ] No console.errors in production code
- [ ] All TypeScript errors fixed
- [ ] No unused imports
- [ ] Code is formatted consistently
- [ ] Comments are clear and helpful

### 3. Environment Variables
- [ ] `backend/.env` has all required variables
- [ ] `frontend/.env` has all required variables
- [ ] `.env.production` created for frontend
- [ ] All secrets are secure

### 4. Dependencies
- [ ] `npm install` works in backend
- [ ] `npm install` works in frontend
- [ ] No security vulnerabilities (`npm audit`)
- [ ] All dependencies are necessary

### 5. Build Test
- [ ] Backend starts: `cd backend && npm start`
- [ ] Frontend builds: `cd frontend && npm run build`
- [ ] No build errors
- [ ] Build output is correct

---

## Before Deploying to Render

### 1. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created with password
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] Connection string copied

### 2. Backend Configuration
- [ ] `render.yaml` file created
- [ ] `backend/package.json` has start script
- [ ] CORS configured for production
- [ ] Environment variables documented
- [ ] Health check endpoint works

### 3. API Keys
- [ ] Formspree form created and ID copied
- [ ] OneSignal app created and keys copied
- [ ] JWT secret generated (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

---

## Before Deploying to Vercel

### 1. Frontend Configuration
- [ ] `frontend/vercel.json` created
- [ ] `frontend/.env.production` created
- [ ] Build command is correct
- [ ] Output directory is `build`
- [ ] All routes work with SPA routing

### 2. API Integration
- [ ] API URL will be updated after Render deployment
- [ ] CORS will allow Vercel domain
- [ ] All API endpoints tested
- [ ] Error handling is robust

### 3. Assets
- [ ] All images optimized
- [ ] Favicon exists
- [ ] Manifest.json configured
- [ ] No broken links

---

## After Deployment

### 1. Backend Verification
- [ ] Health endpoint responds: `/api/health`
- [ ] Lessons endpoint works: `/api/lessons`
- [ ] MongoDB connection successful
- [ ] Logs show no errors

### 2. Frontend Verification
- [ ] App loads without errors
- [ ] Login/Register works
- [ ] Lessons load correctly
- [ ] Progress saves
- [ ] Achievements work
- [ ] Dark mode works
- [ ] Mobile responsive

### 3. Integration Testing
- [ ] Frontend connects to backend
- [ ] CORS works correctly
- [ ] API calls succeed
- [ ] Data persists
- [ ] Notifications work

### 4. Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No memory leaks
- [ ] No console errors

### 5. Security
- [ ] HTTPS enabled (automatic)
- [ ] Environment variables secure
- [ ] No sensitive data exposed
- [ ] Rate limiting works
- [ ] Input validation works

---

## Quick Commands

### Check for sensitive data
```bash
# Search for potential secrets
grep -r "password" --exclude-dir=node_modules .
grep -r "secret" --exclude-dir=node_modules .
grep -r "api_key" --exclude-dir=node_modules .
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Locally
```bash
cd backend
npm install
npm start
# Visit http://localhost:5000/api/health
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm start
# Visit http://localhost:3000
```

### Build Frontend
```bash
cd frontend
npm run build
# Check build/ directory
```

### Check for Vulnerabilities
```bash
cd backend && npm audit
cd frontend && npm audit
```

---

## Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_32_character_random_string_here
FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_REST_API_KEY=your-onesignal-rest-api-key
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_ONESIGNAL_APP_ID=your-onesignal-app-id
GENERATE_SOURCEMAP=false
```

---

## Deployment Order

1. ✅ Push to GitHub
2. ✅ Deploy Backend to Render
3. ✅ Copy Backend URL
4. ✅ Deploy Frontend to Vercel (with Backend URL)
5. ✅ Copy Frontend URL
6. ✅ Update Backend CORS with Frontend URL
7. ✅ Test Everything

---

## Troubleshooting

### If Backend Fails
1. Check Render logs
2. Verify environment variables
3. Test MongoDB connection
4. Check for missing dependencies

### If Frontend Fails
1. Check Vercel logs
2. Verify build command
3. Check environment variables
4. Test API URL

### If Connection Fails
1. Check CORS configuration
2. Verify URLs are correct
3. Check network tab in browser
4. Verify backend is running

---

## Ready to Deploy?

If all checkboxes are checked, you're ready! 🚀

Follow the steps in `QUICK_DEPLOY.md` or `DEPLOYMENT_GUIDE.md`

**Good luck! 🎉**
