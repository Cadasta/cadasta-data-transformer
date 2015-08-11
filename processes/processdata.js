var pg = require('../pg.js'); //

var data = module.exports = {};


data.process_data = function (field_data_id, data, callback) {

    data.forEach(function (res) {
        data_handler(field_data_id, res, function () {
            //console.log('Data Handler Finished....');
        });
    })
};

var data_handler = function (id, data, callback) {

    var data_field_id = id;
    var data_first_name;
    var data_last_name;
    var person_id;
    var data_respondent_id;

    for (var item in data) {

        switch (item) {
            case 'applicant_name/applicant_name_first':
                data_first_name = data[item];
                break;
            case 'applicant_name/applicant_name_last':
                data_last_name = data[item]
                break;
        }

    }

    if (data_first_name !== null && data_last_name !== null) {
        create_party(data_first_name, data_last_name, function (res) {
            person_id = res;
        });
    }

    create_respondent(data_field_id, function (res) {
        data_respondent_id = res;

        response_handler(data, data_field_id, data_respondent_id);

    });

};

var response_handler = function(data,field_id,respondent_id){

    for(var item in data){

        var num_slugs = item.split('/').length;
        var question_slug = item.split('/')[num_slugs-1];
        var response = pg.sanitize(data[item]);

        var q = 'INSERT INTO response (respondent_id, question_id, text) VALUES (' + respondent_id + ',' + '(' +
            'SELECT id from question where lower(name) = ' + pg.sanitize(question_slug) + ' AND field_data_id = ' + field_id +  '),' + data[item] +')';

        //console.log(q);

        //getQuestionID(question_slug,id,function(id){
        //    ////console.log("label: " + question_slug +  " Question id: " + id);
        //});

    }
};

var getQuestionID = function (slug,data_field_id,callback){
    var q = 'SELECT id from question where lower(name) = ' + pg.sanitize(slug) + ' AND field_data_id = ' + data_field_id;

    pg.query(q,function(err,res){
        ////console.log(slug);
        if(res.length > 0){
            callback(parseInt(res[0].id))
        } else {
            callback(null);
        }
    });


};

var getNumquestions = function(slug,data_field_id,callback){
    var q = 'SELECT count(id) from question WHERE lower(name) = lower(' + pg.sanitize(slug) + ') and field_data_id = ' + data_field_id;

    pg.query(q,function(err,res){
        if(res.length>0){
            callback(parseInt(res[0].count));
        } else {
            callback(0);
        }
    });
};

var create_party = function (first_name, last_name, callback) {

    var q = 'SELECT * FROM cd_create_party (' + pg.sanitize(first_name) + ',' + pg.sanitize(last_name) + ')';

    pg.query(q,function(err,res){
        callback(res[0].id);
    })

};

var create_respondent = function (id, callback) {
    var q = 'INSERT INTO respondent (field_data_id) VALUES (' + id + ') RETURNING id';

    pg.query(q,function(err, res){
        callback(res[0].id);
    })

};



