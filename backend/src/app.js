const express = require("express");
const app = express();
const AuthRoutes = require("./routes/authRoutes");
const errorHandler = require("./errors/errorHandler");

app.use(express.json());

const routes = AuthRoutes.getRoutes();
routes.forEach((route) => {
  app.use(route.path, route.router);
});

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use(errorHandler);

module.exports = app;
