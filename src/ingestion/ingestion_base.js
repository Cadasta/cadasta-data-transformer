/***
 *
 * Cadasta Ingestion Engine is a framework to register specific data-type providers to ETL data into the Cadasta Platform.
 * This module itself doesn't do any data transformation.  Instead, it provides a base framework that each data-specific provider will register with.
 * In this way, a CSV parser may be registered with the engine, which itself will be required by the Cadasta base API.
 *
 * The Cadasta API should first require this module.
 * var ingestion_engine = require("cadasta-ingestion-engine");
 *
 * Next, require the provider and pass in the engine to register it.
 * require("cadasta-provider-csv").register(ingestion_engine);
 *
 */


var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var common = require("./../common");

//TODO: Add this back in when it exists.
var DataTransformer = require("../../index.js");
var dataTransformer = new DataTransformer({});

//Loop thru providers folder and require each, and create routes
var app = { providers: {},  router: router };


app.init = function(){

  buildProviderRoutes();
  buildProviderIndexRoute();
  buildProviderLoadRoutes();

}


/***
 * All Routes set up in this file are prepended with a /providers/ route.
 */

/***
 * For each provider found in the providers folder, create an API route
 */
var buildProviderRoutes = function() {

  router.get('/:provider', function (req, res, next) {

    //Look up the provider in the list of providers
    var provider = app.providers[req.params.provider];

    if (provider) {
      res.status(200).json({status: "hello " + req.params.provider + " ingestion!"});
    }
    else {
      //Provider not found
      res.status(200).json({status: "Provider " + req.params.provider + " not found. Make sure the provider name is correct."});
    }

  });

}

/***
 * Build a 'load' route for each provider that will execute the 'load' method
 */
var buildProviderLoadRoutes = function() {

  router.get('/:provider/load', function (req, res, next) {

    //Get the tokenized provider from the route and make sure it exists.
    //If we're all good, then try to fire the 'fetch' method for the provider
    var provider = app.providers[req.params.provider];

    if (!provider) {
      res.status(200).json({status: "Provider " + provider + " not found. Make sure the provider name is correct."});
      return;
    }

    //Get args, regardless of GET or POST
    var args = common.getArguments(req);

    //Next, check for a dataset.  We need a dataset to load.
    if (!args.files) {
      res.status(200).json({status: "Load command must include a data parameter with a dataset to load."});
      return;
    }


    provider.load(args.files, function (err, cjf) {

      res.status(200).json(result);

    });

  });

}


/***
 * Create a list (index) for each provider found in the providers folde
 */
var buildProviderIndexRoute = function(){

  router.get('/', function(req, res, next) {

    res.status(200).json({providers: Object.keys(app.providers)});

  });

}


router.get('/data-transformer', function(req, res, next) {

  res.status(200).json({providers: Object.keys(app.providers)});

});


//Initialize routes
app.init();
module.exports = app;


