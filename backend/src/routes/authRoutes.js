const express = require("express");
const AuthController = require("../controllers/authController");
const RouteInterface = require("./routeInterface");
const AuthMiddleware = require("../middlewares/authMiddlewares");
const AuthSchemas = require("../validations/schemas/authSchema");

class AuthRoutes extends RouteInterface {
  constructor() {
    super();
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Register route
    this.router.post(
      "/register",
      AuthMiddleware.validate(AuthSchemas.register()),
      (req, res, next) => AuthController.register(req, res, next)
    );
    // Activate user account route
    this.router.post(
      "/activate",
      AuthMiddleware.validate(AuthSchemas.activateAccount()),
      (req, res, next) => AuthController.activateAccount(req, res, next)
    );
    // login route
    this.router.post(
      "/login",
      AuthMiddleware.validate(AuthSchemas.login()),
      (req, res, next) => AuthController.login(req, res, next)
    );
    // Refresh token route
    this.router.post("/refresh-token", (req, res, next) => {
      AuthController.refreshToken(req, res, next);
    });
    // Resend confirmation code to user route
    this.router.post("/resend-code", (req, res, next) => {
      AuthController.confirmationcode(req, res, next);
    });
    // Initiate reset password route
    this.router.post("/reset-password", (req, res, next) => {
      AuthController.sendResetPasswordCode(req, res, next);
    });
    // Change password route
    this.router.post(
      "/change-password",
      AuthMiddleware.isAuthenticated,
      (req, res, next) => AuthController.changePassword(req, res, next)
    );
    // logout route
    this.router.post(
      "/logout",
      AuthMiddleware.isAuthenticated,
      (req, res, next) => AuthController.logout(req, res, next)
    );

    this.addRoute({
      path: "/auth",
      router: this.router,
    });
  }
}

module.exports = new AuthRoutes();
