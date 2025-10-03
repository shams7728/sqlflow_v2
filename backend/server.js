const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
require('dotenv').config();

// Local services and utils
const lessonService = require('./services/lessonService');
const validationService = require('./services/validationService');
const { getLessonDB } = require('./utils/db');
const { sanitizeQuery } = require('./utils/security');

const app = express();
const PORT = process.env.PORT || 5000;
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT;


// =================== MIDDLEWARE SETUP ===================
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Rate limiting for feedback
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many submissions from this IP. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Sanitize incoming requests
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .trim()
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
});

// =================== DATABASE CONNECTION ===================
async function connectToMongoDB() {
  // Modern MongoDB connection options (Mongoose 8+)
  const connectionOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    // Explicitly disable deprecated options
    bufferCommands: false,
  };

  // Ensure clean connection state
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Try Atlas connection first
  if (process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb+srv')) {
    try {
      console.log('🔄 Attempting MongoDB Atlas connection...');
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      console.log('✅ MongoDB Atlas Connected successfully');
      return true;
    } catch (atlasErr) {
      console.log('⚠️  MongoDB Atlas connection failed:', atlasErr.message);
      // Disconnect on failure to ensure clean state
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  }
  
  // Try local MongoDB as fallback
  if (process.env.MONGO_URI_LOCAL) {
    try {
      console.log('🔄 Attempting local MongoDB connection...');
      await mongoose.connect(process.env.MONGO_URI_LOCAL, connectionOptions);
      console.log('✅ Local MongoDB Connected successfully');
      return true;
    } catch (localErr) {
      console.log('⚠️  Local MongoDB connection failed:', localErr.message);
      // Disconnect on failure to ensure clean state
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  }

  console.log('❌ All MongoDB connections failed');
  console.log('⚠️  Server will continue running without MongoDB (some features may be limited)');
  console.log('💡 To fix this:');
  console.log('   1. Check your internet connection for Atlas');
  console.log('   2. Install and start local MongoDB, or');
  console.log('   3. Update your MongoDB Atlas connection string');
  return false;
}

// Connect to MongoDB with retry logic
let mongoConnected = false;
connectToMongoDB().then(connected => {
  mongoConnected = connected;
}).catch(err => {
  console.error('MongoDB connection error:', err);
  mongoConnected = false;
});

// Retry connection every 30 seconds if not connected
setInterval(async () => {
  if (!mongoConnected && mongoose.connection.readyState !== 1) {
    console.log('🔄 Retrying MongoDB connection...');
    mongoConnected = await connectToMongoDB();
  }
}, 30000);

// Middleware to check MongoDB connection for routes that need it
const requireMongoDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database temporarily unavailable. Please try again later.',
      hint: 'Some features require database connection. Lessons and SQL execution still work!'
    });
  }
  next();
};

// =================== ROUTES ===================

// Auth routes (temporarily allow without MongoDB for development)
app.use('/api/auth', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️  Auth route accessed without MongoDB connection');
  }
  next();
}, require('./routes/auth'));

// Progress routes (require MongoDB)
app.use('/api/progress', requireMongoDB, require('./routes/progress'));

// Achievement routes (require MongoDB)
app.use('/api/achievements', requireMongoDB, require('./routes/achievements'));

// Analytics routes (require MongoDB)
app.use('/api/analytics', requireMongoDB, require('./routes/analytics'));

// Notification routes (require MongoDB)
app.use('/api/notifications', requireMongoDB, require('./routes/notifications'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      server: 'running',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      lessons: 'available',
      sqlExecution: 'available'
    }
  };
  res.json(health);
});

// Get all lessons
app.get('/api/lessons/', (req, res) => {
  try {
    const lessons = lessonService.getAllLessons();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load lessons' });
  }
});

// Validate query
app.post('/api/validate', async (req, res) => {
  try {
    const { lessonId, exerciseId, query } = req.body;
    const result = await validationService.validateSolution(query, lessonId, exerciseId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Execute SQL query
app.post('/api/execute', async (req, res) => {
  try {
    const { lessonId, query } = req.body;
    if (!lessonId || !query) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // Check if this lesson teaches DDL operations
    const isDDLLesson = ['alter-table', 'create-table', 'drop-table', 'data-definition'].includes(lessonId);

    const sanitized = sanitizeQuery(query, isDDLLesson);

    // For DDL operations, use a temporary writable database
    if (isDDLLesson) {
      const { getTempLessonDB, cleanupTempDB } = require('./utils/db');
      const db = getTempLessonDB(lessonId);
      
      db.run(sanitized, function(err) {
        if (err) {
          cleanupTempDB(db);
          return res.json({ success: false, error: err.message });
        }
        
        // Get the updated schema or table info
        db.all("SELECT name, sql FROM sqlite_master WHERE type='table' ORDER BY name", (err2, tables) => {
          cleanupTempDB(db);
          if (err2) {
            return res.json({ success: true, message: 'Operation completed successfully', changes: this.changes });
          }
          res.json({ 
            success: true, 
            message: 'Operation completed successfully', 
            changes: this.changes,
            tables: tables 
          });
        });
      });
    } else {
      const db = getLessonDB(lessonId);
      db.all(sanitized, (err, rows) => {
        db.close();
        if (err) return res.json({ success: false, error: err.message });

        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        res.json({ success: true, data: rows, columns });
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post('/api/submit-feedback', feedbackLimiter, async (req, res) => {
  try {
    // Check if Formspree endpoint is configured
    if (!FORMSPREE_ENDPOINT) {
      console.error('FORMSPREE_ENDPOINT is not configured in .env file');
      return res.status(500).json({
        success: false,
        error: 'Feedback service is not configured. Please contact the administrator.'
      });
    }

    const { name = '', email = '', message, issueType = 'general' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'Anonymous User',
        email: email || 'no-reply@sqlflow.com',
        message: `Type: ${issueType}\nPage: ${req.headers.referer || 'Unknown'}\n\n${message}`
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({
        success: false,
        error: errData.error || 'Failed to send message to Formspree'
      });
    }

    res.json({ success: true, message: '✅ Feedback sent successfully!' });

  } catch (error) {
    console.error('Formspree error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// =================== ERROR HANDLING ===================
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// =================== START SERVER ===================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
