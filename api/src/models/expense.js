const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const expenseSchema = Schema({
    _id: Schema.Types.ObjectId,
    amount: {
        type: Number,
        required,
    },
    description: {
        type: String,
        maxLength: 200,
    },
    name: {
        type: String,
        required,
    },
    paidOnDate: {
        type: Date,
        required,
    },
    paidTo: {
        type: String,
        required,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Expense', expenseSchema);
