"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Transaction extends Model {
  static associate(models) {
    // Define associations here
    Transaction.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Transaction.belongsTo(models.Employer, {
      foreignKey: "employerId",
      as: "employer",
    });
  }
}

Transaction.init(
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
        transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        },
        type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
        },
        description: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
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
        modelName: "Transaction",
        tableName: "transactions",
        timestamps: true,
    }
)

module.exports = Transaction;