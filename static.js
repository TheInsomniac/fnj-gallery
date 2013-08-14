function getStaticFiles(express, app, debug, fs, config) {
  "use strict";
  // exposes site-wide css files
  app.use(express.static(__dirname + "/static/css"));

  if (config.node_env === "development") {
    // if development serve unminified js files
    app.use(express.static(__dirname + "/static/js/dev"));
  } else {
    // if production serve minified js files
    app.use(express.static(__dirname + "/static/js/prod"));
  }

  // Choose html rendered for gallery based upon sets or collections setting
  if (config.use === "sets") {
    app.use(express.static(__dirname + "/views/sets"));
  } else if (config.use === "collections") {
    app.use(express.static(__dirname + "/views/collections"));
  }
}

exports.getStaticFiles = getStaticFiles;