import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Context } from '../context';

// Import existing models
const User = require('../../models/User');

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class UserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserInputError';
  }
}

export const authResolvers = {
  Query: {
    async me(_: any, __: any, { user }: Context) {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const userData = await User.findById(user.id);
      return {
        id: userData._id.toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'STUDENT',
        isGuest: userData.isGuest || false,
        createdAt: userData.createdAt,
      };
    },
  },

  Mutation: {
    async login(_: any, { email, password }: { email: string; password: string }) {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user || !user.password) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'STUDENT',
          isGuest: user.isGuest || false,
          createdAt: user.createdAt,
        }
      };
    },

    async register(_: any, { email, password, name }: { email: string; password: string; name?: string }) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        throw new UserInputError('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'STUDENT'
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'STUDENT',
          isGuest: user.isGuest || false,
          createdAt: user.createdAt,
        }
      };
    },

    async loginAsGuest() {
      const user = new User({
        email: `guest_${Date.now()}@sqlflow.com`,
        name: 'Guest User',
        role: 'STUDENT',
        isGuest: true
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'STUDENT',
          isGuest: user.isGuest || false,
          createdAt: user.createdAt,
        }
      };
    }
  }
};