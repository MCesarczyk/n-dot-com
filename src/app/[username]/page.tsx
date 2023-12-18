import { AutoRefresh } from "@/app/[username]/AutoRefresh";
import { Form } from "@/app/[username]/Form";
import { getCachedTweetsForUser } from "@/app/[username]/getCachedTweetsForUser";
import { getCachedUser } from "@/app/getCachedUser";
import { db } from "@/db/db";
import { tweet } from "@/db/schema";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const userData = await getCachedTweetsForUser(params.username);
  const users = await getCachedUser();

  const currentUserId = users.find(
    (user) => user.username === params.username
  )?.id;

  if (!userData || !currentUserId) {
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
            userId: currentUserId,
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
