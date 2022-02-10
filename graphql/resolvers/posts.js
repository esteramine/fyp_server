const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');
const { validatePostInput } = require('../../utils/validators');

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
        },
        async getUserMonthPosts(_, { year, month }, context) {
            const user = checkAuth(context);
            try {
                const posts = await Post.find({ username: user.username }).sort({ ateTime: 1 });
                return posts.filter(post => (new Date(post.ateTime).getMonth()+1 == month && new Date(post.ateTime).getFullYear() == year));

            } catch (error) {
                throw new Error(error);
            }

        },
    },
    Mutation: {
        async createPost(_, { postInput: {
            image,
            foodName,
            completion,
            ateTime,
            price,
            restaurantName,
            location,
            rating,
            review,
            tags } }, context) {
            const user = checkAuth(context);

            const { valid, errors } = validatePostInput(foodName, image);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const newPost = new Post({
                image,
                foodName,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
                completion,
                ateTime,
                price,
                restaurantName,
                location,
                rating,
                review,
                tags
            });

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (user.username == post.username) {
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
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // whether the user already liked the post
                    post.likes = post.likes.filter(like => like.username !== username);
                }
                else {
                    // the user has not liked the post, like the post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            }
            else {
                throw new UserInputError('Post not found.');
            }
        }
    }
};