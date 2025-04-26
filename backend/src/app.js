const express = require("express");
const app = express();
const AuthRoutes = require("./routes/authRoutes");

app.use(express.json());

const routes = AuthRoutes.getRoutes();
routes.forEach((route) => {
  app.use(route.path, route.router);
});

app.get("/", (req, res) => {
  res.send("Hello World !");
});

module.exports = app;
