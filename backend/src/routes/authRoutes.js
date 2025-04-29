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

    this.router.post("/register", (req, res) =>
      AuthController.register(req, res)
    );
    this.router.post("/activate", (req, res) => {
      AuthController.activateAccount(req, res);
    });

    this.addRoute({
      path: "/auth",
      router: this.router,
    });
  }
}

module.exports = new AuthRoutes();
