/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  reactStrictMode: true,
};

export default nextConfig;
