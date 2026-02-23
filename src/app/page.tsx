import postsData from "./posts.json";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  const month = parts[1];
  const day = parts[2];
  return `${month}.${day}`;
}

export default function Home() {
  const posts = postsData.posts as Post[];

  // 년도별 그룹핑
  const postsByYear = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = post.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  // 년도 내림차순 정렬
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="mx-auto xl:mx-0 max-w-[var(--content-max-width)] px-4 md:px-6 xl:px-0 py-12">
      {years.map((year) => (
        <section key={year} className="mb-10">
          <div className="flex gap-1.5 items-end">
            <h2 className="text-3xl font-bold">{year}</h2>
            <span className="text-sm font-normal text-muted-foreground">
              {postsByYear[year].length} post
              {postsByYear[year].length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-4 flex flex-col">
            {postsByYear[year].map((post) => (
              <Link
                key={post.slug}
                className="group flex items-baseline gap-4 py-2 -mx-3 px-3 rounded-lg hover:bg-muted transition-colors"
                href={`/posts/${post.slug}`}
              >
                <time className="text-sm text-muted-foreground shrink-0 w-12">
                  {formatDate(post.date)}
                </time>
                <span className="text-sm text-primary group-hover:underline">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
