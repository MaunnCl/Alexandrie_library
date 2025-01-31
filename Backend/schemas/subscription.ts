import { pgTable, uuid, varchar, date, integer } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const subscriptionTable = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }).notNull(),
    plan: varchar("plan", { length: 100 }).notNull(),
    price: integer("price").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    next_billing_date: date("next_billing_date"),
    subscription_started: date("subscription_started").notNull(),
    subscription_ended: date("subscription_ended"),
    createdAt: date("createdAt").notNull().defaultNow(),
    updatedAt: date("updatedAt").notNull().defaultNow()
});
