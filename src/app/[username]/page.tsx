import { AutoRefresh } from "@/app/[username]/AutoRefresh";
import { Form } from "@/app/[username]/Form";
import { db } from "@/db/db";
import { tweet, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import Link from "next/link";
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
    <>
      <Form
        action={async (formData: FormData) => {
          "use server";

          const message = formData.get("message")?.toString();

          if (!message) {
            throw new Error("Message is required");
          }

          const insertData = {
            message,
            userId: 3,
          } satisfies typeof tweet.$inferInsert;

          await db.insert(tweet).values([insertData]);

          revalidatePath(`/${params.username}`);

          console.log({ message });
        }}
      >
        <label className="flex gap-4">
          Message
          <textarea name="message" className="w-full text-gray-950"></textarea>
        </label>
        <button
          className="text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md block flex-grow-0"
          type="submit"
        >
          Post
        </button>
      </Form>
      <AutoRefresh />
      <ul className="mb-4">
        {userData.tweets.map((tweet) => (
          <li>
            <p className="border-b-gray-500 border-b-2 mb-2">{tweet.message}</p>
          </li>
        ))}
      </ul>
      <div className="flex">
        <Link
          className="text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md block flex-grow-0"
          href={"/"}
        >
          Back
        </Link>
      </div>
    </>
  );
}
