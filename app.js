var fs = require("fs"),
  config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var host = config.host,
  port = config.port,
  debug;

var flickr = require(__dirname + "/lib/flickr.js"),
  USER_ID = config.user_id,
  OAUTH_TOKEN = config.oauth_token,
  OAUTH_SECRET = config.oauth_secret;

process.env.NODE_ENV = config.node_env;

// create express app instance
var express = require("express"),
  app = new express();

// exposes "/"  and any files contained within static folder
// used for css files.
app.use(express.static(__dirname + "/static/css"));

app.configure("production", function () {
  "use strict";
  app.use(express.static(__dirname + "/static/js/prod"));
  debug = false;
});

app.configure("development", function () {
  "use strict";
  app.use(express.static(__dirname + "/static/js/dev"));
  debug = true;
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
});

// create empty global variable to hold album data (we'll call this a cache :P )
var photosets = null;
var collections = null;

// load photoset data
flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
  "use strict";
  photosets = this;
  if (debug) {
    //console.log(JSON.stringify(albums, null, 4));
    fs.writeFileSync(__dirname + "/tmp/sets-parsed.json",
      JSON.stringify(photosets, null, 4));
  }
});

// load collections data
flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
  "use strict";
  collections = this;
  if (debug) {
    //console.log(JSON.stringify(albums, null, 4));
    fs.writeFileSync(__dirname + "/tmp/collections-parsed.json",
      JSON.stringify(collections, null, 4));
  }
});

// Choose html rendered for gallery based upon sets or collections setting
if (config.use === "sets") {
  app.use(express.static(__dirname + "/views/sets"));
} else if (config.use === "collections") {
  app.use(express.static(__dirname + "/views/collections"));
}

// exposes "/albums?return=[photosets|collections]"
// and "/albums?update=true"
app.get("/albums", function (req, res) {
  "use strict";
  if (req.query.return === "collections") {
    res.json(collections);
  } else if (req.query.return === "photosets") {
    res.json(photosets);
  } else if (req.query.update === "true") {
    flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
      photosets = this;
    });
    flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
      collections = this;
    });
    res.json({"Photosets":"Updated", "Collections":"Updated"});
  } else {
    res.json(404, {"Error":"Please specify return type",
             "Return Type":["?return=collections","?return=photosets"],
             "Update Cache":"?update=true"});
  }
});

// exposes "/photos?album=ALBUM_ID"
app.get("/photos", function (req, res) {
  "use strict";
  if (req.query.album) {
    flickr.getPhotoSetPhotos(OAUTH_TOKEN, OAUTH_SECRET, req.query.album, function () {
      if (this.length) {
        res.json(this);
        if (debug) {
          fs.writeFileSync(__dirname + "/tmp/photoset-" + req.query.album +
            "-parsed.json", JSON.stringify(this, null, 4));
        }
      } else {
        res.json(404, {"Error":"Incorrect Album Specified"});
      }
    });
  } else {
    res.json(404, {"Error":"No Album Specified!",
              "Usage":"?photos=ALBUM_ID"});
  }
});

// determine if we want to run the http server. Loaded from config
if (config.runServer) {
  app.listen(port, function () {
    "use strict";
    console.log("Server listening on:\nhttp://" + host + ":" + port +
      "\nPress CTRL-C to terminate");
  });
}