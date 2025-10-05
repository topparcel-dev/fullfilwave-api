import { pgTable, text, numeric, timestamp, uuid, jsonb, bigint } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const shopifyProducts = pgTable("shopify_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopifyId: bigint("shopify_id", { mode: "number" }).notNull().unique(),
  sellerSku: text("seller_sku"),
  barcode: text("barcode"),
  title: text("title").notNull(),
  handle: text("handle"),
  bodyHtml: text("body_html"),
  vendor: text("vendor"),
  productType: text("product_type"),
  status: text("status"),
  tags: text("tags").array(),
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  stockQuantity: numeric("stock_quantity", { precision: 8, scale: 0 }),
  variants: jsonb("variants"),
  images: jsonb("images"),
  options: jsonb("options"),
  metafields: jsonb("metafields"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
