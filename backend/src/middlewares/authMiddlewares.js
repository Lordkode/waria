const AppError = require("../errors/appError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthMiddleware {
  // Validate schema
  static validate(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }
      next();
    };
  }

  // Is Authenticated Middleware
  static isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Token manquant ou invalide !", 401));
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded; // ex: { id, role, ... }
      next();
    } catch {
      return next(new AppError("Token invalide.", 401));
    }
  }

  // Is Admin middleware
  static isAdmin(req, res, next) {
    if (req.user.role !== "admin") {
      return next(new AppError("Unauthorized ! Not admin !", 403));
    }
    next();
  }

  // Is Employer middleware
  static isEmployer(req, res, next) {
    if (req.user.role !== "employer") {
      return next(new AppError("Unauthorized ! Not employer !", 403));
    }
    next();
  }

  // Is Employee middleware
  static isEmployee(req, res, next) {
    if (req.user.role !== "employee") {
      return next(new AppError("Unauthorized ! Not employee !", 403));
    }
    next();
  }
}

module.exports = AuthMiddleware;
