var pg = require('../pg.js'); //

var data = module.exports = {};


data.process_data = function(survey_id, data,callback){
    var data_survey_id = data[0];

    if (data_survey_id !== null) {
        data.forEach(function(res){
            data_handler(data_survey_id, res, function () {
                console.log('Data Handler Finished....');
            });
        })
    }

};

//var create_person = function(first_name, last_name);

var data_handler = function (survey_id,data,callback){

    //loop through object keys and to get first/last name


};


