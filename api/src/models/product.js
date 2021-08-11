const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const productSchema = Schema({
    _id: Schema.Types.ObjectId,
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    productName: {
        type: String,
        required,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    buyPrice: {
        type: Number,
        required,
    },
    sellPrice: {
        type: Number,
        required,
    },
    stockReminder: {
        type: Number,
        required,
        default: 5,
    },
    soldAs: {
        type: String,
        enum: ['kg', 'ltr', 'unit'],
        default: 'kg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = model('Product', productSchema);
