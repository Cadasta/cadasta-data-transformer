var pg = require('./data_access.js');
var Q = require('q');
var data = module.exports = {};

/**
 *
 * @param form_data
 */
data.load = function (form_data) {
    getFieldDataId()
        .then(function(field_data_id){
            return loadFieldData(field_data_id,form_data);
        })
};

/**
 *
 * @param field_data_id
 * @param form_data
 * @returns {*|promise}
 */
function loadFieldData(field_data_id,form_data){

    var deferred = Q.defer();

    pg.query('SELECT * FROM cd_import_data_json(' + field_data_id + ',' + form_data + ')',function(err,res){
        if(err){
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
    });

    return deferred.promise;
}

/**
 * Get id of latest survey from field_data table (assuming survey doesn't change)
 * @returns {*|promise}
 */
function getFieldDataId (){

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

