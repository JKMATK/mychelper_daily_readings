import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { PrismaClient } from '@prisma/client';
import gql from 'graphql-tag';

const prisma = new PrismaClient();

const typeDefs = gql`
  type DailyReading {
    title: String
    decription: String
    refrences: [String]
  }

  type Query {
    dailyReadings: [DailyReading]
  }
`;

const resolvers = {
  Query: {
    dailyReadings: () => [
      {
        title: 'God’s Love in Action',
        decription: 'Today’s reading explores how God’s love transforms our relationships.',
        refrences: ['John 3:16', 'Romans 5:8']
      },
      {
        title: 'Walking in Faith',
        decription: 'We are reminded to walk by faith, not by sight.',
        refrences: ['Hebrews 11:1', '2 Corinthians 5:7']
      }
    ]
  }
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