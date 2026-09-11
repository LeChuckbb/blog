import postsData from "@/src/app/posts.json";
import linkPreviews from "@/src/app/link-previews.json";
import type { LinkPreviewData, Post } from "@/src/app/config/types";

type ExternalEntry =
  | {
      title: string;
      description?: string | null;
      image?: string | null;
      siteName?: string | null;
      fetchedAt: string;
    }
  | { error: string; fetchedAt: string };

const posts = (postsData as { posts: Post[] }).posts;
const previews = linkPreviews as Record<string, ExternalEntry>;

/**
 * 본문 링크의 미리보기 데이터. 서버(MDX 렌더)에서만 호출한다.
 * 데이터가 없으면 null — 호출자는 일반 링크로 렌더링한다.
 */
export function getLinkPreview(
  href: string | undefined,
): LinkPreviewData | null {
  if (!href) return null;
  try {
    return lookup(href);
  } catch {
    // 잘못된 URL·인코딩 등으로 파싱이 실패해도 페이지 빌드는 살린다
    return null;
  }
}

function lookup(href: string): LinkPreviewData | null {
  if (href.startsWith("/posts/")) {
    const slug = decodeURIComponent(
      href.slice("/posts/".length).split(/[#?]/)[0],
    );
    const post = posts.find((p) => p.slug === slug);
    if (!post) return null;
    return {
      kind: "post",
      title: post.title,
      date: post.date,
      readingTime: post.readingTime,
      series: post.series,
      description: post.description || undefined,
    };
  }

  if (/^https?:\/\//.test(href)) {
    const entry = previews[href];
    if (!entry || "error" in entry) return null;
    return {
      kind: "external",
      title: entry.title,
      domain: new URL(href).hostname.replace(/^www\./, ""),
      description: entry.description ?? undefined,
      image: entry.image ?? undefined,
    };
  }

  return null;
}
