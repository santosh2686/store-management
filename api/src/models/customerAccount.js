const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { messages } = require('../utils');
const { required } = messages

const customerAccountSchema = Schema({
    _id: Schema.Types.ObjectId,
    customer: {
        type: Schema.Types.ObjectId, ref: 'Customer',
        required,
    },
    paidAmount: {
        type: Number,
    },
    previousBalance: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        required,
    },
    payment: {
        mode: {
            type: String,
            enum: ['', 'CASH', 'ONLINE_TRANSFER', 'CHEQUE'],
        },
        proof: {
            type: String,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('customerAccount', customerAccountSchema);
