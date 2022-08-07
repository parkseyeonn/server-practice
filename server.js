import "dotenv/config";
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import { typeDefs, resolvers } from './schema';
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";

const PORT = process.env.PORT;

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req }) => {
      return {
        loggedInUser : await getUser(req.headers.token),
      }
    },
  });
  
  await apollo.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use('/static', express.static('uploads'));
  apollo.applyMiddleware({ app });
  await new Promise((func) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`);
}

startServer();
  