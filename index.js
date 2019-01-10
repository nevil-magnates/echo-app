"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var request = require('request');
const restService = express();

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

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

restService.post("/test", function(req, res) {
    var a = request('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json', function (error, response, body) {
        var mfr_list = JSON.parse(body);

        var mfr_name = [];

        mfr_list.Results.forEach((mfr, index) => {
            console.log(mfr.Mfr_Name);
            mfr_name.push(mfr.Mfr_Name);
        });

        var Res = {};
        var slack = {};
        var payload = {};
        var text = "Slack Test";
        slack['text'] = text;
        payload['slack'] = slack;
        // Res["fulfillmentText"] = "Test Case";
        // Res["payload"] = "Test Case";
        // Res["fulfillmentMessages"] = mfr_name;
        // Res["source"] = "webhook-echo-sample";
        
        Res["payload"] = payload;
        Res["fulfillmentText"]= mfr_name;
        res.json(Res);
    });
  return a;
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    function mfrList(agent) {
        agent.add(`make list...`);
    }

    let intentMap = new Map();
    intentMap.set('Get List', mfrList);
    agent.handleRequest(intentMap);
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
