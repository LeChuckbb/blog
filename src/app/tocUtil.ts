// utils/toc.ts
import matter from "gray-matter";

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

// 문자열을 slug로 변환 (한글 지원)
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/[^\w가-힣\-]+/g, "") // 영문, 숫자, 한글, 하이픈만 유지
    .replace(/\-\-+/g, "-") // 연속 하이픈을 하나로
    .replace(/^-+/, "") // 앞쪽 하이픈 제거
    .replace(/-+$/, ""); // 뒤쪽 하이픈 제거
}

// 마크다운에서 헤딩 추출
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

// 평면 구조를 트리 구조로 변환
export function buildTocTree(headings: TocItem[]): TocItem[] {
  const tree: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const heading of headings) {
    const item: TocItem = { ...heading, children: [] };

    // 현재 레벨보다 깊은 항목들을 스택에서 제거
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 최상위 항목
      tree.push(item);
    } else {
      // 부모 항목의 자식으로 추가
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }

    stack.push(item);
  }

  return tree;
}

// MDX 파일에서 ToC 생성
export async function generateTocFromFile(
  filePath: string,
): Promise<TocItem[]> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const fullPath = path.resolve(filePath);
  const fileContent = await fs.readFile(fullPath, "utf8");

  const { content } = matter(fileContent);
  const headings = extractHeadings(content);

  return buildTocTree(headings);
}

// 문자열 컨텐츠에서 ToC 생성
export function generateTocFromContent(markdownContent: string): TocItem[] {
  const { content } = matter(markdownContent);
  const headings = extractHeadings(content);

  return buildTocTree(headings);
}
