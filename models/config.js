'use strict';

module.exports = function(sequelize, DataTypes) {
  let Config = sequelize.define('config', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    can_draw: {
      type: DataTypes.STRING(4),
      allowNull: true,
      defaultValue: '0'
    },
    can_apply: {
      type: DataTypes.STRING(4),
      allowNull: true,
      defaultValue: '1'
    },
    back1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    back2: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
		timestamps: false,
    tableName: 'config'
  });

  return Config;
};
