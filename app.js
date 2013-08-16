var fs = require("fs"),
    config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var host = config.host,
    port = config.port,
    debug;

// Globals
albums = {"collections":[], "photosets":[]};

// Production or Development mode?
process.env.NODE_ENV = config.node_env;

// create express app instance
var express = require("express"),
    app = new express();

// development only
if ("development" == app.get("env")) {
  app.locals.pretty = true;
  debug = true;
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
}

// production only
if ("production" == app.get("env")) {
  debug = false;
}

// retrieve static file settings
var getStaticFiles = require("./static").getStaticFiles;
var _getStaticFiles = new getStaticFiles(express, app, config);

// retrieve routes api from api.js
var api = require("./api").api;
var _api = new api(app, debug, fs, config);

// determine if we want to run the http server. Loaded from config
if (config.runServer) {
  app.listen(port, function () {
    "use strict";
    console.log("Started in " + app.get("env") + " mode...");
    console.log("Server listening on:\nhttp://" + host + ":" + port +
                "\nPress CTRL-C to terminate");
  });
}
