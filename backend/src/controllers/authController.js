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

  // Fonction to resend new confirmation code
  async confirmationcode(req, res) {
    try {
      const { email } = req.body;

      const userResponse = await this.userService.getUserByEmail(email);

      if (!userResponse) {
        return res.status(404).json({ message: "User not created !" });
      }

      if (userResponse.data.isActive) {
        return res
          .status(400)
          .json({ message: "Your account is already activate !" });
      }

      const key = `user:${email}`;
      const code = await this.redisClient.get(key);

      if (code) {
        await this.redisClient.del(key);
      }

      // Generate new confirmation code
      const newConfirmationCode = this.helpers.generateConfirmationCode();

      // Send new code to user
      await this.emailConnector.sendVerificationEmail({
        to: email,
        verificationCode: newConfirmationCode,
      });

      // Redis storage
      await this.redisClient.set(key, newConfirmationCode, { EX: 600 });

      return res.status(200).json({
        success: true,
        message: "New code send to user email adress !",
      });
    } catch (error) {
      console.error("Error while resend confirmation code :", error);
      res.status(500).json({
        message: "Internal server error ",
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
      const payload = {
        id: updateResponse.data.id,
        email: updateResponse.data.email,
        isActive: updateResponse.data.isActive,
        username: updateResponse.data.username,
        fullName: updateResponse.data.fullName,
      };

      const accessToken = await this.tokenService.generateAccessToken(payload);

      // Genrate refresh token
      const refreshToken = await this.tokenService.generateRefreshToken(
        payload
      );
      const refreshTokenKey = `refresh:${updateResponse.data.email}`;
      await this.redisClient.set(refreshTokenKey, refreshToken, { EX: 604800 });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        message: "User activate successfully !",
        token: accessToken,
        user: {
          username: updateResponse.data.username,
          fullName: updateResponse.data.fullName,
          email: userResponse.data.email,
          id: userResponse.data.id,
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error while active user !");
      return res.status(500).json({ message: "Internal server error ", error });
    }
  }

  // Login function
  async login(req, res) {
    const { email, password } = req.body;
    try {
      // check if email or password is passed to request body
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password required !" });
      }

      // Get user with his email
      const userResponse = await this.userService.getUserByEmail(email);
      if (!userResponse || !userResponse.data) {
        return res
          .status(404)
          .json({ message: "User with that email not found !" });
      }

      const user = userResponse.data;
      if (!user.isActive) {
        return res.status(403).json({ message: "Unauthorized !" });
      }

      // Check password match
      const isPasswordMatch = this.helpers.comparePassword(
        password,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(400).json({
          message: "Password is incorrect !",
        });
      }

      // Generate access and refresh token
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      };
      const refreshTokenKey = `refresh:${user.email}`;
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken = await this.tokenService.generateRefreshToken(
        payload
      );
      await this.redisClient.set(refreshTokenKey, refreshToken, { EX: 604800 });

      return res.status(200).json({
        success: true,
        message: "User logging successfully !",
        token: accessToken,
      });
    } catch (error) {
      console.error("Error while connecting user !");
      return res
        .status(500)
        .json({ message: "Internal server error :", error });
    }
  }

  // Refresh Token function
  async refreshToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Authorization header missing !",
        });
      }

      const oldAccessToken = authHeader.split(" ")[1];

      // Read payload even token expired
      const payload = await this.tokenService.decodeToken(oldAccessToken);
      if (!payload) {
        return res.status(401).json({ message: "Invalid access token !" });
      }

      // get refresh token from accesstoken email
      const refresTokenKey = `refresh:${payload.email}`;
      const storedRefreshToken = await this.redisClient.get(refresTokenKey);

      if (!storedRefreshToken) {
        return res.status(401).json({ message: "Refresh token not found !" });
      }

      // Generate new access token
      const newAccessToken = await this.tokenService.generateAccessToken({
        id: payload.id,
        email: payload.email,
        username: payload.username,
        fullName: payload.fullName,
      });

      // Generate new refresh token

      return res.status(200).json({
        message: "New access token generate successfully !",
        token: newAccessToken,
      });
    } catch (error) {
      console.error("Error during token refresh :", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  // Send Reset password code
  async sendResetPasswordCode(req, res) {
    try {
      const { email } = req.body;

      const userResponse = await this.userService.getUserByEmail(email);
      if (!userResponse || !userResponse.data) {
        res.status(404).json({ message: "User with that email not found !" });
      }

      const key = `reset:${email}`;
      const storedCode = await redisClient.get(key);
      if (storedCode) {
        await redisClient.del(key);
      }

      const code = this.helpers.generateConfirmationCode();
      await this.redisClient.set(key, code, { EX: 600 });

      // Send email to user
      await this.emailConnector.resetPasswordCodeEmail({
        to: email,
        code: code,
      });

      return res.status(200).json({
        success: true,
        message: `Reset password send to ${email}`,
      });
    } catch (error) {
      console.error("Error sending reset password code :", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    const { email, code, password } = req.body;
    const transaction = await sequelize.transaction();
    try {
      if (!email || !code) {
        return res.status(400).json({
          message: "Email or verification code is required !",
        });
      }

      const userResponse = await this.userService.getUserByEmail(email);
      if (!userResponse || !userResponse.data) {
        return res.status(404).json({
          message: `User with email : ${email} not found !`,
        });
      }

      // redis get code
      const key = `reset:${email}`;
      const storedCode = await redisClient.get(key);

      if (!storedCode) {
        return res.status(401).json({
          message: "Reset password code expire; please aske new code",
        });
      }

      if (code !== storedCode) {
        return res.status(400).json({
          message: "Reset password code is incorrect !",
        });
      }

      // Hashed password
      const hashedPassword = await this.helpers.hashPassword(password);
      await this.userService.updateUser(
        userResponse.data.id,
        {
          password: hashedPassword,
        },
        { transaction }
      );

      await redisClient.del(key);

      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: "Password changed successfully !",
      });
    } catch (error) {
      (await transaction).rollback();
      console.error("Error while change password", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
module.exports = new AuthController();
