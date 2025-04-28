"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    firstname: (0, pg_core_1.varchar)("firstname", { length: 255 }).notNull(),
    lastname: (0, pg_core_1.varchar)("lastname", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    password: (0, pg_core_1.varchar)("password").notNull(),
    dateOfBirth: (0, pg_core_1.date)("date_of_birth"),
    address: (0, pg_core_1.varchar)("address", { length: 255 }),
    country: (0, pg_core_1.varchar)("country", { length: 255 }),
    zipcode: (0, pg_core_1.varchar)("zipcode", { length: 10 }),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    createdAt: (0, pg_core_1.date)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.date)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.unique)("users_email_unique").on(table.email),
]);
