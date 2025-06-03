import {
  convertToAfterContentPath,
  findFileBySlug,
  getAllFrontmatters,
} from "@/src/app/posts/[slug]/util";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = await findFileBySlug(slug);

  if (!filePath) {
    throw new Error(`Content file not found for slug: ${slug}`);
  }

  const afterContentPath = convertToAfterContentPath(filePath);

  try {
    const { default: Post } = await import(`@/content/${afterContentPath}`);
    return <Post />;
  } catch (error) {
    console.log(error);
    throw new Error(`Content file not found for slug: ${slug}`);
  }
}

export async function generateStaticParams() {
  try {
    const frontmatters = await getAllFrontmatters();
    const slugs: { slug: string }[] = [];

    for (const { data } of frontmatters) {
      // frontmatter에 slug가 있으면 사용
      if (data.slug) {
        slugs.push({ slug: data.slug });
      }
    }

    console.log("Generated slugs from frontmatter:", slugs);
    return slugs;
  } catch (error) {
    console.error("Error reading frontmatter:", error);
    return [];
  }
}

export const dynamicParams = false;
