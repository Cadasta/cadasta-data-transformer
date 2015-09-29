var express = require('express');
var router = express.Router();
var form = require('../../src/controllers/processform');
var data = require('../../src/controllers/processdata');

var pg = require('../../src/controllers/data_access.js'); //

//var survey_form = require('../../tests/data/form.js');

var survey = require('../../tests/data/cjf-min.json');

/* GET data-transformer route . */
router.get('/', function(req, res, next) {

  // clean up form data
  //var cjfdata = pg.sanitize(JSON.stringify(survey.data));

  form.load(survey.form)
      .then(function(field_data_id){
          res.send('Survey: ' + field_data_id +  ' loaded successfully.');
      })

      .catch(function(err){

        res.send(err);

      })
      .done();


});

module.exports = router;
