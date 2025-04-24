const app = require("./src/app");
const { Sequelize } = require("sequelize");
const config = require("./config/config");

const PORT = process.env.PORT || 3000;

// Envrionnement initialisation
const env = process.env.NODE_ENV || "development";
const configEnv = config[env];
const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  {
    host: configEnv.host,
    dialect: configEnv.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// Test de la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "✅ Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
