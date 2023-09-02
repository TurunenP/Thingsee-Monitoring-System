const mongoose = require("mongoose");

const thingseeSensorSchema = mongoose.Schema({
  in: {
    type: Number,
    required: true,
    default: 0,
  },
  out: {
    type: Number,
    required: true,
    default: 0,
  },
  totalIn: {
    type: Number,
    required: true,
    default: 0,
  },
  totalOut: {
    type: Number,
    required: true,
    default: 0,
  },
  historicalIn: {
    type: Number,
    required: true,
    default: 0,
  },
  historicalOut: {
    type: Number,
    required: true,
    default: 0,
  },
  amountIn: {
    type: Number,
    required: true,
    default: 0,
  },
  carbonDioxide: {
    type: Number,
    required: true,
    default: 0,
  },
  tvoc: {
    type: Number,
    required: true,
    default: 0,
  },
  temp: {
    type: Number,
    required: true,
    default: 0,
  },
  humd: {
    type: Number,
    required: true,
    default: 0,
  },
  airp: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = thingseeSensorSchema;
