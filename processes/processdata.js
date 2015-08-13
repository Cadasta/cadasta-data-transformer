var pg = require('../pg.js'); //

var data = module.exports = {};

data.load = function (field_data_id,form_data) {
    var async = setTimeout(function(){
        pg.query('SELECT * FROM cd_import_data_json(' + field_data_id + ',' + form_data + ')',function(err,res){
            if(!err){
                console.log(res);
            }
        });
    }, 20000)
};
