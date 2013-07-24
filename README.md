#Flickr-NodeJS-JQuery (FNJ Gallery)

*Note: This is my first attempt at **anything** javascript / NODE.js*  

This, appearance wise, is identical to my "Flickr-Python-JQuery" gallery but is based  
entirely on node.js and does not use static JSON files.  

This gallery connects via the Flickr API (using oauth) and retreives Photosets  
and photos on the fly.  

###Installation:  
    clone this repository
    npm install
    edit config.json to suit your needs. (You can skip the oauth parts at this time)

###Getting auth tokens for Flickr (from flickr-oauth):  
######Here Goes:
    Edit ./lib/flickr.js and remove the comments for getRequestToken();  
    node ./lib/flickr.js
    Copy the returned "oauth_token", "oauth_secret", and "oauth_verifier" for the next step  
    Edit ./lib/flickr.js and re-add the comment for getRequestToken();  
    Uncomment getAccessToken and replace the arguments with the values saved above.  
    node ./lib/flickr.js
    Copy the returned oauth_token, userID, and oauth_secret for the next step.  
    Place the resultant parameters into config.json
    Finally, edit ./lib/flickr.js again and re-add the comment for getAccessToken  

###Running:  
    node app.js
    Voila!
