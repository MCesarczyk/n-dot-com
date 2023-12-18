import { unstable_cache } from "next/cache";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { tweet, user } from "@/db/schema";

export const getCachedTweetsForUser = unstable_cache(
  async (username: string) => {
    return db.query.user.findFirst({
      where: eq(user.username, username),
      with: {
        tweets: {
          orderBy: desc(tweet.createdAt),
        },
      },
    });
  },
  ["user", "findFirst", "tweets"],
  {
    revalidate: 25,
  }
);
