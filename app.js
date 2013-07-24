var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));

var flickr = require('./lib/flickr.js');
var USER_ID = config.user_id;
var OAUTH_TOKEN = config.oauth_token;
var OAUTH_SECRET = config.oauth_secret;

var express = require('express');
var app = new express();
var host = config.host;
var port = config.port;

var albums;
flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
    "use strict";
    albums = this;
});

// exposes '/'  and any .html contained within static folder
app.use(express.static(__dirname + '/static'));

// exposes '/albums'
app.get('/albums', function (req, res) {
    "use strict";
    //res.send(JSON.stringify(albums));
    res.json(albums);
});

// exposes '/albums/update'
app.get('/albums/update', function (req, res) {
    "use strict";
    flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        albums = this;
        res.send("Albums Updated!");
    });
});

// exposes '/photos?album=ALBUM_ID'
app.get('/photos', function (req, res) {
    "use strict";
    if (req.query.album) {
        flickr.getPhotos(OAUTH_TOKEN, OAUTH_SECRET, req.query.album, function () {
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

app.listen(port, function () {
    "use strict";
    console.log("Server listening on " + host + ":" + port);
});
