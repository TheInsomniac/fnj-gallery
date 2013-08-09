var fs = require("fs");
config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var host = config.host,
    port = config.port;

// create express app globally
express = require("express"),
app = new express();

// exposes "/"  and any files contained within static folder
// used for css/ and js/ files.
app.use(express.static(__dirname + "/static"));

// get debug enabled/disabled from config
debug = config.debug;
// create tmp folder if !exists when debug enabled
if (debug) {
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
}

// create empty global variable to hold album data (we'll call this a cache)
albums = null;

// load flickr module globally for use in routes
flickr = require(__dirname + "/lib/flickr.js");
USER_ID = config.user_id;
OAUTH_TOKEN = config.oauth_token;
OAUTH_SECRET = config.oauth_secret;

// get collections or sets flag from config
use = config.use;

// load modules from "./routes" as defined in index.js 
require('./routes');

// determine if we want to run the http server. Loaded from config
if (config.runServer) {
  app.listen(port, function () {
      "use strict";
      console.log("Server listening on:\nhttp://" + host + ":" + port +
                  "\nPress CTRL-C to terminate");
  });
}
