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

const Dots = mongoose.model('Dots', dots)

module.exports = Dots