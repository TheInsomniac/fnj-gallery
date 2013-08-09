if (use === "sets") {
  app.use(express.static(__dirname + "/../views/sets"));
  flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    "use strict";
    albums = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/../tmp/sets-parsed.json",
          JSON.stringify(albums, null, 4));
    }
  });
} else if (use === "collections") {
  app.use(express.static(__dirname + "/../views/collections"));
  flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    "use strict";
    albums = this;
    if (debug) {
      //console.log(JSON.stringify(albums, null, 4));
      fs.writeFileSync(__dirname + "/../tmp/collections-parsed.json",
        JSON.stringify(albums, null, 4));
    }
  });
}
