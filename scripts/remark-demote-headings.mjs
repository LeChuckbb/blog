import { visit } from 'unist-util-visit';

// 글 페이지는 제목을 <h1>으로 이미 렌더한다(posts/[slug]/page.tsx). 그런데 64개 글 중
// 41개가 본문 섹션 제목을 `#`(h1)으로 써서, 한 페이지에 h1이 최대 8개까지 나온다.
// 네이버 서치어드바이저가 "<H1> 요소가 2개 이상 발견"으로 잡아 색인을 보류하는 항목이다.
//
// 글 41개를 손으로 고치는 대신 렌더 시점에 한 단계씩 내린다. 본문에 h1이 하나라도 있을 때만
// 전체를 +1 하므로 계층(h1>h2>h3)은 그대로 유지되고, 이미 `##`부터 쓴 글은 건드리지 않는다.
//
// 목차(tocUtil.ts)는 원문 마크다운의 `#` 개수로 트리를 만들고 rehype-slug와 같은 규칙으로
// id를 뽑는다. 여기서 depth만 바꾸고 텍스트는 그대로 두므로 목차 앵커는 계속 일치한다.
export default function remarkDemoteHeadings() {
  return function transformer(tree) {
    let hasH1 = false;
    visit(tree, 'heading', (node) => {
      if (node.depth === 1) hasH1 = true;
    });
    if (!hasH1) return;

    visit(tree, 'heading', (node) => {
      node.depth = Math.min(6, node.depth + 1);
    });
  };
}
