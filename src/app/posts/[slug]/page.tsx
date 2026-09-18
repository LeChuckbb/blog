import type { Metadata } from "next";
import postsData from "@/src/app/posts.json";
import { generateTocFromFile } from "@/src/app/lib/tocUtil";
import TableOfContents from "@/src/app/_components/TableOfContents";
import { MobileToc } from "@/src/app/_components/MobileToc";
import SeriesNav, { SeriesData } from "@/src/app/_components/SeriesNav";
import PostNav, { PostNavData } from "@/src/app/_components/PostNav";
import { siteConfig } from "@/src/app/config/siteConfig";
import { generateBlogPostingJsonLd } from "@/src/app/lib/jsonLd";
import { Post } from "@/src/app/config/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  const description = post.description || siteConfig.description;

  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${siteConfig.url}/posts/${slug}`,
      publishedTime: post.date,
      authors: [siteConfig.author.name],
      tags: post.tags,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: `/posts/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    throw new Error(`Content file not found for slug: ${slug}`);
  }

  const filePath = post.filename || `${post.title}.mdx`;
  const jsonLd = generateBlogPostingJsonLd(post);

  let tocItems;
  let Post;
  try {
    tocItems = await generateTocFromFile(`./content/${filePath}`);
    ({ default: Post } = await import(`@/content/${filePath}`));
  } catch (error) {
    console.error(error);
    throw new Error(`Content file not found for slug: ${slug}`);
  }

  const seriesData = getSeriesData(post);
  const postNavData = getPostNavData(post, seriesData);

  return (
    <div className="pt-16 pb-24 px-4 md:px-6 xl:px-0 xl:grid xl:grid-cols-[var(--content-max-width)_minmax(0,1fr)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Main Content */}
      <article className="min-w-0 w-full max-w-[var(--content-max-width)] mx-auto xl:mx-0">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-serif">
            <time>{post.date}</time>
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime} min to read</span>
              </>
            )}
          </div>
        </header>
        {seriesData && <SeriesNav {...seriesData} />}
        <div className="prose dark:prose-invert max-w-none break-words">
          <Post />
        </div>
        {/* 다 읽은 독자가 위로 올라가지 않도록 시리즈 목록(항상 펼침)과 이전/다음 카드를 하단에도 둔다 */}
        <footer className="mt-16 flex flex-col gap-3">
          {seriesData && <SeriesNav {...seriesData} variant="footer" />}
          <PostNav {...postNavData} />
        </footer>
      </article>

      {/* 목차: xl 이상에서 우측 여백(최소 300px)에 60px 간격으로 붙고, 남는 여백을 상한까지 채운다 */}
      <aside className="hidden xl:block xl:min-w-0 xl:ml-[var(--sidebar-gap)] xl:max-w-[var(--toc-max-width)]">
        <div className="sticky top-20">
          <TableOfContents items={tocItems} />
        </div>
      </aside>

      {/* xl 미만: 읽는 중 헤더를 숨기고 좌하단 알약 → 바텀시트로 목차 */}
      <MobileToc items={tocItems} />
    </div>
  );
}

function getPostBySlug(slug: string): Post | null {
  const decodedSlug = decodeURIComponent(slug);
  return (
    (postsData.posts as Post[]).find((post) => post.slug === decodedSlug) ??
    null
  );
}

function getSeriesData(post: Post): SeriesData | null {
  if (!post.series) return null;

  const seriesPosts = (postsData.posts as Post[])
    .filter((p) => p.series === post.series)
    .sort((a, b) => {
      const dateA = new Date(a.date || "1900-01-01").getTime();
      const dateB = new Date(b.date || "1900-01-01").getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.slug.localeCompare(b.slug);
    });

  if (seriesPosts.length <= 1) return null;

  const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug);

  return {
    seriesName: post.series,
    posts: seriesPosts.map((p) => ({ slug: p.slug, title: p.title })),
    currentIndex,
  };
}

/**
 * 하단 이전/다음 대상. 시리즈 글은 시리즈 안의 이웃 편이 우선이고,
 * 시리즈 첫/마지막 편처럼 그쪽이 비면 시간순 이웃 글로 채운다.
 * posts.json은 최신순이라 "이전 글" = 더 오래된 글(index + 1).
 */
function getPostNavData(
  post: Post,
  seriesData: SeriesData | null,
): PostNavData {
  const posts = postsData.posts as Post[];
  const index = posts.findIndex((p) => p.slug === post.slug);
  const older = index >= 0 ? (posts[index + 1] ?? null) : null;
  const newer = index > 0 ? (posts[index - 1] ?? null) : null;

  const seriesPrev = seriesData
    ? (seriesData.posts[seriesData.currentIndex - 1] ?? null)
    : null;
  const seriesNext = seriesData
    ? (seriesData.posts[seriesData.currentIndex + 1] ?? null)
    : null;

  return {
    prev: seriesPrev
      ? { ...seriesPrev, label: "시리즈 이전 글" }
      : older
        ? { slug: older.slug, title: older.title, label: "이전 글" }
        : null,
    next: seriesNext
      ? { ...seriesNext, label: "시리즈 다음 글" }
      : newer
        ? { slug: newer.slug, title: newer.title, label: "다음 글" }
        : null,
  };
}

export async function generateStaticParams() {
  const slugs = postsData.posts.map((post) => post.slug);
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
