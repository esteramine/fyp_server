const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGO_URL } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected!');
        return server.listen({ port: PORT });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    });