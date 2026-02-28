import postsData from "@/src/app/posts.json";
import { siteConfig } from "@/src/app/siteConfig";

export async function GET() {
  const posts = postsData.posts;

  const items = posts
    .map((post) => {
      const postUrl = `${siteConfig.url}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const description = post.description
        ? `<description><![CDATA[${post.description}]]></description>`
        : "";
      const categories = (post.tags || [])
        .map((tag) => `<category>${tag}</category>`)
        .join("\n      ");

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description}
      ${categories}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.title}]]></title>
    <link>${siteConfig.url}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>${siteConfig.language}</language>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
