# 📊 How to View User Signup/Signin Data

## 🗄️ Database Location

All user data is stored in **MongoDB** in the `sqlflow` database.

## 🔍 Method 1: MongoDB Compass (Recommended - GUI)

### Step 1: Download MongoDB Compass
If you don't have it:
- Download from: https://www.mongodb.com/try/download/compass
- Or use the version that came with MongoDB

### Step 2: Connect to Your Database
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"

### Step 3: View User Data
1. Select database: `sqlflow`
2. Click on collections:
   - **`users`** - User accounts (email, password, name)
   - **`userstats`** - XP, levels, streaks
   - **`achievements`** - Unlocked achievements
   - **`progress`** - Lesson progress

### What You'll See in Each Collection:

#### `users` Collection
```json
{
  "_id": "ObjectId(...)",
  "email": "user@example.com",
  "password": "$2a$10$...", // Hashed password
  "name": "John Doe",
  "isGuest": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### `userstats` Collection
```json
{
  "_id": "ObjectId(...)",
  "userId": "user-id-here",
  "totalXP": 350,
  "level": 3,
  "currentStreak": 5,
  "longestStreak": 10,
  "lessonsCompleted": 8,
  "practiceCompleted": 12,
  "quizzesCompleted": 5,
  "lastActivity": "2024-01-15T10:30:00.000Z"
}
```

## 🖥️ Method 2: MongoDB Shell (Command Line)

### Step 1: Open MongoDB Shell
```bash
# Windows
mongosh

# Or if mongosh is not in PATH:
"C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe"
```

### Step 2: Select Database
```javascript
use sqlflow
```

### Step 3: View Collections
```javascript
// List all collections
show collections

// View all users
db.users.find().pretty()

// Count users
db.users.countDocuments()

// Find specific user by email
db.users.findOne({ email: "user@example.com" })

// View user stats
db.userstats.find().pretty()

// View achievements
db.achievements.find().pretty()

// View progress
db.progress.find().pretty()
```

### Useful Queries:

```javascript
// Get all users with their email and name
db.users.find({}, { email: 1, name: 1, createdAt: 1 })

// Get users created today
db.users.find({ 
  createdAt: { 
    $gte: new Date(new Date().setHours(0,0,0,0)) 
  }
})

// Get user with highest XP
db.userstats.find().sort({ totalXP: -1 }).limit(1)

// Get all users with their stats
db.users.aggregate([
  {
    $lookup: {
      from: "userstats",
      localField: "_id",
      foreignField: "userId",
      as: "stats"
    }
  }
])
```

## 🛠️ Method 3: Create a Script to View Data

I'll create a script for you:

