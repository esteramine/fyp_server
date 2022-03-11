const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    // deviceId: {
    //     type: String,
    //     required: true,
    // }
    createdAt: String,
    // studentId: {
    //     type: String,
    //     required: true,
    //     unique: true, 
    // },
    // school: {
    //     type: String,
    //     required: true,
    // },
    progress: Number

});

module.exports = model('User', userSchema);
