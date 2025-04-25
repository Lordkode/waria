"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const adminId = uuidv4();
const employerId = uuidv4();
const employeeId = uuidv4();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Users initial data
    await queryInterface.bulkInsert("users", [
      {
        id: adminId,
        username: "admin_user",
        password: bcrypt.hashSync("admin_password", saltRounds),
        email: "admin@exemple.com",
        fullName: "Admin User",
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()"),
        isActive: true,
      },
      {
        id: employerId,
        username: "employer_user",
        password: bcrypt.hashSync("employer_password", saltRounds),
        email: "employer@example.com",
        fullName: "Employer User",
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()"),
        isActive: true,
      },
      {
        id: employeeId,
        username: "employee_user",
        password: bcrypt.hashSync("employee_password", saltRounds),
        email: "employee@example.com",
        fullName: "Employee User",
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()"),
        isActive: true,
      },
    ]);

    // Admins initial data
    await queryInterface.bulkInsert("admins", [
      {
        id: adminId,
        userId: adminId,
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()"),
      },
    ]);

    // Employers initial data
    await queryInterface.bulkInsert("employers", [
      {
        id: employerId,
        userId: employerId,
        companyName: "Tech Solutions Ltd",
        companyRegistrationNumber: "TS-123456",
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()"),
      },
    ]);

    // Employees initial data
    await queryInterface.bulkInsert("employees", [
      {
        id: employeeId,
        userId: employeeId,
        employerId: employerId,
        salary: 300000.0,
        hireDate: new Date(),
        position: "Software Engineer",
        department: "Engineering",
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()"),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("employees", { userId: employeeId }, {});
    await queryInterface.bulkDelete("employers", { userId: employerId }, {});
    await queryInterface.bulkDelete("admins", { userId: adminId }, {});
    await queryInterface.bulkDelete(
      "users",
      { id: [adminId, employerId, employeeId] },
      {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      }
    );
  },
};
