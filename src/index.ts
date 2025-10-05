import { Elysia } from "elysia";
import { sql } from "drizzle-orm";
import { db } from "./db/client";

const app = new Elysia()
  .get("/", async () => {
    try {
      const [row] = await db.execute(sql`select version() as version`);
      return {
        status: "ok",
        database: row?.version,
      };
    } catch (error) {
      console.error("Database health check failed", error);
      return {
        status: "error",
        message: "Database connection failed",
      };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
