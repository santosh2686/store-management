const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  firstName: {
    type: String,
    required,
    trim: true
  },
  lastName: {
    type: String,
    required,
    trim: true
  },
  email: { 
    type: String,
    required,
    unique: true,
    trim: true,
    match: [email, invalidEmail]
  },
  contact: {
    type: String,
    required,
    trim: true,
    match: [contact, invalidContact]
  },
  userName: {
    type: String,
    required,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required
  },
  shopDetails: {
    name: {
      type: String,
      required,
      trim: true
    },
    shopNumber: {
      type: String,
      required,
      trim: true
    },
    buildingName: {
      type: String,
      required,
      trim: true
    },
    landMark: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required,
      trim: true
    },
    state: {
      type: String,
      required,
      trim: true
    },
    registrationNumber: {
      type: String,
      required,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('User', userSchema);
