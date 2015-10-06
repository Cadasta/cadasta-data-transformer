var express = require('express');
var router = express.Router();
var form = require('../../src/controllers/processform');
var data = require('../../src/controllers/processdata');

var pg = require('../../src/controllers/data_access.js'); //

//var survey_form = require('../../tests/data/form.js');

var cjf = require('../../tests/data/cjf-min.json');

// Load form
router.get('/data', function(req, res, next) {

  data.load(cjf.data)
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

    form.load(cjf)
        .then(function(response){
            res.status(200).json(response);
        })
        .catch(function(err){
            res.status(200).json(err);
        })
        .done();

});

module.exports = router;
