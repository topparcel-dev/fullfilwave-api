import { pgTable, text, numeric, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userProducts = pgTable('user_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  baseSku: text('base_sku').notNull().unique(), // основной SKU пользователя
  title: text('title').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  barcode: text('barcode').unique(),
  brand: text('brand'),
  category: text('category'),
  weight: numeric('weight', { precision: 8, scale: 3 }),
  imageUrls: jsonb('image_urls').$type<string[]>(), // массив URL изображений
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
