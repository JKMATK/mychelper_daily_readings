import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const typeDefs = gql`
  type Reading {
    id: ID!
    title: String!
    content: String!
    date: String!
  }

  type Query {
    dailyReadings: [Reading!]!
  }
`;

const resolvers = {
  Query: {
    dailyReadings: () => [
      {
        id: '1',
        title: 'Genesis 1',
        content: 'In the beginning...',
        date: '2025-07-04',
      },
    ],
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