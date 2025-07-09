import { queryResolvers } from './queries';
import { mutationResolvers } from './mutations';
import { fieldResolvers } from './fieldResolvers';

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  ...fieldResolvers
}; 