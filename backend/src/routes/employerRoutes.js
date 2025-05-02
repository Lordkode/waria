const express = require("express");
const EmployerController = require("../controllers/employerController");
const RouteInterface = require("./routeInterface");
const AuthMiddleware = require("../middlewares/authMiddlewares");

class EmployerRoutes extends RouteInterface {
  constructor() {
    super();
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Register route
    this.router.post(
      "/createEmployee",
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isEmployer,
      (req, res, next) => EmployerController.createEmployee(req, res, next)
    );

    this.addRoute({
      path: "/employer",
      router: this.router,
    });
  }
}

module.exports = new EmployerRoutes();
