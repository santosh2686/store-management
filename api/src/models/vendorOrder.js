const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const vendorOrderSchema = Schema({
    _id: Schema.Types.ObjectId,
    vendor: {
        type: Schema.Types.ObjectId, ref: 'Vendor'
    },
    products: {
        type: Object,
        required
    },
    isReceivedAll: {
        type: Boolean,
        default: false
    },
    isPaymentAddedToAccount: {
        type: Boolean,
        default: true
    },
    quantityOrderedTotal: {
        type: Number,
        required,
    },
    quantityReceivedTotal: {
        type: Number,
        required,
    },
    orderTotal: {
        type: Number,
        required,
    },
    orderStatus: {
        type: String,
        enum: ['OPEN', 'CANCEL', 'PARTIAL_RECEIVED', 'FULL_RECEIVED'],
        default: 'OPEN'
    },
    payment: {
        status: {
            type: String,
            enum: ['', 'ADDED_TO_ACCOUNT', 'PARTIAL_PAID', 'FULL_PAID'],
            default: ''
        },
        mode: {
            type: String,
            enum: ['', 'CASH', 'ONLINE_TRANSFER', 'CHEQUE'],
        },
        proof: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    orderNo: {
        type: Number,
        unique: true,
        default: () => {
            const currentDate = new Date();
            return `${currentDate.getYear()}${currentDate.getDate()}${currentDate.getMonth()}${currentDate.getMilliseconds()}`;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('VendorOrder', vendorOrderSchema);
