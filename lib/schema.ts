import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const guestbookMessages = pgTable("guestbook_messages", {
  id:        serial("id").primaryKey(),
  name:      varchar("name", { length: 100 }).notNull(),
  message:   text("message").notNull(),
  status:    varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GuestbookMessage = typeof guestbookMessages.$inferSelect;
