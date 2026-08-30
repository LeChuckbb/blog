import { notFound, permanentRedirect } from "next/navigation";
import postsData from "@/src/app/posts.json";

// 2026-02 개편 전 블로그는 https://www.lechuck.blog/post/{제목의 공백을 -로 치환} 구조였다.
// 2026-02-28(975920c) 개편으로 /posts/{영문 slug}가 됐는데 리다이렉트를 걸지 않아 기존 색인이 전부 404가 됐고,
// 축적된 검색 평가와 외부 링크가 새 URL로 승계되지 않았다. 여기서 301(308)로 잇는다.
//
// next.config의 redirects()가 아니라 라우트로 처리하는 이유: 구 URL은 한글에 괄호·+가 섞여
// 있어 source 패턴을 path-to-regexp 문법에 맞게 이스케이프하고 퍼센트 인코딩 형태까지
// 조합해야 한다(제목 62개 중 17개가 해당). 라우트는 slug 하나만 받아 맵에서 조회하면 되므로
// 그 조합을 전부 다룰 필요가 없고, 매핑도 posts.json 한 곳에서만 나온다.
const LEGACY_SLUG_TO_SLUG = new Map(
  postsData.posts.map((post) => [post.title.replace(/ /g, "-"), post.slug]),
);

function decodeLegacySlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    // 이미 디코딩된 경로에 %가 남아 있는 등 잘못된 인코딩이면 원본으로 조회한다.
    return slug;
  }
}

export default async function LegacyPostRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target =
    LEGACY_SLUG_TO_SLUG.get(slug) ??
    LEGACY_SLUG_TO_SLUG.get(decodeLegacySlug(slug));

  // 매핑에 없는 구 URL은 실제로 사라진 글이므로 404를 유지한다.
  // 전부 홈으로 보내면 구글이 soft 404로 처리한다.
  if (!target) {
    notFound();
  }

  // 한글 slug가 그대로 들어가면 Location 헤더에 비ASCII 문자가 실려 500이 난다.
  permanentRedirect(`/posts/${encodeURIComponent(target)}`);
}
