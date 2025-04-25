"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Admin extends Model {
        static associate(models) {
            Admin.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            // Define other associations here if needed 
            Admin.hasMany(models.Employee, {
                foreignKey: "userId",
                as: "employees",
            });
        }
    }
    Admin.init(
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
            modelName: "Admin",
            tableName: "admins",
            timestamps: true,
        }
    );
    return Admin;
}