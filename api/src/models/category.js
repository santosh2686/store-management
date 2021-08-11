const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;
const { messages } = require('../utils');

const categorySchema = Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: messages.required,
        unique: 'Product Category name is already exist.',
        uniqueCaseInsensitive: true,
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

categorySchema.plugin(uniqueValidator);

categorySchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category'
  });

module.exports = model('Category', categorySchema);