const Post = require('../../models/Post');

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

    }
};