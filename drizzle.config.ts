import {defineConfig} from "drizzle-kit";
import type {Config} from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

import path from "path";

const drizzleConfig = {
    schema: "drizzle/schema.ts",
    out: path.join(__dirname, "migrations"), // Dynamically resolve path
    dialect: "postgresql",
    dbCredentials: {url: DATABASE_URL},
} satisfies Config;

export default defineConfig(drizzleConfig)