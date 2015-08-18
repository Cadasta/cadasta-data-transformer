var express = require('express');
var router = express.Router();
var form = require('../../src/controllers/processform');
var data = require('../../src/controllers/processdata');

var pg = require('../../src/controllers/data_access.js'); //

var survey_form = require('../../tests/data/form.js');

/* GET data-transformer route . */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  // clean up form data
  var results = pg.sanitize(JSON.stringify(survey_form.form.results));

  // process raw field data templates
  form.load(survey_form.form,function(id){

    console.log("Loading in the survey response data now...")
    data.load(id,results,function(res){
      console.log(res);
    });

  });

});

module.exports = router;
