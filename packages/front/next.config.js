/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost:3000"],
  },
  compiler: {
    emotion: true,
  },
};

module.exports = nextConfig;
