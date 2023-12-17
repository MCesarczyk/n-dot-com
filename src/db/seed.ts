import { drizzle } from "drizzle-orm/node-postgres";
import { user, tweet } from "./schema";
import { faker } from "@faker-js/faker";
import NextEnv from '@next/env';
import pg from "pg";
const { Pool } = pg;

NextEnv.loadEnvConfig(process.cwd(), true);

if (!("POSTGRES_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  const client = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
  const db = drizzle(client);
  const usersData: (typeof user.$inferInsert)[] = [];
  const tweetsData: (typeof tweet.$inferInsert)[] = [];

  for (let i = 0; i < 10; i++) {
    usersData.push({
      username: faker.internet.userName(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    });
  }

  for (let i = 0; i < 10; i++) {
    tweetsData.push({
      userId: i + 1,
      message: faker.lorem.sentence(),
      retweetCount: faker.number.int({ min: 0, max: 100 }),
      favoriteCount: faker.number.int({ min: 0, max: 100 }),
      isRetweet: faker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log("Seed start");
  // await db.insert(user).values(usersData);
  await db.insert(tweet).values(tweetsData);
  console.log("Seed done");
};

main();