// exposes "/albums"
app.get("/albums", function (req, res) {
  "use strict";
  res.json(albums);
});

// exposes "/albums/update"
app.get("/albums/update", function (req, res) {
  "use strict";
  if (use === "sets") {
    flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
      albums = this;
      res.send("<h3>Albums Updated from Sets</h3></br>" +
          "<a href=/index.html>Return Home</a>");
    });
  } else if (use === "collections") {
      flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        albums = this;
        res.send("<h3>Albums Updated from Collections</h3></br>" +
            "<a href=/index.html>Return Home</a>");
      });
    }
});
