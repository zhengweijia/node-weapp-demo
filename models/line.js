'use strict';

module.exports = function(sequelize, DataTypes) {
   let Line =sequelize.define('line', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    bonus: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    line_difficulty_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    point: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    finish_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    comment: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ground_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
		 timestamps: false,
		 comment: '攀岩具体一条线路',
		 tableName: 'line'
  });

	return Line;
};
