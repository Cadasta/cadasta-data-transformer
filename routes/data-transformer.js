var express = require('express');
var router = express.Router();
var form = require('../processes/processform');
var data = require('../processes/processdata');

var pg = require('../pg.js'); //

var survey_form = require('../data/form.js');

/* GET data-transformer route . */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  // clean up form data
  var results = pg.sanitize(JSON.stringify(survey_form.form.results));

  // process raw field data templates
  form.load(survey_form.form,function(id){

    data.load(id,results,function(res){
      console.log(res);
    });

  });

});

module.exports = router;
