import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { PrismaClient } from './generated/prisma';
import gql from 'graphql-tag';

const prisma = new PrismaClient();

const typeDefs = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = {
  Query: {
    
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 },
  });

  console.log(`📖 Daily Readings Subgraph running at ${url}`);
})();