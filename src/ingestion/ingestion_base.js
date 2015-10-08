/***
 *
 * Cadasta Ingestion Engine is a framework to register specific data-type providers to ETL data into the Cadasta Platform.
 * This module itself doesn't do any data transformation.  Instead, it provides a base framework that each data-specific provider will register with.
 * In this way, a CSV parser may be registered with the engine, which itself will be required by the Cadasta base API.
 *
 * The Cadasta API should first require this module.
 * var ingestion_engine = require("cadasta-ingestion-engine");
 *
 * Next, require the provider and pass in the engine to register it.
 * require("cadasta-provider-csv").register(ingestion_engine);
 *
 */


var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var common = require("./../common");
var multiparty = require('multiparty');
var PythonShell = require('python-shell');

//Loop thru providers folder and require each, and create routes
var app = {providers: {}, router: router};
var cjf = {};

app.dataProcessor = require('../controllers/processdata.js');
app.formProcessor = require('../controllers/processform.js');
app.data_access = require('../controllers/data_access.js');
app.validator = require('../controllers/validateform.js');


app.init = function () {

  buildProviderRoutes();
  buildProviderIndexRoute();
  buildProviderLoadRoutes();

}


/***
 * All Routes set up in this file are prepended with a /providers/ route.
 */

/***
 * For each provider found in the providers folder, create an API route
 */
var buildProviderRoutes = function () {

  router.get('/:provider', function (req, res, next) {

    //Look up the provider in the list of providers
    var provider = app.providers[req.params.provider];

    if (provider) {
      res.status(200).json({status: "hello " + req.params.provider + " ingestion!"});
    }
    else {
      //Provider not found
      res.status(200).json({status: "Provider " + req.params.provider + " not found. Make sure the provider name is correct."});
    }

  });

}

/***
 * Build a 'load' route for each provider that will execute the 'load' method
 */
var buildProviderLoadRoutes = function () {

  /**
   * @api {post} /providers/:provider/load Upload data
   * @apiName PostFileToProvider
   * @apiGroup Providers
   * @apiDescription Upload data in a "provider-defined" format
   * @apiParam {String} provider name/type of provider, e.g. csv
   * @apiParam {Object} postdata the POST data
   * @apiParam {file} postdata.file_upload the data file uploaded
   *
   * @apiSuccess {String} status message noting that the data is loaded
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost/providers/csv/load
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *
   *     { "status": "Data Loaded." }
   */
  router.post('/:provider/load', function (req, res, next) {

    //Get the tokenized provider from the route and make sure it exists.
    //If we're all good, then try to fire the 'fetch' method for the provider
    var provider = app.providers[req.params.provider];

    if (!provider) {
      res.status(200).json({status: "Provider " + provider + " not found. Make sure the provider name is correct."});
      return;
    }

    var form = new multiparty.Form();
    var parsedFile;

    form.parse(req, function (err, fields, files) {

      var file = files.file_upload;

      //Next, check for a dataset.  We need a dataset to load.
      if (!file || !file[0]) {
        res.status(200).json({status: "Load command must include a 'file_upload' parameter with a dataset to be loaded."});
        return;
      }


      provider.load(file[0].path, function (err, cjf) {

        //Got the CJF.
        var results = app.data_access.sanitize(JSON.stringify(cjf.data));

        //Pass along to Data Transformer
        app.dataProcessor.load(results).then(function (surveyId) {

          res.status(200).json({"status": "Data Loaded."});

        }).done();

      });

      //resp.end(util.inspect({fields:fields, files:files}));
      //parsedFile = parseCsv(files.upload[0].path);
      //console.log(parsedFile);
    });

  });

}


/***
 * Create a list (index) for each provider found in the providers folder
 */
var buildProviderIndexRoute = function () {

  /**
   * @api {post} /providers Show list of all providers
   * @apiName GetProviders
   * @apiGroup Providers
   *
   *
   * @apiSuccess {String[]} providers list of available providers
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost/providers
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *
   *     { "providers": ["csv"] }
   */
  router.get('/', function (req, res, next) {

    res.status(200).json({providers: Object.keys(app.providers)});

  });

}

/**
 * @api {post} /providers/ona/load-form/:project_id Upload ONA Form
 * @apiName PostFormtoONA
 * @apiGroup Providers
 * @apiDescription Upload ONA Form
 * @apiParam {Number} Cadasta project id
 * @apiParam {Object} postdata the POST data
 *
 * @apiSuccess {String} status message noting that the form is loaded
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/providers/ona/load-form/1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     { "status": "Form Loaded." }
 */
//TODO create docs
router.post('/ona/load-form/:project_id', function (req, res, next) {

  var project_id = req.params.project_id;

  // update cjf
  cjf.form = req.body.data;
  cjf.form.formid = req.body.formid;
  cjf.project_id = project_id;

  // load form to DB
  app.formProcessor.load(cjf)
      .then(function(response){

        res.status(200).json({status: "Form Loaded."});

      }).catch(function(err){

        res.status(200).json({error:err});
      });

});

/**
 * ONA provider validation
 * TODO - make entensible for all providers?
 * TODO - create API docs
 * TODO - need path to python
 */

/**
 * @api {post} /providers/ona/validate Validate ONA XLSForm
 * @apiName ValidateONAXLSForm
 * @apiGroup Providers
 * @apiDescription Upload ONA Form
 * @apiParam {file} postdata.xls_file the POST data
 *
 * @apiSuccess {Object} Object with status message and JSON representation of XLSForm
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/providers/ona/validate
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     {
  "status": "Validation Complete.",
  "data": {
    "name": "ASPimGMbYsam8yc9ppcZzzPs",
    "title": "Cadasta CJF Minimum Monday3",
    "sms_keyword": "CJF-minimum-Monday3",
    "default_language": "default",
    "id_string": "CJF-minimum-Monday3",
    "type": "survey",
    "children": [
      {
        "type": "start",
        "name": "start"
      },
      {
        "type": "end",
        "name": "end"
      },
      {
        "type": "today",
        "name": "today"
      },
      {
        "type": "deviceid",
        "name": "deviceid"
      },
      {
        "type": "note",
        "name": "title",
        "label": "Cadasta CJF Minimum – September 2015"
      },
      {
        "choices": [
          {
            "name": "katechapman",
            "label": "Kate Chapman"
          },
          {
            "name": "frankpichel",
            "label": "Frank Pichel"
          },
          {
            "name": "ryanwhitley",
            "label": "Ryan Whitley"
          },
          {
            "name": "danielbaah",
            "label": "Daniel Baah"
          },
          {
            "name": "toddslind",
            "label": "Todd Slind"
          },
          {
            "name": "nicholashallahan",
            "label": "Nicholas Hallahan"
          }
        ],
        "type": "select one",
        "name": "surveyor",
        "label": "Name of Surveyor"
      },
      {
        "control": {
          "appearance": "field-list"
        },
        "children": [
          {
            "type": "text",
            "name": "applicant_name_first",
            "label": "Applicant First Name"
          },
          {
            "type": "text",
            "name": "applicant_name_middle",
            "label": "Applicant Middle Name"
          },
          {
            "type": "text",
            "name": "applicant_name_last",
            "label": "Applicant Last Name (Surname)"
          }
        ],
        "type": "group",
        "name": "applicant_name",
        "label": "Name of Applicant"
      },
      {
        "type": "geopoint",
        "name": "geo_location",
        "label": "Location of Parcel"
      },
      {
        "type": "date",
        "name": "date_land_possession",
        "label": "Date of Land Possession"
      },
      {
        "choices": [
          {
            "name": "freehold",
            "label": "Freehold"
          },
          {
            "name": "lease",
            "label": "Lease"
          },
          {
            "name": "inheritance",
            "label": "Inheritance"
          },
          {
            "name": "gift",
            "label": "Gift"
          },
          {
            "name": "other",
            "label": "Other"
          }
        ],
        "type": "select one",
        "name": "means_of_acquire",
        "label": "How did you acquire the land?"
      },
      {
        "choices": [
          {
            "name": "allodial",
            "label": "Allodial Ownder"
          },
          {
            "name": "freehold",
            "label": "Freehold"
          },
          {
            "name": "common_law_freehold",
            "label": "Common Law Freehold"
          },
          {
            "name": "lease",
            "label": "Leasehold Interest"
          },
          {
            "name": "contractual",
            "label": "Contractual / Share Cropping / Customary Tenure Agreement"
          }
        ],
        "type": "select one",
        "name": "tenure_type",
        "label": "What is the Social Tenure Type?"
      },
      {
        "control": {
          "bodyless": true
        },
        "type": "group",
        "name": "meta",
        "children": [
          {
            "bind": {
              "readonly": "true()",
              "calculate": "concat('uuid:', uuid())"
            },
            "type": "calculate",
            "name": "instanceID"
          }
        ]
      }
    ]
  }
}
 *
 */

router.post('/ona/validate', function (req, res, next) {

  var form = new multiparty.Form();

  //var project_id = req.params.project_id;

  form.parse(req, function (err, fields, files) {

    // save xls file
    var file = files.xls_file;

    // python-shell options
    var options = {
      scriptPath: path.join(__dirname + ' ../../../pyxform/pyxform/'), // location of script dir
      args: [file[0].path],
      mode: "text"
    };

    var formObj;

    PythonShell.run('xls2json.py',options, function (err, results) {
      if (err) throw err;

      var obj = "";

      // concat results into JSON string
      results.forEach(function (res) {
        obj += res;
      });

      formObj = JSON.parse(obj);  // parse JSON string

      // validate parsed JSON
      app.validator.ONA(formObj)
          .then(function (result) {
            // form has passed validation, send back to user
            res.status(200).json({status: "Validation Complete.", data:result});
            //res.send({success: 'Validation Complete', formObj:formObj});
          })
          .catch(function (err) {
            res.status(200).json({error: err});
            //res.send({error: err});
          });
    });

  });

});



//Initialize routes
app.init();
module.exports = app;