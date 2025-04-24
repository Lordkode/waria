const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello World !" });
});

module.exports = app;
