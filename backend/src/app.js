const express = require("express");
const app = express();
const AuthRoutes = require("./routes/authRoutes");
const errorHandler = require("./errors/errorHandler");
const EmployerRoutes = require("./routes/employerRoutes");

app.use(express.json());

// Authentification routes
const authRoutes = AuthRoutes.getRoutes();
authRoutes.forEach((route) => {
  app.use(route.path, route.router);
});

// Employer routes
const employerRoutes = EmployerRoutes.getRoutes();
employerRoutes.forEach((route) => {
  app.use(route.path, route.router);
});

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use(errorHandler);

module.exports = app;
