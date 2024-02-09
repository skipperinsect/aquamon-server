"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedings extends Model {
    static associate(models) {
      Feedings.belongsTo(models.Devices, {
        foreignKey: "code",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Feedings.init(
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
      servo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Feedings",
    }
  );
  return Feedings;
};
