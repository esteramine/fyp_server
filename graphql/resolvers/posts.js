const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
                
            } catch (error) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findOne({ postId });
                if (post) {
                    return post;
                }
                else {
                    throw new Error('Post not found.');
                }
            } catch (error) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, {postInput: { image, foodName }}, context) {
            const user = checkAuth(context);

            const newPost = new Post({
                image,
                foodName,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if(user.username == post.username) { 
                    // check whether the person who delete the post is the post owner
                    await post.delete();
                    return 'Post deleted successfully.';
                }
                else {
                    throw new AuthenticationError('Action not allowed.');
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    }
};