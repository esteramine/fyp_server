const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    itsc: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // deviceId: {
    //     type: String,
    //     required: true,
    // }
    createdAt: {
        type: String,
        required: true
    },
    // studentId: {
    //     type: String,
    //     required: true,
    //     unique: true, 
    // },
    // school: {
    //     type: String,
    //     required: true,
    // },

});

module.exports = model('User', userSchema);
