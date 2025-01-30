import { Dialect, Sequelize } from "sequelize";
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST as string,
        dialect: process.env.DB_DIALECT as Dialect,
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