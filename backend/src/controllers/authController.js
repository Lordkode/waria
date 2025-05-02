const UserService = require("../services/userService");
const TokenService = require("../services/tokenService");
const EmployerService = require("../services/employerService");
const EmailConnector = require("../integrations/emails/emailConnector");
const sequelize = require("../../config/database");
const Helpers = require("../utils/helpers");
const redisClient = require("../../config/redis");
const AppError = require("../errors/appError");

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = TokenService;
    this.employerService = new EmployerService();
    this.emailConnector = new EmailConnector();
    this.helpers = Helpers;
    this.redisClient = redisClient;
    this.AppError = AppError; // Référence à la classe, pas d'instanciation
  }

  // Register function
  async register(req, res, next) {
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
        // Utiliser AppError pour passer l'erreur au middleware
        return next(new this.AppError(newUserResponse.message, 400));
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
        return next(this.AppError(newEmployeurResponse.message, 400));
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

  // Fonction to resend new confirmation code
  async confirmationcode(req, res, next) {
    try {
      const { email } = req.body;
      const { data: user } = await this.userService.getUserByEmail(email, {
        attributes: ["id", "isActive"],
      });

      if (!user) return next(new this.AppError("User not found!", 404));

      if (user.isActive) {
        return next(
          new this.AppError("Your account is already activated!", 400)
        );
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
        message: "New code sent to user email address!",
      });
    } catch (error) {
      console.error("Error while resending confirmation code:", error);

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }

  // Activate Account function
  async activateAccount(req, res, next) {
    const { email, code } = req.body;
    const transaction = await sequelize.transaction();
    try {
      // get user with that email
      const userResponse = await this.userService.getUserByEmail(email, {
        attributes: ["id", "email", "isActive"],
        transaction,
      });

      // Get data and activate user
      const user = userResponse.data;

      if (user.isActive) {
        return next(new this.AppError("User is already activated", 400));
      }
      // Generate redis key
      const key = `user:${email}`;

      // Get content
      const storedCode = await this.redisClient.get(key);

      // If there is no code
      if (!storedCode) {
        return next(
          new this.AppError(
            "Confirmation code has expired or does not exist",
            400
          )
        );
      }

      // Compare code
      if (storedCode !== code) {
        const error = new this.AppError("Invalid confirmation code!", 400);
        return next(error);
      }

      if (!userResponse.success) {
        return next(new this.AppError("User not found!", 404));
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
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // Generate refresh token
      const refreshToken = this.tokenService.generateRefreshToken(payload);
      const refreshTokenKey = `refresh:${updateResponse.data.email}`;
      await this.redisClient.set(refreshTokenKey, refreshToken, { EX: 604800 });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        message: "User activated successfully!",
        token: accessToken,
        user: {
          id: userResponse.data.id,
          email: userResponse.data.email,
          isActive: userResponse.data.isActive,
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error while activating user!");

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }

  // Login function
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      // check if email or password is passed to request body
      if (!email || !password) {
        return next(new this.AppError("Email and password required!", 400));
      }

      // Get user with his email
      const userResponse = await this.userService.getUserByEmail(email, {
        attributes: ["id", "email", "password", "isActive"],
      });

      if (!userResponse || !userResponse.data) {
        return next(new this.AppError("User with that email not found!", 404));
      }

      const user = userResponse.data;
      if (!user.isActive) {
        return next(
          new this.AppError("Unauthorized! Account not activated.", 403)
        );
      }

      // Check password match
      const isPasswordMatch = await this.helpers.comparePassword(
        password,
        user.password
      );

      console.log("password comparaison: ", isPasswordMatch);

      if (!isPasswordMatch) {
        return next(new this.AppError("Password is incorrect!", 400));
      }

      // Generate access and refresh token
      const payload = {
        id: user.id,
        email: user.email,
      };
      const refreshTokenKey = `refresh:${user.email}`;
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken = await this.tokenService.generateRefreshToken(
        payload
      );
      await this.redisClient.set(refreshTokenKey, refreshToken, { EX: 604800 });

      return res.status(200).json({
        success: true,
        message: "User logged in successfully!",
        token: accessToken,
      });
    } catch (error) {
      console.error("Error while connecting user!");

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }

  // Refresh Token function
  async refreshToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new this.AppError("Authorization header missing!", 401));
      }

      const oldAccessToken = authHeader.split(" ")[1];

      // Read payload even token expired
      const payload = await this.tokenService.decodeToken(oldAccessToken);
      if (!payload) {
        return next(new this.AppError("Invalid access token!", 401));
      }

      // get refresh token from accesstoken email
      const refresTokenKey = `refresh:${payload.email}`;
      const storedRefreshToken = await this.redisClient.get(refresTokenKey);

      if (!storedRefreshToken) {
        return next(new this.AppError("Refresh token not found!", 401));
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
        message: "New access token generated successfully!",
        token: newAccessToken,
      });
    } catch (error) {
      console.error("Error during token refresh:", error);

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }

  // Send Reset password code
  async sendResetPasswordCode(req, res, next) {
    try {
      const { email } = req.body;

      const userResponse = await this.userService.getUserByEmail(email, {
        attributes: ["id"],
      });
      if (!userResponse || !userResponse.data) {
        return next(new this.AppError("User with that email not found!", 404));
      }

      const key = `reset:${email}`;
      const storedCode = await this.redisClient.get(key);
      if (storedCode) {
        await this.redisClient.del(key);
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
        message: `Reset password code sent to ${email}`,
      });
    } catch (error) {
      console.error("Error sending reset password code:", error);

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }

  // Change password
  async changePassword(req, res, next) {
    const { email, code, password } = req.body;
    const transaction = await sequelize.transaction();
    try {
      if (!email || !code) {
        return next(
          new this.AppError("Email and verification code are required!", 400)
        );
      }

      const userResponse = await this.userService.getUserByEmail(email, {
        attributes: ["id", "password"],
        transaction,
      });
      if (!userResponse || !userResponse.data) {
        return next(
          new this.AppError(`User with email: ${email} not found!`, 404)
        );
      }

      // redis get code
      const key = `reset:${email}`;
      const storedCode = await this.redisClient.get(key);

      if (!storedCode) {
        return next(
          new this.AppError(
            "Reset password code expired; please request a new code",
            401
          )
        );
      }

      if (code !== storedCode) {
        return next(
          new this.AppError("Reset password code is incorrect!", 400)
        );
      }

      // Hashed password
      const hashedPassword = await this.helpers.hashPassword(password);
      const updatedResponse = await this.userService.updateUser(
        userResponse.data.id,
        {
          password: hashedPassword,
        },
        { transaction }
      );

      console.log("Update user :", updatedResponse);

      await this.redisClient.del(key);

      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error while changing password", error);

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }

  // Logout function
  async logout(req, res, next) {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new this.AppError("Authorization header missing!", 401));
      }

      // Get access token
      const accessToken = authHeader.split(" ")[1];

      // Decode accessToken
      const payload = await this.tokenService.decodeToken(accessToken);
      if (!payload) {
        return next(new this.AppError("Invalid access token!", 401));
      }

      // Delete refresh token
      const refreshTokenKey = `refresh:${payload.email}`;
      const exists = await this.redisClient.exists(refreshTokenKey);

      if (exists) {
        await this.redisClient.del(refreshTokenKey);
      }

      return res.status(200).json({
        success: true,
        message: "User logged out successfully!",
      });
    } catch (error) {
      console.error("Error during logout:", error);

      if (error instanceof this.AppError) {
        return next(error);
      }

      return next(new this.AppError("Internal server error", 500, error));
    }
  }
}
module.exports = new AuthController();
