const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const mqtt = require('mqtt')
const fs = require('fs')
const thingseeSensorHandler = require("./routeHandler/thingseeSensorHandler");
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());


const username = "Dip";
const password = "ban00ban@";
const encodedPassword = encodeURIComponent(password);

const mongoURI = `mongodb+srv://the-chapal:chapal@cluster0.m2ptazw.mongodb.net/thingsee?retryWrites=true&w=majority`;


mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to MongoDB Atlas successful"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));


app.use("/thingseeSensor", thingseeSensorHandler);


const options = {host: 'a39cwxnxny8cvy.iot.eu-west-1.amazonaws.com',
                port: '8883',
                protocol: 'mqtt',
                rejectUnauthorized: false,
                key: fs.readFileSync('./certificates/sales-cloudext-prfi00airmonitoring.key'),
                cert: fs.readFileSync('./certificates/sales-cloudext-prfi00airmonitoring.pem')
                }

const client = mqtt.connect(options)

// subscribe to a topic
client.on('connect', () => {
    console.log('Connected MQTT')
  client.subscribe('cloudext/json/pr/fi/prfi00airmonitoring/#')
})

var readings = {
  'in': 0,
  'out': 0,
  'totalIn': 0,
  'totalOut': 0,
  'historicalIn': 0,
  'historicalOut': 0,
  'amountIn': 0,
  'carbonDioxide': 0,
  'tvoc': 0,
  'temp': 0,
  'humd': 0,
  'airp': 0,
};
// handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message.toString()}`)

  var reading = JSON.parse(message);
  for (var key in reading) {
    readings[key] = reading[key];
  }
  readings['date'] = new Date()
  console.log(readings);
  sendPostRequest()

  
})
const port = process.env.PORT || 4000;
function sendPostRequest() {
  axios
    .post("http://localhost:4000/thingseeSensor", readings)
    .then((response) => {
      console.log("Data Save successful");
    })
    .catch((error) => {
      console.error("Error sending POST request:", error.message);
    });

}

//setInterval(sendPostRequest, 360000);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}



app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});