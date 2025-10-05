import { pgTable, text, numeric, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const amazonProducts = pgTable("amazon_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  asin: text("asin").notNull().unique(),
  sellerSku: text("seller_sku"),
  productBarcode: text("product_barcode"),
  title: text("title"),
  brand: text("brand"),
  manufacturer: text("manufacturer"),
  productGroup: text("product_group"),
  productStatus: text("product_status"),
  variationTheme: text("variation_theme"),
  parentAsin: text("parent_asin"),
  fulfillmentChannels: text("fulfillment_channels").array(),
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  offers: jsonb("offers"),
  images: jsonb("images"),
  itemAttributes: jsonb("item_attributes"),
  itemDimensions: jsonb("item_dimensions"),
  packageDimensions: jsonb("package_dimensions"),
  salesRank: jsonb("sales_rank"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  rawData: jsonb("raw_data"),
});
