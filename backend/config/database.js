const { Sequelize } = require("sequelize");
const config = require("./config");

const env = process.env.NODE_ENV || "development";
const configEnv = config[env];

const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  {
    host: configEnv.host,
    dialect: configEnv.dialect,
    dialectOptions: configEnv.dialectOptions,
    logging: console.log,
  }
);

module.exports = sequelize;
