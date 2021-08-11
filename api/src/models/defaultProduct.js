const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const defaultProductSchema = Schema({
    _id: Schema.Types.ObjectId,
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required
    },
    quantity: {
        type: Number,
        required,
    },
    totalPrice: {
        type: Number,
        required,
    },
    frequency: {
        type: String,
        enum: ['oneTime', 'daily', 'custom'],
        default: 'daily'
    },
    custom: {
        type: Object,
        required: () => this.frequency === 'custom'
    },
    deliveryDate: {
        type: String,
        required: () => this.frequency === 'oneTime'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = model('DefaultProduct', defaultProductSchema);
