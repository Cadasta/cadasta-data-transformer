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
var multer = require('multer');
var upload = multer();


//Loop thru providers folder and require each, and create routes
var app = {providers: {}, router: router};
var cjf = {};

app.dataProcessor = require('../controllers/processdata.js');
app.formProcessor = require('../controllers/processform.js');
app.data_access = require('../controllers/data_access.js');
app.validator = require('../controllers/validateform.js');


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


/***
 * For each provider found in the providers folder, create an API route
 */

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
            var results = cjf.data;

            //Pass along to Data Transformer
            app.dataProcessor.load(results).then(function () {

                    res.status(200).json({"status": "Data Loaded."});

                }).done();

        });

        //resp.end(util.inspect({fields:fields, files:files}));
        //parsedFile = parseCsv(files.upload[0].path);
        //console.log(parsedFile);
    });

});




router.get('/:provider/trigger/:formId', function (req, res, next) {
    trigger(req, res, next);
});

router.post('/:provider/trigger/:formId', function (req, res, next) {
    trigger(req, res, next);
});

function trigger(req, res, next) {
    var provider = app.providers[req.params.provider];
    var formId = req.params.formId;

    // Make sure the given provider is Ona, the one that registers triggers
    if (typeof provider.trigger !== 'function' || provider === null) {
        res.status(400).json({status: 400, msg: "Provider does not have a trigger method."});
        return;
    }

    if (!provider) {
        res.status(400).json({status: 400, msg: "Provider not found. Make sure the provider name is correct."});
        return;
    }

    if (!formId) {
        res.status(400).json({status: 400, msg: "You must specify a form id to register a trigger."});
        return;
    }

    // We don't care about the body of the request from Ona.
    // Ona is just hitting our trigger, which tells us that
    // there is new data. The Ona provider's trigger function
    // then goes in and fetches appropriate form data from
    // Ona's data.json endpoint.
    provider.trigger(formId, function(response) {
        if (response.status == "ERROR") {
            res.status(400).json(response);
        } else {
            res.status(200).json(response);
        }
    });

}

/**
 * @api {post} /providers/ona/load-form/:project_id Upload ONA Form
 * @apiName PostFormtoOna
 * @apiGroup Providers
 * @apiDescription Upload Ona Form
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
router.post('/:provider/load-form/:project_id',function (req, res, next) {
    var project_id = req.params.project_id;

    //Get the tokenized provider from the route and make sure it exists.
    //If we're all good, then try to fire the 'fetch' method for the provider
    var provider = app.providers[req.params.provider];

    if (typeof provider !== 'object' || provider === null) {
        res.status(400).json({status: 400, msg: "Provider not found. Make sure the provider name is correct."});
        return;
    }

    // Make sure the given provider is Ona, the one that registers triggers
    if (typeof provider.xlsToJson !== 'function' || typeof provider.uploadFormToOna !== 'function') {
        res.status(400).json({status: 400, msg: "Provider does not have a xls2Json method."});
        return;
    }

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {

        var file = files.xls_file;

        if (!file) {
            res.status(400).json({
                status: 'ERROR',
                msg: 'You must POST form-data with a key of "xls_file" and a value of an XLS Excel file.'
            });
        }

        provider.xlsToJson(file, function(xlsToJsonRes){
            if (xlsToJsonRes.status === 'ERROR') {
                res.status(400).json(xlsToJsonRes);
            }

            // validate parsed JSON
            app.validator(xlsToJsonRes)
                .then(function (response) {
                    // make request to ONA
                    provider.uploadFormToOna(response.data , project_id, file, function(r){

                        if (r.status === 'ERROR' || r.status === 'NO_ONA_API_KEY') {

                            res.status(400).json(r);

                        } else {

                            if (typeof provider.registerTrigger === 'function') {
                                // Register trigger for form
                                provider.registerTrigger(r.ona.form.formid, r.ona_api_key, function (obj) {
                                    if (obj.status == "ERROR") {
                                        obj.trigger = false;
                                        res.status(400).json(obj);
                                    } else {
                                        // load CJF form to DB
                                        app.formProcessor.load(r.ona)
                                            .then(function(r2){
                                                r2.trigger = true
                                                res.status(200).json(r2)
                                            })
                                            .catch(function(e2){
                                                e2.trigger = true;
                                                res.status(400).json(e2)
                                            });
                                    }
                                });
                            } else {
                                // load CJF form to DB
                                app.formProcessor.load(r.ona)
                                    .then(function(r3){
                                        r3.trigger = false;
                                        res.status(200).json(r3)
                                    })
                                    .catch(function(e3){
                                        e3.trigger = false;
                                        res.status(400).json(e3)
                                    });
                            }

                        }
                    });
                }).catch(function(err){
                    res.status(400).json(err);
                })
                .done()
        });

    });

});


module.exports = app;