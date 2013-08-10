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

app.use(express.compress());

app.configure("production", function(){
  "use strict";
  debug = false;
});

app.configure("development", function(){
  "use strict";
  debug = true;
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
});

// exposes "/"  and any files contained within static folder
// used for css/ and js/ files.
app.use(express.static(__dirname + "/static"));

// create empty global variable to hold album data (we'll call this a cache :P )
var albums = null;
// fill the albums array
if (config.use === "sets") {
  app.use(express.static(__dirname + "/views/sets"));
  flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    "use strict";
    albums = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/tmp/sets-parsed.json",
          JSON.stringify(albums, null, 4));
    }
  });
} else if (config.use === "collections") {
  app.use(express.static(__dirname + "/views/collections"));
  flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    "use strict";
    albums = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/tmp/collections-parsed.json",
        JSON.stringify(albums, null, 4));
    }
  });
}

// exposes "/albums"
app.get("/albums", function (req, res) {
  "use strict";
  res.json(albums);
});

// exposes "/albums/update"
app.get("/albums/update", function (req, res) {
  "use strict";
  if (config.use === "sets") {
    flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
      albums = this;
      res.send("<h3>Albums Updated from Sets</h3></br>" +
          "<a href=/index.html>Return Home</a>");
    });
  } else if (config.use === "collections") {
      flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        albums = this;
        res.send("<h3>Albums Updated from Collections</h3></br>" +
            "<a href=/index.html>Return Home</a>");
      });
    }
});

// exposes "/photos?album=ALBUM_ID"
app.get("/photos", function (req, res) {
  "use strict";
  if (req.query.album) {
      flickr.getPhotoSetPhotos(OAUTH_TOKEN, OAUTH_SECRET, req.query.album,
          function () {
              if (this.length > 0) {
                  res.json(this);
                  //res.send(JSON.stringify(this));
              } else if (this.length === 0) {
                  res.send("Incorrect Album Specified");
              }
          });
  } else {
      res.send("No Album Specified!");
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
