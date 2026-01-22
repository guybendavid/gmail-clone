import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 20 }).notNull(),
  lastName: varchar("last_name", { length: 20 }).notNull(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 })
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  sender: varchar("sender", { length: 50 })
    .notNull()
    .references(() => users.email),
  recipient: varchar("recipient", { length: 50 })
    .notNull()
    .references(() => users.email),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow()
});
