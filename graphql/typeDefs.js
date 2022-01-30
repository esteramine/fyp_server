const gql = require('graphql-tag');

module.exports = gql`
    type Post {
        id: ID!
        image: String!
        foodName: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        commentCount: Int!
        likeCount: Int!

        completion: String!
        ateTime: String!
        price: String!
        restaurantName: String!
        location: String!
        rating: String!
        review: String!
        tags: [String]!
    }
    type User {
        id: ID!
        token: String!
        username: String!
        createdAt: String!
    }
    type Comment {
        id: ID!
        username: String!
        body: String!
        createdAt: String!
    }
    type Like {
        id: ID!
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
        # below are not required
        completion: String!
        ateTime: String!
        price: String!
        restaurantName: String!
        location: String!
        rating: String!
        review: String!
        tags: [String]!
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
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
`;