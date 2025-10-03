const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
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
  exercisesCompleted: [{
    type: String
  }],
  quizScore: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  firstCompletedAt: {
    type: Date,
    default: null
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Index for sorting by last accessed
progressSchema.index({ userId: 1, lastAccessedAt: -1 });

module.exports = mongoose.model('Progress', progressSchema);
