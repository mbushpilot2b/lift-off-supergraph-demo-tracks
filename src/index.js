const { ApolloServer, gql } = require('apollo-server');
const { readFileSync } = require('fs');
const path = require("path");
const typeDefs = gql(readFileSync(path.resolve(__dirname, "./schema.graphql"), { encoding: 'utf-8' }));
const resolvers = require('./resolvers');
const TrackAPI = require('./datasources/track-api');
const { buildSubgraphSchema } = require('@apollo/subgraph');

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  dataSources: () => {
    return {
      trackAPI: new TrackAPI(),
    };
  },
});

server.listen({ port: process.env.PORT || 4001 }).then(({ url, port }) => {
  console.log(`
    🚀  Server is running
    🔉  Listening on port ${port}
    📭  Query at ${url}
  `);
});

