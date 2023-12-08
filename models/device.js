"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Devices extends Model {
    static associate(models) {
      Devices.hasMany(models.LogDatas, {
        foreignKey: "code",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Devices.init(
    {
      code: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Devices",
    }
  );
  return Devices;
};
