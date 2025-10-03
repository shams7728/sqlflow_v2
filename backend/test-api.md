# API Testing Guide

## Prerequisites
1. Make sure backend server is running: `cd backend && npm start`
2. Make sure MongoDB is connected
3. Use these commands in a terminal or Postman

## Test User ID
For testing, use: `test-user-123` or `guest`

---

## 1. Test Progress Update (Awards XP)

### Complete a Lesson
```bash
curl -X POST http://localhost:5000/api/progress/update \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "lessonId": "select-basics",
    "status": "completed",
    "score": 100,
    "maxScore": 100,
    "timeSpent": 300,
    "exercisesCompleted": ["ex1", "ex2"],
    "quizScore": 90
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": { /* progress data */ },
  "xp": {
    "success": true,
    "xpAwarded": 100,
    "totalXP": 100,
    "leveledUp": false,
    "newLevel": 1
  },
  "achievements": [
    {
      "title": "First Steps",
      "description": "Complete your first lesson",
      "xp": 50
    }
  ]
}
```

---

## 2. Test Get User Stats

```bash
curl http://localhost:5000/api/progress/stats/test-user-123 \
  -H "x-user-id: test-user-123"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalXP": 150,
    "level": {
      "level": 1,
      "currentXP": 150,
      "xpToNextLevel": 50
    },
    "currentStreak": 1,
    "completedLessons": 1,
    "totalTimeSpent": 300
  }
}
```

---

## 3. Test Get Achievements

```bash
curl http://localhost:5000/api/achievements/user/test-user-123 \
  -H "x-user-id: test-user-123"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "achievementId": "first_lesson",
        "title": "First Steps",
        "description": "Complete your first lesson",
        "xp": 50,
        "earnedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalPoints": 10,
    "level": {
      "level": 1,
      "currentXP": 150
    }
  }
}
```

---

## 4. Test Bookmark

```bash
curl -X POST http://localhost:5000/api/progress/bookmark/select-basics \
  -H "x-user-id: test-user-123"
```

---

## 5. Test Get All Progress

```bash
curl http://localhost:5000/api/progress/user/test-user-123 \
  -H "x-user-id: test-user-123"
```

---

## Testing Scenarios

### Scenario 1: New User Completes First Lesson
1. Update progress with status="completed", score=100
2. Check stats - should show XP=100 + 50 (perfect score) + 25 (first try) = 175 XP
3. Check achievements - should have "First Steps" achievement
4. Total XP should be 175 + 50 (achievement) = 225 XP

### Scenario 2: User Completes 5 Lessons
1. Complete 5 different lessons
2. Check achievements - should unlock "Getting Started" (5 lessons)
3. Total XP should include lesson XP + achievement XP

### Scenario 3: User Gets Perfect Score
1. Complete lesson with score=100
2. Should get bonus 50 XP
3. Should unlock "Perfectionist" achievement (+75 XP)

### Scenario 4: Practice Exercises
1. Update progress with exercisesCompleted=["ex1", "ex2", "ex3"]
2. Should get 50 XP per exercise = 150 XP
3. After 20 exercises total, should unlock "Practice Master" achievement

---

## Quick Test Commands

### Windows PowerShell:
```powershell
# Test progress update
Invoke-RestMethod -Uri "http://localhost:5000/api/progress/update" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "x-user-id"="test-user-123"} `
  -Body '{"lessonId":"test-1","status":"completed","score":100,"maxScore":100}'

# Test get stats
Invoke-RestMethod -Uri "http://localhost:5000/api/progress/stats/test-user-123" `
  -Headers @{"x-user-id"="test-user-123"}
```

---

## Verify in MongoDB

Connect to MongoDB and check:

```javascript
// Check user stats
db.userstats.find({ userId: "test-user-123" })

// Check achievements
db.achievements.find({ userId: "test-user-123" })

// Check progress
db.progresses.find({ userId: "test-user-123" })
```

---

## Expected XP Flow

1. **Complete Lesson**: 100 XP
2. **Perfect Score Bonus**: +50 XP
3. **First Try Bonus**: +25 XP
4. **Achievement Unlocked**: +50 XP (First Steps)
5. **Total**: 225 XP → Level 2

Level progression:
- Level 1: 0-99 XP
- Level 2: 100-399 XP
- Level 3: 400-899 XP
- Level 4: 900-1599 XP
