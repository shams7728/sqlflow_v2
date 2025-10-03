# 📊 Complete Guide: View User Signup/Signin Data

## 🎯 Quick Answer

User data is stored in **MongoDB** in the `sqlflow` database with these collections:
- **`users`** - Email, password (hashed), name, signup date
- **`userstats`** - XP, level, streaks, completion counts
- **`achievements`** - Unlocked achievements
- **`progress`** - Lesson progress records

## 🚀 Method 1: Run the Viewer Script (Easiest!)

### View All Data in Terminal
```bash
cd backend
node view-users.js
```

**Output:**
```
📊 USER DATA VIEWER
============================================================
👥 USERS (2 total)
1. User ID: 507f1f77bcf86cd799439011
   Email: john@example.com
   Name: John Doe
   Guest: No
   Created: 1/15/2024, 10:30:00 AM
   Password: ****** (hashed)

📈 USER STATS
1. User: john@example.com
   Level: 3
   Total XP: 350
   Current Streak: 5 days
   Lessons Completed: 8
   ...
```

### Export to JSON File
```bash
cd backend
node export-users.js
```

This creates a file like `user-data-export-1234567890.json` with all data.

## 🖥️ Method 2: MongoDB Compass (GUI)

### Step 1: Install MongoDB Compass
- Download: https://www.mongodb.com/try/download/compass
- Or it's included with MongoDB installation

### Step 2: Connect
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"

### Step 3: Browse Data
1. Select database: **`sqlflow`**
2. Click on collections to view:

#### View Users
- Collection: **`users`**
- You'll see: email, name, password (hashed), createdAt

#### View XP & Stats
- Collection: **`userstats`**
- You'll see: totalXP, level, streaks, completion counts

#### View Achievements
- Collection: **`achievements`**
- You'll see: unlocked achievements with dates

#### View Progress
- Collection: **`progress`**
- You'll see: lesson completion, scores, time spent

## 💻 Method 3: MongoDB Shell

### Open Shell
```bash
mongosh
```

### View Users
```javascript
// Select database
use sqlflow

// View all users
db.users.find().pretty()

// Count users
db.users.countDocuments()

// Find by email
db.users.findOne({ email: "john@example.com" })

// View only email and name
db.users.find({}, { email: 1, name: 1, createdAt: 1 })
```

### View Stats
```javascript
// All user stats
db.userstats.find().pretty()

// User with highest XP
db.userstats.find().sort({ totalXP: -1 }).limit(1)

// Users by level
db.userstats.find().sort({ level: -1 })
```

### View Achievements
```javascript
// All achievements
db.achievements.find().pretty()

// Count achievements per user
db.achievements.aggregate([
  { $group: { _id: "$userId", count: { $sum: 1 } } }
])
```

### View Progress
```javascript
// All progress
db.progress.find().pretty()

// Completed lessons only
db.progress.find({ status: "completed" })

// Progress for specific user
db.progress.find({ userId: "user-id-here" })
```

## 🔍 Method 4: Create API Endpoint

Add this to your backend to view data via browser:

```javascript
// In backend/server.js
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection('users')
      .find({}, { projection: { password: 0 } }) // Hide passwords
      .toArray();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Then visit: `http://localhost:5000/api/admin/users`

## 📋 Common Queries

### Find User by Email
```javascript
db.users.findOne({ email: "user@example.com" })
```

### Get User with Their Stats
```javascript
db.users.aggregate([
  {
    $lookup: {
      from: "userstats",
      localField: "_id",
      foreignField: "userId",
      as: "stats"
    }
  },
  {
    $project: {
      email: 1,
      name: 1,
      stats: 1,
      password: 0 // Hide password
    }
  }
])
```

### Count Users by Date
```javascript
db.users.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } }
])
```

### Top 10 Users by XP
```javascript
db.userstats.find().sort({ totalXP: -1 }).limit(10)
```

### Recent Signups (Last 7 Days)
```javascript
db.users.find({
  createdAt: {
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
})
```

## 🛠️ Useful Commands

### Backup Database
```bash
# Backup entire database
mongodump --db sqlflow --out ./backup

# Restore from backup
mongorestore --db sqlflow ./backup/sqlflow
```

### Export Collection to CSV
```bash
mongoexport --db sqlflow --collection users --type=csv --fields email,name,createdAt --out users.csv
```

### Delete Test Data
```javascript
// Delete test users
db.users.deleteMany({ email: /test/ })

// Delete old progress
db.progress.deleteMany({ 
  createdAt: { $lt: new Date('2024-01-01') }
})
```

## 📊 Data Structure Reference

### Users Collection
```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password": "$2a$10$...", // bcrypt hashed
  "name": "John Doe",
  "isGuest": false,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

### UserStats Collection
```json
{
  "_id": ObjectId("..."),
  "userId": "user-id",
  "totalXP": 350,
  "level": 3,
  "currentStreak": 5,
  "longestStreak": 10,
  "lessonsCompleted": 8,
  "practiceCompleted": 12,
  "quizzesCompleted": 5,
  "lastActivity": ISODate("2024-01-15T10:30:00Z")
}
```

### Achievements Collection
```json
{
  "_id": ObjectId("..."),
  "userId": "user-id",
  "achievementId": "first-lesson",
  "title": "First Steps",
  "description": "Complete your first lesson",
  "rarity": "common",
  "xpReward": 50,
  "earnedAt": ISODate("2024-01-15T10:30:00Z")
}
```

### Progress Collection
```json
{
  "_id": ObjectId("..."),
  "userId": "user-id",
  "lessonId": "select-basics",
  "status": "completed",
  "score": 100,
  "maxScore": 100,
  "timeSpent": 300,
  "attempts": 1,
  "completedAt": ISODate("2024-01-15T10:30:00Z")
}
```

## 🎯 Quick Commands Summary

```bash
# View all data in terminal
cd backend
node view-users.js

# Export to JSON
cd backend
node export-users.js

# MongoDB Shell
mongosh
use sqlflow
db.users.find().pretty()

# MongoDB Compass
# Open GUI → Connect to localhost:27017 → Browse sqlflow database
```

## 🔐 Security Notes

- Passwords are **hashed** with bcrypt (never stored in plain text)
- The export script hides passwords automatically
- Never share exported data publicly
- Use environment variables for sensitive data

## ✅ Checklist

- [ ] MongoDB is running
- [ ] Backend connected to MongoDB
- [ ] Users have signed up
- [ ] Run `node view-users.js` to see data
- [ ] Or use MongoDB Compass for GUI view
- [ ] Check all 4 collections: users, userstats, achievements, progress

---

**Need Help?**
- Check MongoDB is running: `mongosh` should connect
- Check backend logs for connection status
- Run health check: `http://localhost:5000/api/health`
