const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const gql = require('graphql-tag');
const { readFileSync } = require('fs');
const path = require('path');

const typeDefs = gql(readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf-8' }));
const resolvers = require('./resolvers');
const TrackAPI = require('./datasources/track-api');

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      return {
        dataSources: {
          trackAPI: new TrackAPI(),
        },
      };
    },
    listen: { port: process.env.PORT || 4001 },
  });

  console.log(`
    🚀  Server is running
    📭  Query at ${url}
  `);
}

startApolloServer();
