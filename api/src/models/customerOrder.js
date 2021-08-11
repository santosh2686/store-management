const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const customerOrderSchema = Schema({
    _id: Schema.Types.ObjectId,
    type: {
        type: String,
        enum: ['IN_STORE', 'ONLINE'],
        required
    },
    status: {
        type: String,
        enum: ['SUBMITTED', 'IN-PROGRESS', 'DELIVERED', 'CANCELLED'],
        required
    },
    customer: {
        type: Schema.Types.ObjectId, ref: 'Customer'
    },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: {
            type: Number,
            required,
        }
    }],
    totalQuantity: {
        type: Number,
        required,
    },
    orderTotal: {
        type: Number,
        required,
    },
    totalProducts: {
        type: Number,
        required
    },
    isAddedToAccount: {
        type: Boolean,
        default: false,
    },
    isDailyEntry: {
        type: Boolean,
        default: false,
    },
    payment: {
        status: {
            type: String,
            enum: ['ADDED_TO_ACCOUNT', 'FULL_PAID'],
        },
        mode: {
            type: String,
            enum: ['', 'CASH', 'ONLINE_TRANSFER', 'CHEQUE'],
            default: ''
        },
        transactionNumber: {
            type: String,
        },
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

module.exports = model('CustomerOrder', customerOrderSchema);
