/***
 * common.js is a collection of commonly used functions by the main app.js and all submodules.
 */

var http = require("http"),
    fs = require("fs");

var common = {};
common.formatters = {};

common.respond = function (req, res, args, callback) {

    // File name the respondant JSON will be if downloaded.
    var downloadFileName = args.name || args.table || 'download';

    // makes the json pretty if desired. (2 space indent)
    var indent = args.pretty ? 2 : null;

    //Show or hide different NAV elements based on whether the endpoint is installed or not

    //Write out a response as JSON or HTML with the appropriate arguments.  Add more formats here if desired
    if (!args.format || args.format.toLowerCase() == "html") {
        //calculate response time
        args.responseTime = new Date - req._startTime; //ms since start of request

        //Determine sample request based on args
        if(args.view){
            res.render(args.view, args);
        }
        else{
            res.send(JSON.stringify(args));
        }
    }
    else if (args.format && (args.format.toLowerCase() == "json" || args.format.toLowerCase() == "esrijson" || args.format.toLowerCase() == "j")) {
        //Respond with JSON
        if (args.errorMessage) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ error: args.errorMessage }, null, indent));
        }
        else if(args.infoMessage) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ error: args.infoMessage }, null, indent));
        }
        else {
            //Send back json file
            res.setHeader('Content-disposition', 'attachment; filename=' + downloadFileName + '.json');
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(args.featureCollection, null, indent));
            //Determine sample request based on args
            //res.render(args.view, args);
        }
    }
    else if (args.format && (args.format.toLowerCase() == "json" || args.format.toLowerCase() == "esrijson" || args.format.toLowerCase() == "j")) {
        //Respond with JSON
        if (args.errorMessage) {
            res.jsonp({ error: args.errorMessage });
        }
        else {
            //Send back json file
            //res.setHeader('Content-disposition', 'attachment; filename=' + args.table + '.json');
            //res.writeHead(200, {
            //    'Content-Type': 'application/json'
            //});
            //res.end(JSON.stringify(args.featureCollection));
            res.jsonp(args.featureCollection);

        }
    }
    else if (args.format.toLowerCase() == "geojson") {
        //Set initial header
        res.setHeader('Content-disposition', 'attachment; filename=' + downloadFileName + '.geojson');

        //Responsd with GeoJSON
        if (args.errorMessage) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ error: args.errorMessage }, null, indent));
        }
        else {
            //Send back json file
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(args.featureCollection, null, indent));
        }
    }
    else if (args.format && (args.format.toLowerCase() == "shapefile")) {
        //Requesting Shapefile Format.
        //If there's an error, return a json
        if (args.errorMessage) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ error: args.errorMessage }, null, indent));
        }
        else {
            //Send back a shapefile
            res.download(args.file, function () {
                callback(args.file)
            });
        }
    }
    else if (args.format && (args.format.toLowerCase() == "csv")) {
        //Responsd with CSV
        //If there's an error, return a json
        if (args.errorMessage) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ error: args.errorMessage }, null, indent));
        }
        else {
            var filename = downloadFileName + ".csv";
            //Send back a csv
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.writeHead(200, {
                'Content-Type': 'text/csv'
            });
            res.end(args.featureCollection);
        }
    }
    else {
        //If unrecognized format is specified
        if (args.errorMessage) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ error: args.errorMessage }, null, indent));
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(args.featureCollection, null, indent));
        }
    }

}


//Utilities
common.log = function (message) {
    //Write to console
    console.log(message);
}


//Determine if a string contains all numbers.
common.IsNumeric = function (sText) {
    var ValidChars = "0123456789";
    var IsNumber = true;
    var Char;

    sText.toString().replace(/\s+/g, '')

    for (var i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}


//Take in an array, spit out an array of escaped columns
common.escapePostGresColumns = function (items) {
    //wrap all strings in double quotes
    return items.map(function (item) {
        //remove all quotes then wrap with quotes, just to be sure
        return '"' + item.replace(/"/g, "") + '"';
    });
}

//Take in an array, spit out an array of unescaped columns
common.unEscapePostGresColumns = function (items) {
    //remove all double quotes from strings

    if(!items) return "";

    return items.map(function (item) {
        //remove all quotes
        return item.replace(/"/g, "");
    });
}

common.isValidSQL = function (item) {
    //if(!item || item.length == 0) return true;

    //var illegalChars = /[\<\>\;\\\/\"\'\[\]]/;

    //if (illegalChars.test(item)) {
    //    //String contains invalid characters
    //    log("invalid sql: " + item);
    //    return false;
    //} else {
    //    return true;
    //}
    return true;
    //TODO - add validation code.
};

common.getArguments = function (req) {
    var args;

    //Grab POST or QueryString args depending on type
    if (req.method.toLowerCase() == "post") {
        //If a post, then arguments will be members of the this.req.body property
        args = req.body;
    } else if (req.method.toLowerCase() == "get") {
        //If request is a get, then args will be members of the this.req.query property
        args = req.query;
    }
    return args;
}

common.getProtocol = function(req){
  return ((req.secure ? "https:" : "http:") + "//");
}

module.exports = common;
