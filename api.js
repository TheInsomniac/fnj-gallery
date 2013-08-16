function api(app, debug, fs, config) {
  "use strict";
  var flickr = require(__dirname + "/lib/flickr.js"),
      USER_ID = config.user_id,
      OAUTH_TOKEN = config.oauth_token,
      OAUTH_SECRET = config.oauth_secret;

  // load photoset data
  flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    albums.photosets = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/tmp/sets-parsed.json",
        JSON.stringify(albums.photosets, null, 4));
    }
  });

  // load collections data
  flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    albums.collections = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/tmp/collections-parsed.json",
        JSON.stringify(albums.collections, null, 4));
    }
  });

  // exposes "/albums?request=[photosets|collections]"
  // and "/albums?update=true"
  app.get("/albums", function (req, res) {
    if (req.query.request === "collections") {
      res.json(albums.collections);
    } else if (req.query.request === "photosets") {
      res.json(albums.photosets);
    } else if (req.query.update === "true") {
      flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        albums.photosets = this;
      });
      flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        albums.collections = this;
      });
      res.json(200, {"Photosets": "Updated", "Collections": "Updated"});
    } else {
      res.json(404, {"Error": "Please specify reqest type",
               "Request Type": ["?request=collections", "?request=photosets"],
               "Update Cache": "?update=true"});
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
          res.json(404, {"Error": "Incorrect Album Specified"});
        }
      });
    } else {
      res.json(404, {"Error": "No Album Specified!",
                "Usage": "?album=ALBUM_ID"});
    }
  });
}

exports.api = api;
