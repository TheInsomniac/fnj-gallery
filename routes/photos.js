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
