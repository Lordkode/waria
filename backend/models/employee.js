"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Employee extends Model {
    static associate(models) {
      // Define associations here
      Employee.belongsTo(models.Employer, {
        foreignKey: "employerId",
        as: "employer",
      });
      Employee.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "employers",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      hireDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
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
      modelName: "Employee",
      tableName: "employees",
      timestamps: true,
    }
  );
  return Employee;
};
