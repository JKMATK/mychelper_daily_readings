import { queryResolvers } from './queries';
import { fieldResolvers } from './fieldResolvers';

export const resolvers = {
  Query: queryResolvers,
  ...fieldResolvers
}; 