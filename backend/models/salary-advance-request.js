"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class SalaryAdvanceRequest extends Model {
    static associate(models) {
        // Define associations here
        SalaryAdvanceRequest.belongsTo(models.Employee, {
            foreignKey: "employeeId",
            as: "employee",
        });
        SalaryAdvanceRequest.belongsTo(models.Employer, {
            foreignKey: "employerId",
            as: "employer",
        });
    }
}

SalaryAdvanceRequest.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        employeeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "employees",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        raison: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        requestDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            allowNull: false,
            defaultValue: "pending",
        },
        employerComment: {
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: "SalaryAdvanceRequest",
        tableName: "salary_advance_requests",
        timestamps: true,
    }
);

module.exports = SalaryAdvanceRequest;