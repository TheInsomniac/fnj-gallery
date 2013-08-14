function api(express, app, debug, fs, config) {
  "use strict";
  var flickr = require(__dirname + "/lib/flickr.js"),
      USER_ID = config.user_id,
      OAUTH_TOKEN = config.oauth_token,
      OAUTH_SECRET = config.oauth_secret;

  // create empty variables to hold album data (we'll call this a cache :P )
  var photosets = null;
  var collections = null;

  // load photoset data
  flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    photosets = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/tmp/sets-parsed.json",
        JSON.stringify(photosets, null, 4));
    }
  });

  // load collections data
  flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    collections = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/tmp/collections-parsed.json",
        JSON.stringify(collections, null, 4));
    }
  });

  // exposes "/albums?return=[photosets|collections]"
  // and "/albums?update=true"
  app.get("/albums", function (req, res) {
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
}

exports.api = api;
