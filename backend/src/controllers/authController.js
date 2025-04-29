const UserService = require("../services/userService");
const TokenService = require("../services/tokenService");
const EmployerService = require("../services/employerService");
const EmailConnector = require("../integrations/emails/emailConnector");
const sequelize = require("../../config/database");
const Helpers = require("../utils/helpers");
const redisClient = require("../../config/redis");

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = TokenService;
    this.employerService = new EmployerService();
    this.emailConnector = new EmailConnector();
    this.helpers = Helpers;
    this.redisClient = redisClient;
  }

  // Register function
  async register(req, res) {
    const transaction = await sequelize.transaction();
    try {
      // Get user data from request body
      const {
        email,
        password,
        username,
        fullName,
        isActive = false,
        companyName,
        companyRegistrationNumber,
      } = req.body;

      // Create new user
      const newUserResponse = await this.userService.createUser(
        {
          email,
          password,
          username,
          fullName,
          isActive,
        },
        { transaction }
      );

      if (!newUserResponse.success) {
        return res.status(400).json({
          message: newUserResponse.message,
        });
      }

      // New user Data
      const newUser = newUserResponse.data;

      // Create new employer
      const newEmployeurResponse = await this.employerService.createEmployer(
        {
          userId: newUser.id,
          companyName,
          companyRegistrationNumber,
        },
        { transaction }
      );

      if (!newEmployeurResponse.success) {
        // Rollback transaction
        await transaction.rollback();
        return res.status(400).json({
          message: newEmployeurResponse.message,
        });
      }

      // Generate confirmation code
      const code = this.helpers.generateConfirmationCode();

      // Generate redis key
      const key = `user:${newUser.email}`;

      // Save confirmation code to redis for 10 min
      await this.redisClient.set(key, code, { EX: 600 });

      // Send email to new user
      await this.emailConnector.sendVerificationEmail({
        to: newUser.email,
        verificationCode: code,
      });

      // Commit that transaction
      await transaction.commit();

      // Return success response
      return res.status(201).json({
        message: "Employer created successfully",
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

        return res.status(400).json({
          message: message,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Activate Account function 
  async activateAccount(req, res) {
    const { email, code } = req.body;
    const transaction = await sequelize.transaction();
    try {
      // Generate redis key
      const key = `user:${email}`;

      // Get content
      const storedCode = await this.redisClient.get(key);

      // If ther is no code
      if (!storedCode) {
        return res.status(400).json({
          message: "Confirmation code has expired or does not exist",
        });
      }

      // Compare code
      if (storedCode !== code) {
        return res.status(400).json({ message: "Invalid confirmation code !" });
      }

      // get user with that email
      const userResponse = await this.userService.getUserByEmail(email, {
        transaction,
      });
      // G
      if (!userResponse.success) {
        return res.status(404).json({ message: "User not found !" });
      }

      // Get data and activate user
      const user = userResponse.data;

      if (user.isActive) {
        return res.status(400).json({ message: "User is already activate" });
      }

      const updateResponse = await this.userService.updateUser(
        user.id,
        {
          isActive: true,
        },
        { transaction }
      );

      await this.redisClient.del(key);

      // Generate JWT token
      const token = await this.tokenService.generateAccessToken({
        id: updateResponse.data.id,
        email: updateResponse.data.email,
        isActive: updateResponse.data.isActive,
        username: updateResponse.data.username,
        fullname: updateResponse.data.fullname,
      });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        message: "User activate successfully !",
        token: token,
        user: {
          username: updateResponse.data.username,
          fullname: updateResponse.data.fullname,
          email: userResponse.data.email,
          id: userResponse.data.id,
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error while active user !");
      return res.status(500).json({ message: "Internal server error ", error });
    }
  };

  // Login function
}
module.exports = new AuthController();
