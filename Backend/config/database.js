const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à PostgreSQL réussie !");
    } catch (error) {
        console.error("❌ Erreur de connexion à PostgreSQL :", error);
        process.exit(1);
    }
}

module.exports = { sequelize, connectDB };