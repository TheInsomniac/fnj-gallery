var util = require('util');
var querystring = require('querystring');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));

var FlickrAPI = require('flickr-oauth/index').FlickrAPI;
var API_KEY = config.api_key;
var API_SECRET = config.api_secret;
var flickr = new FlickrAPI(API_KEY, API_SECRET);


//getRequestToken();
/*
Returns:
oauth_token=12345678901234567-1234567890123456
oauth_token_secret=1234567890123456
oauth_verifier=1234567890123456
*/

//getAccessToken("12345678901234567-1234567890123456", "1234567890123456", "1234567890123456");
/*
Returns:
12345678901234567-1234567890123456 1234567890123456
{ fullname: 'Bob Smith',
  oauth_token: '12345678901234567-1234567890123456',
  oauth_token_secret: '1234567890123456',
  user_nsid: '12345678@N00',
  username: 'bobsmith31337' }
*/

function getRequestToken(){
    "use strict";
    flickr.getOAuthRequestToken("http://localhost:4010/auth/complete", function (error, oauth_token, oauth_token_secret, oauth_authorise_url, results) {
        if (error) {
            util.puts('error :' + error);
        } else {
            console.log(oauth_token, oauth_token_secret);
            console.log(oauth_authorise_url);
    //we can now store this for later - after the user has authenticated using the oauth_authorise_url
        }
    });
}

function getAccessToken(oauth_token, oauth_token_secret, oauth_verifier) {
    "use strict";
//USING THE oauth_token from 'getOauthRequestToken' and the oauth_verifier for the callback_url we authenticate to obtain the access_codes
    flickr.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier,function(error, oauth_token, oauth_token_secret, results){
        if (error) {
            util.puts('error :' + util.inspect(error));
        } else {
            console.log(oauth_token, oauth_token_secret);
            console.log(util.inspect(results));
//we can now store this for later - ater the user has authenticated using the oauth_authorise_url
        }
    });
}

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
        var photoSets = data['photosets']['photoset']
        var albums = [];
        var i = null;
        for (i = 0; photoSets.length > i; i += 1) {
            albums.push({id: photoSets[i].id, title: photoSets[i].title._content});
        }
        if (callback) {
            callback.call(albums);
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
            callback.call(photos);
        }
    });
}

module.exports = {
    getUserPhotos : getUserPhotos,
    getUserPhotosets : getUserPhotoSets,
    getPhotos : getPhotos
}
