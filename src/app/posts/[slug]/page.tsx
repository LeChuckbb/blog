import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

function convertToAfterContentPath(absolutePath: string): string {
  const contentDir = path.join(process.cwd(), "content");
  // 절대 경로에서 content 디렉토리 이후 부분만 추출
  const relativePath = path.relative(contentDir, absolutePath);
  // Windows 경로 구분자를 Unix 스타일로 변환
  return relativePath.replace(/\\/g, "/");
}

// slug로 실제 파일 경로 찾기
async function findFileBySlug(slug: string): Promise<string | null> {
  const contentDir = path.join(process.cwd(), "content");

  try {
    const files = await fs.readdir(contentDir);
    for (const file of files) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data } = matter(fileContent);

        if (data.slug === slug) {
          return filePath;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error finding file by slug:", error);
    return null;
  }
}

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
  const contentDir = path.join(process.cwd(), "content");

  try {
    const files = await fs.readdir(contentDir);
    const slugs: { slug: string }[] = [];

    for (const file of files) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data } = matter(fileContent);

        // frontmatter에 slug가 있으면 사용
        if (data.slug) {
          slugs.push({ slug: data.slug });
        }
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
