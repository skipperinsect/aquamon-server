"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LogDatas extends Model {
    static associate(models) {
      LogDatas.belongsTo(models.Devices, {
        foreignKey: "code",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  LogDatas.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
      },
      tds: {
        type: DataTypes.FLOAT,
      },
      temp: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "LogDatas",
    }
  );

  return LogDatas;
};
