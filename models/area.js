'use strict';

module.exports = function(sequelize, DataTypes) {
  let Area = sequelize.define('area', {
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
    }
  }, {
		timestamps: false,
		comment: '攀岩赛场区域',
		tableName: 'area'
  });
  return Area;
};
