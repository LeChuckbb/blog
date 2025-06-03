import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";

export function convertToAfterContentPath(absolutePath: string): string {
  const contentDir = path.join(process.cwd(), "content");
  // 절대 경로에서 content 디렉토리 이후 부분만 추출
  const relativePath = path.relative(contentDir, absolutePath);
  // Windows 경로 구분자를 Unix 스타일로 변환
  return relativePath.replace(/\\/g, "/");
}

// 마크다운/MDX 파일 목록을 가져오는 공통 함수
async function getMarkdownFiles(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), "content");

  try {
    const files = await fs.readdir(contentDir);
    return files.filter(
      (file) => file.endsWith(".md") || file.endsWith(".mdx"),
    );
  } catch (error) {
    console.error("Error reading content directory:", error);
    return [];
  }
}

// 파일의 frontmatter를 파싱하는 공통 함수
async function parseFrontmatter(filePath: string) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data } = matter(fileContent);
    return data;
  } catch (error) {
    console.error(`Error parsing frontmatter for ${filePath}:`, error);
    return null;
  }
}

// 모든 마크다운 파일의 frontmatter를 가져오는 함수
export async function getAllFrontmatters(): Promise<
  Array<{ filePath: string; data: any }>
> {
  const contentDir = path.join(process.cwd(), "content");
  const files = await getMarkdownFiles();
  const frontmatters = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const data = await parseFrontmatter(filePath);

    if (data) {
      frontmatters.push({ filePath, data });
    }
  }

  return frontmatters;
}

// slug로 실제 파일 경로 찾기
export async function findFileBySlug(slug: string): Promise<string | null> {
  try {
    const frontmatters = await getAllFrontmatters();

    for (const { filePath, data } of frontmatters) {
      if (data.slug === slug) {
        return filePath;
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding file by slug:", error);
    return null;
  }
}
