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

var pg = require('../pg.js'); //
//var DataProcessor = require('../processes/processdata');
var forEach = require('async-foreach').forEach;

var survey = module.exports = {};

var section_id = null;
var group_id;
var field_data_id;
var metadata;

/**
 *
 * @param form
 * @param callback
 *
 * Grab raw json to send to createSurvey
 */
survey.load = function (form, callback) {

    /**  This is the final callback after all recursion is complete
     *
     */
    function allDone(notAborted, arr) {
        console.log("Survey successfully created. id: " + field_data_id);
        console.log("The recursive Async survey structure loading is done.");
        callback(field_data_id);
    }

    metadata = form.metadata;

    var idString = pg.sanitize(metadata.id_string);
    var name = pg.sanitize(metadata.name);
    var title = pg.sanitize(metadata.title);

    createFieldData(idString, name, title, function (error, id) {

        field_data_id = id;

        if (error.length === 0 && id !== null) {



            //call recursive function
            //pass json.children & null

            var nodeZero = {children: metadata.children, parent_id: null};

            node_handler(nodeZero, allDone);


        }

    });

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
 * @param node
 * @param type_id
 */
var question_handler = function (node, type_id) {

    var deferred = Q.defer();

    var p_id = node.parent_id || null;

    var sql = 'INSERT INTO question (field_data_id, type_id, name, label,section_id,group_id) values ' +
        '(' + field_data_id + ',' + type_id + ',' + pg.sanitize(node.name) + ',' + pg.sanitize(node.label) + ',' + section_id + ',' + p_id + ') RETURNING id';

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
            deferred.resolve(res[0].id);
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
