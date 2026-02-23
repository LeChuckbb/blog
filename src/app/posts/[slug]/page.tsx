import postsData from "@/src/app/posts.json";
import { generateTocFromFile } from "@/src/app/tocUtil";
import TableOfContents from "@/src/app/_components/TableOfContents";

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

  try {
    const tocItems = await generateTocFromFile(`./content/${filePath}`);
    const { default: Post } = await import(`@/content/${filePath}`);

    return (
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4 md:px-6">
        <div className="flex gap-8 relative">
          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-[var(--content-max-width)] py-8 pb-24">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {post.title}
              </h1>
              <time className="text-sm text-muted-foreground">{post.date}</time>
            </header>
            <div className="prose dark:prose-invert max-w-none">
              <Post />
            </div>
          </article>

          {/* Sidebar: lg 이상에서만 표시 */}
          <aside className="hidden lg:block w-[var(--sidebar-width)] shrink-0">
            <div className="sticky top-[calc(var(--nav-height)+1rem)]">
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    throw new Error(`Content file not found for slug: ${slug}`);
  }
}

interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
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
