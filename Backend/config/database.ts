import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";
import 'dotenv/config';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;

const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

export const db = drizzle(postgres(dbUrl as string));