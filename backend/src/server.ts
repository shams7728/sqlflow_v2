import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';

// Import existing services (keeping compatibility)
const lessonService = require('../services/lessonService');
const validationService = require('../services/validationService');
const { getLessonDB } = require('../utils/db');
const { sanitizeQuery } = require('../utils/security');

// Import new GraphQL resolvers
import { resolvers } from './resolvers';
import { createContext } from './context';

require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.TS_PORT || 5001;
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
        req.query[key] = (req.query[key] as string).trim();
      }
    });
  }

  next();
});

// =================== DATABASE CONNECTION ===================
mongoose.connect(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =================== GRAPHQL SETUP ===================
async function setupGraphQL() {
  const typeDefs = readFileSync(join(__dirname, 'graphql', 'schema.graphql'), 'utf8');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.NODE_ENV !== 'production',
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    })
  );

  console.log('🚀 GraphQL endpoint ready at /graphql');
}

// =================== EXISTING REST ROUTES (MAINTAINED) ===================

// Auth routes
app.use('/api/auth', require('../routes/auth'));

// Progress routes
app.use('/api/progress', require('../routes/progress'));

// Get all lessons
app.get('/api/lessons/', (req, res) => {
  const lessons = lessonService.getAllLessons();
  res.json(lessons);
});

// Validate query
app.post('/api/validate', async (req, res) => {
  try {
    const { lessonId, exerciseId, query } = req.body;
    const result = await validationService.validateSolution(query, lessonId, exerciseId);
    res.json(result);
  } catch (error: any) {
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

    const db = getLessonDB(lessonId);
    const sanitized = sanitizeQuery(query);

    db.all(sanitized, (err: any, rows: any) => {
      db.close();
      if (err) return res.json({ success: false, error: err.message });

      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      res.json({ success: true, data: rows, columns });
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit feedback
app.post('/api/submit-feedback', feedbackLimiter, async (req, res) => {
  try {
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

    const fetch = (await import('node-fetch')).default;
    const response = await fetch(FORMSPREE_ENDPOINT!, {
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
        error: (errData as any).error || 'Failed to send message to Formspree'
      });
    }

    res.json({ success: true, message: '✅ Feedback sent successfully!' });

  } catch (error: any) {
    console.error('Formspree error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// =================== ERROR HANDLING ===================
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// =================== START SERVER ===================
async function startServer() {
  try {
    // Setup GraphQL
    await setupGraphQL();
    
    // Start HTTP server
    await new Promise<void>((resolve) =>
      httpServer.listen(PORT, resolve)
    );
    
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();