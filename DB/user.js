const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    secretToken: {
        type: String
    },
    active: {
        type : Boolean
    }
}, {timestamps: true })

const User = mongoose.model('User', user)

module.exports = User