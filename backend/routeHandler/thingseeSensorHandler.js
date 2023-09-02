const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const thingseeSensorSchema = require("../schemas/thingseeSensorSchema");

const ThingseeSensor = mongoose.model("ThingseeSensor", thingseeSensorSchema);

// GET ALL THE ThingseeSensors
router.get("/", async (req, res) => {
  try {
    const sensors = await ThingseeSensor.find({});
    res.status(200).json({
      result: sensors,
      message: "Success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

// GET A ThingseeSensor by ID
router.get("/:id", async (req, res) => {
  try {
    const sensor = await ThingseeSensor.findOne({ _id: req.params.id });

    if (!sensor) {
      res.status(404).json({
        message: "ThingseeSensor not found",
      });
    } else {
      res.status(200).json({
        result: sensor,
        message: "Success",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

// POST A ThingseeSensor
router.post("/", async (req, res) => {
  try {
    const newSensor = new ThingseeSensor(req.body);
    await newSensor.save();

    res.status(200).json({
      message: "ThingseeSensor was inserted successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "There was a server-side error!",
      details: err.message,
    });
  }
});

// POST MULTIPLE ThingseeSensors
router.post("/all", async (req, res) => {
  try {
    await ThingseeSensor.insertMany(req.body);

    res.status(200).json({
      message: "ThingseeSensors were inserted successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "There was a server-side error!",
      details: err.message,
    });
  }
});

module.exports = router;
