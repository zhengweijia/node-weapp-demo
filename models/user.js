'use strict';

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    unionid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: '0'
    },
    code_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    active: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    nick: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
		avatar_url: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
    id_card: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: ''
    },
    clothes_size: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    climbing_ability: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    climbing_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    money: {
      type: "DOUBLE",
      allowNull: true,
      defaultValue: '0'
    },
    point: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    comment: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  }, {
		timestamps: false,
		comment: '用户，裁判等',
		tableName: 'user'
  });

  return User;
};
