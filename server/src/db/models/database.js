'use strict';

// import necessary modules
const fs = require('fs');  // file system operations
const path = require('path');  // utilities for working with file and directory paths
const Sequelize = require('sequelize');  // the Sequelize library
const process = require('process');  // a global object that provides information about and control over the current Node.js process
const basename = path.basename(__filename);  // sets basename to the name of this file 'index.js' but extracting the basename from the current file path
const env = process.env.NODE_ENV || 'development';  // sets the environment variable 'env' (defaulting to development)***
const config = require(__dirname + '/../config/config.json')[env];  //loads the configuration in the config.json file for the current environment***
const db = {};  // initialize an empty database object

// create an instance of sequalize according to the configuration settings.***
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config); 
}

fs
  .readdirSync(__dirname)  // read all files in the current directory i.e. models
  .filter(file => {  // filter out non-js files
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {  // initialize each model and add it to the db object with the model name as a key
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// creates associations from model if there are any defined.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// add the instance and library to the object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// export the object to be used in other files of the backend server project.
module.exports = db;
