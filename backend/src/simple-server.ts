import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.TS_PORT || 5001;

// Simple GraphQL schema
const typeDefs = `
  type Query {
    hello: String
    lessons: [Lesson]
  }
  
  type Lesson {
    id: String
    title: String
    category: String
  }
`;

// Simple resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    lessons: () => {
      // Import lesson service from the existing backend
      const lessonService = require('../services/lessonService');
      try {
        const lessons = lessonService.getAllLessons();
        return lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          category: lesson.category
        }));
      } catch (error) {
        console.error('Error loading lessons:', error);
        return [];
      }
    }
  }
};

async function startServer() {
  try {
    // Setup middleware
    app.use(cors());
    app.use(express.json());

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      introspection: true, // Enable GraphQL Playground
    });

    await server.start();

    // Apply GraphQL middleware
    app.use('/graphql', expressMiddleware(server));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        server: 'TypeScript GraphQL Server',
        port: PORT,
        endpoints: {
          graphql: `/graphql`,
          playground: `/graphql`
        }
      });
    });

    // Start server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, resolve);
    });

    console.log(`🚀 TypeScript GraphQL Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);

  } catch (error) {
    console.error('Failed to start TypeScript server:', error);
    process.exit(1);
  }
}

startServer();