import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export * from "../../schema/user-products";
export * from "./schema/shopify-products";
export * from "./schema/ebay-listings";
export * from "./schema/amazon-products";
export * from "./schema/etsy-listings";
export * from "./schema/tiktok-products";
export * from "./schema/woocommerce-products";
