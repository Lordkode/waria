"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PayrollSystem extends Model {
    static associate(models) {
      // Define associations here
      PayrollSystem.belongsTo(models.Payment, {
        foreignKey: "paymentId",
        as: "payment",
      });
    }
  }
  PayrollSystem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      paymentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "payments",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      modelName: "PayrollSystem",
      tableName: "payroll_systems",
      timestamps: true,
    }
  );
  return PayrollSystem;
};
