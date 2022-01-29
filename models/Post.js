const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    username: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: String,
    foodName: String,
    completion: String,
    ateTime: String,
    createdAt: String,
    price: String,
    restaurantName: String,
    location: String,
    rating: String,
    review: String,
    tags: [String],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ]
});

module.exports = model('Post', postSchema)