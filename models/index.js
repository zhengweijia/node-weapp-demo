"use strict";

let fs        = require("fs");
let path      = require("path");
let Sequelize = require("sequelize");
let config = require("../config");

let sequelize = new Sequelize(config.dataBase.name, config.dataBase.userName, config.dataBase.pwd, {
	'host': config.dataBase.host,
	'port': config.dataBase.port,
	'dialect': 'mysql',
	timezone:'+08:00',
	pool: {
		max: 20,
		min: 5,
		idle: 10000
	},
	dialectOptions: {
		charset: 'utf8',
		collate: 'utf8_general_ci',
	},
});
let db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
