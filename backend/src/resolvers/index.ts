import { authResolvers } from './auth';
import { lessonResolvers } from './lessons';
import { progressResolvers } from './progress';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...lessonResolvers.Query,
    ...progressResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...lessonResolvers.Mutation,
    ...progressResolvers.Mutation,
  },
  User: {
    ...progressResolvers.User,
  },
};