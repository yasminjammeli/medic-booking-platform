// src/app.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const appointmentRoutes = require('./routes/appointment.routes');
const authRoutes = require('./routes/auth.routes');


dotenv.config();


const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'api-gateway' });
  });

  // REST endpoint
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/auth', authRoutes);

  
  // GraphQL
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Gateway running on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
