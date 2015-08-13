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
//var DataProcessor = require('../processes/processdata');
var forEach = require('async-foreach').forEach;

var survey = module.exports = {};

var section_id = null;
var group_id;
var field_data_id;
var metadata;
var formdata;

/**
 *
 * @param form
 * @param callback
 *
 * Grab raw json to send to createSurvey
 */
survey.load = function (form, callback) {

    metadata = form.metadata;
    formdata = form.results;

    var idString = pg.sanitize(metadata.id_string);
    var name = pg.sanitize(metadata.name);
    var title = pg.sanitize(metadata.title);

    createFieldData(idString, name, title, function (error, id) {

        field_data_id = id;

        if (error.length === 0 && id !== null) {
            console.log("Survey successfully created. id: " + field_data_id);


            //call recursive function
            //pass json.children & null

            node_handler(metadata.children,null);

            //DataProcessor.process_data(field_data_id,formdata);
            callback(field_data_id);
        }

    });

};

/**
 *
 * Recursive function that loops through question and handles them by type
 * Function is recursively called if question is a group, using group_id as parent_id in parameter
 *
 * @param children
 * @param parent_id
 * @param itemDone
 */
var node_handler = function(children,parent_id,itemDone){

    children.forEach(function(child_node, index){

        var name = child_node.name || null;
        var label = child_node.label || null;
        switch (child_node.type) {
            case 'note':

                // create note
                note_handler(child_node.name,child_node.label, function (section_id) {
                    //console.log('Note Section created for survey: ' + section_id);

                });

                break;
            case 'group':
            case 'repeat':
                // hand parents children
                //console.log('Group');

                //forEach(children,function(item,index,arr){
                //    var done = this.async();
                    group_handler(child_node.children,parent_id, name, label);

                //});

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

                                });
                        }

                    });
                });
                break;
            default:
                // handle normal question types; these types do not have children, therefore a new question row is created
                get_type_id(child_node.type,function(type_id){
                    question_handler(name, label, type_id, parent_id, function (question_id) {

                    });
                })

        }

    });

};

/**
 *
 * Create new field_data in Cadasta DB from raw json
 *
 * @param id_string
 * @param name
 * @param title
 * @param callback return field_data_id
 */
var createFieldData = function (id_string, name, title, callback) {

    var q1 = 'SELECT * FROM cd_create_field_data(' + (id_string) + ')';

    pg.query(q1, function (error, result) {

        field_data_id = result[0].cd_create_field_data; // save new survey id

        var updateSurvey = [];
        updateSurvey.push('UPDATE field_data SET name = ' + name + 'where id=' + field_data_id);
        updateSurvey.push('UPDATE field_data SET label = ' + title + 'where id=' + field_data_id);

        //execute multiple update statements
        pg.queryArr(updateSurvey, function (error, result) {
            if (result.length == 2) {
                callback(error, field_data_id);
            }
        })

    })

};

/**
 *
 * Create new question in the Cadasta DB
 *
 * @param name
 * @param label
 * @param type_id
 * @param p_group_id
 * @param callback question_id
 */
var question_handler = function (name, label, type_id, p_group_id, callback) {

    var p_id = p_group_id || null;

    var q = 'INSERT INTO question (field_data_id, type_id, name, label,section_id,group_id) values ' +
        '(' + field_data_id + ',' + type_id + ',' + pg.sanitize(name) + ',' + pg.sanitize(label) + ',' + section_id + ',' + p_id + ') RETURNING id';

    pg.query(q, function (err, res) {
        if (!err) {
            var question_id = res[0].id;

            if (question_id !== null) {

                callback(question_id);
            }

        }
    });
};

// create new Group in q_group table
/**
 *
 * Creates new parent group in group table and returns the group_id as a parameter in the recursive function node_handler
 *
 * @param children
 * @param parent_id
 * @param name
 * @param label
 * @param callback group_id as 'parent_int' in node_handler()
 */
var group_handler = function (children,parent_id, name, label, callback) {
    if (name !== null && label !== null) {
        var q = 'INSERT INTO q_group (field_data_id,name,label,parent_id) VALUES ('
            + field_data_id + ',' + pg.sanitize(name) + ',' + pg.sanitize(label) + ',' + pg.sanitize(parent_id) + ') RETURNING id';

        pg.queryDeferred(q)
            .then(function(res){
                group_id = res[0].id;
                node_handler(children,group_id);
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

/**
 *
 * Creates new note in Cadasta DB
 *
 * @param name
 * @param label
 * @param callback section_id
 */
// create new not in Section table
var note_handler = function (name, label, callback) {
    var q = 'INSERT INTO section(field_data_id,name,label) VALUES(' + field_data_id + ',' + pg.sanitize(name) + ',' + pg.sanitize(label) + ') RETURNING id';
    pg.query(q, function (err, res) {
        if (!err) {
            section_id = res[0].id; // save section id
            callback(section_id);
            //console.log('-----> NEW SECTION: ' + label + '(' + section_id + ')');
        }
    });
};

/**
 *
 * Get question type from type table in Cadasta DB
 *
 * @param type
 * @param callback type_id
 */
// take in type and return id from type table
var get_type_id = function (type, callback) {

    var q = 'SELECT id FROM type where name = ' + pg.sanitize(type);

    pg.query(q, function (err, res) {
        if (!err && res.length > 0) {
            callback(res[0].id);
        }
    })
};

/**
 *
 * Create new option for questions of type 'select' in Cadasta DB
 *
 * @param obj
 * @param parent_question_id
 * @param name
 * @param label
 * @param callback
 */
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
