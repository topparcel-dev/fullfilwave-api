CREATE TABLE "user_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_sku" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD',
	"barcode" text,
	"brand" text,
	"category" text,
	"weight" numeric(8, 3),
	"image_urls" jsonb,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "user_products_base_sku_unique" UNIQUE("base_sku"),
	CONSTRAINT "user_products_barcode_unique" UNIQUE("barcode")
);
