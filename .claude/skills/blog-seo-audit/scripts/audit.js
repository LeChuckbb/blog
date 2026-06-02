#!/usr/bin/env node
/**
 * blog-seo-audit — 콘텐츠 SEO·품질 자동 점검기
 *
 * content/*.mdx 와 src/app/posts.json 을 교차 비교하여 기계적으로
 * 검출 가능한 이슈를 JSON 으로 리포트한다. 심각도 판정과 개선안 작성은
 * 이 출력을 입력으로 seo-auditor 가 수행한다.
 *
 * 사용: node .claude/skills/blog-seo-audit/scripts/audit.js [--json]
 *
 * 이 스크립트는 진단만 한다. 어떤 파일도 수정하지 않는다.
 */
const fs = require("fs");
const path = require("path");

// gray-matter 는 프로젝트 devDependency. 프로젝트 루트에서 실행 가정.
let matter;
try {
  matter = require(path.resolve(process.cwd(), "node_modules/gray-matter"));
} catch {
  try {
    matter = require("gray-matter");
  } catch {
    console.error(
      "gray-matter 를 찾을 수 없습니다. 프로젝트 루트에서 실행하세요 (pnpm install 필요할 수 있음)."
    );
    process.exit(2);
  }
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const POSTS_JSON = path.join(ROOT, "src/app/posts.json");
const PUBLIC_IMAGES = path.join(ROOT, "public/images");

const DESC_MIN = 80;
const DESC_RECOMMENDED_MIN = 120;
const DESC_MAX = 155;
const TITLE_MAX = 60;
const TAGS_MAX = 10;

function loadPostsJson() {
  if (!fs.existsSync(POSTS_JSON)) return { posts: [] };
  const raw = JSON.parse(fs.readFileSync(POSTS_JSON, "utf8"));
  // 구조: { posts: [...] }
  return Array.isArray(raw) ? { posts: raw } : raw;
}

function listMdx() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(CONTENT_DIR, f));
}

function imageExists(ref) {
  // /images/x.png → public/images/x.png
  const m = ref.match(/^\/images\/(.+)$/);
  if (!m) return null; // 로컬 이미지 아님(원격 등) → 판정 제외
  const decoded = decodeURIComponent(m[1]);
  return fs.existsSync(path.join(PUBLIC_IMAGES, decoded));
}

function audit() {
  const issues = [];
  const add = (severity, area, slugOrFile, message, detail = {}) =>
    issues.push({ severity, area, target: slugOrFile, message, ...detail });

  const { posts } = loadPostsJson();
  const postsBySlug = new Map(posts.map((p) => [p.slug, p]));
  const mdxFiles = listMdx();

  const contentSlugs = new Set();
  const seriesGroups = {};

  for (const file of mdxFiles) {
    const base = path.basename(file);
    let parsed;
    try {
      parsed = matter(fs.readFileSync(file, "utf8"));
    } catch (e) {
      add("critical", "frontmatter", base, `frontmatter 파싱 실패: ${e.message}`);
      continue;
    }
    const fm = parsed.data || {};
    const body = parsed.content || "";
    const slug = fm.slug || base.replace(/\.mdx$/, "");
    contentSlugs.add(slug);

    // --- date ---
    if (!fm.date) {
      add("critical", "date", slug, "date 누락 — 정렬/sitemap/RSS 기준이 깨짐");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fm.date))) {
      add("critical", "date", slug, `date 형식 오류: "${fm.date}" (YYYY-MM-DD 필요)`);
    }

    // --- title ---
    if (!fm.title) {
      add("critical", "title", slug, "title 누락 — 파일명이 제목으로 노출됨");
    } else if (String(fm.title).length > TITLE_MAX) {
      add("warning", "title", slug, `title 길이 ${String(fm.title).length}자 (검색 결과 잘림 우려, ~${TITLE_MAX}자 권장)`, { value: fm.title });
    }

    // --- description ---
    if (!fm.description) {
      add("warning", "description", slug, "description 누락 — 본문 자동추출 폴백에 의존(품질 불안정)");
    } else {
      const len = String(fm.description).length;
      if (len < DESC_MIN) add("warning", "description", slug, `description 너무 짧음 (${len}자, 권장 ${DESC_RECOMMENDED_MIN}~${DESC_MAX})`, { value: fm.description });
      else if (len > DESC_MAX) add("warning", "description", slug, `description 너무 김 (${len}자, ${DESC_MAX}자 초과분 잘림)`, { value: fm.description });
      else if (len < DESC_RECOMMENDED_MIN) add("info", "description", slug, `description 권장 하한 미달 (${len}자, ${DESC_RECOMMENDED_MIN}자+ 권장)`);
    }

    // --- tags ---
    const tags = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : [];
    if (tags.length === 0) add("warning", "tags", slug, "tags 없음 — 카테고리/관련글/keywords 약화");
    else if (tags.length > TAGS_MAX) add("info", "tags", slug, `tags 과다 (${tags.length}개) — 키워드 희석`);

    // --- 미해결 위키링크 ---
    if (/\(unresolved:/.test(body)) add("critical", "internal-link", slug, "미해결 내부 링크(unresolved:) 존재 — 가리키는 글이 미발행");
    if (/\[\[[^\]]+\]\]/.test(body)) add("critical", "internal-link", slug, "변환되지 않은 위키링크 [[ ]] 잔존 — 동기화 변환 실패 의심");

    // --- 헤딩 구조 ---
    const headings = [...body.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => ({ level: m[1].length, text: m[2].trim() }));
    if (headings.some((h) => h.level === 1)) add("warning", "heading", slug, "본문에 h1(#) 존재 — 페이지 제목과 중복(h2부터 권장)");
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level - headings[i - 1].level >= 2) {
        add("warning", "heading", slug, `헤딩 레벨 점프 (h${headings[i - 1].level}→h${headings[i].level}) at "${headings[i].text}"`);
        break;
      }
    }
    if (headings.length === 0) add("info", "heading", slug, "헤딩 없음 — 목차 미생성");

    // --- 이미지 alt & 존재 ---
    const imgs = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    const seenImg = new Set();
    for (const [, alt, rawSrc] of imgs) {
      // 마크다운 title 속성 분리: ![alt](url "title") → url 만 취함
      const src = rawSrc.trim().split(/\s+/)[0];
      if (!alt.trim()) add("info", "image", slug, `이미지 alt 비어 있음: ${src}`);
      if (seenImg.has(src)) continue; // 같은 파일 중복 보고 억제
      seenImg.add(src);
      const exists = imageExists(src);
      if (exists === false) add("critical", "image", slug, `이미지 파일 없음: ${src} (public/images/ 에 없음)`);
    }

    // --- 내부 링크 0개 ---
    if (!/\]\(\/posts\//.test(body)) add("info", "internal-link", slug, "내부 글 링크 없음 — 사이트 링크 그래프 약화");

    // --- frontmatter ↔ posts.json 불일치 ---
    const pj = postsBySlug.get(slug);
    if (!pj) {
      add("critical", "sync", slug, "content 에는 있으나 posts.json 에 없음 — 페이지 누락");
    } else {
      for (const field of ["title", "date", "description"]) {
        if (fm[field] != null && pj[field] != null && String(fm[field]) !== String(pj[field])) {
          add("warning", "sync", slug, `${field} 불일치: frontmatter="${fm[field]}" vs posts.json="${pj[field]}"`);
        }
      }
    }

    // --- 시리즈 그룹핑 ---
    if (fm.series) {
      (seriesGroups[fm.series] ||= []).push(slug);
    }
  }

  // --- posts.json → content 고아 ---
  for (const p of posts) {
    if (!contentSlugs.has(p.slug)) {
      add("critical", "sync", p.slug, "posts.json 에는 있으나 content 에 매칭되는 .mdx 없음 — import 실패/404 우려");
    }
  }

  // --- 시리즈: 멤버 1개 ---
  for (const [name, members] of Object.entries(seriesGroups)) {
    if (members.length === 1) add("warning", "series", members[0], `시리즈 "${name}" 멤버 1개 — 내비 미노출(오타로 분리됐는지 확인)`);
  }

  return { issues, seriesGroups, counts: summarize(issues), totals: { mdx: mdxFiles.length, posts: posts.length } };
}

function summarize(issues) {
  const c = { critical: 0, warning: 0, info: 0 };
  for (const i of issues) c[i.severity] = (c[i.severity] || 0) + 1;
  return c;
}

function main() {
  const result = audit();
  const jsonMode = process.argv.includes("--json");
  if (jsonMode) {
    process.stdout.write(JSON.stringify(result, null, 2));
    return;
  }
  const { counts, totals } = result;
  console.log(`\n📋 SEO·품질 점검 — content ${totals.mdx}개 / posts.json ${totals.posts}개`);
  console.log(`   critical ${counts.critical} · warning ${counts.warning} · info ${counts.info}\n`);
  const order = { critical: 0, warning: 1, info: 2 };
  result.issues
    .sort((a, b) => order[a.severity] - order[b.severity])
    .forEach((i) => {
      const tag = { critical: "🔴", warning: "🟡", info: "🔵" }[i.severity];
      console.log(`${tag} [${i.area}] ${i.target}: ${i.message}`);
    });
  console.log(`\n(상세 JSON: --json 플래그)`);
}

main();
