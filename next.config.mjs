import remarkToc from "remark-toc";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: "catppuccin-frappe",
  // transformers: [transformerCopyButton({})],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  images: {
    remotePatterns: [new URL("https://imagedelivery.net/**")],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [[remarkToc, {}]],
    rehypePlugins: [
      [rehypePrettyCode, options],
      rehypeSlug,
      rehypeAutolinkHeadings,
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
