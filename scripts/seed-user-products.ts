import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { db } from "../src/db/client";
import { userProducts } from "../src/db/schema";

async function seedUserProducts(count = 150) {
  console.log(`🌱 Начинаем генерацию ${count} товаров...`);

  const categories = [
    "Clothing",
    "Electronics",
    "Home",
    "Toys",
    "Books",
    "Beauty",
    "Sports",
  ];

  const products = Array.from({ length: count }).map(() => {
    const title = faker.commerce.productName();
    const price = parseFloat(faker.commerce.price({ min: 5, max: 200 }));
    return {
      baseSku: faker.string.alphanumeric(8).toUpperCase(),
      title,
      description: faker.commerce.productDescription(),
      price,
      currency: "USD",
      barcode: faker.string.numeric(12),
      brand: faker.company.name(),
      category: faker.helpers.arrayElement(categories),
      weight: faker.number.float({ min: 0.2, max: 5, precision: 0.01 }),
      imageUrls: [
        faker.image.urlPicsumPhotos({ width: 800, height: 800 }),
        faker.image.urlPicsumPhotos({ width: 800, height: 800 }),
        faker.image.urlPicsumPhotos({ width: 800, height: 800 }),
      ],
    };
  });

  await db.delete(userProducts).where(eq(userProducts.currency, "USD"));

  await db.insert(userProducts).values(products);

  console.log(`✅ Сгенерировано ${count} товаров`);
  process.exit(0);
}

seedUserProducts().catch((error) => {
  console.error("❌ Ошибка при генерации товаров", error);
  process.exit(1);
});
