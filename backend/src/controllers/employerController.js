const sequelize = require("../../config/database");
const AppError = require("../errors/appError");
const EmployerService = require("../services/employerService");
const EmployeeService = require("../services/employeeService");
const tokenService = require("../services/tokenService");
const UserService = require("../services/userService");
const EmailConnector = require("../integrations/emails/emailConnector");
const helpers = require("../utils/helpers");

class EmployerController {
  constructor() {
    this.UserService = new UserService();
    this.EmployerService = new EmployerService();
    this.EmployeeService = new EmployeeService();
    this.TokenService = tokenService;
    this.EmailConnector = new EmailConnector();
    this.Helpers = helpers;
    this.AppError = AppError;
  }

  // Method to create new Employee
  async createEmployee(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      // Get field from request body
      const { email, fullName, salary, hireDate, position, department } =
        req.body;

      const employerUserId = req.user.id;

      // find employer record using the userId
      const employer = await this.EmployerService.getEmployerByUserId(
        employerUserId,
        { attributes: ["id"], transaction }
      );

      // Create username
      const username = this.Helpers.generateUserName(fullName);
      const password = this.Helpers.generatePassword();
      const hashedPassword = await this.Helpers.hashPassword(password);

      const newUserResponse = await this.UserService.createUser(
        {
          username: username,
          fullName: fullName,
          email: email,
          role: "employee",
          password: hashedPassword,
          isActive: true,
        },
        { transaction }
      );

      if (!newUserResponse.success) {
        return next(new this.AppError(newUserResponse.message, 400));
      }

      const newUser = newUserResponse.data;

      const newEmployeeResponse = await this.EmployeeService.createEmployee(
        {
          userId: newUser.id,
          employerId: employer.id,
          salary: salary,
          hireDate: hireDate,
          position: position,
          department: department,
        },
        { transaction }
      );

      if (!newEmployeeResponse.success) {
        await transaction.rollback();
        return next(new this.AppError(newEmployeeResponse.message, 400));
      }

      await this.EmailConnector.sendAccountCreationEmail({
        to: newUser.email,
        username: username,
        password: password,
        fullName: newUser.fullName,
      });

      await transaction.commit();
      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          fullName: newUser.fullName,
          isActive: newUser.isActive,
          role: newUser.role,
        },
      });
    } catch (error) {
      // Rollback transaction if there is an error
      await transaction.rollback();

      if (error.name === "SequelizeUniqueConstraintError") {
        const constraint = error.errors[0].path;

        let message = "Validation error";
        if (constraint === "email") {
          message = "Email already exists";
        } else if (constraint === "username") {
          message = "Username already exists";
        }

        return next(new this.AppError(message, 400));
      }

      // Si c'est déjà une AppError, la passer au middleware
      if (error instanceof this.AppError) {
        return next(error);
      }

      // Sinon créer une nouvelle erreur 500
      return next(new this.AppError("Internal server error", 500, error));
    }
  }
}

module.exports = new EmployerController();
