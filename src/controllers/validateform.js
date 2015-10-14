var Q = require("q");
var pg = require('./data_access.js');

module.exports = function (form) {

    var deferred = Q.defer();

    //Check for minimum survey fields
    var filtered = form.children.filter(function (item) {
        if (item.name == 'tenure_type') return true;
        if (item.name == 'applicant_name') return true;
        if (item.name == 'date_land_possession') return true;
        if (item.name == 'means_of_acquire') return true;
    });

    if (filtered.length == 4) {
        deferred.resolve({status: "OK", data:form});
    } else {
        deferred.reject({status:"ERROR", msg:"Failed validation: Missing minimum survey fields"});
    }

    return deferred.promise;

};

