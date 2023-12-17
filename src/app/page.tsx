import { db } from "@/db/db";
import { unstable_cache } from "next/cache";
import Link from "next/link";

const getCachedUser = unstable_cache(() => {
  return db.query.user.findMany();
}, ["user", "findMany"], {
  revalidate: 1125,
  tags: ["homepage"]
});

export default async function Home() {
  const users = await getCachedUser();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/${user.username}`}>{user.username}</Link>
        </li>
      ))}
    </ul>
  );
}
