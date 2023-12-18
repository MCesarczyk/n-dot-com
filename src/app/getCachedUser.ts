import { unstable_cache } from "next/cache";

import { db } from "@/db/db";

export const getCachedUser = unstable_cache(
  () => {
    return db.query.user.findMany();
  },
  ["user", "findMany"],
  {
    revalidate: 1125,
    tags: ["homepage"],
  }
);
