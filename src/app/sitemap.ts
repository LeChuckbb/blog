import type { MetadataRoute } from "next";
import postsData from "@/src/app/posts.json";
import { siteConfig } from "@/src/app/config/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const postUrls: MetadataRoute.Sitemap = postsData.posts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 홈은 최신 글 목록 페이지이므로, lastmod를 가장 최근 포스트 날짜로 고정한다.
  // new Date()를 쓰면 빌드마다 값이 바뀌어 Google이 lastmod 신호를 신뢰하지 않게 된다.
  const latestPostDate = postsData.posts.reduce((latest, post) => {
    const date = new Date(post.date);
    return date > latest ? date : latest;
  }, new Date(0));

  return [
    {
      url: siteConfig.url,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...postUrls,
  ];
}
