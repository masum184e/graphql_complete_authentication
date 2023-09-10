import express from 'express';
import dotenv from 'dotenv';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import { databaseConnection } from './config/databaseConnection.js';

dotenv.config();

import typeDefs from './types/index.js';
import resolvers from './resolvers/index.js';

const app = express();
app.use(cors());
app.use(graphqlUploadExpress());

const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;

const startServer = async() => {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    uploads: true,
    context: ({ req }) => {
      return {
        headers: req.headers,
      }
    }
  });

  await server.start();

  server.applyMiddleware({ app });

  app.use(graphqlUploadExpress());

  console.log(DATABASE_NAME, DATABASE_URL)
  databaseConnection(DATABASE_URL, DATABASE_NAME)

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  })
}

startServer();