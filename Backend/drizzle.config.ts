import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPassword = process.env.DB_PASSWORD!;
const dbHost = process.env.DB_HOST!;

const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

export default defineConfig({
  schema: './src/schemas',
  out: './config/migration',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl
  }
});
