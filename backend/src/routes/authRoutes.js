const express = require("express");
const AuthController = require("../controllers/authController");
const RouteInterface = require("./routeInterface");

class AuthRoutes extends RouteInterface {
  constructor() {
    super();
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Register route
    this.router.post("/register", (req, res) =>
      AuthController.register(req, res)
    );
    // Activate user account route
    this.router.post("/activate", (req, res) => {
      AuthController.activateAccount(req, res);
    });
    // login route
    this.router.post("/login", (req, res) => {
      AuthController.login(req, res);
    });
    // Refresh token route
    this.router.post("/refresh-token", (req, res) => {
      AuthController.refreshToken(req, res);
    });
    // Resend confirmation code to user route
    this.router.post("/resend-code", (req, res) => {
      AuthController.confirmationcode(req, res);
    });
    // Initiate reset password route
    this.router.post("/reset-password", (req, res) => {
      AuthController.sendResetPasswordCode(req, res);
    });
    // Change password route
    this.router.post("/change-password", (req, res) => {
      AuthController.changePassword(req, res);
    });

    this.addRoute({
      path: "/auth",
      router: this.router,
    });
  }
}

module.exports = new AuthRoutes();
