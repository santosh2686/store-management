const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const { messages } = require("../utils");
const { required } = messages;

const dailyProductSchema = Schema({
  _id: Schema.Types.ObjectId,
  dailyProducts: {
    type: Object,
    default: {},
    required,
  },
  date: {
    type: String,
    required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("DailyProduct", dailyProductSchema);
