import { faker } from "@faker-js/faker";
import { db } from "../src/db/client";
import {
  userProducts,
  shopifyProducts,
  ebayListings,
  amazonProducts,
  etsyListings,
  tiktokProducts,
  woocommerceProducts,
} from "../src/db/schema";

async function seedChannels() {
  console.log("🔄 Получаем товары пользователя...");
  const baseProducts = await db.select().from(userProducts);

  if (baseProducts.length === 0) {
    console.log(
      "❌ В базе нет user_products. Сначала заполни через seed-user-products.ts"
    );
    process.exit(1);
  }

  const channels = [
    { name: "shopify" },
    { name: "ebay" },
    { name: "amazon" },
    { name: "etsy" },
    { name: "tiktok" },
    { name: "woocommerce" },
  ] as const;

  const TOTAL_PER_CHANNEL = 90;

  for (const { name } of channels) {
    console.log(`\n📦 Генерация для канала: ${name}...`);

    switch (name) {
      case "shopify":
        await db.delete(shopifyProducts);
        break;
      case "ebay":
        await db.delete(ebayListings);
        break;
      case "amazon":
        await db.delete(amazonProducts);
        break;
      case "etsy":
        await db.delete(etsyListings);
        break;
      case "tiktok":
        await db.delete(tiktokProducts);
        break;
      case "woocommerce":
        await db.delete(woocommerceProducts);
        break;
    }

    for (let i = 0; i < TOTAL_PER_CHANNEL; i++) {
      const base = faker.helpers.arrayElement(baseProducts);
      const title = faker.helpers.arrayElement([
        base.title,
        `${faker.commerce.productAdjective()} ${base.title}`,
        `${base.title} ${faker.commerce.productMaterial()}`,
        `${base.title} ${faker.helpers.arrayElement(["Pro", "Plus", "Edition", "Limited"])}`,
      ]);

      const multiplier = faker.number.float({ min: 0.85, max: 1.2, multipleOf: 0.01 });
      const price = Number((Number(base.price) * multiplier).toFixed(2));
      const sku = `${name.substring(0, 3).toUpperCase()}-${base.baseSku}`;
      const barcode = base.barcode;
      const images = faker.helpers
        .shuffle(base.imageUrls ?? [])
        .slice(0, faker.number.int({ min: 1, max: Math.max(1, base.imageUrls?.length ?? 1) }));
      const stockQty = faker.number.int({ min: 1, max: 150 });

      switch (name) {
        case "shopify":
          await db.insert(shopifyProducts).values({
            shopifyId: faker.number.int({ min: 1_000_000_000, max: 9_999_999_999 }),
            sellerSku: base.baseSku,
            barcode,
            title,
            handle: faker.helpers.slugify(title).toLowerCase(),
            vendor: base.brand,
            productType: base.category,
            status: faker.helpers.arrayElement(["active", "draft", "archived"]),
            tags: faker.helpers.arrayElements(["new", "sale", "bestseller", "eco"], {
              min: 0,
              max: 3,
            }),
            price,
            stockQuantity: stockQty,
            currency: "USD",
            variants: [{ sku, price, quantity: stockQty }],
            images: images.map((src) => ({ src })),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          });
          break;

        case "ebay":
          await db.insert(ebayListings).values({
            ebayItemId: faker.string.numeric({ length: 12 }),
            sellerSku: base.baseSku,
            ebaySku: sku,
            barcode,
            title,
            description: base.description,
            currentPrice: price,
            quantity: stockQty,
            listingStatus: faker.helpers.arrayElement(["Active", "Ended", "Completed"]),
            imageUrls: images,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          });
          break;

        case "amazon":
          await db.insert(amazonProducts).values({
            asin: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
            sellerSku: sku,
            productBarcode: barcode,
            title,
            brand: base.brand,
            manufacturer: base.brand,
            productGroup: base.category,
            fulfillmentChannels: faker.helpers.arrayElements(["FBA", "FBM"], {
              min: 1,
              max: 1,
            }),
            productStatus: faker.helpers.arrayElement(["Active", "Inactive", "Suppressed"]),
            price,
            currency: "USD",
            offers: [{ price }],
            images: images.map((url) => ({ url })),
            itemAttributes: { weight: `${base.weight}kg` },
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          });
          break;

        case "etsy":
          await db.insert(etsyListings).values({
            etsyListingId: faker.number.int({ min: 1_000_000_000, max: 9_999_999_999 }).toString(),
            sellerSku: sku,
            barcode,
            title,
            description: base.description,
            price,
            currency: "USD",
            quantity: stockQty,
            listingStatus: faker.helpers.arrayElement(["active", "inactive", "sold_out"]),
            tags: faker.helpers.arrayElements(["handmade", "vintage", "gift"], {
              min: 0,
              max: 3,
            }),
            images: images.map((url) => ({ src: url })),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          });
          break;

        case "tiktok":
          await db.insert(tiktokProducts).values({
            tiktokProductId: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
            shopId: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
            sellerSku: sku,
            barcode,
            title,
            productStatus: faker.number.int({ min: 1, max: 6 }),
            price,
            currency: "USD",
            stockQuantity: stockQty,
            skus: [
              {
                id: sku,
                seller_sku: base.baseSku,
                price,
                stock_info: { quantity: stockQty },
              },
            ],
            mainImages: images,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          });
          break;

        case "woocommerce":
          await db.insert(woocommerceProducts).values({
            wcProductId: faker.number.int({ min: 100_000_000, max: 999_999_999 }),
            sellerSku: sku,
            barcode,
            name: title,
            description: base.description,
            status: faker.helpers.arrayElement(["publish", "draft"]),
            price,
            stockQuantity: stockQty,
            stockStatus: faker.helpers.arrayElement(["instock", "outofstock"]),
            images: images.map((src) => ({ src })),
            categories: [{ name: base.category }],
            tags: faker.helpers.arrayElements(["featured", "sale"], {
              min: 0,
              max: 2,
            }),
            createdAt: faker.date.past(),
          });
          break;
      }
    }

    console.log(`✅ Канал ${name}: создано ${TOTAL_PER_CHANNEL} товаров`);
  }

  console.log("\n🎉 Все каналы заполнены!");
  process.exit(0);
}

seedChannels().catch((error) => {
  console.error("❌ Ошибка при генерации каналов", error);
  process.exit(1);
});
