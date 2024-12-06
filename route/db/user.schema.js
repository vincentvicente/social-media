const Schema = require('mongoose').Schema;


exports.UserSchema = new Schema({
    username: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    created: { type: Date, default: Date.now() },
}, { collection : 'usersFall2024' });