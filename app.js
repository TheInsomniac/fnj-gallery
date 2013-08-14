// create express app instance
var express = require("express"),
    app = new express();

var fs = require("fs"),
    config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var host = config.host,
    port = config.port,
    debug;

if (config.node_env === "development") {
  debug = true;
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
} else {
  debug = false;
}

// retrieve static file settings
var getStaticFiles = require("./static").getStaticFiles;
new getStaticFiles(express, app, debug, fs, config);

// retrieve routes api from api.js
var api = require("./api").api;
new api(express, app, debug, fs, config);

// determine if we want to run the http server. Loaded from config
if (config.runServer) {
  app.listen(port, function(){
    "use strict";
    console.log("Server listening on:\nhttp://" + host + ":" + port +
                "\nPress CTRL-C to terminate");
  });
}
