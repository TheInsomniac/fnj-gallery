var util = require("util");

var fs = require("fs");
var config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"));

var FlickrAPI = require("flickr-oauth/index").FlickrAPI;
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
{ fullname: "Bob Smith",
  oauth_token: "12345678901234567-1234567890123456",
  oauth_token_secret: "1234567890123456",
  user_nsid: "12345678@N00",
  username: "bobsmith31337" }
*/

function getRequestToken() {
    "use strict";
    flickr.getOAuthRequestToken("http://www.flickr.com", function (error, oauth_token, oauth_token_secret, oauth_authorise_url, results) {
        if (error) {
            util.puts("error :" + error);
        } else {
            console.log(oauth_token, oauth_token_secret);
            console.log(oauth_authorise_url);
    //we can now store this for later - after the user has authenticated using the oauth_authorise_url
        }
    });
}

function getAccessToken(oauth_token, oauth_token_secret, oauth_verifier) {
    "use strict";
//USING THE oauth_token from "getOauthRequestToken" and the oauth_verifier for the callback_url we authenticate to obtain the access_codes
    flickr.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier,function(error, oauth_token, oauth_token_secret, results){
        if (error) {
            util.puts("error :" + util.inspect(error));
        } else {
            console.log(oauth_token, oauth_token_secret);
            console.log(util.inspect(results));
//we can now store this for later - after the user has authenticated using the oauth_authorise_url
        }
    });
}

