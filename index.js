/***
 *
 * @param settings - an object containing PostGres connection properties: user, password, server, port, database;
 * @constructor
 */
var DataTransformer = function(settings){
  if(!settings){
    throw new Error("DataTransformer requires a settings object when initializing.");
    return;
  }

  //PostGres Connection String
  global.conString = "postgres://" + settings.pg.user + ":" + settings.pg.password + "@" + settings.pg.server + ":" + settings.pg.port + "/" + settings.pg.database;
  global.escapeStr = settings.pg.escapeStr;

  this.ingestion_engine = require('./src/ingestion/ingestion_base.js');
};

module.exports = DataTransformer;