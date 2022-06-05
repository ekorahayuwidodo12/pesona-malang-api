const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tour = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    operationalHour: {
        type: String,
        required: true
    },
    ticket: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tour', Tour);