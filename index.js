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

  // Copy the "instance" settings to the module settings.  This is at least a little weird because we are in a constructor function and moduleSettings is a singleton
  moduleSettings.pg = settings.pg;

  //DataTransformer.settings = settings;
  //PostGres Connection String
  //global.conString = "postgres://" + settings.pg.user + ":" + settings.pg.password + "@" + settings.pg.server + ":" + settings.pg.port + "/" + settings.pg.database;
  //global.escapeStr = settings.pg.escapeStr;

  this.ingestion_engine = require('./src/ingestion/ingestion_base.js');
};

module.exports = DataTransformer;