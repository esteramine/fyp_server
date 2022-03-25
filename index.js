const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');

const { MONGO_URL } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 5000;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(async () => {
        console.log('MongoDB connected!');
        await server.start();
        app.use(graphqlUploadExpress());
        server.applyMiddleware({ app });

        return app.listen({ port: PORT });
    })
    .then(res => {
        console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
    });