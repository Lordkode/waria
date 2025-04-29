const app = require("./src/app");
const sequelize = require("./config/database");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 3000;

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

// Test redis database connexion
(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis client connected successfully !");
  } catch (error) {
    console.error("❌ Error while connecting to redis", error);
  }
})();
