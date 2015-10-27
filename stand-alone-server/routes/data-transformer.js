var express = require('express');
var router = express.Router();
var formProcessor = require('../../src/controllers/processform');
var dataProcessor = require('../../src/controllers/processdata');

var pg = require('../../src/controllers/data_access.js'); //
var cjf = require('../../tests/data/cjf-min.json');

// Load form
router.get('/data', function(req, res, next) {

    dataProcessor.load(cjf.data)
      .then(function(response){
          res.status(200).json(response);
      })
      .catch(function(err){
          res.status(200).json(err);
      })
      .done();

});

// Load data
router.get('/form', function(req, res, next) {

    formProcessor.load(cjf)
        .then(function(response){
            res.status(200).json(response);
        })
        .catch(function(err){
            res.status(200).json(err);
        })
        .done();

});

module.exports = router;
