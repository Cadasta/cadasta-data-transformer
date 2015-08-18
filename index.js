/***
 *
 * @param settings - an object containing PostGres connection properties: user, password, server, port, database;
 * @constructor
 */
var DataTransformer = {};

DataTransformer.setDBSettings = function(settings){
   if(!settings){
      throw new Error("DataTransformer requires a settings object when initializing.");
     return;
   }

  DataTransformer.settings = settings;
};

DataTransformer.form = require('./src/controllers/processform.js');

DataTransformer.data = require('./src/controllers/processdata.js');

module.exports = DataTransformer;