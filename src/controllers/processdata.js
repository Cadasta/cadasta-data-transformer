var pg = require('./data_access.js');
var Q = require('q');
var data = module.exports = {};

/**
 *
 * @param form_data
 */
data.load = function (form_data) {

    var deferred = Q.defer();

    loadFieldData(form_data)
        .then(function(response){
            deferred.resolve({status:response});
        }).catch(function(err){
            deferred.reject({error:err});
        });

    return deferred.promise;
};

/**
 *
 * @param field_data_id
 * @param form_data
 * @returns {*|promise}
 */
function loadFieldData(form_data){

    var deferred = Q.defer();

    var data = pg.sanitize(JSON.stringify(form_data));
    var sql = 'SELECT * FROM cd_import_data_json(' + data + ')';

    //TODO pass project id instead of field_data_id
    pg.queryDeferred(sql)
        .then(function(res){
            // DB function returns true or false
            if(res[0].cd_import_data_json){
                deferred.resolve('Data Loaded.');
            } else {
                //TODO send back better error
                deferred.reject('Cannot find field_data_id');
            }
        })
        .catch(function(err){
            deferred.reject(err);
        });

    return deferred.promise;
}

/**
 * Get id of latest survey from field_data table (assuming survey doesn't change)
 * @returns {*|promise}
 */
function getFieldDataId (id_string){

    var deferred = Q.defer();

    var sql = 'SELECT id FROM field_data ORDER BY id DESC LIMIT 1';

    pg.query(sql, function (err, res) {

        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res[0].id);
        }

    });

    return deferred.promise;

}

