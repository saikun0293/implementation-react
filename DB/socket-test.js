const mongoose = require('mongoose');

const dots = new mongoose.Schema({
    dotName: {
        type: String
    },
    createdBy: {
        type: String
    },
    content: {
        type: String
    }
}, {timestamps: true })

const sockettest = mongoose.model('sockettest', dots)

module.exports = sockettest