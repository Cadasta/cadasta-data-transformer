var express = require('express');
var router = express.Router();
var survey = require('../processes/processform');
var pg = require('../pg.js'); //

var survey_form = require('../data/form.js');
var survey_data = require('../processes/processdata');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  var form = pg.sanitize(JSON.stringify(survey_form.new_form.results));

  survey.processForm(survey_form.new_form,function(id){

    var survey_id = id;

    var async = setTimeout(function(){
      pg.query('SELECT * FROM cd_import_data_json(' + survey_id + ',' + form + ')',function(err,res){
        console.log(res);
      });
    }, 20000)

  });




});

module.exports = router;
