"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var request = require('request');
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());


restService.get("/", function(req, res) {
  return res.json({
    source: "Hello Word"
  });
});

restService.get("/test", function(req, res) {
    var a = request('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json', function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred and handle it
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          res.json(JSON.parse(body));
    });
  return a;
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
