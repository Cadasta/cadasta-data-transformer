/***
 *
 * @param settings - an object containing PostGres connection properties: user, password, server, port, database;
 * @constructor
 */

var moduleSettings = require('./src/module-settings/module-settings.js');

var DataTransformer = function(settings){
  if(!settings){
    throw new Error("DataTransformer requires a settings object when initializing.");
    return;
  }

  for(var i in settings){

    moduleSettings[i] = settings[i];
  }

  return require('./src/ingestion/ingestion_base.js');

};

module.exports = DataTransformer;