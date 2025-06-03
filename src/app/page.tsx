import postsData from "./posts.json";
import Link from "next/link";

export default function Home() {
  const posts = postsData.posts.map((post) => post);

  console.log(posts);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {postsData.posts.map((post) => {
          return (
            <Link
              key={post.slug}
              className="flex flex-col gap-1"
              href={`/posts/${post.slug}`}
            >
              <span>{post.title}</span>
              <span>{post.date}</span>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
