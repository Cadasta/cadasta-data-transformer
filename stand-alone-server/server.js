var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var compression = require('compression')
var bodyParser = require('body-parser');

var ingestion_engine = require('../src/ingestion/ingestion_base.js');

var settings = { apiPort: 3006 };

//Register the CSV Provider
require("cadasta-provider-csv").register(ingestion_engine);

// Create the express instance
var server = express();

// Set app env
server.set('env', 'development');

// compress all requests: gzip/deflate
server.use(compression());

// Body parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// Endpoint configuration
server.use('/providers', ingestion_engine.router);

// catch 404 and forward to error handler; Remove this?
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/


// START THE SERVER
// =============================================================================
server.listen(settings.apiPort, function(){

    console.log('Stand Alone Provider API listening on port ' + settings.apiPort);

});



module.exports = server;
