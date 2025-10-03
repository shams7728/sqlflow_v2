const mongoose = require('mongoose');

const learningAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  lessonsCompleted: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  exercisesSolved: {
    type: Number,
    default: 0
  },
  quizzesTaken: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  errorsEncountered: {
    type: Number,
    default: 0
  },
  aiInteractions: {
    type: Number,
    default: 0
  },
  sessionCount: {
    type: Number,
    default: 0
  },
  averageSessionDuration: {
    type: Number,
    default: 0 // in seconds
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
learningAnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });

// Static methods for analytics queries
learningAnalyticsSchema.statics.getUserAnalytics = function(userId, startDate, endDate) {
  const query = { userId };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  
  return this.find(query).sort({ date: -1 });
};

learningAnalyticsSchema.statics.getDashboardStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalLessons: { $sum: '$lessonsCompleted' },
        totalTimeSpent: { $sum: '$timeSpent' },
        totalExercises: { $sum: '$exercisesSolved' },
        totalQuizzes: { $sum: '$quizzesTaken' },
        averageScore: { $avg: '$averageScore' },
        maxStreak: { $max: '$streakDays' },
        totalSessions: { $sum: '$sessionCount' },
        averageSessionTime: { $avg: '$averageSessionDuration' },
        activeDays: { $sum: { $cond: [{ $gt: ['$timeSpent', 0] }, 1, 0] } }
      }
    }
  ]);
};

learningAnalyticsSchema.statics.getWeeklyProgress = function(userId, weeks = 4) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeks * 7));
  
  return this.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          week: { $week: '$date' },
          year: { $year: '$date' }
        },
        lessonsCompleted: { $sum: '$lessonsCompleted' },
        timeSpent: { $sum: '$timeSpent' },
        averageScore: { $avg: '$averageScore' },
        activeDays: { $sum: { $cond: [{ $gt: ['$timeSpent', 0] }, 1, 0] } }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 }
    }
  ]);
};

learningAnalyticsSchema.statics.getCurrentStreak = function(userId) {
  return this.aggregate([
    {
      $match: {
        userId,
        timeSpent: { $gt: 0 }
      }
    },
    {
      $sort: { date: -1 }
    },
    {
      $group: {
        _id: null,
        dates: { $push: '$date' }
      }
    }
  ]).then(result => {
    if (!result.length || !result[0].dates.length) return 0;
    
    const dates = result[0].dates;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      date.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (date.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  });
};

learningAnalyticsSchema.statics.updateDailyStats = function(userId, updates) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOneAndUpdate(
    { userId, date: today },
    { $inc: updates },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('LearningAnalytics', learningAnalyticsSchema);