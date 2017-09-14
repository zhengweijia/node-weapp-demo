'use strict';

module.exports = function(sequelize, DataTypes) {
  let Result = sequelize.define('result', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    judge_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ground_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    line_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
		timestamps: false,
		comment: '一次攀岩结果',
		tableName: 'result'
  });

  return Result;
};
