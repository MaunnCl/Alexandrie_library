import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;

const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

export default defineConfig({
    dialect: "postgresql",
    out: "./config/migration",
    schema: "./schemas/",
    dbCredentials: {
        url: dbUrl as string,
    },
});
