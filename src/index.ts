import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { config } from './config';

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: config.server.port },
  });

  console.log(`📖 ${config.app.name} running at ${url}`);
})();