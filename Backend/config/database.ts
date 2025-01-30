import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;
const dbDialect = process.env.DB_DIALECT as Dialect;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    logging: false,
});

export async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à PostgreSQL réussie !");
    } catch (error) {
        console.error("❌ Erreur de connexion à PostgreSQL :", error);
        process.exit(1);
    }
}

export default sequelize;
