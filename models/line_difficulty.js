'use strict';

module.exports = function(sequelize, DataTypes) {
  let LineDifficulty = sequelize.define('line_difficulty', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usa: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
		fr: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		uiaa: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
    difficulty: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
		point: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
    comment: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  }, {
		timestamps: false,
		comment: '线路难度',
		tableName: 'line_difficulty'
  });

  return LineDifficulty;
};
