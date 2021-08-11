const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;
const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const customerSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required,
  },
  propertyNumber: {
    type: String,
    required,
  },
  bldgNumber: {
    type: String
  },
  bldgName: {
    type: String,
    required,
  },
  contact: {
    type: String,
    required,
    match: [contact, invalidContact]
  },
  whatsAppNumber: {
    type: String,
    required,
    match: [contact, invalidContact]
  },
  email: {
    type: String,
    required,
    unique: true,
    uniqueCaseInsensitive: true,
    match: [email, invalidEmail]
  },
  comment: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefaultProduct: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.plugin(uniqueValidator);
customerSchema.virtual('defaultProducts', {
  ref: 'DefaultProduct', // model name
  localField: '_id',
  foreignField: 'customer' // field in DefaultProduct model in which customerId is saved.
});

module.exports = model('Customer', customerSchema);
