import { test } from "node:test";
import assert from "node:assert/strict";
import { extractHeadings, generateTocFromContent } from "./tocUtil.ts";

const pick = (md: string) =>
  extractHeadings(md).map(({ text, id, level }) => ({ text, id, level }));

test("링크가 든 헤딩은 링크 텍스트만 남고 id도 그 텍스트로 만든다", () => {
  assert.deepEqual(pick("## [Git Flow](unresolved:git-flow) 방식이 불편했다"), [
    {
      text: "Git Flow 방식이 불편했다",
      id: "git-flow-방식이-불편했다",
      level: 2,
    },
  ]);
});

test("강조·인라인코드 마크업을 벗긴다", () => {
  assert.deepEqual(pick("## **굵게** 와 `코드`"), [
    { text: "굵게 와 코드", id: "굵게-와-코드", level: 2 },
  ]);
});

test("이스케이프 문자를 해제한다", () => {
  assert.deepEqual(pick("# 한강 작가와 \\<소년이 온다>\n\n## a \\{b\\}"), [
    {
      text: "한강 작가와 <소년이 온다>",
      id: "한강-작가와-소년이-온다",
      level: 1,
    },
    { text: "a {b}", id: "a-b", level: 2 },
  ]);
});

test("코드 펜스 안의 # 줄은 헤딩이 아니다", () => {
  const md = "## 진짜\n\n```sh\n# 주석\n## 또 주석\n```\n";
  assert.deepEqual(
    pick(md).map((h) => h.text),
    ["진짜"],
  );
});

test("평문 헤딩의 레벨과 중복 헤딩 -1 접미 규칙을 유지한다", () => {
  assert.deepEqual(pick("# A\n\n### B\n\n## A"), [
    { text: "A", id: "a", level: 1 },
    { text: "B", id: "b", level: 3 },
    { text: "A", id: "a-1", level: 2 },
  ]);
});

test("generateTocFromContent는 frontmatter를 헤딩으로 잡지 않고 트리를 만든다", () => {
  const md = "---\ntitle: t\n---\n## 부모\n\n### 자식\n";
  const tree = generateTocFromContent(md);
  assert.equal(tree.length, 1);
  assert.equal(tree[0].text, "부모");
  assert.equal(tree[0].children?.[0].text, "자식");
});
