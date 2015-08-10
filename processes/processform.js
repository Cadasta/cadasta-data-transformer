/**
 *  --- Process survey and Load to databases  ---
 *
 * Each question in a survey is associated with a specific type. When a question is of type 'select one,'
 * the options a user has to select from are referred to as its children. These options are loaded into the Option table in the Cadasta DB.
 *
 * A question of type 'group' or 'repeat' has one ore more follow up questions. These follow up questions are also
 * referred to as 'children.' This single group of children is loaded into the group table in the Cadasta DB.
 * Each child in the group is checked for type; when that specific question is also of type 'group' or 'repeat,' a new group is created.
 * This new group of questions is referred to a grandchildren. This cycle is repeated one more level, to great-grandchildren.
 *
 * All other question types are individually loaded in the question table in the Cadasta DB
 *
 */

var pg = require('../pg.js'); //
var DataProcessor = require('../processes/processdata');
var forEach = require('async-foreach').forEach;

var survey = module.exports = {};

var section_id = null;
var group_id;
var survey_id;
var metadata;
var formdata;

survey.processForm = function (form, callback) {

    metadata = form.metadata;
    formdata = form.results;

    var idString = pg.sanitize(metadata.id_string);
    var name = pg.sanitize(metadata.name);
    var title = pg.sanitize(metadata.title);

    createSurvey(idString, name, title, function (error, id) {

        survey_id = id;

        if (error.length === 0 && id !== null) {
            //console.log("Survey successfully created.");


            //call recursive function
            //pass json.children & null

            node_handler(metadata.children,null);

            DataProcessor.process_data(survey_id,formdata);

            //parent_handler(json,function(){
            //
            //});
        }

    });

};

var node_handler = function(children,parent_id,itemDone){

    children.forEach(function(child_node, index, arr){

        var name = child_node.name || null;
        var label = child_node.label || null;
        switch (child_node.type) {
            case 'note':

                // create note
                note_handler(child_node.name,child_node.label, function (section_id) {
                    //console.log('Note Section created for survey: ' + section_id);
                    //var async = setTimeout(function(){
                    //    done();
                    //}, 500);
                });

                break;
            case 'group':
            case 'repeat':
                // hand parents children
                //console.log('Group');

                forEach(children,function(item,index,arr){
                    var done = this.async();
                    group_handler(done,child_node.children,parent_id, name, label);

                });

            case 'select one':
            case 'select all that apply':
                ////console.log('select one');
                // create question
                get_type_id(child_node.type,function(type_id){
                    question_handler(name, label, type_id, parent_id, function (question_id) {

                        // make sure question type has children
                        if(child_node.hasOwnProperty('children') == true) {
                            // create new option rows
                            option_handler(child_node.children, question_id, name, label,
                                function (c) {
                                    //var async = setTimeout(function(){
                                    //    done();
                                    //}, 500);
                                });
                        }

                    });
                });
                break;
            default:
                // handle normal question types; these types do not have children, therefore a new question row is created
                get_type_id(child_node.type,function(type_id){
                    question_handler(name, label, type_id, parent_id, function (question_id) {
                        //var async = setTimeout(function(){
                        //    done();
                        //}, 500);
                    });
                })

        }

    });

};

// create new survey in Cadasta DB
var createSurvey = function (id_string, name, title, callback) {

    var q1 = 'SELECT * FROM cd_create_field_data(' + (id_string) + ')';

    pg.query(q1, function (error, result) {

        survey_id = result[0].cd_create_field_data; // save new survey id

        var updateSurvey = [];
        updateSurvey.push('UPDATE field_data SET name = ' + name + 'where id=' + survey_id);
        updateSurvey.push('UPDATE field_data SET label = ' + title + 'where id=' + survey_id);

        //execute multiple update statements
        pg.queryArr(updateSurvey, function (error, result) {
            if (result.length == 2) {
                callback(error, survey_id);
            }
        })

    })

};

// crate new question in Question table
var question_handler = function (name, label, type_id, p_group_id, callback) {

    var p_id = p_group_id || null;

    var q = 'INSERT INTO question (field_data_id, type_id, name, label,section_id,group_id) values ' +
        '(' + survey_id + ',' + type_id + ',' + pg.sanitize(name) + ',' + pg.sanitize(label) + ',' + section_id + ',' + p_id + ') RETURNING id';

    pg.query(q, function (err, res) {
        if (!err) {
            var question_id = res[0].id;

            if (question_id !== null) {

                formdata.forEach(function(v){
                    Object.keys(v).forEach(function(q){
                        if(q == name){
                            console.log('Name: ' + name + " id: " + question_id);
                        }
                    })
                })
                //console.log('-----> NEW Question: ' + label + '(id: ' + question_id + ')');

                //
                //if (typeof(section_id) !== 'undefined') {
                //    var q2 = 'UPDATE question SET section_id = ' + section_id + ' WHERE id= ' + question_id;
                //
                //    pg.query(q2, function (err, res) {
                //        if (!err) {
                //            //console.log("Question: " + question_id + " sucessfully updated");
                //        }
                //    });
                //}

                //this question belongs to the child group of the parent group
                //if (typeof p_group_id !== 'undefined' && p_group_id !== null) {
                //    var q3 = 'UPDATE question SET group_id = ' + p_group_id + ' WHERE id= ' + question_id;
                //    pg.query(q3, function (err, res) {
                //        if (!err) {
                //            //console.log("Question: " + question_id + " sucessfully updated");
                //        }
                //    });
                //}
                callback(question_id);
            }

        }
    });
};

// create new Group in q_group table
var group_handler = function (async,children,parent_id, name, label, callback) {
    if (name !== null && label !== null) {
        var q = 'INSERT INTO q_group (field_data_id,name,label,parent_id) VALUES ('
            + survey_id + ',' + pg.sanitize(name) + ',' + pg.sanitize(label) + ',' + pg.sanitize(parent_id) + ') RETURNING id';

        pg.queryDeferred(q)
            .then(function(res){
                node_handler(children,res[0].id,async);
            })
            .catch()
            .done();

        //pg.query(q, function (err, res) {
        //    if (!err) {
        //        group_id = res[0].id;
        //
        //        callback(group_id); // send back group id
        //        //console.log('-----> NEW GROUP: ' + label + '(id: ' + group_id + ')');
        //
        //        //if (typeof(section_id) !== "undefined" && group_id !== null) {
        //        //    var q2 = 'UPDATE q_group SET section_id =' + section_id + ' WHERE id=' + group_id;
        //        //    pg.query(q2, function (err, res) {
        //        //        if (!err) {
        //        //            callback(group_id); // send back group id
        //        //            //console.log("Question group sucessfully updated");
        //        //        }
        //        //    });
        //        //}
        //    }
        //});
    }

};

// create new not in Section table
var note_handler = function (name, label, callback) {
    var q = 'INSERT INTO section(field_data_id,name,label) VALUES(' + survey_id + ',' + pg.sanitize(name) + ',' + pg.sanitize(label) + ') RETURNING id';
    pg.query(q, function (err, res) {
        if (!err) {
            section_id = res[0].id; // save section id
            callback(section_id);
            //console.log('-----> NEW SECTION: ' + label + '(' + section_id + ')');
        }
    });
};

// take in type and return id from type table
var get_type_id = function (type, callback) {

    var q = 'SELECT id FROM type where name = ' + pg.sanitize(type);

    pg.query(q, function (err, res) {
        if (!err && res.length > 0) {
            callback(res[0].id);
        }
    })
};

// create new option row in Option table
var option_handler = function (obj, parent_question_id, name, label, callback) {

    // loop through options and Insert each into option table
    obj.forEach(function (c, idx) {
        var option_label = c.label || '';
        var option_name = c.name;

        var q = 'INSERT INTO option (question_id, name, label) VALUES (' + parent_question_id + ',' + pg.sanitize(option_name) + ',' + pg.sanitize(option_label) + ')';

        pg.queryDeferred(q).then(function(){
            //console.log('NEW Option created for question: ' + parent_question_id);

            if (idx == obj.length - 1) {

            }

        });

        //pg.query(q, function (err, res) {
        //    if (!err) {
        //        //console.log('NEW Option created for question: ' + parent_question_id);
        //
        //        if (idx == obj.length - 1) {
        //            callback(parent_question_id);
        //        }
        //    }
        //})


    });
};
