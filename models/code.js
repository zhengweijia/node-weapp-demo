'use strict';

module.exports = function(sequelize, DataTypes) {
	let Code =  sequelize.define('code', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(4),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
		timestamps: false,
		comment: '邀请码',
		tableName: 'code'
  });
	return Code;
};
