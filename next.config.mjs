import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkFrontmatter from "remark-frontmatter";
import remarkCallout from "@r4ai/remark-callout";
import remarkFlexibleMarkers from "remark-flexible-markers";
import rehypeImageSize from "./scripts/rehype-image-size.mjs";

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: {
    dark: "catppuccin-frappe",
    light: "github-light",
  },
  onVisitLine(node) {
    // 빈 줄에 공백 문자 삽입 - grid 레이아웃 붕괴 방지
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = [
      ...(node.properties.className ?? []),
      "highlighted-line",
    ];
  },
  onVisitHighlightedChars(node) {
    node.properties.className = [
      ...(node.properties.className ?? []),
      "highlighted-chars",
    ];
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  images: {
    remotePatterns: [
      new URL("https://my-personal-image-bucket.s3.ap-northeast-2.amazonaws.com/**"),
      new URL("https://media.vlpt.us/**"), // velog 이전 이미지 (구 글에 잔존 가능)
    ],
    // S3 객체에 Cache-Control 헤더가 없어 기본 TTL(60초)이 그대로 적용됐다.
    // 블로그 이미지는 한 번 올리면 거의 안 바뀌므로 31일로 늘려 S3 재요청·재변환을 줄인다.
    // 캐시 무효화 수단은 없으나, 이미지 교체 시 S3 URL이 바뀌면 새 캐시 키라 문제없다.
    minimumCacheTTL: 2678400, // 31일
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      [remarkFrontmatter, ["yaml", "toml"]], // frontmatter 파싱 후 제거
      remarkGfm,
      remarkCallout,
      remarkFlexibleMarkers,
      [remarkToc, {}],
    ],
    rehypePlugins: [
      [rehypePrettyCode, options],
      rehypeSlug,
      rehypeImageSize,
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
