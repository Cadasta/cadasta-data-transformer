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

var Q = require("q");
var forEach = require('async-foreach').forEach;

var pg = require('./data_access.js');

var survey = module.exports = {};

var section_id = null;
var field_data_id;
var metadata;
var form;

/**
 *
 * @param form
 * @param callback
 *
 * Grab raw json to send to createSurvey
 */
survey.load = function (cjf, callback) {

    var deferred = Q.defer();

    form = cjf.form;
    var project_id = parseInt(cjf.project_id);
    //metadata = form.metadata;

    var idString = pg.sanitize(form.id_string);
    //var title = pg.sanitize(form.title);
    var formid = parseInt(form.formid);

    if (form == null || project_id == null || idString == null || formid == null ) {
        deferred.reject("project_id, idString, formid, & form Obj required.");
    }

    createFieldData(project_id, idString, formid)
        .then(function(response) {

            field_data_id = response;

            var nodeZero = {children: form.children, parent_id: null};

            return node_handler(nodeZero, allDone);

        })
        .catch(function(err){

            deferred.reject({status:"ERROR", msg:err})
        })
        .done();

    /**  This is the final callback after all recursion is complete
     *
     */
    function allDone(notAborted, arr) {
        //console.log("Survey successfully created. id: " + field_data_id);
        //console.log("The recursive Async survey structure loading is done.");
        deferred.resolve({status:"OK", msg:"Sucessfully Loaded form (field_data) into DB."})
    }

    return deferred.promise;
};

/**
 *
 * Create new field_data in Cadasta DB from raw json
 *
 * @param id_string
 */
var createFieldData = function (project_id, id_string, form_id) {

    var deferred = Q.defer();

    var sql= 'SELECT * FROM cd_create_field_data(' + project_id  + ','  + id_string + ',' + form_id + ')';

    pg.queryDeferred(sql)
        .then(function(result){
            // Return new survey id
            deferred.resolve(result[0].cd_create_field_data);
        })
        .catch(function(err){
            deferred.reject(err.detail || err.hint);
        });

    return deferred.promise;

};

/**
 *
 * Recursive function that loops through question and handles them by type
 * Function is recursively called if question is a group, using group_id as parent_id in parameter
 *
 * @param node the current node in the survey "tree" data structure
 * @param done function to execute once all the node's children have had the appropriate code executed upon them
 */

function node_handler(node, done){

    forEach(node.children, function(child_node, index, arr) {

        // Function that should be fired when this childnode's code is completely executed; Each node generally requires
        // and async function (INSERTs on the DB);  When the async is complete, we fire this.
        var child_node_done = this.async();

        // Make sure name and label properties are there
        child_node.name = child_node.name || null;
        child_node.label = child_node.label || null;

        switch (child_node.type) {
            case 'note':

                // create note
                note_handler(child_node)
                    .then(function(response){

                        // Re-assign section_id value
                        section_id = response;
                        // Console.log("Created section id:", response);
                        child_node_done();
                        return;
                    })
                    .catch(function(err){
                        throw new Error(err);
                    })
                    .done();

                break;

            case 'group':
            case 'repeat':

                // Group handler
                group_handler(child_node)
                    .then(function(response){

                        // Save parent ID for children of group
                        if(child_node.hasOwnProperty('children') == true) {
                            child_node.children.forEach(function (childNode) {
                                childNode.parent_id = response;
                            });
                        }

                        // Groups have children, so we fire the recursive function again
                        return node_handler(child_node, child_node_done);
                    })
                    .catch(function(err){
                        throw new Error(err);
                    })
                    .done();

                break;

            case 'select one':
            case 'select all that apply':

                // create question; need type_id first
                get_type_id(child_node)
                    .then(function(response){

                        // Now create the question
                        return question_handler(child_node, response);

                    })
                    .then(function(response){


                        // These types of question usually have child options
                        if(child_node.hasOwnProperty('children') == true) {

                            // Assign type "option" and a parent_id
                            child_node.children.forEach(function(childNode){

                                childNode.type = "option";
                                childNode.parent_id = response;
                            });

                            // We can use the recursive function to insert these child options into the database
                            return node_handler(child_node, child_node_done);
                            // create new option rows

                        } else {
                            return child_node_done();
                        }
                    })
                    .catch(function(err){
                        throw new Error(err);
                    })
                    .done();

                break;
            case 'option':

                // Create options
                option_handler(child_node)
                    .then(function(response){

                        return child_node_done();
                    })
                    .catch(function(err){
                        throw new Error(err);
                    })
                    .done();

                break;

            default:

                // handle normal question types; these types do not have children, therefore a new question row is created
                get_type_id(child_node)
                    .then(function(response){

                        return question_handler(child_node, response);

                    })
                    .then(function(response){
                        return child_node_done();
                    })
                    .catch(function(err){
                        throw new Error(err);
                    })
                    .done();

        }

    }, done);
}

/**
 *
 * Create new question in the Cadasta DB
 *
 * @param node
 * @param type_id
 */
var question_handler = function (node, type_id) {

    var deferred = Q.defer();

    var p_id = node.parent_id || null;

    var sql = 'INSERT INTO question (field_data_id, type_id, name, label,section_id,group_id) values ' +
        '(' + field_data_id + ',' + (type_id || null) + ',' + pg.sanitize(node.name) + ',' + pg.sanitize(node.label) + ',' + section_id + ',' + p_id + ') RETURNING id';

    pg.query(sql, function (err, res) {
        if (err) {
            deferred.reject(err);
        } else {

            deferred.resolve(res[0].id);

        }
    });

    return deferred.promise;
};

// create new Group in q_group table
/**
 *
 * Creates new parent group in group table and returns the group_id
 *
 * @param node
 */
var group_handler = function (node) {

    var deferred = Q.defer();

    node.parent_id = node.parent_id || null;

    var sql = 'INSERT INTO q_group (field_data_id,name,label,parent_id) VALUES ('
        + field_data_id + ',' + pg.sanitize(node.name) + ',' + pg.sanitize(node.label) + ',' + pg.sanitize(node.parent_id) + ') RETURNING id';

    pg.query(sql, function (err, res) {

        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res[0].id);
        }

    });

    return deferred.promise;
};

/**
 *
 * Creates new note in Cadasta DB
 *
 * @param node
 */
// create new not in Section table
var note_handler = function (node) {

    var deferred = Q.defer();

    var sql = 'INSERT INTO section(field_data_id,name,label) VALUES(' + field_data_id + ',' + pg.sanitize(node.name) + ',' + pg.sanitize(node.label) + ') RETURNING id';

    pg.query(sql, function (err, res) {

        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(section_id);
        }

    });

    return deferred.promise;
};

/**
 *
 * Get question type from type table in Cadasta DB
 *
 * @param node
 */
// take in type and return id from type table
var get_type_id = function (node) {

    var deferred = Q.defer();

    var sql = 'SELECT id FROM type where name = ' + pg.sanitize(node.type);

    pg.query(sql, function (err, res) {

        if(err) {
            deferred.reject(err);
        } else {
            if(res.length > 0){
                deferred.resolve(res[0].id);
            } else {
                //return null if no type exists
                deferred.resolve(null);
            }
        }

    });

    return deferred.promise;
};

/**
 *
 * Create new option for questions of type 'select' in Cadasta DB
 *
 * @param optionNode
 */
// create new option row in Option table
var option_handler = function (optionNode) {

    var deferred = Q.defer();

    optionNode.label = optionNode.label || '';

    var sql = 'INSERT INTO option (question_id, name, label) VALUES ('
        + optionNode.parent_id + ','
        + pg.sanitize(optionNode.name) + ','
        + pg.sanitize(optionNode.label) + ')';

    pg.query(sql, function (err, res) {

        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(true);
        }

    });

    return deferred.promise;

};
