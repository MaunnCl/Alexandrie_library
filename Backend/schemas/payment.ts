import { pgTable, uuid, varchar, date, integer } from "drizzle-orm/pg-core";
import { subscriptionTable } from "./subscription";

export const paymentHistoryTable = pgTable("payment_history", {
    id: uuid("id").primaryKey().defaultRandom(),
    subscription_id: uuid("subscription_id").notNull().references(() => subscriptionTable.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    payment_date: date("payment_date").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    createdAt: date("createdAt").notNull().defaultNow()
});
