const mongoose = require("mongoose");

const thingseeSensorSchema = mongoose.Schema({
  in: {
    type: Number,
    default: 0,
  },
  out: {
    type: Number,
    default: 0,
  },
  totalIn: {
    type: Number,
    default: 0,
  },
  totalOut: {
    type: Number,
    default: 0,
  },
  historicalIn: {
    type: Number,
    default: 0,
  },
  historicalOut: {
    type: Number,
    default: 0,
  },
  amountIn: {
    type: Number,
    default: 0,
  },
  carbonDioxide: {
    type: Number,
    default: 0,
  },
  tvoc: {
    type: Number,
    default: 0,
  },
  temp: {
    type: Number,
    default: 0,
  },
  humd: {
    type: Number,
    default: 0,
  },
  airp: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true,
}
);

const ThingseeSensor = mongoose.model("ThingseeSensor", thingseeSensorSchema);

module.exports = ThingseeSensor;
