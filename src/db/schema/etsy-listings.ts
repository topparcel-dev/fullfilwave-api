import { pgTable, uuid, text, numeric, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const etsyListings = pgTable("etsy_listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  etsyListingId: numeric("etsy_listing_id", { precision: 18, scale: 0 })
    .notNull()
    .unique(),
  sellerUserId: numeric("seller_user_id", { precision: 18, scale: 0 }),
  sellerSku: text("seller_sku"),
  barcode: text("barcode"),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  quantity: integer("quantity"),
  listingStatus: text("listing_status"),
  url: text("url"),
  views: integer("views"),
  numFavorers: integer("num_favorers"),
  tags: text("tags").array(),
  materials: text("materials").array(),
  isCustomizable: text("is_customizable"),
  hasVariations: text("has_variations"),
  variations: jsonb("variations"),
  images: jsonb("images"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  originalCreationTsz: timestamp("original_creation_tsz"),
  lastModifiedTsz: timestamp("last_modified_tsz"),
  rawData: jsonb("raw_data"),
});
