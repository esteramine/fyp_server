const gql = require('graphql-tag');

module.exports = gql`
    type Post {
        id: ID!
        foodName: String!
        username: String!
        createdAt: String!
    }
    type Query {
        getPosts: [Post]
    }
`;