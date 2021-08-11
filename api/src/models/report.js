const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reportSchema = Schema({
    _id: Schema.Types.ObjectId,
    month: {
        type: String,
        required: [true, 'Month is missing']
    },
    year: {
        type: String,
        required: [true, 'Year is missing']
    },
    sale: {
        type: Number,
        default: 0
    },
    profit: {
        type: Number,
        default: 0
    },
    expense: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Report', reportSchema);
