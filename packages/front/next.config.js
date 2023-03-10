/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withTM = require("next-transpile-modules")(["design"]);
const nextConfig = {
  images: {
    domains: ["imagedelivery.net"],
    formats: ["image/avif", "image/webp"],
    imageSizes: [768, 350],
    deviceSizes: [768, 1058],
  },
  reactStrictMode: false,
  compiler: {
    emotion: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(withTM(nextConfig));
