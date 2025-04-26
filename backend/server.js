const app = require("./src/app");
const sequelize = require("./config/database");


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
