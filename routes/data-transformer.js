var express = require('express');
var router = express.Router();
var survey = require('../processes/processform');

var survey_form = require('../data/form.js');
var survey_data = require('../processes/processdata');

var survey_ids = [];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  survey.processForm(survey_form.form,function(id){
    //survey_data.process_data(id,survey_form.form.results,function(){
    //  console.log('Survey data callback');
    //})
  });


});

module.exports = router;
