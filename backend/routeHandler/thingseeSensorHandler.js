const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const thingseeSensorSchema = require("../schemas/thingseeSensorSchema");
const moment = require('moment');

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

router.get("/chart", async (req, res) => {
  try {
    // Calculate the start and end dates for your query (e.g., today)
    const currentDate = moment().startOf('day');
    const nextDate = moment(currentDate).add(1, 'day');

    // Use aggregation to group data by date and limit to 20 entries per date
    const sensors = await ThingseeSensor.aggregate([
      {
        $match: {
          date: {
            $gte: currentDate.toDate(),
            $lt: nextDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          data: { $slice: ["$data", 0, 20] }, // Limit to 20 entries per date
        },
      },
    ]);

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

// GET the Latest ThingseeSensor Data
router.get("/latestdata", async (req, res) => {
  try {
    // Retrieve the latest data
    const latestData = await ThingseeSensor.findOne({}, {}, { sort: { date: -1 } });

    if (!latestData) {
      // If no data is found, return a 404 response
      res.status(404).json({
        message: "No latest data found",
      });

    } else {
      res.status(200).json({
        result: latestData,
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
