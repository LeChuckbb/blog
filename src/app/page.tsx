import postsData from "./posts.json";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

export default function Home() {
  const posts = postsData.posts as Post[];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-10">Posts</h1>
      <div className="flex flex-col">
        {posts.map((post) => (
          <Link
            key={post.slug}
            className="group block py-3 -mx-3 px-3 rounded-lg hover:bg-muted transition-colors"
            href={`/posts/${post.slug}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h2 className="text-base font-medium group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <time className="text-sm text-muted-foreground shrink-0">
                {post.date}
              </time>
            </div>
            {post.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
