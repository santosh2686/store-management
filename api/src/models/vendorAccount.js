const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { messages } = require('../utils');
const { required } = messages

const vendorAccountSchema = Schema({
    _id: Schema.Types.ObjectId,
    vendor: {
        type: Schema.Types.ObjectId, ref: 'Vendor',
        required,
    },
    balance: {
        type: Number,
        required,
    },
    paidAmount: {
        type: Number,
    },
    previousBalance: {
        type: Number,
        default: 0
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

module.exports = model('VendorAccount', vendorAccountSchema);
