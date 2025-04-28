"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/schemas',
    out: './config/migration',
    dialect: 'postgresql',
    dbCredentials: {
        url: dbUrl
    }
});
