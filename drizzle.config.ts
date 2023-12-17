import type { Config } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env'
loadEnvConfig(".")

if (!process.env.POSTGRES_URL) throw new Error("POSTGRES_URL is not defined")

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  }
} satisfies Config
