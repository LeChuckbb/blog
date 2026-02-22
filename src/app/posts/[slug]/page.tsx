import postsData from "@/src/app/posts.json";
import { generateTocFromFile } from "@/src/app/tocUtil";
import TableOfContents from "@/src/app/_components/TableOfContents";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = getFileNameBySlug(slug);

  if (!filePath) {
    throw new Error(`Content file not found for slug: ${slug}`);
  }

  try {
    // ToC 생성
    const tocItems = await generateTocFromFile(`./content/${filePath}`);
    const { default: Post } = await import(`@/content/${filePath}`);

    console.log(filePath, tocItems);
    return (
      <div className="flex gap-4 relative">
        <div className="flex flex-col gap-2 pb-[120px] pt-6 px-4">
          <h1 className="mb-8 text-4xl text-[40px] font-bold">
            {filePath.split(".md")[0]}
          </h1>
          <Post />
        </div>
        <aside className="w-64 shrink-0">
          <div className="sticky border-l top-[64px] flex flex-col ">
            <div className="p-4 border-b">published</div>
            <div className="p-4 border-b">tags..</div>
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </div>
    );
  } catch (error) {
    console.log(error);
    throw new Error(`Content file not found for slug: ${slug}`);
  }
}

function getFileNameBySlug(slug: string): string | null {
  const decodedSlug = decodeURIComponent(slug);
  const post = postsData.posts.find((post) => post.slug === decodedSlug);
  if (!post) return null;

  return `${post.title}.mdx`;
}

export async function generateStaticParams() {
  const slugs = postsData.posts.map((post) => post.slug);
  return slugs.map((slug) => ({ slug }));
}

// export async function generateStaticParams() {
//   try {
//     const frontmatters = await getAllFrontmatters();
//     const slugs: { slug: string }[] = [];
//
//     for (const { data } of frontmatters) {
//       if (data.slug) {
//         slugs.push({ slug: data.slug });
//       }
//     }
//
//     console.log("Generated slugs from frontmatter:", slugs);
//     return slugs;
//   } catch (error) {
//     console.error("Error reading frontmatter:", error);
//     return [];
//   }
// }

export const dynamicParams = false;
