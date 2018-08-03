import { resolvers } from './graphql/resolvers.js'
import { typeDefs } from './graphql/typeDefs.js'

import express from 'express';
import { createServer } from 'http';
import { ApolloServer, gql } from 'apollo-server-express';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
        if (connection) {
            // check connection for metadata
            return {};
        } else {
            // check from req
            const token = req.headers.authorization || "";

            return { token };
        }
    }
});

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);