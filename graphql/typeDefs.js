const gql = require('graphql-tag');

module.exports = gql`
    type Post {
        id: ID!
        foodName: String!
        username: String!
        createdAt: String!
    }
    type User {
        id: ID!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmedPassword: String!
    }
    input LoginInput {
        username: String!
        password: String!
    }
    input PostInput {
        image: String!
        foodName: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
        createPost(postInput: PostInput): Post!
        deletePost(postId: ID!): String!
    }
`;