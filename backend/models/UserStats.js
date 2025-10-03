const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  totalLessonsCompleted: {
    type: Number,
    default: 0
  },
  totalPracticeCompleted: {
    type: Number,
    default: 0
  },
  totalQuizzesCompleted: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate level from XP
userStatsSchema.methods.calculateLevel = function() {
  // Level formula: level = floor(sqrt(XP / 100)) + 1
  this.level = Math.floor(Math.sqrt(this.totalXP / 100)) + 1;
  return this.level;
};

// Get XP needed for next level
userStatsSchema.methods.getXPForNextLevel = function() {
  const nextLevel = this.level + 1;
  return (nextLevel - 1) * (nextLevel - 1) * 100;
};

// Get current level progress
userStatsSchema.methods.getLevelProgress = function() {
  const currentLevelXP = (this.level - 1) * (this.level - 1) * 100;
  const nextLevelXP = this.getXPForNextLevel();
  const xpInCurrentLevel = this.totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  
  return {
    level: this.level,
    currentXP: this.totalXP,
    xpInCurrentLevel,
    xpNeededForLevel,
    xpToNextLevel: nextLevelXP - this.totalXP,
    progress: (xpInCurrentLevel / xpNeededForLevel) * 100
  };
};

module.exports = mongoose.model('UserStats', userStatsSchema);
