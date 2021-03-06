const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { extname } = require('path');
const { v4: uuid } = require('uuid');
const s3 = require('../../s3');

const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../utils/checkAuth');
const { validatePostInput } = require('../../utils/validators');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                posts.sort((b, a) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
                return posts.filter(post => post.public == true);
                // return posts;

            } catch (error) {
                throw new Error(error);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                }
                else {
                    throw new Error('Post not found.');
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        async getUserMonthPosts(_, { year, month }, context) {
            const user = checkAuth(context);
            try {
                const posts = await Post.find({ username: user.username });
                posts.sort((a, b) => (a.ateTime > b.ateTime) ? 1 : ((b.ateTime > a.ateTime) ? -1 : 0));
                return posts.filter(post => (new Date(post.ateTime).getMonth() + 1 == month && new Date(post.ateTime).getFullYear() == year));
            } catch (error) {
                throw new Error(error);
            }

        },
        async searchTag(_, { tag }) {
            try {
                const posts = await Post.find();
                return posts.filter(post => post.tags.includes(tag) && post.public == true);

            } catch (error) {
                throw new Error(error);
            }
        }
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
            tags,
            public
        } }, context) {
            const user = checkAuth(context);

            const { valid, errors } = validatePostInput(foodName, "image dummy string");
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const { createReadStream, filename, mimetype } = await image;
            const fileKey = `${uuid()}${extname(filename)}`;

            const { Location } = await s3.upload({
                Body: createReadStream(),
                Key: fileKey,
                ContentType: mimetype
            }).promise();

            const newPost = new Post({
                image: fileKey,
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
                tags,
                public
            });

            // add progress to the user
            await User.findByIdAndUpdate(user.id, { $inc: { progress: 1 } });

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
                    // decrease progress to the user
                    await User.findByIdAndUpdate(user.id, { $inc: { progress: -1 } });
                    return 'Post deleted successfully.';
                }
                else {
                    throw new AuthenticationError('Action not allowed.');
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        async editPost(_, { postId, postInput }, context) {
            const { username } = checkAuth(context);

            const { valid, errors } = validatePostInput(postInput.foodName, postInput.image);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            try {
                const post = await Post.findById(postId);
                if (username == post.username) {
                    const editedPost = await Post.findByIdAndUpdate(postId, postInput, { new: true });
                    return editedPost;
                }
                else {
                    throw new AuthenticationError('Action not allowed.');
                }
            } catch (err) {
                throw new Error(err);
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