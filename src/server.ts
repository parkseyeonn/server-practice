import "dotenv/config";
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import client from "./client";
import { typeDefs, resolvers } from './schema';
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import logger from "morgan";
// subscription settting
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const PORT = process.env.PORT;
  
const startServer = async () => {
  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({
    schema,
    context: async (ctx) => {
      if (!ctx.connectionParams?.token) {
        return { loggedInUser: null };
      }
      const loggedInUser = await getUser(ctx.connectionParams?.token);
      return {
        loggedInUser,
      };
    },
    onConnect: async (ctx) => {
      if (!ctx.connectionParams?.token) {
        // You can return false to close the connection or throw an explicit error
        return;
      }
    },
    onDisconnect(ctx, code, reason) {
      console.log('Disconnected!');
    },
  }, wsServer);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    }
  },
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  });
  
  await server.start();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  
  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
  });
};

startServer();

// const startServer = async () => {
//   const apollo = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: async ({req }) => {
//       return {
//         client,
//         loggedInUser : await getUser(req.headers.token),
//       }
//     },
//   });
  
//   // Create an Express app and HTTP server; we will attach both the WebSocket
//   // server and the ApolloServer to this HTTP server.
//   const app = express();
//   const httpServer = createServer(app);
//   await apollo.start();
//   app.use(graphqlUploadExpress());
//   app.use('/static', express.static('uploads'));
//   apollo.applyMiddleware({ app });
//   app.listen({ port: PORT }, () => {
//     console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`);
//   });
//   // await new Promise((func) => app.listen({ port: PORT }, func));
// }

// startServer();
  