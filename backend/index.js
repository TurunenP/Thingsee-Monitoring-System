const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const thingseeSensorHandler = require("./routeHandler/thingseeSensorHandler");


const app = express();
app.use(express.json());

//mongoose.set('strictQuery', false);

//const mongoURI = "mongodb+srv://Dip:ban00ban@@cluster0.9ia4y.mongodb.net/thingsee?retryWrites=true&w=majority";
const username = "Dip";
const password = "ban00ban@";
const encodedPassword = encodeURIComponent(password);

const mongoURI = `mongodb+srv://${username}:${encodedPassword}@cluster0.9ia4y.mongodb.net/thingsee?retryWrites=true&w=majority`;


mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to MongoDB Atlas successful"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));


app.use("/thingseeSensor", thingseeSensorHandler);


function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

