const UserService = require("../services/userService");
const TokenService = require("../services/tokenService");
const EmployerService = require("../services/employerService");
const EmailConnector = require("../integrations/emails/emailConnector");

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = TokenService;
    this.employerService = new EmployerService();
    this.emailConnector = new EmailConnector();
  }

  async register(req, res) {
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
      const newUserResponse = await this.userService.createUser({
        email,
        password,
        username,
        fullName,
        isActive,
      });

      if (!newUserResponse.success) {
        return res.status(400).json({
          message: newUserResponse.message,
        });
      }

      // New user Data
      const newUser = newUserResponse.data;

      // Create new employer
      const newEmployeurResponse = await this.employerService.createEmployer({
        userId: newUser.id,
        companyName,
        companyRegistrationNumber,
      });

      if (!newEmployeurResponse.success) {
        await this.userService.deleteUser(newUser.id); // Rollback user creation
        return res.status(400).json({
          message: newEmployeurResponse.message,
        });
      }

      // Generate token for the new user
      const token = this.tokenService.generateAccessToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName,
        isActive: newUser.isActive,
      });

      await this.emailConnector.sendVerificationEmail({
        to: newUser.email,
        verificationCode: "32f4e3d2",
      });
      // Return success response
      return res.status(201).json({
        message: "Employer created successfully",
        employeur: {
          email: newUser.email,
          username: newUser.username,
          fullName: newUser.fullName,
          companyName: newEmployeurResponse.data.companyName,
          companyRegistrationNumber:
            newEmployeurResponse.data.companyRegistrationNumber,
          isActive: newUser.isActive,
        },
        token: token,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const constraint = error.errors[0].path;

        let message = "";
        if (constraint === "email") {
          message = "Email already exists";
        } else if (constraint === "username") {
          message = "Username already exists";
        } else {
          message = "Validation error";
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
}
module.exports = new AuthController();
