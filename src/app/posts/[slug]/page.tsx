import type { Metadata } from "next";
import postsData from "@/src/app/posts.json";
import { generateTocFromFile } from "@/src/app/tocUtil";
import TableOfContents from "@/src/app/_components/TableOfContents";
import { siteConfig } from "@/src/app/siteConfig";
import { generateBlogPostingJsonLd } from "@/src/app/lib/jsonLd";
import { Post } from "@/src/app/types";

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

  const filePath = `${post.title}.mdx`;
  const jsonLd = generateBlogPostingJsonLd(post);

  try {
    const tocItems = await generateTocFromFile(`./content/${filePath}`);
    const { default: Post } = await import(`@/content/${filePath}`);

    return (
      <div className="pt-16 pb-24 px-4 md:px-6 xl:px-0 xl:flex xl:gap-[var(--toc-gap)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Main Content */}
        <article className="min-w-0 w-full max-w-[var(--content-max-width)]">
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
          <div className="prose dark:prose-invert max-w-none [word-break:keep-all] break-words">
            <Post />
          </div>
        </article>

        {/* Sidebar: 1440px 이상에서만 표시 */}
        <aside className="hidden min-[1440px]:block shrink-0 w-[var(--sidebar-width)]">
          <div className="sticky top-20">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </div>
    );
  } catch (error) {
    console.error(error);
    throw new Error(`Content file not found for slug: ${slug}`);
  }
}

function getPostBySlug(slug: string): Post | null {
  const decodedSlug = decodeURIComponent(slug);
  return (
    (postsData.posts as Post[]).find((post) => post.slug === decodedSlug) ??
    null
  );
}

export async function generateStaticParams() {
  const slugs = postsData.posts.map((post) => post.slug);
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
