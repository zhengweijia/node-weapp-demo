"use strict";

let fs        = require("fs");
let path      = require("path");
let Sequelize = require("sequelize");
// let sequelize = new Sequelize('yandian', 'root', 'BBBBBCDIKNab1z', {
let sequelize = new Sequelize('yandian_online', 'root', 'BBBBBCDIKNab1z', {
	'host': '10.66.96.16',
	'port': 3306,
	'dialect': 'mysql',
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
