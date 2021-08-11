const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const vendorSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required,
    },
    shopName: {
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
        match: [email, invalidEmail]
    },
    comment: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    balance: {
        type: Number,
        default: 0
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Vendor', vendorSchema);
