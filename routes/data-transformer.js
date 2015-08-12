var express = require('express');
var router = express.Router();
var survey = require('../processes/processform');
var pg = require('../pg.js'); //

var survey_form = require('../data/form.js');

/* GET data-transformer route . */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  // clean up form data
  var results = pg.sanitize(JSON.stringify(survey_form.form.results));

  // process raw field data templates
  survey.processForm(survey_form.form,function(id){

    var field_data_id = id;

    // wait 20 seconds to load field data results
    var async = setTimeout(function(){
      pg.query('SELECT * FROM cd_import_data_json(' + field_data_id + ',' + results + ')',function(err,res){
        if(!err){
          console.log(res);
        }
      });
    }, 20000)

  });

});

module.exports = router;
