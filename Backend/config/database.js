"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.db = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
require("dotenv/config");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;
exports.db = (0, postgres_js_1.drizzle)((0, postgres_1.default)(dbUrl));
exports.client = (0, postgres_1.default)(dbUrl);
