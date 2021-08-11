const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const staffSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required,
    },
    contact: {
        type: Number,
        required,
    },
    address: {
        type: String,
        required,
    },
    salary: {
        type: Number,
        required,
    },
    description: {
        type: String,
        maxLength: 200,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Staff', staffSchema);
