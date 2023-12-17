import { db } from "@/db/db";
import { tweet, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

const getCachedTweetsForUser = unstable_cache(
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

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const userData = await getCachedTweetsForUser(params.username);

  if (!userData) {
    notFound();
  }

  return (
    <ul>
      {userData.tweets.map((tweet) => (
        <li>
          <p>{tweet.message}</p>
        </li>
      ))}
    </ul>
  );
}
