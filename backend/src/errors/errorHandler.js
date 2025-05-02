const AppError = require("./appError");

// Pour les erreurs de validation Sequelize
const handleSequelizeUniqueConstraintError = (err) => {
  const constraint = err.errors[0].path;
  let message = "Validation error";

  if (constraint === "email") {
    message = "Email already exists";
  } else if (constraint === "username") {
    message = "Username already exists";
  }

  return new AppError(message, 400);
};

// Pour les erreurs JWT
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again.", 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Environnement de développement
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Environnement de production
  let error = { ...err };
  error.message = err.message;

  // Erreurs spécifiques
  if (err.name === "SequelizeUniqueConstraintError")
    error = handleSequelizeUniqueConstraintError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Erreurs opérationnelles connues
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Erreurs inconnues ou non gérées
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
