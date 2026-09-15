// utils/toc.ts
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

// 마크다운에서 헤딩 추출
//
// 정규식으로 `#` 줄을 뜯지 않고 remark로 파싱한다. 헤딩 안의 링크·강조·인라인코드·
// 이스케이프(`\<`, `\{`)를 벗긴 렌더 텍스트가 필요하기 때문이다. 헤딩 id를 붙이는
// rehype-slug도 렌더 텍스트에 github-slugger를 적용하므로, 여기서 같은 문자열을
// 넣어야 목차 앵커와 헤딩 id가 일치한다. 코드 펜스 안의 `# 주석`도 자연히 제외된다.
export function extractHeadings(content: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(content);
  const headings: TocItem[] = [];
  const slugger = new GithubSlugger();

  visit(tree, "heading", (node) => {
    const text = toString(node).trim();
    headings.push({ id: slugger.slug(text), text, level: node.depth });
  });

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
