var Q = require("q");
var forEach = require('async-foreach').forEach;

var pg = require('./data_access.js');

var validator = module.exports = {};

validator.ONA = function (form) {

    var deferred = Q.defer();

    //Check for minimum survey fields
    var filtered = form.children.filter(function (item) {
        if (item.name == 'tenure_type') return false;
        if (item.name == 'applicant/name') return false;
        if (item.name == 'date_land_possession') return true;
        if (item.name == 'means_of_acquire') return true;
    });

    if (filtered.length == 4) {
        deferred.resolve(form);
    } else {
        deferred.reject({"error": "Missing minimum survey fields"});
    }

    return deferred.promise;

};
