# MongoDB Setup Guide

Your SQL-Flow application is currently running without MongoDB. Here are your options to get the database working:

## Option 1: Fix MongoDB Atlas Connection (Recommended)

### Check Your Atlas Connection:
1. **Verify your MongoDB Atlas cluster is running**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Check if your cluster is active

2. **Update Network Access**
   - In Atlas, go to "Network Access"
   - Add your current IP address or use `0.0.0.0/0` for testing

3. **Verify Database User**
   - Go to "Database Access"
   - Ensure user `shamsmohd567` exists with proper permissions

4. **Test Connection String**
   - Your current connection string: `mongodb+srv://shamsmohd567:shamsmohd567@sqluser.ycrlrlx.mongodb.net/sqlflow`

## Option 2: Install Local MongoDB

### Windows:
```bash
# Download and install MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Or use Chocolatey
choco install mongodb

# Start MongoDB service
net start MongoDB
```

### Using Docker (Easiest):
```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or with persistent data
docker run -d -p 27017:27017 -v mongodb_data:/data/db --name mongodb mongo:latest
```

## Option 3: Use MongoDB Atlas Free Tier

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Add your IP to network access
6. Get the connection string
7. Update your `.env` file

## Current Status

✅ **Working Features (No Database Required):**
- SQL Lessons and tutorials
- SQL query execution and validation
- Interactive SQL workspace
- Lesson content and exercises

❌ **Limited Features (Require Database):**
- User authentication and profiles
- Progress tracking
- Achievement system
- Analytics and statistics

## Quick Test

To test if your MongoDB connection is working:

```bash
# In your backend directory
npm run test-db
```

Or visit: `http://localhost:5000/api/health`

## Need Help?

If you're still having issues:
1. Check your internet connection
2. Verify MongoDB Atlas cluster status
3. Try the local MongoDB option
4. Contact support with the error messages

Your application will work perfectly for learning SQL even without MongoDB!