var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));

var FlickrAPI = require('flickr-oauth/index').FlickrAPI;
var API_KEY = config.api_key;
var API_SECRET = config.api_secret;
var flickr = new FlickrAPI(API_KEY, API_SECRET);

function getUserPhotos(auth_token, auth_token_secret, userId, callback) {
    "use strict";
    flickr.authenticate(auth_token, auth_token_secret).people.getPhotos(userId, function (err, data) {
        console.log(err);
        if (callback) {
            callback.call(data);
        }
    });
}

function getUserPhotoSets(auth_token, auth_token_secret, userId, callback) {
    "use strict";
    flickr.authenticate(auth_token, auth_token_secret).photosets.getList(userId, function (err, data) {
        console.log(err);
        var photoSets = data.photosets.photoset;
        var albums = [];
        var i = null;
        for (i = 0; photoSets.length > i; i += 1) {
            albums.push({id: photoSets[i].id, title: photoSets[i].title._content});
        }
        albumSort.insensitive = true;
        albums.sort(albumSort);
        if (callback) {
            callback.call(albums.reverse());
        }
    });
}

function getPhotos(auth_token, auth_token_secret, id, callback) {
    "use strict";
    flickr.authenticate(auth_token, auth_token_secret).photosets.getPhotos(id, "", function (err, data) {
        console.log(err);
        var photos = [];
        if (data.stat !== 'fail') {
            var photoSet = data.photoset.photo;
            var i = null;
            for (i = 0; photoSet.length > i; i += 1) {
                var title, photo_url, thumb_url;
                title = photoSet[i].title.slice(0, -4).replace(/[^A-Za-z0-9]+/g, ' ');
                photo_url = "http://farm" + photoSet[i].farm + ".static.flickr.com/" +
                    photoSet[i].server + "/" + photoSet[i].id + "_" + photoSet[i].secret + "_b.jpg";
                thumb_url = "http://farm" + photoSet[i].farm + ".static.flickr.com/" +
                    photoSet[i].server + "/" + photoSet[i].id + "_" + photoSet[i].secret + "_q.jpg";
                photos.push({title: title, thumb: thumb_url, large: photo_url});
                //photos.push({id: photoSet[i].id, title: photoSet[i].title, secret: photoSet[i].secret,
                //        farm: photoSet[i].farm, server: photoSet[i].server});
            }
        }
        if (callback) {
            callback.call(photos.reverse());
        }
    });
}

// naturalSort function from:
// http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/
function albumSort (a, b) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) { return albumSort.insensitive && (''+s).toLowerCase() || ''+s },
        // convert all to strings strip whitespace
        x = i(a.title).replace(sre, '') || '',
        y = i(b.title).replace(sre, '') || '',
        // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD)
        if ( xD < yD ) return -1;
        else if ( xD > yD ) return 1;
    // natural sorting through split numeric strings and default strings
    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) return -1;
        if (oFxNcL > oFyNcL) return 1;
    }
    return 0;
}

module.exports = {
    getUserPhotos : getUserPhotos,
    getUserPhotosets : getUserPhotoSets,
    getPhotos : getPhotos
};