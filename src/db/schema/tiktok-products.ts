import { pgTable, uuid, text, numeric, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tiktokProducts = pgTable("tiktok_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  tiktokProductId: text("tiktok_product_id").notNull().unique(),
  shopId: text("shop_id"),
  sellerSku: text("seller_sku"),
  barcode: text("barcode"),
  title: text("title").notNull(),
  description: text("description"),
  productStatus: integer("product_status"),
  categoryId: text("category_id"),
  brandId: text("brand_id"),
  currency: text("currency").default("USD"),
  price: numeric("price", { precision: 10, scale: 2 }),
  stockQuantity: integer("stock_quantity"),
  skus: jsonb("skus"),
  mainImages: jsonb("main_images"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  rawData: jsonb("raw_data"),
});
