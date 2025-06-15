import { convertToAfterContentPath } from "@/src/app/posts/[slug]/util";
import postsData from "@/src/app/posts.json";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // const filePath = await findFileBySlug(slug);
  const filePath = getFileNameBySlug(slug);

  if (!filePath) {
    throw new Error(`Content file not found for slug: ${slug}`);
  }

  const afterContentPath = convertToAfterContentPath(filePath);
  console.log(filePath, afterContentPath);

  try {
    const { default: Post } = await import(`@/content/${filePath}`);
    return <Post />;
  } catch (error) {
    console.log(error);
    throw new Error(`Content file not found for slug: ${slug}`);
  }
}

function getFileNameBySlug(slug: string): string | null {
  const post = postsData.posts.find((post) => post.slug === slug);
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
