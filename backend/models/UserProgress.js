const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  lessonId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'mastered'],
    default: 'not_started'
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  maxScore: {
    type: Number,
    default: 100
  },
  timeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  attempts: {
    type: Number,
    default: 0
  },
  exercisesCompleted: {
    type: [String],
    default: []
  },
  quizScore: {
    type: Number,
    default: 0
  },
  firstCompletedAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Instance methods
userProgressSchema.methods.updateProgress = function(updateData) {
  Object.assign(this, updateData);
  this.lastAccessedAt = new Date();
  
  // Set first completion date if completing for the first time
  if (updateData.status === 'completed' && !this.firstCompletedAt) {
    this.firstCompletedAt = new Date();
  }
  
  return this.save();
};

userProgressSchema.methods.addTimeSpent = function(seconds) {
  this.timeSpent += seconds;
  this.lastAccessedAt = new Date();
  return this.save();
};

userProgressSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Static methods
userProgressSchema.statics.getUserProgress = function(userId) {
  return this.find({ userId }).sort({ lastAccessedAt: -1 });
};

userProgressSchema.statics.getLessonProgress = function(userId, lessonId) {
  return this.findOne({ userId, lessonId });
};

userProgressSchema.statics.getCompletedLessons = function(userId) {
  return this.find({ 
    userId, 
    status: { $in: ['completed', 'mastered'] } 
  }).sort({ firstCompletedAt: -1 });
};

userProgressSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalLessons: { $sum: 1 },
        completedLessons: {
          $sum: {
            $cond: [
              { $in: ['$status', ['completed', 'mastered']] },
              1,
              0
            ]
          }
        },
        totalTimeSpent: { $sum: '$timeSpent' },
        averageScore: { $avg: '$score' },
        totalAttempts: { $sum: '$attempts' }
      }
    }
  ]);
};

module.exports = mongoose.model('UserProgress', userProgressSchema);