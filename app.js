var fs = require("fs");
global.config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var host = config.host,
    port = config.port;

// create express app globally
global.express = require("express");
global.app = new express();

// exposes "/"  and any files contained within static folder
// used for css/ and js/ files.
app.use(express.static(__dirname + "/static"));

// get debug enabled/disabled from config
global.debug = config.debug;
// create tmp folder if !exists when debug enabled
if (debug) {
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
}

// create empty global variable to hold album data (we'll call this a cache)
global.albums = null;

// load flickr module globally for use in routes
global.flickr = require(__dirname + "/lib/flickr.js");
global.USER_ID = config.user_id;
global.OAUTH_TOKEN = config.oauth_token;
global.OAUTH_SECRET = config.oauth_secret;

// get collections or sets flag from config
global.use = config.use;

// load modules from "./routes" as defined in index.js 
require("./routes");

// determine if we want to run the http server. Loaded from config
if (config.runServer) {
  app.listen(port, function () {
      "use strict";
      console.log("Server listening on:\nhttp://" + host + ":" + port +
                  "\nPress CTRL-C to terminate");
  });
}
