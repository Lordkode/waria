"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Employer extends Model {
  static associate(models) {
    // Define associations here
    Employer.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Employer.hasMany(models.Employee, {
      foreignKey: "employerId",
      as: "employees",
    });
  }
}

Employer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyRegistrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Employer",
    tableName: "employers",
    timestamps: true,
  }
);

module.exports = Employer;
