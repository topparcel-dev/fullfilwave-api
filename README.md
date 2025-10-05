# FullfilWave API

Мини-сервис на [Bun](https://bun.sh) + [Elysia](https://elysiajs.com) для мок-имитации товарных каналов (Shopify, eBay, Amazon, Etsy, TikTok, WooCommerce) c базой на PostgreSQL и схемами в [Drizzle ORM](https://orm.drizzle.team/).

## Быстрый старт
1. Установи зависимости: `bun install`
2. Укажи `POSTGRES_URL` в `.env`
3. Прогони миграции: `bun run db:migrate`
4. (Опционально) засеять данные:  
   - `bun run seed:user-products` — базовые товары  
   - `bun run seed:channels` — синхронизация всех каналов
5. Запусти сервер: `bun run dev` и открой http://localhost:3000/swagger

## Доступные команды
- `bun run db:generate` — генерирует новую миграцию из схемы
- `bun run db:migrate` — применяет миграции к БД
- `bun run db:push` — синхронизирует схему без миграции
- `bun run db:studio` — UI для просмотра схемы Drizzle
- `bun run seed:user-products` — подготавливает базовые товары
- `bun run seed:channels` — наполняет маркетплейсы
- `bun run dev` — запускает API в watch-режиме

## API
Swagger доступен по адресу `/swagger`. Каждый роут поддерживает фильтры, похожие на реальные API площадок. Примеры:

```http
GET /shopify/products?status=active&vendor=Nike
GET /ebay/listings?price_min=20&price_max=80
GET /amazon/products?seller_sku=AMA-001
GET /etsy/listings?tags=gift
GET /tiktok/products?product_status=4&updated_from=2025-01-01
GET /woocommerce/products?search=bag&price_max=60
```

## Docker (для Coolify или вручную)
1. Собери образ: `docker build -t fullfilwave-api .`
2. Запусти контейнер:  
   `docker run -p 3000:3000 -e POSTGRES_URL=... fullfilwave-api`
3. Swagger и эндпоинты будут доступны на `http://localhost:3000/swagger`

## Структура
```
├─ src/
│  ├─ db/
│  │  ├─ client.ts        # подключение к Postgres через drizzle-orm/postgres-js
│  │  ├─ schema.ts        # экспорт всех таблиц
│  │  └─ schema/*.ts      # схемы каналов
│  └─ index.ts            # Elysia-приложение + Swagger
├─ scripts/
│  ├─ seed-user-products.ts
│  └─ seed-channels.ts
├─ drizzle/               # миграции (генерируются автоматически)
├─ dockerfile             # образ для развёртываний
└─ package.json
```

## Полезно знать
- Drizzle CLI читает `POSTGRES_URL`, поэтому переменная должна быть доступна при запуске команд.
- Faker генерирует детерминированные данные только при фиксированном seed — можно добавить при необходимости.
- Swagger автоматически обновляется при добавлении новых фильтров или роутов благодаря `t.Object` описаниям в коде.
