import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client);

export * from "./schema";
