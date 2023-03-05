/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withTM = require("next-transpile-modules")(["design"]);
const nextConfig = {
  images: {
    domains: ["localhost", "imagedelivery.net", "*"],
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
