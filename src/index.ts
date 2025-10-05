import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { and, eq, gte, like, lte, sql } from "drizzle-orm";
import { db } from "./db/client";

import {
  shopifyProducts,
  ebayListings,
  amazonProducts,
  etsyListings,
  tiktokProducts,
  woocommerceProducts,
} from "./db/schema";

const LIMIT = 20;

const parseNumber = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
};

const app = new Elysia()
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "FullfilWave API",
          version: "1.0.0",
          description: "Mock integrations for all connected sales channels",
        },
      },
    })
  )

  // Shopify
  .get(
    "/shopify/products",
    async ({ query }) => {
      const conditions = [] as ReturnType<typeof eq>[];

      if (query.title) {
        conditions.push(like(shopifyProducts.title, `%${query.title}%`));
      }

      if (query.status) {
        conditions.push(eq(shopifyProducts.status, query.status));
      }

      if (query.vendor) {
        conditions.push(eq(shopifyProducts.vendor, query.vendor));
      }

      if (query.product_type) {
        conditions.push(eq(shopifyProducts.productType, query.product_type));
      }

      const updatedFrom = parseDate(query.updated_from);
      if (updatedFrom) {
        conditions.push(gte(shopifyProducts.updatedAt, updatedFrom));
      }

      const baseQuery = db.select().from(shopifyProducts);
      const filteredQuery = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      return await filteredQuery.limit(LIMIT);
    },
    {
      query: t.Object({
        title: t.Optional(t.String()),
        status: t.Optional(t.Enum(["active", "draft", "archived"])),
        vendor: t.Optional(t.String()),
        product_type: t.Optional(t.String()),
        updated_from: t.Optional(
          t.String({ format: "date", examples: ["2025-01-01"] })
        ),
      }),
    }
  )

  // eBay
  .get(
    "/ebay/listings",
    async ({ query }) => {
      const conditions = [] as ReturnType<typeof eq>[];

      if (query.title) {
        conditions.push(like(ebayListings.title, `%${query.title}%`));
      }

      if (query.listing_status) {
        conditions.push(eq(ebayListings.listingStatus, query.listing_status));
      }

      if (query.category_id) {
        conditions.push(eq(ebayListings.categoryId, query.category_id));
      }

      const minPrice = parseNumber(query.price_min);
      if (minPrice !== undefined) {
        conditions.push(gte(ebayListings.currentPrice, minPrice));
      }

      const maxPrice = parseNumber(query.price_max);
      if (maxPrice !== undefined) {
        conditions.push(lte(ebayListings.currentPrice, maxPrice));
      }

      if (query.sku) {
        conditions.push(eq(ebayListings.ebaySku, query.sku));
      }

      const baseQuery = db.select().from(ebayListings);
      const filteredQuery = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      return await filteredQuery.limit(LIMIT);
    },
    {
      query: t.Object({
        title: t.Optional(t.String()),
        listing_status: t.Optional(t.Enum(["Active", "Ended", "Completed"])),
        category_id: t.Optional(t.String()),
        price_min: t.Optional(t.String({ examples: ["10"] })),
        price_max: t.Optional(t.String({ examples: ["50"] })),
        sku: t.Optional(t.String()),
      }),
    }
  )

  // Amazon
  .get(
    "/amazon/products",
    async ({ query }) => {
      const conditions = [] as ReturnType<typeof eq>[];

      if (query.asin) {
        conditions.push(eq(amazonProducts.asin, query.asin));
      }

      if (query.seller_sku) {
        conditions.push(eq(amazonProducts.sellerSku, query.seller_sku));
      }

      if (query.brand) {
        conditions.push(eq(amazonProducts.brand, query.brand));
      }

      if (query.status) {
        conditions.push(eq(amazonProducts.productStatus, query.status));
      }

      const minPrice = parseNumber(query.price_min);
      if (minPrice !== undefined) {
        conditions.push(gte(amazonProducts.price, minPrice));
      }

      const maxPrice = parseNumber(query.price_max);
      if (maxPrice !== undefined) {
        conditions.push(lte(amazonProducts.price, maxPrice));
      }

      const baseQuery = db.select().from(amazonProducts);
      const filteredQuery = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      return await filteredQuery.limit(LIMIT);
    },
    {
      query: t.Object({
        asin: t.Optional(t.String()),
        seller_sku: t.Optional(t.String()),
        brand: t.Optional(t.String()),
        status: t.Optional(t.Enum(["Active", "Inactive", "Suppressed"])),
        price_min: t.Optional(t.String({ examples: ["20"] })),
        price_max: t.Optional(t.String({ examples: ["80"] })),
      }),
    }
  )

  // Etsy
  .get(
    "/etsy/listings",
    async ({ query }) => {
      const conditions = [] as ReturnType<typeof eq>[];

      if (query.title) {
        conditions.push(like(etsyListings.title, `%${query.title}%`));
      }

      if (query.status) {
        conditions.push(eq(etsyListings.listingStatus, query.status));
      }

      const minPrice = parseNumber(query.price_min);
      if (minPrice !== undefined) {
        conditions.push(gte(etsyListings.price, minPrice));
      }

      const maxPrice = parseNumber(query.price_max);
      if (maxPrice !== undefined) {
        conditions.push(lte(etsyListings.price, maxPrice));
      }

      if (query.tags) {
        conditions.push(
          like(
            sql<string>`array_to_string(${etsyListings.tags}, ',')`,
            `%${query.tags}%`
          )
        );
      }

      const baseQuery = db.select().from(etsyListings);
      const filteredQuery = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      return await filteredQuery.limit(LIMIT);
    },
    {
      query: t.Object({
        title: t.Optional(t.String()),
        status: t.Optional(t.Enum(["active", "inactive", "sold_out"])),
        price_min: t.Optional(t.String({ examples: ["10"] })),
        price_max: t.Optional(t.String({ examples: ["50"] })),
        tags: t.Optional(t.String()),
      }),
    }
  )

  // TikTok
  .get(
    "/tiktok/products",
    async ({ query }) => {
      const conditions = [] as ReturnType<typeof eq>[];

      if (query.title) {
        conditions.push(like(tiktokProducts.title, `%${query.title}%`));
      }

      const productStatus = parseNumber(query.product_status);
      if (productStatus !== undefined) {
        conditions.push(eq(tiktokProducts.productStatus, productStatus));
      }

      if (query.category_id) {
        conditions.push(eq(tiktokProducts.categoryId, query.category_id));
      }

      const minPrice = parseNumber(query.price_min);
      if (minPrice !== undefined) {
        conditions.push(gte(tiktokProducts.price, minPrice));
      }

      const maxPrice = parseNumber(query.price_max);
      if (maxPrice !== undefined) {
        conditions.push(lte(tiktokProducts.price, maxPrice));
      }

      const updatedFrom = parseDate(query.updated_from);
      if (updatedFrom) {
        conditions.push(gte(tiktokProducts.updatedAt, updatedFrom));
      }

      const baseQuery = db.select().from(tiktokProducts);
      const filteredQuery = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      return await filteredQuery.limit(LIMIT);
    },
    {
      query: t.Object({
        title: t.Optional(t.String()),
        product_status: t.Optional(t.String({ examples: ["4"] })),
        category_id: t.Optional(t.String()),
        price_min: t.Optional(t.String({ examples: ["5"] })),
        price_max: t.Optional(t.String({ examples: ["100"] })),
        updated_from: t.Optional(
          t.String({ format: "date", examples: ["2025-01-01"] })
        ),
      }),
    }
  )

  // WooCommerce
  .get(
    "/woocommerce/products",
    async ({ query }) => {
      const conditions = [] as ReturnType<typeof eq>[];

      if (query.sku) {
        conditions.push(eq(woocommerceProducts.sellerSku, query.sku));
      }

      if (query.status) {
        conditions.push(eq(woocommerceProducts.status, query.status));
      }

      if (query.category) {
        conditions.push(
          like(
            sql<string>`coalesce(${woocommerceProducts.categories}::text, '')`,
            `%${query.category}%`
          )
        );
      }

      const minPrice = parseNumber(query.price_min);
      if (minPrice !== undefined) {
        conditions.push(gte(woocommerceProducts.price, minPrice));
      }

      const maxPrice = parseNumber(query.price_max);
      if (maxPrice !== undefined) {
        conditions.push(lte(woocommerceProducts.price, maxPrice));
      }

      if (query.search) {
        conditions.push(like(woocommerceProducts.name, `%${query.search}%`));
      }

      const baseQuery = db.select().from(woocommerceProducts);
      const filteredQuery = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      return await filteredQuery.limit(LIMIT);
    },
    {
      query: t.Object({
        sku: t.Optional(t.String()),
        status: t.Optional(t.Enum(["publish", "draft"])),
        category: t.Optional(t.String()),
        price_min: t.Optional(t.String({ examples: ["20"] })),
        price_max: t.Optional(t.String({ examples: ["50"] })),
        search: t.Optional(t.String()),
      }),
    }
  )

  .listen(3000);

console.log(`🦊 Elysia is running on http://localhost:3000/swagger`);
