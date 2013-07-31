var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json'));

var flickr = require('./lib/photos.js'),
    USER_ID = config.user_id,
    OAUTH_TOKEN = config.oauth_token,
    OAUTH_SECRET = config.oauth_secret;

var express = require('express'),
    app = new express(),
    host = config.host,
    port = config.port;

var debug = config.debug,
    runServer = config.runServer,
    use = config.use,
    albums = null;

if (debug) {
    if (!fs.existsSync('./tmp')) {
        fs.mkdirSync('./tmp');
    }
}

// exposes '/'  and any files contained within static folder
// used for css/ and js/ files.
app.use(express.static(__dirname + '/static'));

if (use === "sets"){
    app.use(express.static(__dirname + '/views/sets'));
    flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        "use strict";
        albums = this;
        if (debug) {
            //console.log(JSON.stringify(albums, null, 4));
            fs.writeFileSync('./tmp/sets-parsed.json',
                JSON.stringify(albums, null, 4));
        }
    });
} else if (use === "collections") {
    app.use(express.static(__dirname + '/views/collections'));
    flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID, function () {
        "use strict";
        albums = this;
        if (debug) {
            //console.log(JSON.stringify(albums, null, 4));
            fs.writeFileSync('./tmp/collections-parsed.json',
                JSON.stringify(albums, null, 4));
        }
    });
}

// exposes '/albums'
app.get('/albums', function (req, res) {
    "use strict";
    res.json(albums);
});

// exposes '/albums/update'
app.get('/albums/update', function (req, res) {
    "use strict";
    if (use === "sets"){
        flickr.getUserPhotosets(OAUTH_TOKEN, OAUTH_SECRET, USER_ID,
            function () {
                albums = this;
                res.send("<h3>Albums Updated from Sets</h3></br>" +
                    "<a href=/index.html>Return Home</a>");
        });
    } else if (use === "collections"){
        flickr.getUserCollections(OAUTH_TOKEN, OAUTH_SECRET, USER_ID,
            function () {
                albums = this;
                res.send("<h3>Albums Updated from Collections</h3></br>" +
                    "<a href=/index.html>Return Home</a>");
        });
    }
});

// exposes '/photos?album=ALBUM_ID'
app.get('/photos', function (req, res) {
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

if (runServer) {
    app.listen(port, function () {
        "use strict";
        console.log("Server listening on:\nhttp://" + host + ":" + port +
                    "\nPress CTRL-C to terminate");
    });
}