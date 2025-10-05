import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db/client";

import {
  shopifyProducts,
  ebayListings,
  amazonProducts,
  etsyListings,
  tiktokProducts,
  woocommerceProducts,
} from "./db/schema";

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
  .get("/shopify/products", async () => {
    return await db.select().from(shopifyProducts).limit(20);
  })

  // eBay
  .get("/ebay/listings", async () => {
    return await db.select().from(ebayListings).limit(20);
  })

  // Amazon
  .get("/amazon/products", async () => {
    return await db.select().from(amazonProducts).limit(20);
  })

  // Etsy
  .get("/etsy/listings", async () => {
    return await db.select().from(etsyListings).limit(20);
  })

  // TikTok
  .get("/tiktok/products", async () => {
    return await db.select().from(tiktokProducts).limit(20);
  })

  // WooCommerce
  .get("/woocommerce/products", async () => {
    return await db.select().from(woocommerceProducts).limit(20);
  })

  .listen(3000);

console.log(`🦊 Elysia is running on http://localhost:3000/swagger`);
