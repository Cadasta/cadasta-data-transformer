var pg = require('./data_access.js');
var Q = require('q');
var data = module.exports = {};

/**
 *
 * @param field_data_id
 * @param form_data (CJF data - array of objects)
 * @callback db message (true or error)
 */
data.load = function (field_data_id,form_data) {

    var deferred = Q.defer();

        pg.query('SELECT * FROM cd_import_data_json(' + field_data_id + ',' + form_data + ')',function(err,res){
            if(err){

                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });

    return deferred.promise;
};
