const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
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
        }
    }
};