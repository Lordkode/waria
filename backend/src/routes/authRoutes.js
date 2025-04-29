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
    // check authController.register type
    if (typeof AuthController.register !== "function") {
      throw new Error("authController.register is not a function");
    }

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

    this.addRoute({
      path: "/auth",
      router: this.router,
    });
  }
}

module.exports = new AuthRoutes();
