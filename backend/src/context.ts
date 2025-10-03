import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Import existing User model
const User = require('../models/User');

export interface Context {
  req: Request;
  res: Response;
  user?: {
    id: string;
    email: string;
    role: string;
    isGuest: boolean;
  };
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  const context: Context = { req, res };

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Fetch user from existing MongoDB model
      const user = await User.findById(decoded.userId).select('email role isGuest');

      if (user) {
        context.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role || 'STUDENT',
          isGuest: user.isGuest || false,
        };
      }
    } catch (error) {
      console.warn('Invalid token:', error);
      // Continue without user context
    }
  }

  return context;
}