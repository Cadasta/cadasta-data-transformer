var pg = require('pg');
var Q = require("q");
var events = require('events').EventEmitter.prototype._maxListeners = 1000;
var settings = require('../module-settings/module-settings.js')

// PostGIS Connection String
var conString = "postgres://" +
    settings.pg.user + ":" +
    settings.pg.password + "@" +
    settings.pg.server + ":" +
    settings.pg.port + "/" +
    settings.pg.database;

//var conString = global.conString;

/**
 * Main query function to execute an array of SQL queries.
 *
 * @type {Function}
 */
var queryArr = module.exports.queryArr = function (queryStrArr, cb) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error('error fetching client from pool', err);
        }

        var errArr = [];
        var resultArr = [];

        queryStrArr.forEach(function (query,i) {
            client.query(query, function (queryerr, result) {
                done();
                if(queryerr) {
                    errArr.push(queryerr);
                }
                if(result) {
                    resultArr.push(result);
                }

                if (queryerr) {
                    console.error('ERROR RUNNING QUERY:', query, queryerr);
                }
                //cb((err || queryerr), (result && result.rows ? result.rows : result));

                if(i == queryStrArr.length - 1){
                    cb(errArr,resultArr);

                }

            });


        });


    });
};



/**
 * Main query function to execute an SQL query.
 *
 * @type {Function}
 */
var query = module.exports.query = function (queryStr, cb) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error('error fetching client from pool', err);
        }

        client.on('notification', function(msg){
            console.log(msg);
        });

        client.query(queryStr, function (queryerr, result) {
            done();
            if (queryerr) {
                console.error('ERROR RUNNING QUERY:', queryStr, queryerr);
            }
            cb((err || queryerr), (result && result.rows ? result.rows : result));
        });

    });
};

var dQuery = module.exports.queryDeferred = function (queryStr) {

    var deferred = Q.defer();

    pg.connect(conString, function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
        }
        client.query(queryStr, function(queryerr, result) {
            done();
            if(queryerr) {
                //console.error('ERROR RUNNING QUERY:', queryStr, queryerr);
                deferred.reject(queryerr);
            } else {
                deferred.resolve(result && result.rows ? result.rows : result);
            }

        });
    });

    return deferred.promise;
};


var sanitize = module.exports.sanitize = function (val) {
    // we want a null to still be null, not a string
    if (typeof val === 'string' && val !== 'null') {
        // $nh9$ is using $$ with an arbitrary tag. $$ in pg is a safe way to quote something,
        // because all escape characters are ignored inside of it.
        var esc = settings.pg.escapeStr;
        return "$" + esc + "$" + val + "$" + esc + "$";
    }
    return val;
};
