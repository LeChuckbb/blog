import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFrontmatter from "remark-frontmatter";
import remarkCallout from "@r4ai/remark-callout";
import remarkFlexibleMarkers from "remark-flexible-markers";

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
      new URL("https://imagedelivery.net/**"),
      new URL("https://my-personal-image-bucket.s3.ap-northeast-2.amazonaws.com/**"),
    ],
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
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor-link"],
          },
        },
      ],
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
