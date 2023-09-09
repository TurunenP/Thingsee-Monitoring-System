const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const mqtt = require('mqtt')
const fs = require('fs')
const thingseeSensorHandler = require("./routeHandler/thingseeSensorHandler");


const app = express();
app.use(express.json());

//mongoose.set('strictQuery', false);

//const mongoURI = "mongodb+srv://Dip:ban00ban@@cluster0.9ia4y.mongodb.net/thingsee?retryWrites=true&w=majority";
const username = "Dip";
const password = "ban00ban@";
const encodedPassword = encodeURIComponent(password);
//const mongoURI = `mongodb+srv://${username}:${encodedPassword}@cluster0.9ia4y.mongodb.net/thingsee?retryWrites=true&w=majority`;
  const mongoURI = `mongodb+srv://${username}:${encodedPassword}@cluster0.9ia4y.mongodb.net/thingsee?retryWrites=true&w=majority`;


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

function sendPostRequest() {
  const ec2Url = 'https://ec2-65-2-184-167.ap-south-1.compute.amazonaws.com';
  axios
    .post("${ec2Url}/thingseeSensor", readings)
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


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

