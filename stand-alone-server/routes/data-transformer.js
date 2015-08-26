var express = require('express');
var router = express.Router();
var form = require('../../src/controllers/processform');
var data = require('../../src/controllers/processdata');

var pg = require('../../src/controllers/data_access.js'); //

var survey_form = require('../../tests/data/form.js');

/* GET data-transformer route . */
router.get('/', function(req, res, next) {

  // clean up form data
  var results = pg.sanitize(JSON.stringify(survey_form.form.results));

  form.load(survey_form.form)
      .then(function(surveyId){

        return data.load(results);
      })
      .then(function(response){

          res.send('Survey and responses loaded successfully.');

      })
      .catch(function(err){

        res.send(err);

      })
      .done();


});

module.exports = router;
