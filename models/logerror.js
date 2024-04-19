"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LogErrors extends Model {
    static associate(models) {}
  }
  LogErrors.init(
    {
      Log: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "LogErrors",
    }
  );
  return LogErrors;
};
