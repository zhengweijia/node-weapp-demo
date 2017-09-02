'use strict';

module.exports = function(sequelize, DataTypes) {
  let  Ground = sequelize.define('ground', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
		timestamps: false,
		comment: '攀岩场地',
		tableName: 'ground'
  });

  return Ground;
};
